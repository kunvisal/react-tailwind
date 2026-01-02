# Mock API Server

This is a mock API server for development and testing purposes using JSON Server.

## Setup

1. Install JSON Server globally (if not already installed):
```bash
npm install -g json-server
```

## Running the Mock API

From the project root directory, run:

```bash
npm run mock-api
```

Or manually:

```bash
json-server mock-api/db.json --port 5000
```

The API will be available at: `http://localhost:5000`

**Note:** This uses json-server 1.0.0-beta which has a simpler API compared to older versions.

## Authentication

The mock API simulates JWT authentication. For protected endpoints, include the Authorization header:

```
Authorization: Bearer <token>
```

### Login

**POST** `/api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

Returns a mock JWT token that can be used for subsequent requests.

## Available Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh token
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Regions
- `GET /api/regions` - Get all regions
- `GET /api/regions/:id` - Get region by ID
- `POST /api/regions` - Create region
- `PUT /api/regions/:id` - Update region
- `DELETE /api/regions/:id` - Delete region

### Branches
- `GET /api/branches` - Get all branches
- `GET /api/branches/:id` - Get branch by ID
- `POST /api/branches` - Create branch
- `PUT /api/branches/:id` - Update branch
- `DELETE /api/branches/:id` - Delete branch

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Permissions
- `GET /api/permissions` - Get all permissions

### Menu Items
- `GET /api/menuItems` - Get all menu items (hierarchical structure)
- `GET /api/menuItems/:id` - Get menu item by ID
- `POST /api/menuItems` - Create menu item
- `PUT /api/menuItems/:id` - Update menu item
- `DELETE /api/menuItems/:id` - Delete menu item

### Audit Logs
- `GET /api/auditLogs` - Get all audit logs (with pagination)
- `GET /api/auditLogs/:id` - Get audit log by ID

### System Settings
- `GET /api/systemSettings` - Get all system settings
- `GET /api/systemSettings/:id` - Get system setting by ID
- `PUT /api/systemSettings/:id` - Update system setting

## Test Users

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin@123 | Admin |
| manager@example.com | Manager@123 | RegionalManager |
| branch.manager@example.com | Branch@123 | BranchManager |
| staff@example.com | Staff@123 | Staff |
| user@example.com | User@123 | User |

## Notes

- The mock API includes a 500ms delay to simulate network latency
- JWT tokens are not actually validated, only checked for presence
- All data is stored in `db.json` and persists between restarts
- To reset data, restore `db.json` from the original version

