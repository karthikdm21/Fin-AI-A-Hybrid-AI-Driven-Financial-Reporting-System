import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Printer } from 'lucide-react';
import apiService from '../services/api';

const AnomalyDetection = () => {
  const navigate = useNavigate();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = async () => {
    try {
      setLoading(true);
      const anomaliesData = await apiService.getAnomalies();
      setAnomalies(anomaliesData);
    } catch (err) {
      setError('Failed to load anomalies. Please try again.');
      console.error('Error loading anomalies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (company) => {
    // Navigate to CompanyReport page with the company ticker
    navigate(`/report/${company.ticker}`);
  };

  return (
    <Box
      id="anomaly"
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
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
          Anomaly Detection
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
          AI-powered detection of financial irregularities and outliers
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#1565C0' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    Company Name
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    Anomaly Count
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {anomalies.map((company) => (
                  <TableRow
                    key={company.id}
                    sx={{
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{company.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={company.anomalyCount}
                        color={company.anomalyCount > 10 ? 'error' : company.anomalyCount > 5 ? 'warning' : 'success'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleViewReport(company)}
                        sx={{
                          bgcolor: '#1565C0',
                          '&:hover': {
                            bgcolor: '#0D47A1',
                          },
                        }}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Print Button for Anomaly Table */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
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
            Print Anomaly Summary
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AnomalyDetection;