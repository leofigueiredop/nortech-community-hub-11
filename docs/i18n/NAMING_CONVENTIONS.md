# Translation Key Naming Conventions

This document outlines the naming conventions for translation keys in the NortechCommunity platform. Following these conventions ensures consistency and maintainability across the application.

## General Rules

1. **Use camelCase**
   - All translation keys must use camelCase notation
   - Example: `userProfile`, `loginButton`, `errorMessage`

2. **Use Dots for Hierarchy**
   - Separate hierarchical levels with dots
   - Maximum 4 levels deep to maintain readability
   - Example: `userProfile.settings.privacy.title`

3. **Be Descriptive but Concise**
   - Keys should be self-descriptive
   - Avoid abbreviations unless widely understood
   - Keep keys under 50 characters when possible

## Key Structure Patterns

### 1. UI Elements

```javascript
// Buttons
"buttons.action.save"
"buttons.action.cancel"
"buttons.navigation.back"
"buttons.form.submit"

// Labels
"labels.input.username"
"labels.input.email"
"labels.status.active"

// Headings
"headings.page.dashboard"
"headings.section.userProfile"
"headings.modal.confirmation"

// Placeholders
"placeholders.search"
"placeholders.email"
"placeholders.phoneNumber"
```

### 2. Messages

```javascript
// Success Messages
"messages.success.saved"
"messages.success.updated"
"messages.success.deleted"

// Error Messages
"messages.error.required"
"messages.error.invalid"
"messages.error.network"

// Info Messages
"messages.info.welcome"
"messages.info.logout"
"messages.info.sessionExpired"

// Confirmation Messages
"messages.confirm.delete"
"messages.confirm.cancel"
"messages.confirm.logout"
```

### 3. Feature-specific Content

```javascript
// User Profile
"userProfile.personalInfo.title"
"userProfile.settings.privacy"
"userProfile.notifications.email"

// Dashboard
"dashboard.summary.title"
"dashboard.stats.users"
"dashboard.charts.monthly"

// Settings
"settings.account.title"
"settings.preferences.language"
"settings.security.password"
```

### 4. Form Fields

```javascript
// Field Labels
"forms.login.username.label"
"forms.signup.email.label"
"forms.profile.phone.label"

// Help Text
"forms.login.password.help"
"forms.signup.email.help"
"forms.profile.avatar.help"

// Validation Messages
"forms.validation.required"
"forms.validation.email"
"forms.validation.password.length"
```

### 5. Dynamic Content

```javascript
// With Variables
"notifications.count" // "{{count}} notifications"
"messages.unread" // "{{count}} unread messages"
"files.selected" // "{{count}} files selected"

// With Multiple Variables
"sharing.invitation" // "{{sender}} shared {{resource}} with you"
"activity.comment" // "{{user}} commented on {{post}}"
```

## Special Cases

### 1. Pluralization

```javascript
// Simple Plurals
"items": {
  "zero": "No items",
  "one": "One item",
  "other": "{{count}} items"
}

// Complex Plurals with Context
"fileUpload": {
  "zero": "No files uploaded {{period}}",
  "one": "Uploaded one file {{period}}",
  "other": "Uploaded {{count}} files {{period}}"
}
```

### 2. Gender-specific Content

```javascript
"profile.greeting": {
  "male": "Welcome Mr. {{name}}",
  "female": "Welcome Ms. {{name}}",
  "other": "Welcome {{name}}"
}
```

### 3. State-dependent Content

```javascript
"button.save": {
  "default": "Save",
  "saving": "Saving...",
  "saved": "Saved!",
  "error": "Try Again"
}
```

## Examples by Component Type

### 1. Page Components

```javascript
// Page Title
"pages.dashboard.title"
"pages.userProfile.title"
"pages.settings.title"

// Page Sections
"pages.dashboard.summary.title"
"pages.userProfile.personal.title"
"pages.settings.security.title"

// Page Actions
"pages.dashboard.actions.refresh"
"pages.userProfile.actions.edit"
"pages.settings.actions.save"
```

### 2. Modal Components

```javascript
// Modal Titles
"modals.confirmation.title"
"modals.settings.title"
"modals.share.title"

// Modal Content
"modals.confirmation.message"
"modals.settings.description"
"modals.share.instructions"

// Modal Actions
"modals.confirmation.confirm"
"modals.confirmation.cancel"
"modals.share.submit"
```

### 3. Form Components

```javascript
// Form Titles
"forms.login.title"
"forms.signup.title"
"forms.profile.title"

// Form Fields
"forms.login.username"
"forms.signup.email"
"forms.profile.phone"

// Form Actions
"forms.login.submit"
"forms.signup.submit"
"forms.profile.save"
```

## Best Practices

1. **Consistency**
   - Use the same pattern for similar types of content
   - Maintain consistent depth for similar hierarchies
   - Use consistent terminology across keys

2. **Maintainability**
   - Group related keys together
   - Use comments to explain complex keys
   - Keep the hierarchy shallow when possible

3. **Scalability**
   - Plan for feature expansion
   - Use namespaces effectively
   - Consider key reusability

4. **Clarity**
   - Make keys self-documenting
   - Use full words over abbreviations
   - Include context in the key structure

## Examples of Good vs Bad Keys

✅ **Good Keys**:
```javascript
"userProfile.settings.privacy.title"
"forms.login.password.help"
"messages.error.network"
"buttons.action.save"
```

❌ **Bad Keys**:
```javascript
"up_set_priv_ttl"  // Avoid abbreviations
"forms/login/pwd/h" // Don't use slashes
"MSG_ERR_NET"      // Don't use uppercase
"btns.act.s"       // Too short/unclear
```

## Implementation Tips

1. **Type Safety**
```typescript
// Define type-safe keys
type TranslationKey = 
  | "userProfile.settings.privacy.title"
  | "forms.login.password.help"
  | "messages.error.network";

// Use in components
const message = t<TranslationKey>("messages.error.network");
```

2. **Key Organization**
```typescript
// Group related keys in constants
const UserProfileKeys = {
  TITLE: "userProfile.title",
  SETTINGS: {
    PRIVACY: "userProfile.settings.privacy",
    NOTIFICATIONS: "userProfile.settings.notifications"
  }
} as const;
```

3. **Key Validation**
```typescript
// Validate keys at build time
const validateTranslationKey = (key: string): boolean => {
  return /^[a-z][a-zA-Z0-9.]*$/.test(key) && 
         key.split('.').length <= 4;
};
```

## Maintenance Guidelines

1. **Regular Review**
   - Audit keys periodically
   - Remove unused keys
   - Consolidate similar keys
   - Update documentation

2. **Version Control**
   - Comment significant key changes
   - Update all language files together
   - Maintain a changelog for keys

3. **Documentation**
   - Keep this guide updated
   - Document complex key patterns
   - Include examples for new patterns

4. **Testing**
   - Validate key format
   - Check for missing translations
   - Verify key uniqueness
   - Test with different languages 