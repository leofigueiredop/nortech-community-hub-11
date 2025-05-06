# Authentication Context Rules

## Overview
The authentication context provides user authentication and community context throughout the application.

## Key Components

### AuthContext
- Manages user authentication state and community context
- Provides login, logout, and session management
- Automatically handles community access verification

### AuthResponse Structure
```typescript
interface AuthResponse {
  user: {
    id: string;
    email: string;
    profile: {
      id: string;
      user_id: string;
      full_name: string;
      avatar_url?: string;
    }
  };
  community: {
    id: string;
    name: string;
    description: string;
    logo_url: string | null;
    theme_config?: {
      primary_color?: string;
      secondary_color?: string;
      background_color?: string;
    }
  }
}
```

## Community Access Rules
- Users must be either a community creator or member to access the system
- Community access is verified during login and session checks
- No access is granted without valid community association
- Community context is always available after successful authentication

## Usage Example
```typescript
const { user, community } = useAuth();

// User data is always available after login
console.log(user.profile.full_name);

// Community context is guaranteed to exist
console.log(community.name);
```

## Error Handling
- Login fails if no community access is found
- Session checks verify both auth and community access
- Clear error messages indicate community access requirements

## Implementation Notes
- Community access is checked in SupabaseAuthRepository
- Checks both creator_id and community_members table
- Community context includes theme configuration
- No null checks needed for community after authentication 