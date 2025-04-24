
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import GeneralSettings from '@/components/settings/GeneralSettings';
import { useTranslation } from 'react-i18next';

const General: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <SettingsLayout activeSection="general" title={t('settings.general.title')}>
      <GeneralSettings />
    </SettingsLayout>
  );
};

export default General;
