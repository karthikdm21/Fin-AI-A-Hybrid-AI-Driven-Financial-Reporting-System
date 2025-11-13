import React from 'react';
import Dashboard from './Dashboard';
import AnomalyDetection from './AnomalyDetection';
import AboutUs from './AboutUs';

const Home = () => {
  return (
    <>
      <Dashboard />
      <AnomalyDetection />
      <AboutUs />
    </>
  );
};

export default Home;