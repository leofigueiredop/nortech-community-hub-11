import { useTranslation } from 'react-i18next';

export function LanguageTest() {
  const { t } = useTranslation('common');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('welcome')}</h1>
      <div className="space-y-2">
        <p>{t('navigation.home')}</p>
        <p>{t('navigation.about')}</p>
        <p>{t('navigation.contact')}</p>
      </div>
      <div className="mt-4">
        <button className="mr-2">{t('actions.save')}</button>
        <button>{t('actions.cancel')}</button>
      </div>
    </div>
  );
} 