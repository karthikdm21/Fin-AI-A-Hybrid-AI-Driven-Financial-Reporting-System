const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.getAuthToken = null; // Will be set by components that use Clerk
  }

  // Method to set the auth token getter function
  setAuthTokenGetter(getTokenFn) {
    this.getAuthToken = getTokenFn;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      // Get auth token if available
      let authHeaders = {};
      if (this.getAuthToken) {
        try {
          const token = await this.getAuthToken();
          if (token) {
            authHeaders.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Failed to get auth token:', error);
        }
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all companies
  async getCompanies() {
    return this.request('/companies');
  }

  // Get specific company details
  async getCompany(ticker) {
    return this.request(`/company/${ticker}`);
  }

  // Get anomaly detection results
  async getAnomalies() {
    return this.request('/anomalies');
  }

  // Get summary statistics
  async getSummary() {
    return this.request('/summary');
  }

  // Get AI-generated company summary
  async getCompanySummary(ticker) {
    return this.request(`/company/${ticker}/summary`);
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // ML service health check
  async getMlHealth() {
    return this.request('/ml-health');
  }
}

export default new ApiService();