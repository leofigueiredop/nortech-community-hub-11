import { useTranslation, TFunction } from 'react-i18next';

type PluralOptions = {
  count: number;
  context?: string;
  period?: 'today' | 'week' | 'month' | 'other';
};

/**
 * A hook for handling pluralization in translations
 * 
 * @example
 * ```tsx
 * const plural = usePlural();
 * 
 * // Simple pluralization
 * plural('items', { count: 5 }); // "5 items"
 * plural('messages', { count: 1 }); // "You have one message"
 * plural('points', { count: 0 }); // "No points earned"
 * 
 * // With context
 * plural('complex.eventAttendance', { count: 3 }); // "3 people are attending this event"
 * 
 * // With period selection
 * plural('complex.taskCompletion', { count: 2, period: 'today' }); // "Completed 2 tasks today"
 * ```
 */
export function usePlural() {
  const { t } = useTranslation('plurals', { keyPrefix: '' });

  return function plural(key: string, options: PluralOptions): string {
    const { count, context, period } = options;

    // Handle context-based translations
    if (context) {
      return t(key, { count, context });
    }

    // Handle period-based translations
    if (period) {
      return t(key, { count, period });
    }

    // Handle simple pluralization
    return t(key, { count });
  };
}

/**
 * A hook for handling complex pluralization with context in translations
 * 
 * @example
 * ```tsx
 * const { t } = useComplexPlural();
 * 
 * // User role context
 * t('context.user.role', { context: 'admin' }); // "Administrator"
 * 
 * // Post visibility context
 * t('context.post.visibility', { context: 'members' }); // "Members Only"
 * ```
 */
export function useComplexPlural() {
  const { t } = useTranslation('plurals', { keyPrefix: '' });

  return {
    t: function translate(key: string, options: { context: string }): string {
      return t(key, options);
    }
  };
}

/**
 * A hook for handling complex pluralization with both count and context
 * 
 * @example
 * ```tsx
 * const { t } = useContextPlural();
 * 
 * // Complex pluralization with context
 * t('complex.taskCompletion', { count: 3, period: 'week' }); 
 * // "Completed 3 tasks this week"
 * ```
 */
export function useContextPlural() {
  const { t } = useTranslation('plurals', { keyPrefix: '' });

  return {
    t: function translate(key: string, options: PluralOptions): string {
      return t(key, options);
    }
  };
} 