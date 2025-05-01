import React from 'react';
import { renderHook } from '@testing-library/react';
import { usePlural, useComplexPlural, useContextPlural } from '../usePlural';
import { LanguageProvider } from '../LanguageContext';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
};

describe('Pluralization hooks', () => {
  describe('usePlural', () => {
    it('handles simple pluralization', () => {
      const { result } = renderHook(() => usePlural(), { wrapper: Wrapper });

      expect(result.current('items', { count: 0 })).toBe('No items');
      expect(result.current('items', { count: 1 })).toBe('One item');
      expect(result.current('items', { count: 2 })).toBe('2 items');
    });

    it('handles messages with different formats', () => {
      const { result } = renderHook(() => usePlural(), { wrapper: Wrapper });

      expect(result.current('messages', { count: 0 })).toBe('No messages');
      expect(result.current('messages', { count: 1 })).toBe('You have one message');
      expect(result.current('messages', { count: 5 })).toBe('You have 5 messages');
    });
  });

  describe('useComplexPlural', () => {
    it('handles context-based translations', () => {
      const { result } = renderHook(() => useComplexPlural(), { wrapper: Wrapper });

      expect(result.current.t('context.user.role', { context: 'admin' })).toBe('Administrator');
      expect(result.current.t('context.user.role', { context: 'moderator' })).toBe('Moderator');
      expect(result.current.t('context.user.role', { context: 'member' })).toBe('Member');
    });

    it('handles post visibility contexts', () => {
      const { result } = renderHook(() => useComplexPlural(), { wrapper: Wrapper });

      expect(result.current.t('context.post.visibility', { context: 'public' })).toBe('Public');
      expect(result.current.t('context.post.visibility', { context: 'private' })).toBe('Private');
      expect(result.current.t('context.post.visibility', { context: 'members' })).toBe('Members Only');
    });
  });

  describe('useContextPlural', () => {
    it('handles complex pluralization with count', () => {
      const { result } = renderHook(() => useContextPlural(), { wrapper: Wrapper });

      expect(result.current.t('complex.eventAttendance', { count: 0 }))
        .toBe('No one is attending this event');
      expect(result.current.t('complex.eventAttendance', { count: 1 }))
        .toBe('One person is attending this event');
      expect(result.current.t('complex.eventAttendance', { count: 3 }))
        .toBe('3 people are attending this event');
    });

    it('handles complex pluralization with period', () => {
      const { result } = renderHook(() => useContextPlural(), { wrapper: Wrapper });

      expect(result.current.t('complex.taskCompletion', { count: 2, period: 'today' }))
        .toBe('Completed 2 tasks today');
      expect(result.current.t('complex.taskCompletion', { count: 1, period: 'week' }))
        .toBe('Completed one task this week');
      expect(result.current.t('complex.taskCompletion', { count: 0, period: 'month' }))
        .toBe('No tasks completed this month');
    });
  });
}); 