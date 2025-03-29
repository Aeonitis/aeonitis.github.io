import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '50px'
    }}>
      <h1 style={{ fontSize: '120px', margin: '0', color: '#1a73e8' }}>404</h1>
      
      <h2 style={{ marginBottom: '20px' }}>Page Not Found</h2>
      
      <p style={{ maxWidth: '500px', marginBottom: '30px', color: '#666' }}>
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      
      <Link 
        to="/"
        style={{
          backgroundColor: '#1a73e8',
          color: 'white',
          textDecoration: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;