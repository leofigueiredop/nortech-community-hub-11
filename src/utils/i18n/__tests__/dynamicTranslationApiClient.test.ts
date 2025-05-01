import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DynamicTranslationApiClient, DynamicTranslationApiError, MockDynamicTranslationApiClient } from '../dynamicTranslationApiClient';

describe('DynamicTranslationApiClient', () => {
  let client: DynamicTranslationApiClient;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create a fresh client for each test
    client = new DynamicTranslationApiClient({
      endpoint: 'http://api.example.com',
      batchSize: 3, // Small batch size for testing
      throttleMs: 100, // Short throttle for testing
      timeoutMs: 1000,
      retryEnabled: true,
      maxRetries: 2,
      retryDelayMs: 50 // Short delay for testing
    });

    // Mock fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof global.fetch;

    // Reset timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('request batching', () => {
    it('batches multiple requests within the batch delay', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          translations: {
            key1: 'Translation 1',
            key2: 'Translation 2',
            key3: 'Translation 3'
          }
        })
      });

      // Make multiple requests almost simultaneously
      const promise1 = client.fetchTranslations(['key1'], 'en-US');
      const promise2 = client.fetchTranslations(['key2'], 'en-US');
      const promise3 = client.fetchTranslations(['key3'], 'en-US');

      // Wait for batch delay
      await vi.advanceTimersByTimeAsync(50);

      // Resolve all promises
      const [result1, result2, result3] = await Promise.all([
        promise1, promise2, promise3
      ]);

      // Verify only one API call was made
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'http://api.example.com/dynamic-translations',
        expect.objectContaining({
          body: JSON.stringify({
            keys: ['key1', 'key2', 'key3'],
            language: 'en-US'
          })
        })
      );

      // Verify each promise got its specific translations
      expect(result1).toEqual({ key1: 'Translation 1' });
      expect(result2).toEqual({ key2: 'Translation 2' });
      expect(result3).toEqual({ key3: 'Translation 3' });
    });

    it('respects batch size limits', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            translations: {
              key1: 'Translation 1',
              key2: 'Translation 2',
              key3: 'Translation 3'
            }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            translations: {
              key4: 'Translation 4',
              key5: 'Translation 5'
            }
          })
        });

      // Request more keys than the batch size
      const promise = client.fetchTranslations(
        ['key1', 'key2', 'key3', 'key4', 'key5'],
        'en-US'
      );

      // Wait for batch delay
      await vi.advanceTimersByTimeAsync(50);

      // Wait for throttle between batches
      await vi.advanceTimersByTimeAsync(100);

      const result = await promise;

      // Verify two API calls were made
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[0][1].body).toEqual(
        JSON.stringify({
          keys: ['key1', 'key2', 'key3'],
          language: 'en-US'
        })
      );
      expect(fetchMock.mock.calls[1][1].body).toEqual(
        JSON.stringify({
          keys: ['key4', 'key5'],
          language: 'en-US'
        })
      );

      // Verify all translations were returned
      expect(result).toEqual({
        key1: 'Translation 1',
        key2: 'Translation 2',
        key3: 'Translation 3',
        key4: 'Translation 4',
        key5: 'Translation 5'
      });
    });
  });

  describe('request throttling', () => {
    it('throttles requests to respect minimum delay', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ translations: {} })
      });

      // Make first request
      const promise1 = client.fetchTranslations(['key1'], 'en-US');
      await vi.advanceTimersByTimeAsync(50); // Wait for batch delay
      await promise1;

      // Make second request immediately
      const promise2 = client.fetchTranslations(['key2'], 'en-US');
      await vi.advanceTimersByTimeAsync(50); // Wait for batch delay

      // Verify second request hasn't been made yet
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Wait for throttle delay
      await vi.advanceTimersByTimeAsync(100);
      await promise2;

      // Verify second request was made after delay
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('error handling and retries', () => {
    it('retries on network errors', async () => {
      fetchMock
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            translations: { key1: 'Translation 1' }
          })
        });

      const result = await client.fetchTranslations(['key1'], 'en-US');

      // Wait for batch delay and retry delay
      await vi.advanceTimersByTimeAsync(150);

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ key1: 'Translation 1' });
    });

    it('retries on 5xx errors', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable',
          json: () => Promise.resolve({ error: 'Service unavailable' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            translations: { key1: 'Translation 1' }
          })
        });

      const result = await client.fetchTranslations(['key1'], 'en-US');

      // Wait for batch delay and retry delay
      await vi.advanceTimersByTimeAsync(150);

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ key1: 'Translation 1' });
    });

    it('does not retry on 4xx errors', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ error: 'Invalid request' })
      });

      await expect(client.fetchTranslations(['key1'], 'en-US'))
        .rejects
        .toThrow(DynamicTranslationApiError);

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('handles request timeouts', async () => {
      fetchMock.mockImplementationOnce(() => new Promise(() => {}));

      const promise = client.fetchTranslations(['key1'], 'en-US');

      // Wait for timeout
      await vi.advanceTimersByTimeAsync(1000);

      await expect(promise)
        .rejects
        .toThrow('Request timeout');
    });
  });
});

describe('MockDynamicTranslationApiClient', () => {
  it('simulates network delay', async () => {
    const mockClient = new MockDynamicTranslationApiClient({
      mockDelay: 100
    });

    const startTime = Date.now();
    await mockClient.fetchTranslations(['key1'], 'en-US');
    expect(Date.now() - startTime).toBeGreaterThanOrEqual(100);
  });

  it('simulates random failures', async () => {
    const mockClient = new MockDynamicTranslationApiClient({
      mockFailureRate: 1 // Always fail
    });

    await expect(mockClient.fetchTranslations(['key1'], 'en-US'))
      .rejects
      .toThrow(DynamicTranslationApiError);
  });

  it('returns mock translations', async () => {
    const mockClient = new MockDynamicTranslationApiClient();
    const result = await mockClient.fetchTranslations(
      ['key1', 'key2'],
      'en-US'
    );

    expect(result).toEqual({
      key1: '[en-US] key1 (mock)',
      key2: '[en-US] key2 (mock)'
    });
  });
}); 