import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { TrendingUp } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar
      id="navigation"
      position="fixed"
      sx={{
        bgcolor: 'white',
        color: '#1565C0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            }
          }}
          onClick={handleLogoClick}
        >
          <TrendingUp size={32} color="#1565C0" />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#1565C0',
              letterSpacing: '-0.5px',
            }}
          >
            FinAI
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => scrollToSection('dashboard')}
            sx={{
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(21, 101, 192, 0.08)',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => scrollToSection('anomaly')}
            sx={{
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(21, 101, 192, 0.08)',
              },
            }}
          >
            Anomaly
          </Button>
          <Button
            color="inherit"
            onClick={() => scrollToSection('about')}
            sx={{
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(21, 101, 192, 0.08)',
              },
            }}
          >
            About Us
          </Button>
          
          {/* Temporary sign in button */}
          <Button
            variant="contained"
            sx={{
              bgcolor: '#1565C0',
              color: 'white',
              fontWeight: 600,
              px: 3,
              ml: 2,
              '&:hover': {
                bgcolor: '#0D47A1',
              },
            }}
          >
            Sign In (Coming Soon)
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;