# Testing the Login Functionality

## Quick Test Steps

### 1. Make Sure Both Servers Are Running

**Terminal 1 - Mock API (should already be running):**
```bash
npm run mock-api
```
You should see:
```
JSON Server started on PORT :5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```
You should see something like:
```
VITE v6.1.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 2. Clear Browser Cache (Important!)

1. Open your browser and go to `http://localhost:5173`
2. Press **F12** to open DevTools
3. Go to the **Console** tab
4. Type and run: `localStorage.clear()`
5. Press **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac) to hard refresh

### 3. Test Login

1. Click on "Sign In" or navigate to `http://localhost:5173/signin`
2. Enter test credentials:
   - **Email**: `admin@example.com`
   - **Password**: `test123` (or any password - mock API doesn't validate)
3. Click "Sign in" button

### 4. Expected Results

✅ **Success Indicators:**
- You should see a green success toast notification saying "Login successful!"
- You should be redirected to the dashboard (`/`)
- In the top right corner, you should see "Sok Chan" (the admin user's name)
- The page should show the dashboard content

❌ **If You See Errors:**
- **"Invalid input: expected string, received undefined"**: 
  - Stop the frontend server (Ctrl+C)
  - Run `localStorage.clear()` in browser console
  - Restart frontend: `npm run dev`
  - Hard refresh the page

- **Network Error**:
  - Check that mock API is running on port 5000
  - Visit `http://localhost:5000/login` - you should see JSON data

### 5. Test Other Features

**Test Logout:**
1. Click on your name in the top right corner
2. Click "Sign out"
3. You should see "Logged out successfully!" toast
4. You should be redirected to the sign-in page

**Test Protected Routes:**
1. While logged out, try to access `http://localhost:5173/profile`
2. You should be redirected to `/signin`
3. After logging in, you should be able to access `/profile`

**Test "Remember Me":**
1. Log in with "Keep me logged in" checked
2. Close the browser completely
3. Open browser again and go to `http://localhost:5173`
4. You should still be logged in

## Test Users

| Email | Role | Description |
|-------|------|-------------|
| admin@example.com | Admin | Full system access |
| manager@example.com | RegionalManager | Regional management access |
| branch.manager@example.com | BranchManager | Branch management access |
| staff@example.com | Staff | Limited staff access |
| user@example.com | User | Basic user access |

**Note:** The mock API doesn't validate passwords, so you can use any password for testing.

## Debugging Tips

### Check Network Requests

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Sign in"
4. Look for a request to `login`
5. Click on it to see:
   - **Request**: Should show the email and password
   - **Response**: Should show the user data and tokens

### Check Console for Errors

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for any red error messages
4. Common errors and fixes:
   - `Failed to fetch`: Mock API is not running
   - `CORS error`: Restart mock API server
   - `undefined is not an object`: Clear cache and refresh

### Check localStorage

1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Local Storage** → `http://localhost:5173`
4. After successful login, you should see:
   - `access_token`: JWT token
   - `refresh_token`: Refresh token
   - `user_data`: User information

### Verify Mock API is Working

Open these URLs in your browser:

- `http://localhost:5000/` - Should show JSON Server index
- `http://localhost:5000/login` - Should show login response with user data
- `http://localhost:5000/users` - Should show array of users

## Common Issues and Solutions

### Issue: Form shows validation errors immediately

**Solution:** This is expected behavior. The form validates on submit. Just fill in the fields and click "Sign in".

### Issue: "Sign in" button is disabled

**Solution:** This happens when the form is submitting. Wait a moment. If it stays disabled:
1. Refresh the page
2. Clear localStorage
3. Try again

### Issue: Redirected to signin after successful login

**Solution:** The token might not be stored correctly:
1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Try logging in again

### Issue: Can't access protected routes

**Solution:** 
1. Make sure you're logged in (check if user name appears in header)
2. Check localStorage for `access_token`
3. Try logging out and logging in again

## Success Checklist

- [ ] Mock API running on port 5000
- [ ] Frontend running on port 5173 (or shown port)
- [ ] Can navigate to signin page
- [ ] Can enter email and password
- [ ] Can click "Sign in" button
- [ ] See success toast notification
- [ ] Redirected to dashboard
- [ ] See user name in header
- [ ] Can access protected routes
- [ ] Can logout successfully
- [ ] Redirected to signin after logout

## Next Steps After Successful Login

Once login is working, you can:

1. **Explore the Dashboard**: Navigate through the existing pages
2. **Test Different Users**: Try logging in with different test users
3. **Test Permissions**: Check which pages different users can access
4. **Build CRUD Pages**: Start implementing user management, region management, etc.
5. **Customize UI**: Update colors, fonts, and layouts

---

**Need Help?**
- Check `SETUP_GUIDE.md` for detailed setup instructions
- Check `IMPLEMENTATION_STATUS.md` for what's been implemented
- Check browser DevTools Console and Network tabs for errors

