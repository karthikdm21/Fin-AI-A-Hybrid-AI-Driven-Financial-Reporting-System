import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import apiService from '../services/api';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the auth token getter function in the API service
    apiService.setAuthTokenGetter(getToken);
  }, [getToken]);

  return (
    <ApiContext.Provider value={{ apiService }}>
      {children}
    </ApiContext.Provider>
  );
};