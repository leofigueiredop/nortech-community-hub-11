# Variable Interpolation and Context Handling

This document outlines how to handle variable interpolation and context-aware translations in the NortechCommunity platform.

## Variable Interpolation

### Basic Variable Interpolation

Use double curly braces `{{variableName}}` to insert variables into translations:

```javascript
// Translation Key
{
  "welcome": "Welcome, {{username}}!",
  "itemCount": "You have {{count}} items",
  "lastLogin": "Last login: {{date}}"
}

// Usage in Code
const { t } = useTranslation();
t('welcome', { username: 'John' }); // "Welcome, John!"
t('itemCount', { count: 5 }); // "You have 5 items"
t('lastLogin', { date: '2024-05-01' }); // "Last login: 2024-05-01"
```

### Multiple Variables

When using multiple variables, use descriptive names:

```javascript
// Translation Key
{
  "shareMessage": "{{senderName}} shared {{resourceName}} with {{recipientName}}",
  "activityLog": "{{userName}} performed {{actionName}} on {{targetName}} at {{timestamp}}"
}

// Usage in Code
t('shareMessage', {
  senderName: 'Alice',
  resourceName: 'Project Report',
  recipientName: 'Bob'
}); // "Alice shared Project Report with Bob"
```

### Formatting Variables

Use formatters for consistent display of numbers, dates, and currencies:

```javascript
// Translation Key
{
  "price": "Price: {{amount, currency}}",
  "date": "Posted on {{date, datetime}}",
  "number": "{{value, number}}"
}

// Usage in Code
t('price', {
  amount: 99.99,
  formatters: {
    currency: (value) => formatCurrency(value, 'USD')
  }
}); // "Price: $99.99"

t('date', {
  date: new Date(),
  formatters: {
    datetime: (value) => formatDate(value, 'long')
  }
}); // "Posted on May 1, 2024"
```

### Variable Types

1. **Text Variables**
```javascript
{
  "greeting": "Hello, {{name}}!",
  "message": "{{sender}} says: {{text}}"
}
```

2. **Numeric Variables**
```javascript
{
  "count": "{{number}} items",
  "progress": "{{percentage}}% complete",
  "distance": "{{value}} kilometers"
}
```

3. **Date/Time Variables**
```javascript
{
  "posted": "Posted {{timeAgo}}",
  "scheduled": "Scheduled for {{date}}",
  "duration": "Duration: {{time}} minutes"
}
```

## Context Handling

### 1. Context Parameters

Use context parameters to provide additional information to translators:

```javascript
// Translation Key
{
  "button_label": {
    "context": "This button appears on the main dashboard",
    "value": "Refresh"
  },
  "status_message": {
    "context": "Shown when a user's account is locked",
    "value": "Account access temporarily restricted"
  }
}

// Usage in Code
t('button_label.value')
t('status_message.value')
```

### 2. Gender Context

Handle gender-specific translations:

```javascript
// Translation Key
{
  "profile": {
    "greeting": {
      "male": "Welcome Mr. {{name}}",
      "female": "Welcome Ms. {{name}}",
      "other": "Welcome {{name}}"
    },
    "possessive": {
      "male": "his profile",
      "female": "her profile",
      "other": "their profile"
    }
  }
}

// Usage in Code
t('profile.greeting', {
  name: 'John',
  context: 'male'
});

t('profile.possessive', {
  context: user.gender
});
```

### 3. Count Context

Handle quantity-based variations:

```javascript
// Translation Key
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{{count}} items"
  },
  "messages": {
    "zero": "Your inbox is empty",
    "one": "You have one unread message",
    "other": "You have {{count}} unread messages"
  }
}

// Usage in Code
t('items', { count: 0 }); // "No items"
t('items', { count: 1 }); // "One item"
t('items', { count: 5 }); // "5 items"
```

### 4. Time Context

Handle time-sensitive content:

```javascript
// Translation Key
{
  "event": {
    "past": "Event ended {{time}} ago",
    "current": "Event is happening now",
    "future": "Event starts in {{time}}"
  },
  "availability": {
    "today": "Available today",
    "tomorrow": "Available tomorrow",
    "other": "Available on {{date}}"
  }
}

// Usage in Code
t('event', {
  time: '2 hours',
  context: getEventTimeContext(eventDate)
});
```

## Complex Scenarios

### 1. Nested Interpolation

Handle complex nested structures:

```javascript
// Translation Key
{
  "notification": {
    "comment": {
      "reply": "{{user}} replied to {{parent.user}}'s comment: \"{{text}}\"",
      "mention": "{{user}} mentioned you in a reply to {{parent.user}}: \"{{text}}\""
    }
  }
}

// Usage in Code
t('notification.comment.reply', {
  user: 'Alice',
  parent: {
    user: 'Bob'
  },
  text: 'Great point!'
});
```

### 2. Conditional Content

Handle content that varies based on multiple conditions:

```javascript
// Translation Key
{
  "task": {
    "status": {
      "completed": {
        "onTime": "Completed on time by {{user}}",
        "late": "Completed {{timeOverdue}} late by {{user}}"
      },
      "pending": {
        "dueToday": "Due today, assigned to {{user}}",
        "overdue": "Overdue by {{timeOverdue}}, assigned to {{user}}",
        "upcoming": "Due in {{timeLeft}}, assigned to {{user}}"
      }
    }
  }
}

// Usage in Code
t(`task.status.${status}.${getTimeContext()}`, {
  user: 'Alice',
  timeOverdue: '2 days',
  timeLeft: '3 days'
});
```

## Implementation Helpers

### 1. Type-Safe Interpolation

```typescript
// Define types for interpolation variables
interface WelcomeVariables {
  name: string;
  count: number;
  lastVisit: Date;
}

// Type-safe translation function
function translate<T extends Record<string, any>>(
  key: string,
  variables: T
): string {
  return t(key, variables);
}

// Usage
translate<WelcomeVariables>('welcome', {
  name: 'John',
  count: 5,
  lastVisit: new Date()
});
```

### 2. Context Helpers

```typescript
// Context utility functions
const getTimeContext = (date: Date): 'past' | 'current' | 'future' => {
  const now = new Date();
  if (date < now) return 'past';
  if (date > now) return 'future';
  return 'current';
};

const getQuantityContext = (count: number): 'zero' | 'one' | 'other' => {
  if (count === 0) return 'zero';
  if (count === 1) return 'one';
  return 'other';
};

// Usage
t(`event.${getTimeContext(eventDate)}`, { time: formatRelativeTime(eventDate) });
t(`items.${getQuantityContext(itemCount)}`, { count: itemCount });
```

### 3. Formatter Registry

```typescript
// Central registry for formatters
const formatters = {
  currency: (value: number, currency = 'USD') => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    }).format(value),
    
  datetime: (value: Date, style = 'medium') => 
    new Intl.DateTimeFormat('en-US', { 
      dateStyle: style 
    }).format(value),
    
  number: (value: number, decimals = 0) => 
    value.toFixed(decimals)
};

// Usage
t('price', {
  amount: 99.99,
  formatters: {
    currency: formatters.currency
  }
});
```

## Best Practices

1. **Variable Naming**
   - Use descriptive variable names
   - Be consistent with naming conventions
   - Document expected variable types

2. **Context Handling**
   - Keep context logic separate from translation
   - Use enums or constants for context values
   - Document context requirements

3. **Type Safety**
   - Define interfaces for variables
   - Use TypeScript for better IDE support
   - Validate variable presence

4. **Formatting**
   - Use consistent formatters
   - Handle localization in formatters
   - Document formatter options

5. **Testing**
   - Test with different variable values
   - Verify all context combinations
   - Test missing variable handling 