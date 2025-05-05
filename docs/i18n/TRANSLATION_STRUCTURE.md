# Translation File Structure and Guidelines

## Directory Structure

The translation files are organized in the `/public/locales` directory, with subdirectories for each supported language:

```
public/locales/
├── en-US/                 # English (United States)
│   ├── common.json       # Common UI elements
│   ├── navigation.json   # Navigation-related text
│   ├── forms.json        # Form-related content
│   ├── features.json     # Feature-specific content
│   ├── auth.json         # Authentication-related text
│   └── plurals.json      # Pluralization rules
└── pt-BR/                 # Portuguese (Brazil)
    ├── common.json
    ├── navigation.json
    ├── forms.json
    ├── features.json
    ├── auth.json
    └── plurals.json
```

## Namespace Files

### 1. common.json
- **Purpose**: Contains shared UI elements and general text used throughout the application
- **Scope**:
  - Button labels (submit, cancel, save, etc.)
  - Common messages (success, error, loading states)
  - Shared UI component text
  - Generic validation messages
  - Application-wide terminology

Example structure:
```json
{
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete"
  },
  "messages": {
    "loading": "Loading...",
    "success": "Operation completed successfully",
    "error": "An error occurred"
  },
  "labels": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone"
  }
}
```

### 2. navigation.json
- **Purpose**: Contains all navigation-related text
- **Scope**:
  - Menu items
  - Navigation links
  - Breadcrumbs
  - Section titles
  - Route descriptions

Example structure:
```json
{
  "mainMenu": {
    "home": "Home",
    "profile": "Profile",
    "settings": "Settings"
  },
  "breadcrumbs": {
    "home": "Home",
    "profile": "Profile",
    "settings": "Settings"
  },
  "sections": {
    "dashboard": "Dashboard",
    "userProfile": "User Profile",
    "accountSettings": "Account Settings"
  }
}
```

### 3. forms.json
- **Purpose**: Contains form-related content and validation messages
- **Scope**:
  - Form field labels
  - Placeholder text
  - Help text
  - Validation messages
  - Form section titles

Example structure:
```json
{
  "fields": {
    "username": {
      "label": "Username",
      "placeholder": "Enter your username",
      "help": "Choose a unique username"
    },
    "password": {
      "label": "Password",
      "placeholder": "Enter your password",
      "help": "Must be at least 8 characters"
    }
  },
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email address",
    "minLength": "Must be at least {{count}} characters",
    "maxLength": "Cannot exceed {{count}} characters"
  }
}
```

### 4. features.json
- **Purpose**: Contains feature-specific content
- **Scope**:
  - Feature descriptions
  - Feature-specific messages
  - Module-specific content
  - Feature state messages

Example structure:
```json
{
  "userProfile": {
    "title": "User Profile",
    "sections": {
      "personalInfo": "Personal Information",
      "preferences": "Preferences",
      "security": "Security Settings"
    },
    "messages": {
      "updateSuccess": "Profile updated successfully",
      "updateError": "Failed to update profile"
    }
  },
  "notifications": {
    "title": "Notifications",
    "empty": "No notifications",
    "markAsRead": "Mark as read"
  }
}
```

### 5. auth.json
- **Purpose**: Contains authentication-related text
- **Scope**:
  - Login/Signup forms
  - Password reset
  - Authentication errors
  - Session messages
  - Security notifications

Example structure:
```json
{
  "login": {
    "title": "Login",
    "submit": "Sign In",
    "forgotPassword": "Forgot Password?",
    "newAccount": "Create Account"
  },
  "signup": {
    "title": "Create Account",
    "submit": "Sign Up",
    "haveAccount": "Already have an account?"
  },
  "errors": {
    "invalidCredentials": "Invalid username or password",
    "accountLocked": "Account is locked",
    "sessionExpired": "Session has expired"
  }
}
```

### 6. plurals.json
- **Purpose**: Contains pluralization rules and complex message formats
- **Scope**:
  - Plural forms
  - Quantity-based messages
  - Complex ICU message formats
  - Context-dependent variations

Example structure:
```json
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{{count}} items"
  },
  "messages": {
    "zero": "No messages",
    "one": "You have one message",
    "other": "You have {{count}} messages"
  },
  "complex": {
    "taskCompletion": "{{count, plural, =0 {No tasks completed} =1 {Completed one task} other {Completed # tasks}}} {{period, select, today {today} week {this week} month {this month} other {in total}}}"
  }
}
```

## File Loading and Access

The translation files are:
1. Loaded automatically by i18next based on the current language
2. Cached in the browser for improved performance
3. Hot-reloaded during development for immediate feedback
4. Accessed using the appropriate namespace in code:

```typescript
// Using the useTranslation hook
const { t } = useTranslation(['common', 'forms']);

// Accessing translations
const buttonText = t('common:buttons.submit');
const errorMessage = t('forms:validation.required');
```

## Validation and Maintenance

- All JSON files must be valid and well-formatted
- Use consistent indentation (2 spaces)
- Keep files organized and grouped logically
- Regularly validate completeness across languages
- Remove unused translation keys
- Update all language versions when adding new keys

## Best Practices

1. Keep translation keys descriptive but concise
2. Use consistent key structure across files
3. Group related translations together
4. Include comments for complex translations
5. Maintain alphabetical ordering when practical
6. Regularly review and update translations
7. Test translations in context
8. Keep backup copies of translation files
9. Document any special handling or context
10. Follow the established naming conventions 