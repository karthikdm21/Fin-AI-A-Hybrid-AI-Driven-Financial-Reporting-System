import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Container, Box, Typography, Card, CardContent } from '@mui/material';
import { TrendingUp } from 'lucide-react';

const SignInPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8f9fa',
        pt: 12,
        pb: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            {/* Logo and Title */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <TrendingUp size={40} color="#1565C0" />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#1565C0',
                    letterSpacing: '-0.5px',
                  }}
                >
                  FinAI
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  fontWeight: 400,
                  mb: 1,
                }}
              >
                Welcome to FinAI
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#888',
                  maxWidth: '400px',
                  mx: 'auto',
                }}
              >
                AI-powered financial analysis and forecasting platform. 
                Sign in to access comprehensive financial insights and anomaly detection.
              </Typography>
            </Box>

            {/* Clerk Sign In Component */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                afterSignInUrl="/"
                appearance={{
                  baseTheme: undefined, // Use light theme
                  variables: {
                    colorPrimary: '#1565C0',
                    colorText: '#333333',
                    colorTextSecondary: '#666666',
                    colorBackground: '#ffffff',
                    colorInputBackground: '#ffffff',
                    colorInputText: '#333333',
                    colorNeutral: '#f8f9fa',
                    colorShimmer: '#f0f0f0',
                    colorSuccess: '#4caf50',
                    colorWarning: '#ff9800',
                    colorDanger: '#f44336',
                    borderRadius: '8px',
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: '14px',
                    fontWeight: {
                      normal: 400,
                      medium: 500,
                      semibold: 600,
                      bold: 700,
                    },
                  },
                  elements: {
                    formButtonPrimary: {
                      backgroundColor: '#1565C0',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#0D47A1',
                      },
                      '&:focus': {
                        backgroundColor: '#0D47A1',
                      },
                    },
                    formButtonSecondary: {
                      backgroundColor: '#ffffff',
                      color: '#1565C0',
                      border: '1px solid #1565C0',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    },
                    card: {
                      boxShadow: 'none',
                      border: 'none',
                      backgroundColor: '#ffffff',
                    },
                    headerTitle: {
                      display: 'none',
                    },
                    headerSubtitle: {
                      display: 'none',
                    },
                    socialButtonsBlockButton: {
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      color: '#333333',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                        borderColor: '#1565C0',
                      },
                    },
                    socialButtonsBlockButtonText: {
                      color: '#333333',
                      fontWeight: '500',
                    },
                    dividerLine: {
                      backgroundColor: '#e0e0e0',
                    },
                    dividerText: {
                      color: '#666666',
                    },
                    formFieldInput: {
                      backgroundColor: '#ffffff',
                      borderColor: '#e0e0e0',
                      color: '#333333',
                      '&:focus': {
                        borderColor: '#1565C0',
                        boxShadow: '0 0 0 1px #1565C0',
                      },
                    },
                    formFieldLabel: {
                      color: '#333333',
                    },
                    identityPreviewText: {
                      color: '#666666',
                    },
                    identityPreviewEditButton: {
                      color: '#1565C0',
                    },
                    footerActionText: {
                      color: '#666666',
                    },
                    footerActionLink: {
                      color: '#1565C0',
                      '&:hover': {
                        color: '#0D47A1',
                      },
                    },
                  },
                  layout: {
                    showOptionalFields: false,
                    socialButtonsPlacement: 'top',
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            What you'll get access to:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: '#888' }}>
              📊 Financial Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              🔍 Anomaly Detection
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              🤖 AI-Powered Analysis
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              📈 Revenue Forecasting
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignInPage;