import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#263238',
        color: 'white',
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              FinAI
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BEC5', lineHeight: 1.6 }}>
              Advanced AI-powered financial analysis platform providing comprehensive insights and forecasting for modern businesses.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#dashboard" sx={{ color: '#B0BEC5', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Dashboard
              </Link>
              <Link href="#anomaly" sx={{ color: '#B0BEC5', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Anomaly Detection
              </Link>
              <Link href="#about" sx={{ color: '#B0BEC5', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                About Us
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: '#B0BEC5', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Privacy Policy
              </Link>
              <Link href="#" sx={{ color: '#B0BEC5', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Terms of Service
              </Link>
              <Link href="#" sx={{ color: '#B0BEC5', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                Contact
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid #37474F',
            mt: 4,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
            © 2025 FinAI. All rights reserved. Powered by advanced machine learning and AI technology.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;