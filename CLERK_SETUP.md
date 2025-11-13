# Clerk Authentication Setup for FinAI

## Prerequisites

1. **Create a Clerk Account**
   - Go to [https://clerk.com](https://clerk.com)
   - Sign up for a free account
   - Create a new application

2. **Get Your Clerk Keys**
   - In your Clerk Dashboard, go to "API Keys"
   - Copy your "Publishable Key"

## Setup Steps

### 1. Install Dependencies

```bash
cd client
npm install @clerk/clerk-react
```

### 2. Configure Environment Variables

Update your `.env.local` file in the `client` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

**Important:** Replace `pk_test_your_actual_publishable_key_here` with your actual Clerk publishable key from the dashboard.

### 3. Configure Clerk Dashboard

In your Clerk Dashboard:

1. **Set up Sign-in/Sign-up URLs:**
   - Sign-in URL: `http://localhost:5173/sign-in`
   - Sign-up URL: `http://localhost:5173/sign-up`
   - After sign-in URL: `http://localhost:5173/`
   - After sign-up URL: `http://localhost:5173/`

2. **Configure Authentication Methods:**
   - Enable Email/Password authentication
   - Optionally enable Google, GitHub, or other OAuth providers

3. **Customize Appearance (Optional):**
   - Go to "Customization" in your Clerk Dashboard
   - Upload your logo and customize colors to match your brand

### 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`
3. You should be redirected to the sign-in page
4. Create a new account or sign in
5. After authentication, you should see the main dashboard

## Features Implemented

### ✅ Authentication Features
- **Sign In/Sign Up**: Custom styled pages matching your app design
- **Protected Routes**: All main app routes require authentication
- **User Profile**: Integrated user button with profile management
- **Session Management**: Automatic token handling for API calls
- **Responsive Design**: Works on desktop and mobile devices

### ✅ UI Components
- **Navigation Bar**: Shows user info and sign-out option when authenticated
- **Custom Sign-in Page**: Branded sign-in experience
- **Custom Sign-up Page**: Branded registration experience
- **Protected Route Component**: Reusable component for route protection

### ✅ API Integration
- **Automatic Token Handling**: API calls include authentication headers
- **Context Provider**: Centralized API authentication management
- **Error Handling**: Graceful handling of authentication errors

## Customization Options

### 1. Styling
You can customize the Clerk components' appearance by modifying the `appearance` prop in:
- `SignInPage.jsx`
- `SignUpPage.jsx`
- `Navigation.jsx` (UserButton)

### 2. Authentication Methods
In your Clerk Dashboard, you can enable additional authentication methods:
- Google OAuth
- GitHub OAuth
- Microsoft OAuth
- Apple OAuth
- Phone number authentication
- Magic links

### 3. User Profile Fields
Configure additional user profile fields in your Clerk Dashboard under "User & Authentication" > "Email, Phone, Username".

## Security Considerations

1. **Environment Variables**: Never commit your actual Clerk keys to version control
2. **HTTPS in Production**: Always use HTTPS in production environments
3. **API Protection**: Consider adding authentication middleware to your backend API
4. **Rate Limiting**: Implement rate limiting for authentication endpoints

## Troubleshooting

### Common Issues

1. **"Missing Publishable Key" Error**
   - Ensure your `.env.local` file has the correct `VITE_CLERK_PUBLISHABLE_KEY`
   - Restart your development server after adding environment variables

2. **Redirect Loop**
   - Check that your Clerk Dashboard URLs match your local development URLs
   - Ensure the publishable key is from the correct Clerk application

3. **Styling Issues**
   - Clerk components inherit some styles from your app
   - Use the `appearance` prop to override default styles

4. **API Authentication Errors**
   - Verify that the API service is correctly configured with the auth token getter
   - Check browser network tab for authentication headers in API requests

## Next Steps

1. **Backend Authentication**: Consider adding Clerk authentication to your backend API
2. **User Roles**: Implement user roles and permissions if needed
3. **Analytics**: Add user analytics and tracking
4. **Email Templates**: Customize email templates in Clerk Dashboard
5. **Multi-factor Authentication**: Enable MFA for enhanced security

## Support

- **Clerk Documentation**: [https://clerk.com/docs](https://clerk.com/docs)
- **Clerk Discord**: Join the Clerk community for support
- **GitHub Issues**: Report issues in your project repository