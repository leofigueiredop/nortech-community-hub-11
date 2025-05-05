import { TFunction } from 'i18next';

export const getContentTypes = (t: TFunction) => [
  { id: 'all', name: t('feed.filters.all') },
  { id: 'posts', name: t('feed.filters.posts') },
  { id: 'events', name: t('feed.filters.events') },
  { id: 'lives', name: t('feed.filters.lives') },
  { id: 'content', name: t('feed.filters.content') }
];

export const getAccessTypes = (t: TFunction) => [
  { id: 'all', name: t('feed.filters.allContent') },
  { id: 'free', name: t('feed.filters.freeContent') },
  { id: 'paid', name: t('feed.filters.paidContent') },
  { id: 'subscription', name: t('feed.filters.subscription') }
];

// Smaller set of popular tags for a cleaner display
export const popularTags = [
  'Web3', 'Finance', 'Design', 'Development', 'Marketing', 
  'AI', 'Career', 'Blockchain'
];
