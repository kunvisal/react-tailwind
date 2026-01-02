# Setup Guide - Admin Dashboard

This guide will help you set up and run the admin dashboard with the mock API server.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Linux/Mac
cp .env.example .env
```

## Running the Application

### Option 1: Run Both Frontend and Mock API (Recommended for Development)

Open two terminal windows:

**Terminal 1 - Mock API Server:**
```bash
npm run mock-api
```
The mock API will be available at `http://localhost:5000`

Available endpoints:
- `http://localhost:5000/login` - Login endpoint
- `http://localhost:5000/users` - Users CRUD
- `http://localhost:5000/roles` - Roles CRUD
- `http://localhost:5000/permissions` - Permissions
- `http://localhost:5000/regions` - Regions CRUD
- `http://localhost:5000/branches` - Branches CRUD
- `http://localhost:5000/menuItems` - Menu items
- `http://localhost:5000/auditLogs` - Audit logs
- `http://localhost:5000/systemSettings` - System settings

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy)

### Option 2: Run Only Frontend (if you have a real backend)

```bash
npm run dev
```

Make sure to update the `.env` file with your actual API URL:
```
VITE_API_BASE_URL=https://your-api-url.com
```

## Test Users

Use these credentials to log in to the mock API:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin@123 | Admin |
| manager@example.com | Manager@123 | RegionalManager |
| branch.manager@example.com | Branch@123 | BranchManager |
| staff@example.com | Staff@123 | Staff |
| user@example.com | User@123 | User |

**Note:** The mock API doesn't actually validate passwords, any password will work. The passwords above are just for reference when you implement a real backend.

## Project Structure

```
├── mock-api/              # Mock API server files
│   ├── db.json           # Mock database with dummy data
│   ├── routes.json       # API route mappings
│   ├── middleware.js     # JWT simulation middleware
│   └── README.md         # Mock API documentation
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── common/      # Common components (LoadingSpinner, ErrorBoundary, etc.)
│   │   └── ...
│   ├── context/         # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── SidebarContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── api/         # API-related hooks (useUsers, useRegions, etc.)
│   │   └── ...
│   ├── pages/           # Page components
│   ├── services/        # API services
│   │   └── api/         # API client and service functions
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── ...
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Example environment variables
└── package.json         # Project dependencies and scripts
```

## Features Implemented

### Week 1-2: Foundation
- ✅ Authentication Context with JWT support
- ✅ Protected Routes with role-based access control
- ✅ Form validation with react-hook-form and Zod
- ✅ Enhanced authentication forms (Sign In, Sign Up, Forgot Password, Reset Password)
- ✅ API client with interceptors (token refresh, error handling)
- ✅ API service layer (auth, users, regions, branches, menus)

### Week 3: Integration
- ✅ React Query integration
- ✅ Custom data fetching hooks
- ✅ Loading states (LoadingSpinner, SkeletonLoader)
- ✅ Error handling (ErrorBoundary, toast notifications)
- ✅ Environment configuration

### Mock API
- ✅ 69+ API endpoints
- ✅ Realistic dummy data (5 users, 3 regions, branches, menus, audit logs)
- ✅ JWT simulation
- ✅ Pagination support
- ✅ Error responses

## Development Tips

### Testing Authentication

1. Start the mock API server
2. Go to `http://localhost:5173/signin`
3. Use any of the test user credentials
4. You should be redirected to the dashboard

### Testing Protected Routes

1. Try accessing `/profile` or any dashboard route without logging in
2. You should be redirected to `/signin`
3. After logging in, you should be able to access protected routes

### Testing Token Refresh

The token refresh is automatic. The AuthContext checks token expiry every minute and refreshes it if needed.

### Viewing API Requests

Open the browser DevTools (F12) → Network tab to see all API requests and responses.

## Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use:

**For Mock API (port 5000):**
Edit `package.json` and change the port in the `mock-api` script:
```json
"mock-api": "json-server --watch mock-api/db.json --routes mock-api/routes.json --middlewares mock-api/middleware.js --port 5001"
```

Then update `.env`:
```
VITE_API_BASE_URL=http://localhost:5001/api
```

**For Frontend (port 5173):**
Vite will automatically use the next available port and show it in the terminal.

### CORS Errors

The mock API server should handle CORS automatically. If you're still getting CORS errors, make sure:
1. The mock API is running
2. The `VITE_API_BASE_URL` in `.env` matches the mock API URL

### Authentication Not Working

1. Check that the mock API is running on port 5000
2. Open browser DevTools → Console to see any errors
3. Check Network tab to see if API requests are being made
4. Verify the API is accessible: Open `http://localhost:5000/login` in your browser
5. Clear browser cache and localStorage: Open DevTools Console and run `localStorage.clear()`, then refresh
6. Make sure you're using the correct API URL in `.env`: `VITE_API_BASE_URL=http://localhost:5000`

### "Invalid input: expected string, received undefined" Error

This error occurs when the form validation doesn't receive the expected data. **This has been fixed!**

The issue was that the Input and Checkbox components weren't forwarding refs properly for react-hook-form.

**If you still see this error:**
1. Stop the frontend server (Ctrl+C in the terminal)
2. Clear your browser cache and localStorage: Open DevTools Console and run `localStorage.clear()`
3. Restart the frontend server: `npm run dev`
4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Next Steps

1. **Implement Real Backend:** Replace the mock API with a real ASP.NET Core API or your preferred backend
2. **Add More Features:** Implement user management, region/branch management, etc.
3. **Customize UI:** Update colors, fonts, and layouts to match your brand
4. **Add Tests:** Write unit tests and integration tests
5. **Deploy:** Deploy to your hosting provider

## Support

For issues or questions, refer to:
- Mock API documentation: `mock-api/README.md`
- Implementation plan: `.cursor/plans/week_1-3_implementation_&_complete_api_system_776dfc01.plan.md`

