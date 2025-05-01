/**
 * Translation debugger system for development environment
 */
import { languageService } from './languageService';

export interface DebugModeConfig {
  /** Whether to highlight untranslated content */
  highlightMissing?: boolean;
  /** Whether to show translation keys */
  showKeys?: boolean;
  /** Whether to log missing translations */
  logMissing?: boolean;
  /** Whether to track translation usage */
  trackUsage?: boolean;
}

interface TranslationInfo {
  key: string;
  namespace?: string;
  language: string;
  source: 'translation' | 'fallback' | 'key';
  timestamp: number;
}

class TranslationDebugger {
  private static instance: TranslationDebugger;
  private config: Required<DebugModeConfig>;
  private translationInfo: TranslationInfo[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  private constructor() {
    this.config = {
      highlightMissing: true,
      showKeys: true,
      logMissing: true,
      trackUsage: true
    };
  }

  public static getInstance(): TranslationDebugger {
    if (!TranslationDebugger.instance) {
      TranslationDebugger.instance = new TranslationDebugger();
    }
    return TranslationDebugger.instance;
  }

  public getConfig(): Required<DebugModeConfig> {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<DebugModeConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };

    // Dispatch event to notify components
    window.dispatchEvent(
      new CustomEvent('translationDebugConfigChanged', {
        detail: this.config
      })
    );
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setIsEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public wrapContent(
    content: string,
    key: string,
    namespace?: string,
    source: 'translation' | 'fallback' | 'key' = 'translation'
  ): string {
    if (!this.isEnabled) return content;

    // Track usage if enabled
    if (this.config.trackUsage) {
      this.translationInfo.push({
        key,
        namespace,
        language: languageService.getCurrentLanguage(),
        source,
        timestamp: Date.now()
      });
    }

    // Log missing translations if enabled
    if (this.config.logMissing && source === 'key') {
      console.warn(
        `Missing translation for key "${key}"${namespace ? ` in namespace "${namespace}"` : ''}`
      );
    }

    // Return unmodified content if no visual debug features are enabled
    if (!this.config.highlightMissing && !this.config.showKeys) {
      return content;
    }

    // Add visual indicators based on config
    let wrappedContent = content;
    if (this.config.showKeys) {
      wrappedContent = `${wrappedContent} [${key}]`;
    }
    if (this.config.highlightMissing && source === 'key') {
      wrappedContent = `⚠️ ${wrappedContent}`;
    }

    return wrappedContent;
  }

  public getAllTranslationInfo(): TranslationInfo[] {
    return [...this.translationInfo];
  }

  public clearTranslationInfo(): void {
    this.translationInfo = [];
  }
}

export const translationDebugger = TranslationDebugger.getInstance(); 