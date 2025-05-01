import 'i18next';

// Define the structure for each namespace
interface ICommonTranslation {
  meta: {
    title: string;
    description: string;
  };
  actions: {
    view: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    submit: string;
    search: string;
    filter: string;
    sort: string;
    clear: string;
    close: string;
    open: string;
  };
  status: {
    loading: string;
    success: string;
    error: string;
    empty: string;
    required: string;
    optional: string;
    active: string;
    inactive: string;
    pending: string;
    completed: string;
  };
  notifications: {
    success: string;
    error: string;
    info: string;
    warning: string;
  };
  time: {
    now: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
    years: string;
  };
  errors: {
    generic: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    validation: string;
    network: string;
  };
  pagination: {
    previous: string;
    next: string;
    showing: string;
    of: string;
    to: string;
    results: string;
  };
}

interface IFormsTranslation {
  labels: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  placeholders: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    phone: string;
    search: string;
  };
  validation: {
    required: string;
    email: string;
    password: string;
    confirmPassword: string;
    minLength: string;
    maxLength: string;
    pattern: string;
    number: string;
    url: string;
  };
}

interface IFeaturesTranslation {
  events: {
    create: {
      title: string;
      description: string;
      date: string;
      time: string;
      location: string;
      capacity: string;
      type: {
        label: string;
        online: string;
        inPerson: string;
        hybrid: string;
      };
    };
    filters: {
      upcoming: string;
      past: string;
      myEvents: string;
      registered: string;
    };
  };
  discussions: {
    create: {
      title: string;
      topic: string;
      content: string;
      tags: string;
    };
    actions: {
      reply: string;
      share: string;
      report: string;
      pin: string;
    };
  };
  points: {
    earn: {
      title: string;
      description: string;
      daily: string;
      post: string;
      comment: string;
      attend: string;
    };
    redeem: {
      title: string;
      description: string;
      available: string;
    };
  };
}

interface IAuthTranslation {
  signIn: {
    title: string;
    subtitle: string;
    submit: string;
    forgotPassword: string;
    noAccount: string;
    signUp: string;
  };
  signUp: {
    title: string;
    subtitle: string;
    submit: string;
    hasAccount: string;
    signIn: string;
  };
  forgotPassword: {
    title: string;
    subtitle: string;
    submit: string;
    backToSignIn: string;
  };
  resetPassword: {
    title: string;
    subtitle: string;
    submit: string;
  };
  errors: {
    invalidCredentials: string;
    emailNotFound: string;
    weakPassword: string;
    emailInUse: string;
  };
}

interface INavigationTranslation {
  menu: {
    home: string;
    events: string;
    discussions: string;
    profile: string;
    settings: string;
    help: string;
    signOut: string;
  };
  breadcrumbs: {
    home: string;
    events: string;
    discussions: string;
    profile: string;
    settings: string;
  };
}

// Extend i18next types
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: ICommonTranslation;
      forms: IFormsTranslation;
      features: IFeaturesTranslation;
      auth: IAuthTranslation;
      navigation: INavigationTranslation;
    };
  }
} 