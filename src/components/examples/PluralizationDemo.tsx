import React, { useState } from 'react';
import { usePlural, useComplexPlural, useContextPlural } from '../../utils/i18n/usePlural';
import { useLanguage } from '../../utils/i18n/LanguageContext';

export const PluralizationDemo: React.FC = () => {
  const [count, setCount] = useState(0);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'other'>('today');
  const { language } = useLanguage();
  const plural = usePlural();
  const { t: complexT } = useComplexPlural();
  const { t: contextT } = useContextPlural();

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Pluralization Examples</h2>
      <p className="text-gray-600">Current Language: {language}</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="other">Total</option>
          </select>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Simple Pluralization</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>{plural('items', { count })}</li>
            <li>{plural('messages', { count })}</li>
            <li>{plural('points', { count })}</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Complex Pluralization</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>{contextT('complex.eventAttendance', { count })}</li>
            <li>{contextT('complex.commentThread', { count })}</li>
            <li>{contextT('complex.pointsEarned', { count })}</li>
            <li>{contextT('complex.taskCompletion', { count, period })}</li>
            <li>{contextT('complex.membershipDuration', { count })}</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Context Examples</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">User Roles</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>{complexT('context.user.role', { context: 'admin' })}</li>
                <li>{complexT('context.user.role', { context: 'moderator' })}</li>
                <li>{complexT('context.user.role', { context: 'member' })}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium">Post Visibility</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>{complexT('context.post.visibility', { context: 'public' })}</li>
                <li>{complexT('context.post.visibility', { context: 'private' })}</li>
                <li>{complexT('context.post.visibility', { context: 'members' })}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 