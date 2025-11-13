import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Box,
  Chip,
  Autocomplete,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Printer, FileText } from 'lucide-react';
import apiService from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const companiesData = await apiService.getCompanies();
      setCompanies(companiesData);
    } catch (err) {
      setError('Failed to load companies. Please try again.');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = async (event, newValue) => {
    setSelectedCompany(newValue);
    if (newValue) {
      try {
        setLoading(true);
        const companyData = await apiService.getCompany(newValue.ticker);
        
        // Fetch AI-generated summary
        try {
          const summaryData = await apiService.getCompanySummary(newValue.ticker);
          companyData.aiSummary = summaryData.summary;
        } catch (summaryErr) {
          console.warn('Failed to load AI summary:', summaryErr);
          companyData.aiSummary = 'AI summary generation failed. Please try again later.';
        }
        
        setSelectedCompanyData(companyData);
      } catch (err) {
        setError('Failed to load company details. Please try again.');
        console.error('Error loading company details:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedCompanyData(null);
    }
  };

  return (
    <Box
      id="dashboard"
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8f9fa',
        pt: 12,
        pb: 8,
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
          Financial Dashboard
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
          Comprehensive AI-powered financial analysis and forecasting
        </Typography>

        <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {loading && companies.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Autocomplete
                options={companies}
                getOptionLabel={(option) => option.name}
                value={selectedCompany}
                onChange={handleCompanyChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and Select Company"
                    placeholder="Type to search companies..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#1565C0',
                        },
                      },
                    }}
                  />
                )}
                sx={{ mb: 3 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            )}

            {selectedCompanyData && (
              <Box>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
                    {selectedCompanyData.name}
                  </Typography>
                  <Chip
                    label={`${selectedCompanyData.anomalyCount} Anomalies Detected`}
                    color="warning"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Company Summary Section */}
                <Card sx={{ mb: 4, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1565C0', borderBottom: '2px solid #1565C0', pb: 1 }}>
                      Financial Summary & Analysis
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                      {/* Key Metrics */}
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                          Key Financial Metrics
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Latest Year:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {selectedCompanyData.revenueData && selectedCompanyData.revenueData.length > 0 
                                ? Math.max(...selectedCompanyData.revenueData.filter(d => d.type === 'historical').map(d => d.year))
                                : 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Total Revenue:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {selectedCompanyData.revenueData && selectedCompanyData.revenueData.length > 0 
                                ? `${(selectedCompanyData.revenueData
                                    .filter(d => d.type === 'historical')
                                    .sort((a, b) => b.year - a.year)[0]?.revenue || 0).toFixed(2)}B`
                                : 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Net Income:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {selectedCompanyData.financialData && selectedCompanyData.financialData.netIncome && selectedCompanyData.financialData.netIncome.length > 0
                                ? `${(selectedCompanyData.financialData.netIncome
                                    .filter(d => d.type === 'historical')
                                    .sort((a, b) => b.year - a.year)[0]?.value / 1000000000 || 0).toFixed(2)}B`
                                : 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Total Assets:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {selectedCompanyData.financialData && selectedCompanyData.financialData.totalAssets && selectedCompanyData.financialData.totalAssets.length > 0
                                ? `${(selectedCompanyData.financialData.totalAssets
                                    .filter(d => d.type === 'historical')
                                    .sort((a, b) => b.year - a.year)[0]?.value / 1000000000 || 0).toFixed(2)}B`
                                : 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Earnings Per Share:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {(() => {
                                // Debug: Log the EPS data structure
                                console.log('EPS data:', selectedCompanyData.financialData?.eps);
                                
                                if (selectedCompanyData.financialData && selectedCompanyData.financialData.eps && selectedCompanyData.financialData.eps.length > 0) {
                                  const historicalEPS = selectedCompanyData.financialData.eps.filter(d => d.type === 'historical');
                                  console.log('Historical EPS:', historicalEPS);
                                  
                                  if (historicalEPS.length > 0) {
                                    const latestEPS = historicalEPS.sort((a, b) => b.year - a.year)[0];
                                    console.log('Latest EPS:', latestEPS);
                                    
                                    const epsValue = latestEPS?.value || 0;
                                    return epsValue !== 0 ? `${epsValue.toFixed(2)}` : 'N/A';
                                  }
                                }
                                
                                // Fallback: try to get EPS from the companies list data
                                if (selectedCompany && selectedCompany.eps) {
                                  console.log('Using EPS from company list:', selectedCompany.eps);
                                  return `${selectedCompany.eps.toFixed(2)}`;
                                }
                                
                                return 'N/A';
                              })()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Analysis Insights */}
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                          Analysis Insights
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Anomaly Status:</Typography>
                            <Chip
                              label={selectedCompanyData.anomalyCount === 0 ? 'No Anomalies' : `${selectedCompanyData.anomalyCount} Anomalies`}
                              color={selectedCompanyData.anomalyCount === 0 ? 'success' : 'warning'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Financial Health:</Typography>
                            <Chip
                              label={(() => {
                                const latestNetIncome = selectedCompanyData.financialData?.netIncome?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                                return latestNetIncome > 0 ? 'Profitable' : 'Loss-Making';
                              })()}
                              color={(() => {
                                const latestNetIncome = selectedCompanyData.financialData?.netIncome?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                                return latestNetIncome > 0 ? 'success' : 'error';
                              })()}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Asset Turnover:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {(() => {
                                const latestRevenue = selectedCompanyData.revenueData?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.revenue || 0;
                                const latestAssets = selectedCompanyData.financialData?.totalAssets?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                                
                                // Debug: Log the actual values to understand the data format
                                console.log('Revenue value:', latestRevenue, 'Assets value:', latestAssets);
                                
                                // Assume both values are in the same unit (likely actual dollars)
                                // If revenue is much smaller than assets, revenue might be in billions already
                                let normalizedRevenue = latestRevenue;
                                let normalizedAssets = latestAssets;
                                
                                // If revenue is significantly smaller than assets, it's likely in billions
                                if (latestRevenue > 0 && latestAssets > 0 && latestAssets / latestRevenue > 1000) {
                                  normalizedRevenue = latestRevenue * 1000000000; // Convert billions to dollars
                                }
                                
                                const assetTurnover = normalizedAssets > 0 ? (normalizedRevenue / normalizedAssets) : 0;
                                
                                // Cap the result to reasonable values (0.01 to 10.0)
                                const cappedTurnover = Math.min(Math.max(assetTurnover, 0.01), 10.0);
                                
                                return normalizedAssets > 0 ? `${cappedTurnover.toFixed(2)}x` : 'N/A';
                              })()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>Profit Margin:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {(() => {
                                const latestRevenue = selectedCompanyData.revenueData?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.revenue || 0;
                                const latestNetIncome = selectedCompanyData.financialData?.netIncome?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                                
                                // Debug: Log the actual values
                                console.log('Revenue for margin:', latestRevenue, 'Net Income:', latestNetIncome);
                                
                                // Ensure both values are in the same units
                                let normalizedRevenue = latestRevenue;
                                
                                // If revenue is in billions and net income is in dollars
                                if (latestRevenue > 0 && latestNetIncome !== 0 && Math.abs(latestNetIncome) > latestRevenue * 1000) {
                                  normalizedRevenue = latestRevenue * 1000000000; // Convert billions to dollars
                                }
                                
                                const profitMargin = normalizedRevenue > 0 ? ((latestNetIncome / normalizedRevenue) * 100) : 0;
                                
                                return normalizedRevenue > 0 ? `${profitMargin.toFixed(1)}%` : 'N/A';
                              })()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Summary Description */}
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                      <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                        {(() => {
                          const latestRevenue = selectedCompanyData.revenueData?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.revenue || 0;
                          const latestNetIncome = selectedCompanyData.financialData?.netIncome?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                          const latestAssets = selectedCompanyData.financialData?.totalAssets?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                          
                          // Use the same calculation as in the Analysis Insights section
                          const revenueInBillions = latestRevenue; // Already in billions
                          const assetsInBillions = latestAssets / 1000000000; // Convert to billions
                          const assetTurnover = assetsInBillions > 0 ? (revenueInBillions / assetsInBillions) : 0;
                          
                          return `${selectedCompanyData.name} shows ${selectedCompanyData.anomalyCount === 0 ? 'stable financial performance' : 'some financial anomalies that require attention'}. 
                          With a revenue of ${latestRevenue.toFixed(2)}B and ${latestNetIncome > 0 ? `a net income of ${(latestNetIncome / 1000000000).toFixed(2)}B` : `a net loss of ${Math.abs(latestNetIncome / 1000000000).toFixed(2)}B`}, 
                          the company demonstrates ${latestNetIncome > 0 ? 'profitability' : 'challenges in maintaining profitability'}. 
                          The asset turnover ratio of ${assetTurnover.toFixed(2)}x indicates ${assetTurnover > 1 ? 'efficient' : 'moderate'} asset utilization.`;
                        })()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* AI-Generated Company Summary Section */}
                <Card sx={{ mb: 4, bgcolor: '#fff8e1', border: '1px solid #ffb74d' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#f57c00', borderBottom: '2px solid #ffb74d', pb: 1 }}>
                      🤖 AI-Generated Financial Analysis
                    </Typography>
                    
                    {selectedCompanyData.aiSummary ? (
                      <Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#333', 
                            lineHeight: 1.8, 
                            whiteSpace: 'pre-line',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                          }}
                        >
                          {selectedCompanyData.aiSummary}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Generating AI-powered financial analysis...
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                <Box sx={{ height: 400, width: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1565C0' }}>
                    Total Revenue Forecast (Billions USD)
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedCompanyData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `'${value.toString().slice(-2)}`}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}B`}
                      />
                      <Tooltip
                        formatter={(value, name) => [`$${value}B`, name]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1565C0"
                        strokeWidth={3}
                        dot={(props) => {
                          const { payload } = props;
                          return (
                            <circle
                              cx={props.cx}
                              cy={props.cy}
                              r={4}
                              fill={payload.type === 'historical' ? '#1565C0' : '#FF6B35'}
                              stroke={payload.type === 'historical' ? '#1565C0' : '#FF6B35'}
                              strokeWidth={2}
                            />
                          );
                        }}
                        strokeDasharray={(entry) => entry?.type === 'forecast' ? '5 5' : '0'}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', gap: 3, mt: 2, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 3,
                          bgcolor: '#1565C0',
                          borderRadius: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Historical Data
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 3,
                          bgcolor: '#FF6B35',
                          borderRadius: 1,
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'repeating-linear-gradient(90deg, #FF6B35 0px, #FF6B35 5px, transparent 5px, transparent 10px)',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Forecast Data
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<FileText />}
                    onClick={() => navigate(`/report/${selectedCompanyData.ticker || selectedCompany.ticker}`)}
                    sx={{
                      borderColor: '#1565C0',
                      color: '#1565C0',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        bgcolor: 'rgba(21, 101, 192, 0.08)',
                        borderColor: '#1565C0',
                      },
                    }}
                  >
                    View Full Report
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Printer />}
                    onClick={() => window.print()}
                    sx={{
                      bgcolor: '#1565C0',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        bgcolor: '#0D47A1',
                      },
                    }}
                  >
                    Print Dashboard Report
                  </Button>
                </Box>
              </Box>
            )}

            {!selectedCompanyData && (
              <Box
                sx={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                <Typography variant="h6">
                  Select a company to view financial analysis
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;