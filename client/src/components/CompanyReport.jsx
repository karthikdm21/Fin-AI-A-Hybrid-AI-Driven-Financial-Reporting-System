import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Printer } from 'lucide-react';
import apiService from '../services/api';

const CompanyReport = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticker) {
      loadCompanyData(ticker);
    }
  }, [ticker]);

  const loadCompanyData = async (companyTicker) => {
    try {
      setLoading(true);
      const data = await apiService.getCompany(companyTicker);
      
      // Fetch AI-generated summary
      try {
        const summaryData = await apiService.getCompanySummary(companyTicker);
        data.aiSummary = summaryData.summary;
      } catch (summaryErr) {
        console.warn('Failed to load AI summary:', summaryErr);
        data.aiSummary = 'AI summary generation failed. Please try again later.';
      }
      
      setCompanyData(data);
    } catch (err) {
      setError('Failed to load company details. Please try again.');
      console.error('Error loading company details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 12 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/')}
          sx={{ bgcolor: '#1565C0' }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!companyData) {
    return (
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Company data not found.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/')}
          sx={{ bgcolor: '#1565C0' }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: 12, pb: 4 }}>
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/')}
            sx={{ 
              borderColor: '#1565C0', 
              color: '#1565C0',
              '&:hover': {
                bgcolor: 'rgba(21, 101, 192, 0.08)',
                borderColor: '#1565C0',
              }
            }}
          >
            Back to Dashboard
          </Button>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1565C0',
              flex: 1,
              textAlign: 'center',
            }}
          >
            Company Financial Report
          </Typography>
        </Box>

        {/* Company Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
            {companyData.name}
          </Typography>
          <Chip
            label={`${companyData.anomalyCount} Anomalies Detected`}
            color="warning"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Company Summary Section */}
        <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
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
                      {companyData.revenueData && companyData.revenueData.length > 0 
                        ? Math.max(...companyData.revenueData.filter(d => d.type === 'historical').map(d => d.year))
                        : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>Total Revenue:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                      {companyData.revenueData && companyData.revenueData.length > 0 
                        ? `$${(companyData.revenueData
                            .filter(d => d.type === 'historical')
                            .sort((a, b) => b.year - a.year)[0]?.revenue || 0).toFixed(2)}B`
                        : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>Net Income:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                      {companyData.financialData && companyData.financialData.netIncome && companyData.financialData.netIncome.length > 0
                        ? `$${(companyData.financialData.netIncome
                            .filter(d => d.type === 'historical')
                            .sort((a, b) => b.year - a.year)[0]?.value / 1000000000 || 0).toFixed(2)}B`
                        : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>Total Assets:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                      {companyData.financialData && companyData.financialData.totalAssets && companyData.financialData.totalAssets.length > 0
                        ? `$${(companyData.financialData.totalAssets
                            .filter(d => d.type === 'historical')
                            .sort((a, b) => b.year - a.year)[0]?.value / 1000000000 || 0).toFixed(2)}B`
                        : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>Earnings Per Share:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                      {(() => {
                        // Debug: Log the data structure
                        console.log('CompanyData for EPS:', companyData);
                        console.log('FinancialData:', companyData.financialData);
                        console.log('EPS Data:', companyData.financialData?.eps);
                        
                        if (companyData.financialData && companyData.financialData.eps && companyData.financialData.eps.length > 0) {
                          const historicalEPS = companyData.financialData.eps.filter(d => d.type === 'historical');
                          console.log('Historical EPS:', historicalEPS);
                          
                          if (historicalEPS.length > 0) {
                            const latestEPS = historicalEPS.sort((a, b) => b.year - a.year)[0];
                            console.log('Latest EPS:', latestEPS);
                            
                            const epsValue = latestEPS?.value;
                            console.log('EPS Value:', epsValue, typeof epsValue);
                            
                            // Handle different data types and show actual value even if 0
                            if (epsValue !== undefined && epsValue !== null && !isNaN(epsValue)) {
                              return `$${Number(epsValue).toFixed(2)}`;
                            }
                          }
                        }
                        
                        // Also check if EPS data exists in a different structure
                        if (companyData.analysis && companyData.analysis.predictedEPS !== undefined) {
                          console.log('Predicted EPS from analysis:', companyData.analysis.predictedEPS);
                          return `$${Number(companyData.analysis.predictedEPS).toFixed(2)} (Predicted)`;
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
                      label={companyData.anomalyCount === 0 ? 'No Anomalies' : `${companyData.anomalyCount} Anomalies`}
                      color={companyData.anomalyCount === 0 ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>Financial Health:</Typography>
                    <Chip
                      label={(() => {
                        const latestNetIncome = companyData.financialData?.netIncome?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                        return latestNetIncome > 0 ? 'Profitable' : 'Loss-Making';
                      })()}
                      color={(() => {
                        const latestNetIncome = companyData.financialData?.netIncome?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
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
                        const latestRevenue = companyData.revenueData?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.revenue || 0;
                        const latestAssets = companyData.financialData?.totalAssets?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                        
                        let normalizedRevenue = latestRevenue;
                        let normalizedAssets = latestAssets;
                        
                        if (latestRevenue > 0 && latestAssets > 0 && latestAssets / latestRevenue > 1000) {
                          normalizedRevenue = latestRevenue * 1000000000;
                        }
                        
                        const assetTurnover = normalizedAssets > 0 ? (normalizedRevenue / normalizedAssets) : 0;
                        const cappedTurnover = Math.min(Math.max(assetTurnover, 0.01), 10.0);
                        
                        return normalizedAssets > 0 ? `${cappedTurnover.toFixed(2)}x` : 'N/A';
                      })()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>Profit Margin:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                      {(() => {
                        const latestRevenue = companyData.revenueData?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.revenue || 0;
                        const latestNetIncome = companyData.financialData?.netIncome?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                        
                        let normalizedRevenue = latestRevenue;
                        
                        if (latestRevenue > 0 && latestNetIncome !== 0 && Math.abs(latestNetIncome) > latestRevenue * 1000) {
                          normalizedRevenue = latestRevenue * 1000000000;
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
            <Box sx={{ mt: 3, p: 3, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.8 }}>
                {(() => {
                  const latestRevenue = companyData.revenueData?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.revenue || 0;
                  const latestNetIncome = companyData.financialData?.netIncome?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                  const latestAssets = companyData.financialData?.totalAssets?.filter(d => d.type === 'historical')?.sort((a, b) => b.year - a.year)[0]?.value || 0;
                  
                  const revenueInBillions = latestRevenue;
                  const assetsInBillions = latestAssets / 1000000000;
                  const assetTurnover = assetsInBillions > 0 ? (revenueInBillions / assetsInBillions) : 0;
                  
                  return `${companyData.name} shows ${companyData.anomalyCount === 0 ? 'stable financial performance' : 'some financial anomalies that require attention'}. 
                  With a revenue of $${latestRevenue.toFixed(2)}B and ${latestNetIncome > 0 ? `a net income of $${(latestNetIncome / 1000000000).toFixed(2)}B` : `a net loss of $${Math.abs(latestNetIncome / 1000000000).toFixed(2)}B`}, 
                  the company demonstrates ${latestNetIncome > 0 ? 'profitability' : 'challenges in maintaining profitability'}. 
                  The asset turnover ratio of ${assetTurnover.toFixed(2)}x indicates ${assetTurnover > 1 ? 'efficient' : 'moderate'} asset utilization.`;
                })()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* AI-Generated Company Summary Section */}
        <Card sx={{ mb: 4, bgcolor: '#fff8e1', border: '1px solid #ffb74d', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4, pb: 5 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#f57c00', borderBottom: '2px solid #ffb74d', pb: 1 }}>
              🤖 AI-Generated Financial Analysis
            </Typography>
            
            {companyData.aiSummary ? (
              <Box sx={{ p: 4, bgcolor: '#fffbf0', borderRadius: 2, border: '1px solid #ffe0b2' }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#333', 
                    lineHeight: 2, 
                    whiteSpace: 'pre-line',
                    fontFamily: 'Georgia, serif',
                    fontSize: '1rem',
                    letterSpacing: '0.02em'
                  }}
                >
                  {companyData.aiSummary}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 4, bgcolor: '#fffbf0', borderRadius: 2, border: '1px solid #ffe0b2' }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Generating AI-powered financial analysis...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Financial Charts Section */}
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#1565C0', textAlign: 'center' }}>
          Financial Forecasts & Analysis
        </Typography>

        {/* Revenue Chart */}
        <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4, pb: 6 }}>
            <Box sx={{ height: 400, width: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1565C0' }}>
                Total Revenue Forecast (Billions USD)
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={companyData.revenueData}>
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
          </CardContent>
        </Card>

        {/* Net Income Chart */}
        <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4, pb: 6 }}>
            <Box sx={{ height: 400, width: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2E7D32' }}>
                Net Income Forecast (Billions USD)
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={companyData.financialData?.netIncome?.map(item => ({
                  year: item.year,
                  netIncome: item.value / 1000000000, // Convert to billions
                  type: item.type
                }))}>
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
                    formatter={(value, name) => [`$${value.toFixed(2)}B`, name]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="netIncome"
                    stroke="#2E7D32"
                    strokeWidth={3}
                    dot={(props) => {
                      const { payload } = props;
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill={payload.type === 'historical' ? '#2E7D32' : '#FF6B35'}
                          stroke={payload.type === 'historical' ? '#2E7D32' : '#FF6B35'}
                          strokeWidth={2}
                        />
                      );
                    }}
                    strokeDasharray={(entry) => entry?.type === 'forecast' ? '5 5' : '0'}
                    name="Net Income"
                  />
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', gap: 3, mt: 2, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 3,
                      bgcolor: '#2E7D32',
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
          </CardContent>
        </Card>

        {/* Total Assets Chart */}
        <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4, pb: 6 }}>
            <Box sx={{ height: 400, width: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#7B1FA2' }}>
                Total Assets Forecast (Billions USD)
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={companyData.financialData?.totalAssets?.map(item => ({
                  year: item.year,
                  totalAssets: item.value / 1000000000, // Convert to billions
                  type: item.type
                }))}>
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
                    formatter={(value, name) => [`$${value.toFixed(2)}B`, name]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalAssets"
                    stroke="#7B1FA2"
                    strokeWidth={3}
                    dot={(props) => {
                      const { payload } = props;
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill={payload.type === 'historical' ? '#7B1FA2' : '#FF6B35'}
                          stroke={payload.type === 'historical' ? '#7B1FA2' : '#FF6B35'}
                          strokeWidth={2}
                        />
                      );
                    }}
                    strokeDasharray={(entry) => entry?.type === 'forecast' ? '5 5' : '0'}
                    name="Total Assets"
                  />
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', gap: 3, mt: 2, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 3,
                      bgcolor: '#7B1FA2',
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
          </CardContent>
        </Card>

        {/* Earnings Per Share Chart */}
        <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4, pb: 6 }}>
            <Box sx={{ height: 400, width: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#D32F2F' }}>
                Earnings Per Share Forecast (USD)
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={companyData.financialData?.eps?.map(item => ({
                  year: item.year,
                  eps: item.value,
                  type: item.type
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `'${value.toString().slice(-2)}`}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="eps"
                    stroke="#D32F2F"
                    strokeWidth={3}
                    dot={(props) => {
                      const { payload } = props;
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill={payload.type === 'historical' ? '#D32F2F' : '#FF6B35'}
                          stroke={payload.type === 'historical' ? '#D32F2F' : '#FF6B35'}
                          strokeWidth={2}
                        />
                      );
                    }}
                    strokeDasharray={(entry) => entry?.type === 'forecast' ? '5 5' : '0'}
                    name="Earnings Per Share"
                  />
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', gap: 3, mt: 2, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 3,
                      bgcolor: '#D32F2F',
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
          </CardContent>
        </Card>

        {/* Print Button */}
        <Box sx={{ textAlign: 'center' }}>
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
            Print Report
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyReport;