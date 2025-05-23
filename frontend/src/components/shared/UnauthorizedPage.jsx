import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '50px 20px',
      margin: '0 auto',
      backgroundColor: 'white',
      color: 'black'
    }}>
      <h1>Access Denied</h1>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default UnauthorizedPage;