# Roles-Based Architecture

This directory contains role-specific components, pages, and services organized by user roles.

## Structure

```
roles/
├── Admin/           # Admin-specific features
│   ├── components/  # Admin UI components
│   │   └── AdminLogin.tsx
│   ├── pages/       # Admin pages
│   │   └── Dashboard.tsx
│   ├── services/    # Admin-specific services
│   └── index.tsx    # Admin exports
│
└── SPO/             # SPO-specific features (to be populated)
    ├── components/  # SPO UI components
    ├── pages/       # SPO pages
    ├── services/    # SPO-specific services
    └── index.tsx    # SPO exports
```

## Current Implementation

### Admin Role
- **Login**: `/admin/signin` - Admin login page (no signup option)
- **Dashboard**: `/admin/dashboard` - Main admin dashboard
- Admin credentials are pre-created by backend

### SPO Role
- Components currently in `src/components/` will be migrated here
- Existing routes: `/login`, `/signup`, `/assessment`, etc.
- To be organized once admin portal is complete

## Authentication Flow

1. User logs in with credentials
2. Backend returns user object with `role` field
3. App routes user to role-specific dashboard:
   - `ADMIN` → `/admin/dashboard`
   - `SPO` → `/assessment`

## Future Enhancements

- Auth provider context for role management
- Role-based route guards
- Dynamic menu/navigation based on role
- Additional roles as needed

