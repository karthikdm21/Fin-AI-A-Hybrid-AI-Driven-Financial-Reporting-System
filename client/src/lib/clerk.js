// Clerk configuration
export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  
  // Appearance configuration
  appearance: {
    elements: {
      formButtonPrimary: {
        backgroundColor: '#1565C0',
        '&:hover': {
          backgroundColor: '#0D47A1',
        },
      },
      card: {
        boxShadow: 'none',
        border: 'none',
      },
      headerTitle: {
        display: 'none',
      },
      headerSubtitle: {
        display: 'none',
      },
      socialButtonsBlockButton: {
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        color: '#333',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    layout: {
      showOptionalFields: false,
      socialButtonsPlacement: 'top',
    },
    variables: {
      colorPrimary: '#1565C0',
      colorText: '#333',
      colorTextSecondary: '#666',
      colorBackground: '#ffffff',
      colorInputBackground: '#ffffff',
      colorInputText: '#333',
      borderRadius: '8px',
    },
  },
  
  // Routing configuration
  routing: {
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    afterSignInUrl: '/',
    afterSignUpUrl: '/',
  },
};