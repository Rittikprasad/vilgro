# Admin Portal Setup

This document outlines the admin portal structure that has been set up.

## What's Been Created

### 1. Admin Role Structure
```
src/roles/Admin/
├── components/
│   └── AdminLogin.tsx       # Admin login component (no signup option)
├── pages/
│   └── Dashboard.tsx        # Admin dashboard placeholder
├── services/                # For future admin-specific services
└── index.tsx               # Admin exports
```

### 2. Auth Infrastructure
```
src/auth/
├── useAuth.ts              # Hook to access auth state and user role
└── ProtectedRoute.tsx      # Role-based route guard
```

### 3. Router Infrastructure
```
src/router/
├── RoleRouter.tsx          # Routes users based on their role
└── routes.ts              # Central route configuration
```

### 4. SPO Role Structure (Placeholder)
```
src/roles/SPO/
├── components/             # Future: SPO-specific components
├── pages/                  # Future: SPO-specific pages
├── services/               # Future: SPO-specific services
└── index.tsx              # SPO exports
```

## Key Features

### Admin Login
- **Route**: `/admin/login`
- **UI**: Same design as SPO login
- **Differences**:
  - Title changed to "Admin Portal"
  - No "Sign up here" section (admin credentials pre-created)
  - Forgot password links to `/admin/forgot-password`
- **Navigation**: After login, redirects to `/admin/dashboard`

### Role-Based Routing
The app now supports role-based routing:
- Admin users → `/admin/dashboard`
- SPO users → `/assessment`

### Authentication Flow
1. User logs in via `/login` (SPO) or `/admin/login` (Admin)
2. Backend returns JWT tokens + user object with role
3. App checks user.role and routes accordingly
4. Protected routes verify user has correct role

## Current Routes

### Public Routes
- `/` - Home
- `/login` - SPO Login
- `/signup/*` - SPO Signup flow
- `/admin/login` - Admin Login

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard
- `/admin/*` - All admin routes require ADMIN role

### SPO Routes (Protected)
- `/assessment` - Assessment tool
- `/onboarding` - Onboarding flow
- `/welcome` - Welcome page
- `/dashboard` - SPO dashboard

## Response Structure

Login response from backend:
```json
{
  "refresh": "jwt_refresh_token",
  "access": "jwt_access_token",
  "user": {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "ADMIN" // or "SPO"
  },
  "has_completed_profile": true,
  "onboarding": {
    "current_step": 3,
    "is_complete": true
  }
}
```

## Next Steps

1. **API Integration**: Connect admin login to backend endpoint
2. **Admin Dashboard**: Build out admin dashboard features
3. **Role Guard**: Ensure proper role checking on all routes
4. **SPO Migration**: Move existing components to `src/roles/SPO/`
5. **Admin Features**: Add admin-specific functionality (user management, etc.)

## Notes

- Existing SPO functionality remains unchanged
- No changes to features folder or API integration yet
- Auth infrastructure is ready for future role expansion
- Both roles use the same auth slice and thunks

