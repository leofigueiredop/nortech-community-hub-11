/**
 * Interfaces for dynamic translation API requests and responses
 */
export interface DynamicTranslationRequest {
  keys: string[];
  language: string;
}

export interface DynamicTranslationResponse {
  translations: Record<string, string>;
  missing?: string[];
}

/**
 * Configuration options for the API client
 */
export interface DynamicTranslationApiConfig {
  /** Base endpoint for the translation API */
  endpoint: string;
  /** Maximum number of keys to include in a single request */
  batchSize?: number;
  /** Minimum time (in ms) between requests */
  throttleMs?: number;
  /** Request timeout (in ms) */
  timeoutMs?: number;
  /** Whether to enable request retries */
  retryEnabled?: boolean;
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Base delay (in ms) between retries (will be exponentially increased) */
  retryDelayMs?: number;
}

/**
 * Error class for API-related failures
 */
export class DynamicTranslationApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: any
  ) {
    super(message);
    this.name = 'DynamicTranslationApiError';
  }
}

/**
 * API client for fetching dynamic translations from the backend
 */
export class DynamicTranslationApiClient {
  private endpoint: string;
  private batchSize: number;
  private throttleMs: number;
  private timeoutMs: number;
  private retryEnabled: boolean;
  private maxRetries: number;
  private retryDelayMs: number;
  private lastRequestTime: number = 0;
  private pendingBatch: {
    keys: Set<string>;
    language: string;
    resolve: (translations: Record<string, string>) => void;
    reject: (error: Error) => void;
  } | null = null;
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(config: DynamicTranslationApiConfig) {
    this.endpoint = config.endpoint;
    this.batchSize = config.batchSize ?? 50;
    this.throttleMs = config.throttleMs ?? 1000;
    this.timeoutMs = config.timeoutMs ?? 5000;
    this.retryEnabled = config.retryEnabled ?? true;
    this.maxRetries = config.maxRetries ?? 3;
    this.retryDelayMs = config.retryDelayMs ?? 1000;
  }

  /**
   * Fetches translations for a batch of keys
   * @param keys Array of translation keys
   * @param language Target language code (e.g., 'en-US')
   * @returns Map of key to translation
   */
  async fetchTranslations(keys: string[], language: string): Promise<Record<string, string>> {
    // Deduplicate keys
    const uniqueKeys = [...new Set(keys)];

    // If we have a pending batch for the same language, merge with it
    if (this.pendingBatch && this.pendingBatch.language === language) {
      return new Promise((resolve, reject) => {
        uniqueKeys.forEach(key => this.pendingBatch!.keys.add(key));
        const currentKeys = Array.from(this.pendingBatch!.keys);

        // If we've exceeded batch size, execute immediately
        if (currentKeys.length >= this.batchSize) {
          this.executeBatch();
        }

        // Create a new batch with remaining keys
        const remainingKeys = currentKeys.slice(this.batchSize);
        if (remainingKeys.length > 0) {
          this.startNewBatch(remainingKeys, language);
        }

        // Add this request's callbacks to the batch
        const originalResolve = this.pendingBatch!.resolve;
        const originalReject = this.pendingBatch!.reject;
        this.pendingBatch!.resolve = (translations) => {
          originalResolve(translations);
          resolve(this.filterTranslations(translations, keys));
        };
        this.pendingBatch!.reject = (error) => {
          originalReject(error);
          reject(error);
        };
      });
    }

    // Start a new batch
    return new Promise((resolve, reject) => {
      this.startNewBatch(uniqueKeys, language, resolve, reject);
    });
  }

  /**
   * Starts a new batch request
   */
  private startNewBatch(
    keys: string[],
    language: string,
    resolve?: (translations: Record<string, string>) => void,
    reject?: (error: Error) => void
  ) {
    this.pendingBatch = {
      keys: new Set(keys),
      language,
      resolve: resolve || (() => {}),
      reject: reject || (() => {})
    };

    // Schedule batch execution
    this.batchTimeout = setTimeout(() => {
      this.executeBatch();
    }, 50); // Small delay to allow batching of near-simultaneous requests
  }

  /**
   * Executes the current batch request
   */
  private async executeBatch() {
    if (!this.pendingBatch) return;

    const { keys, language, resolve, reject } = this.pendingBatch;
    this.pendingBatch = null;
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    try {
      // Apply throttling
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.throttleMs) {
        await new Promise(resolve => 
          setTimeout(resolve, this.throttleMs - timeSinceLastRequest)
        );
      }

      // Make the request with retries
      const translations = await this.makeRequest(
        Array.from(keys).slice(0, this.batchSize),
        language
      );

      resolve(translations);
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Makes an HTTP request to the translation API with retry logic
   */
  private async makeRequest(
    keys: string[],
    language: string,
    attempt: number = 1
  ): Promise<Record<string, string>> {
    const req: DynamicTranslationRequest = { keys, language };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const res = await fetch(`${this.endpoint}/dynamic-translations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      this.lastRequestTime = Date.now();

      if (!res.ok) {
        throw new DynamicTranslationApiError(
          `API error: ${res.status} ${res.statusText}`,
          res.status,
          await res.json().catch(() => null)
        );
      }

      const data: DynamicTranslationResponse = await res.json();
      return data.translations;

    } catch (err) {
      // Handle abort/timeout
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new DynamicTranslationApiError('Request timeout');
      }

      // Handle other errors with retry logic
      if (
        this.retryEnabled &&
        attempt < this.maxRetries &&
        this.shouldRetry(err)
      ) {
        const delay = this.retryDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(keys, language, attempt + 1);
      }

      throw err instanceof Error ? err : new Error(String(err));
    }
  }

  /**
   * Determines if a failed request should be retried
   */
  private shouldRetry(error: unknown): boolean {
    if (error instanceof DynamicTranslationApiError) {
      // Retry on network errors and 5xx server errors
      return !error.statusCode || error.statusCode >= 500;
    }
    // Retry on network/connection errors
    return true;
  }

  /**
   * Filters translations to only include requested keys
   */
  private filterTranslations(
    translations: Record<string, string>,
    requestedKeys: string[]
  ): Record<string, string> {
    const filtered: Record<string, string> = {};
    for (const key of requestedKeys) {
      if (key in translations) {
        filtered[key] = translations[key];
      }
    }
    return filtered;
  }
}

/**
 * Mock API client for development/testing
 */
export class MockDynamicTranslationApiClient extends DynamicTranslationApiClient {
  private mockDelay: number;
  private mockFailureRate: number;

  constructor(config: {
    mockDelay?: number;
    mockFailureRate?: number;
  } = {}) {
    super({ endpoint: '' });
    this.mockDelay = config.mockDelay ?? 200;
    this.mockFailureRate = config.mockFailureRate ?? 0;
  }

  async fetchTranslations(keys: string[], language: string): Promise<Record<string, string>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.mockDelay));

    // Simulate random failures
    if (Math.random() < this.mockFailureRate) {
      throw new DynamicTranslationApiError('Mock API error', 500);
    }

    // Return dummy translations
    const translations: Record<string, string> = {};
    for (const key of keys) {
      translations[key] = `[${language}] ${key} (mock)`;
    }
    return translations;
  }
} 