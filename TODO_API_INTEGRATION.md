# TODO: API Integration Checklist

This document outlines all the changes needed when implementing API integration for the admin portal.

## Files to Update

### 1. `/src/roles/Admin/components/AdminLogin.tsx`

**Current State:** API calls are commented out, direct navigation to dashboard

**Changes Needed:**
```typescript
// Line 12-15: Uncomment imports
import { useDispatch } from "react-redux"
import { login } from "../../../features/auth/authThunks"
import { clearError } from "../../../features/auth/authSlice"

// Line 37: Uncomment dispatch
const dispatch = useDispatch()

// Line 39: Add back user state
const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth)

// Line 48-54: Uncomment useEffect for navigation after auth
useEffect(() => {
  if (isAuthenticated && user?.role === "ADMIN") {
    console.log("Admin authenticated, navigating to admin dashboard")
    navigate("/admin/dashboard", { replace: true })
  }
}, [isAuthenticated, user, navigate])

// Line 59-90: Uncomment API calls in onSubmit
dispatch(clearError())
const result = await dispatch(login(data) as any)
// ... rest of the logic
```

### 2. `/src/components/AppRouter.tsx`

**Current State:** Admin dashboard is unprotected, directly accessible

**Changes Needed:**
```typescript
// Line 15-16: Uncomment import
import { ProtectedRoute as RoleProtectedRoute } from '../auth/ProtectedRoute';

// Line 163-173: Remove direct route
// Delete the unprotected /admin/dashboard route

// Line 175-190: Uncomment protected routes block
<Route
    path="/admin/*"
    element={
        <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
        </RoleProtectedRoute>
    }
/>
```

### 3. `/src/roles/Admin/pages/Dashboard.tsx`

**Current State:** Simple placeholder UI

**Changes Needed:**
- Remove development notes from comments
- Add API calls to fetch admin-specific data
- Implement actual admin features:
  - User management
  - SPO approval/management
  - Analytics dashboard
  - System settings
  - etc.

## Testing Checklist

After implementing API integration, test:

- [ ] Admin can login with valid credentials
- [ ] Admin cannot login with invalid credentials
- [ ] Non-admin users redirected away from admin routes
- [ ] Admin redirected to dashboard after successful login
- [ ] Admin dashboard loads with proper data
- [ ] Session persistence (refresh page maintains auth)
- [ ] Logout functionality
- [ ] Token refresh on expiry
- [ ] Error handling for API failures

## Role-Based Routing Flow

After implementation:

1. **Admin Login** (`/admin/login`)
   - User enters credentials
   - Backend returns: `{ user: { role: "ADMIN" }, access: "...", refresh: "..." }`
   - Redux stores auth state
   - Redirects to `/admin/dashboard`

2. **Protected Dashboard** (`/admin/dashboard`)
   - `RoleProtectedRoute` checks `isAuthenticated`
   - `RoleProtectedRoute` verifies `user.role === "ADMIN"`
   - If both true → render `AdminDashboard`
   - If not → redirect to `/admin/login`

3. **SPO Protection**
   - SPO users trying to access `/admin/*` get redirected
   - Admin users trying to access SPO routes get redirected

## Notes

- All commented code is marked with `// TODO: API Integration`
- Search for "TODO: API Integration" to find all places that need changes
- Auth infrastructure (`/src/auth/`) is already in place and ready
- SPO functionality remains completely unaffected

