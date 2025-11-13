import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ClerkProvider } from '@clerk/clerk-react';
import { ApiProvider } from './contexts/ApiContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import CompanyReport from './components/CompanyReport';
import Footer from './components/Footer';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#37474F',
      light: '#62727B',
      dark: '#263238',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => window.location.href = to}
      appearance={{
        variables: {
          colorPrimary: '#1565C0',
          colorText: '#333',
          colorTextSecondary: '#666',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#333',
          borderRadius: '8px',
        },
      }}
    >
      <ApiProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes for authentication */}
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                
                {/* Protected routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/report/:ticker" element={<CompanyReport />} />
                      </Routes>
                      <Footer />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </ApiProvider>
    </ClerkProvider>
  );
}

export default App;