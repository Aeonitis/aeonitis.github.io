import React from 'react';
import AboutPage from '../components/About/AboutPage';

const About = () => {
  return (
    <div className="about-page-container">
      <h1 style={{ marginBottom: '20px' }}>About This Project</h1>
      <AboutPage />
    </div>
  );
};

export default About;