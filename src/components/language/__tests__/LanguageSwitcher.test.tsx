import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useLanguagePreference } from '@/utils/i18n/useLanguagePreference';

// Mock the useLanguagePreference hook
vi.mock('@/utils/i18n/useLanguagePreference', () => ({
  useLanguagePreference: vi.fn(),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementation
    (useLanguagePreference as jest.Mock).mockReturnValue({
      currentLanguage: 'en-US',
      changeLanguage: vi.fn(),
      isLoading: false,
      error: null,
    });
  });

  it('renders correctly with default props', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows language options when clicked', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Check if both language options are shown
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Português')).toBeInTheDocument();
  });

  it('shows check mark for current language', () => {
    (useLanguagePreference as jest.Mock).mockReturnValue({
      currentLanguage: 'pt-BR',
      changeLanguage: vi.fn(),
      isLoading: false,
      error: null,
    });

    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // The check mark should be next to Portuguese
    const portugueseOption = screen.getByText('Português').parentElement;
    expect(portugueseOption?.querySelector('svg')).toBeInTheDocument();
    
    // English should not have a check mark
    const englishOption = screen.getByText('English').parentElement;
    expect(englishOption?.querySelector('svg')).not.toBeInTheDocument();
  });

  it('calls changeLanguage when a language is selected', () => {
    const changeLanguage = vi.fn();
    (useLanguagePreference as jest.Mock).mockReturnValue({
      currentLanguage: 'en-US',
      changeLanguage,
      isLoading: false,
      error: null,
    });

    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Click on Portuguese option
    fireEvent.click(screen.getByText('Português'));
    expect(changeLanguage).toHaveBeenCalledWith('pt-BR');
  });

  it('accepts and applies custom styling props', () => {
    render(
      <LanguageSwitcher 
        variant="outline" 
        size="lg" 
        className="custom-class" 
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  // Accessibility tests
  it('is keyboard navigable', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    
    // Open menu with keyboard
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    
    // Check if menu is open
    expect(screen.getByText('English')).toBeInTheDocument();
    
    // Navigate to Portuguese option
    fireEvent.keyDown(screen.getByText('English'), { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toBe('Português');
  });

  it('has appropriate ARIA attributes', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-haspopup');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
}); 