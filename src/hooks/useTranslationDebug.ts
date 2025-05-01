import { useState, useEffect, useCallback } from 'react';
import { translationDebugger, DebugModeConfig } from '../utils/i18n/translationDebugger';

/**
 * Hook for using translation debug features in components
 */
export function useTranslationDebug() {
  const [config, setConfig] = useState<Required<DebugModeConfig>>(
    translationDebugger.getConfig()
  );

  useEffect(() => {
    // Update config when debug settings change
    const handleConfigChange = (e: CustomEvent<Required<DebugModeConfig>>) => {
      setConfig(e.detail);
    };

    window.addEventListener(
      'translationDebugConfigChanged',
      handleConfigChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'translationDebugConfigChanged',
        handleConfigChange as EventListener
      );
    };
  }, []);

  const wrapContent = useCallback((
    content: string,
    key: string,
    namespace?: string
  ): string => {
    return translationDebugger.wrapContent(
      content,
      key,
      namespace,
      content === key ? 'key' : 'translation'
    );
  }, []);

  return {
    isEnabled: translationDebugger.getIsEnabled(),
    config,
    setConfig: translationDebugger.setConfig.bind(translationDebugger),
    wrapContent,
    getAllTranslationInfo: translationDebugger.getAllTranslationInfo.bind(translationDebugger),
    clearTranslationInfo: translationDebugger.clearTranslationInfo.bind(translationDebugger)
  };
} 