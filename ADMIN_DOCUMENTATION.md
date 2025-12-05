# Administrator Panel Documentation

## Overview
The administrator panel provides elevated access to manage all clubs, users, and platform operations. Admins are identified by email addresses configured in environment variables.

## Configuration

### Setting Admin Emails
Add admin email addresses to `.env.local`:

```env
# Admin Users (comma-separated email addresses)
ADMIN_EMAILS=luciferzx136@gmail.com,admin2@example.com,admin3@example.com
```

Multiple admins can be configured by separating emails with commas.

## Admin Features

### 1. Admin Dashboard (`/admin`)
- Central hub for all admin operations
- Quick stats and platform overview
- Links to club management and user management

### 2. Manage All Clubs (`/admin/clubs`)
- View all clubs on the platform
- See club status (Active/Inactive)
- View creator information
- Access individual club management

### 3. Individual Club Management (`/admin/clubs/[id]`)
- View complete club details
- See all members and creator
- **Activate/Deactivate clubs** - Toggle club status
- **Delete clubs permanently** - Remove clubs from the platform
- View creation and update timestamps

### 4. Manage All Users (`/admin/users`)
- View all registered users
- See user club memberships
- View registration dates
- Monitor user activity

## Admin Actions

### Toggle Club Status
- Activate or deactivate any club
- Deactivated clubs remain in database but are hidden from public views
- Can be reactivated at any time

### Delete Club
- Permanently removes club from database
- Requires confirmation
- **Warning**: This action cannot be undone
- All member associations are removed

## Access Control

### Admin Check
- Admins are verified on each admin page load
- Email must match exactly with configured `ADMIN_EMAILS`
- Non-admin users are redirected to home page

### API Protection
All admin API endpoints (`/api/admin/*`) require:
1. User authentication (via Clerk)
2. Admin status verification (via `requireAdmin()`)

Returns 403 Forbidden if user is not an admin.

## Navigation

### Navbar Integration
- "Admin Panel" link appears in navbar for admin users only
- Link is visible on both desktop and mobile views
- Automatically hidden for non-admin users

## API Endpoints

### Admin Endpoints
- `GET /api/admin/check` - Check if current user is admin
- `PATCH /api/admin/clubs/[id]/toggle-status` - Toggle club active status
- `DELETE /api/admin/clubs/[id]` - Delete club permanently

## Technical Implementation

### Admin Helper Functions (`lib/isAdmin.ts`)
```typescript
// Check if current user is admin
await isAdmin() // Returns true/false

// Require admin access (throws error if not admin)
await requireAdmin() // Returns true or throws error
```

### Usage in Pages
```typescript
import { isAdmin } from "@/lib/isAdmin";

// Check admin status
const admin = await isAdmin();
if (!admin) {
  redirect('/');
}
```

### Usage in API Routes
```typescript
import { requireAdmin } from '@/lib/isAdmin';

// Require admin access
await requireAdmin(); // Throws error if not admin
```

## Security Notes

1. **Email Verification**: Admin status is determined solely by email matching
2. **Environment Variables**: Keep `.env.local` secure and never commit to version control
3. **Production Deployment**: Ensure `ADMIN_EMAILS` is configured in Vercel/production environment
4. **API Protection**: All admin endpoints are protected by both Clerk auth and admin check
5. **Delete Operations**: Club deletions are permanent and should be used with caution

## Future Enhancements

Potential additions for the admin panel:
- Platform statistics dashboard
- Bulk operations (delete multiple clubs, export data)
- User management actions (suspend/ban users)
- Activity logs and audit trails
- Email template customization
- Certificate template management
- System settings configuration

## Troubleshooting

### Admin Panel Not Appearing
1. Check `ADMIN_EMAILS` is set in `.env.local`
2. Verify your logged-in email matches exactly (case-sensitive)
3. Restart development server after changing environment variables
4. Check browser console for errors

### "Unauthorized" Errors
1. Ensure you're signed in with Clerk
2. Verify your email is in `ADMIN_EMAILS`
3. Check that commas separate multiple emails correctly
4. No spaces around emails (they're trimmed automatically)

### Changes Not Reflecting
1. Refresh the page after admin actions
2. Check MongoDB connection if data isn't updating
3. Verify API routes are not returning errors

## Support

For issues or questions about the admin panel, check:
- Environment variables configuration
- Clerk authentication status
- MongoDB connection logs
- Browser console errors
