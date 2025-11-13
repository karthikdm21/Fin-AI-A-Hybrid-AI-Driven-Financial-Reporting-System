import React from 'react';
import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { Printer } from 'lucide-react';

const AboutUs = () => {
  return (
    <Box
      id="about"
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8f9fa',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1565C0',
            mb: 1,
            textAlign: 'center',
          }}
        >
          How FinAI Works: Our 4-Step Process 🔬
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#666',
            mb: 6,
            textAlign: 'center',
            fontWeight: 400,
          }}
        >
          Our platform transforms raw financial data into clear, actionable insights through a sophisticated automated pipeline.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1565C0', mb: 2 }}>
                1. Data Preprocessing & Feature Engineering
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7 }}>
                It all starts with the data. We take raw financial statements from the fundamentals.csv dataset and put them through a rigorous cleaning process. We handle missing values, standardize formats, and then engineer new, insightful metrics like Return on Equity and Revenue Growth Rate. This creates a clean and feature-rich dataset, ready for machine learning.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1565C0', mb: 2 }}>
                2. Anomaly Detection with Isolation Forest
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7 }}>
                Once the data is clean, our anomaly detection model gets to work. Using a powerful algorithm called Isolation Forest, the system analyzes each company's financial history individually. It's trained to spot unusual patterns or outliers that deviate from the company's own normal performance. This helps flag years with potentially significant, one-time events that warrant closer inspection.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1565C0', mb: 2 }}>
                3. Forecasting with ARIMA Models
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7, mb: 2 }}>
                With a solid understanding of the past, we look to the future. We use a statistical model called ARIMA (AutoRegressive Integrated Moving Average) to forecast key financial metrics. For each company, a dedicated model is trained on its historical data to predict its performance for the next upcoming year. We focus on four crucial metrics:
              </Typography>
              <List sx={{ ml: 2 }}>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary="• Total Revenue" 
                    sx={{ '& .MuiListItemText-primary': { color: '#555' } }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary="• Net Income" 
                    sx={{ '& .MuiListItemText-primary': { color: '#555' } }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary="• Total Assets" 
                    sx={{ '& .MuiListItemText-primary': { color: '#555' } }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary="• Earnings Per Share (EPS)" 
                    sx={{ '& .MuiListItemText-primary': { color: '#555' } }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1565C0', mb: 2 }}>
                4. AI-Powered Summary Generation
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7 }}>
                Finally, we bring it all together. The results from the anomaly detection and forecasting models—the hard numbers—are sent to the Google Gemini AI. We use a detailed prompt that instructs the AI to act as a senior financial analyst. It synthesizes all the data points into a high-level executive summary, a detailed analysis, and provides actionable suggestions for both investors and financial analysts. This turns complex data into a clear, human-readable narrative.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Print Button */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Printer />}
            onClick={() => window.print()}
            sx={{
              borderColor: '#1565C0',
              color: '#1565C0',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: '#0D47A1',
                bgcolor: 'rgba(21, 101, 192, 0.08)',
              },
            }}
          >
            Print About Us Guide
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;