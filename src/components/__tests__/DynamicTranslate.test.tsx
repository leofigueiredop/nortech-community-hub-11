import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DynamicTranslate } from '../DynamicTranslate';
import { useTranslationWithFallback } from '../../hooks/useTranslationWithFallback';
import { useTranslationDebug } from '../../hooks/useTranslationDebug';

// Mock the hooks
vi.mock('../../hooks/useTranslationWithFallback', () => ({
  useTranslationWithFallback: vi.fn()
}));

vi.mock('../../hooks/useTranslationDebug', () => ({
  useTranslationDebug: vi.fn()
}));

describe('DynamicTranslate', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Set up default mock implementations
    (useTranslationWithFallback as jest.Mock).mockReturnValue({
      t: vi.fn().mockImplementation((key, options) => options?.fallback || key),
      ready: true
    });

    (useTranslationDebug as jest.Mock).mockReturnValue({
      isEnabled: false,
      wrapContent: vi.fn().mockImplementation(content => content)
    });
  });

  it('renders translation when available', () => {
    const mockT = vi.fn().mockReturnValue('Hello');
    (useTranslationWithFallback as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true
    });

    render(<DynamicTranslate translationKey="greeting" />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('greeting', {
      fallback: undefined,
      params: undefined
    });
  });

  it('renders fallback text when translation is not found', () => {
    const mockT = vi.fn().mockImplementation((_, options) => options.fallback);
    (useTranslationWithFallback as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true
    });

    render(
      <DynamicTranslate 
        translationKey="missing.key"
        fallback="Fallback Text"
      />
    );
    
    expect(screen.getByText('Fallback Text')).toBeInTheDocument();
  });

  it('handles interpolation parameters', () => {
    const mockT = vi.fn().mockReturnValue('Hello, John!');
    (useTranslationWithFallback as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true
    });

    render(
      <DynamicTranslate 
        translationKey="welcome"
        params={{ name: 'John' }}
      />
    );
    
    expect(screen.getByText('Hello, John!')).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('welcome', {
      params: { name: 'John' },
      fallback: undefined
    });
  });

  it('applies debug features when enabled', () => {
    const mockT = vi.fn().mockReturnValue('Hello');
    (useTranslationWithFallback as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true
    });

    const mockWrapContent = vi.fn().mockReturnValue('Hello [greeting]');
    (useTranslationDebug as jest.Mock).mockReturnValue({
      isEnabled: true,
      wrapContent: mockWrapContent
    });

    render(
      <DynamicTranslate 
        translationKey="greeting"
        ns="common"
      />
    );

    expect(mockWrapContent).toHaveBeenCalledWith('Hello', 'greeting', 'common');
    expect(screen.getByText('Hello [greeting]')).toBeInTheDocument();
  });

  it('skips debug features when disabled', () => {
    const mockT = vi.fn().mockReturnValue('Hello');
    (useTranslationWithFallback as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true
    });

    const mockWrapContent = vi.fn();
    (useTranslationDebug as jest.Mock).mockReturnValue({
      isEnabled: false,
      wrapContent: mockWrapContent
    });

    render(<DynamicTranslate translationKey="greeting" />);

    expect(mockWrapContent).not.toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('skips debug features when showMissingIndicator is false', () => {
    const mockT = vi.fn().mockReturnValue('Hello');
    (useTranslationWithFallback as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true
    });

    const mockWrapContent = vi.fn();
    (useTranslationDebug as jest.Mock).mockReturnValue({
      isEnabled: true,
      wrapContent: mockWrapContent
    });

    render(
      <DynamicTranslate 
        translationKey="greeting"
        showMissingIndicator={false}
      />
    );

    expect(mockWrapContent).not.toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies className and style props', () => {
    const mockT = vi.fn().mockReturnValue('Hello');
    (useTranslationWithFallback as jest.Mock).mockReturnValue({
      t: mockT,
      ready: true
    });

    const style = { color: 'red' };
    const className = 'test-class';

    render(
      <DynamicTranslate 
        translationKey="greeting"
        className={className}
        style={style}
      />
    );
    
    const element = screen.getByText('Hello');
    expect(element).toHaveClass(className);
    expect(element).toHaveStyle(style);
  });
}); 