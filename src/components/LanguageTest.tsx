import { useTranslation } from 'react-i18next';

export function LanguageTest() {
  const { t } = useTranslation(['common', 'navigation']);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('common:meta.title')}</h1>
      <div className="space-y-2">
        <p>{t('navigation:menu.home')}</p>
        <p>{t('navigation:menu.signOut')}</p>
        <p>{t('navigation:menu.events')}</p>
      </div>
      <div className="mt-4">
        <button className="mr-2">{t('common:actions.save')}</button>
        <button>{t('common:actions.cancel')}</button>
      </div>
    </div>
  );
} 