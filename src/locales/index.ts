// Import all translation files
import enCommon from '../../public/locales/en-US/common.json';
import enForms from '../../public/locales/en-US/forms.json';
import enFeatures from '../../public/locales/en-US/features.json';
import enAuth from '../../public/locales/en-US/auth.json';
import enNavigation from '../../public/locales/en-US/navigation.json';
import enPlurals from '../../public/locales/en-US/plurals.json';

import ptCommon from '../../public/locales/pt-BR/common.json';
import ptForms from '../../public/locales/pt-BR/forms.json';
import ptFeatures from '../../public/locales/pt-BR/features.json';
import ptAuth from '../../public/locales/pt-BR/auth.json';
import ptNavigation from '../../public/locales/pt-BR/navigation.json';
import ptPlurals from '../../public/locales/pt-BR/plurals.json';

// Export the resources object without type assertion
export const resources = {
  'en-US': {
    common: enCommon,
    forms: enForms,
    features: enFeatures,
    auth: enAuth,
    navigation: enNavigation,
    plurals: enPlurals,
  },
  'pt-BR': {
    common: ptCommon,
    forms: ptForms,
    features: ptFeatures,
    auth: ptAuth,
    navigation: ptNavigation,
    plurals: ptPlurals,
  },
}; 