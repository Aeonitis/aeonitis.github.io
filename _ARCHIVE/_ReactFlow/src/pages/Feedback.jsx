import React from 'react';
import FeedbackPage from '../components/Feedback/FeedbackPage';

const Feedback = () => {
  return (
    <div className="feedback-page-container">
      <h1 style={{ marginBottom: '20px' }}>Feedback & Contact</h1>
      <FeedbackPage />
    </div>
  );
};

export default Feedback;