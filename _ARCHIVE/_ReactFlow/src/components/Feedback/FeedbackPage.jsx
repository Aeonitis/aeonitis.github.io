import React from 'react';
import { COMPANY_INFO } from '../../config';

const FeedbackPage = () => {
  const handleEmailClick = () => {
    const subject = encodeURIComponent('Feedback on Argument Mapping Tool');
    const body = encodeURIComponent('Hello,\n\nI would like to provide the following feedback about the Argument Mapping Tool:\n\n');
    window.location.href = `mailto:${COMPANY_INFO.EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="feedback-page-content" style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="feedback-section" style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Share Your Thoughts</h2>
        
        <p style={{ marginBottom: '20px', lineHeight: '1.7' }}>
          We're constantly working to improve the Argument Mapping Tool. Your feedback is invaluable
          in helping us create a better experience for everyone. Whether you've found a bug, have a
          feature suggestion, or just want to share your experience, we'd love to hear from you!
        </p>
        
        <button
          onClick={handleEmailClick}
          style={{
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Send Feedback by Email
        </button>
      </div>
      
      <div className="faq-section" style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Frequently Asked Questions</h2>
        
        <div className="faq-item" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>How do I save my argument map?</h3>
          <p>
            Your work is automatically saved in your browser's local storage. You can also export 
            your map as a .trie file by clicking the "Export as .trie" button, which allows you 
            to save it to your device and import it later.
          </p>
        </div>
        
        <div className="faq-item" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Can I collaborate with others?</h3>
          <p>
            Currently, real-time collaboration isn't supported. However, you can export your map 
            as a .trie file and share it with others, who can then import it into their browser.
          </p>
        </div>
        
        <div className="faq-item">
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Is there a limit to how large my argument map can be?</h3>
          <p>
            There's no hard limit, but very large maps might become difficult to navigate. We 
            recommend focusing on the most important elements of your argument for clarity.
          </p>
        </div>
      </div>
      
      <div className="follow-us-section">
        <h2 style={{ marginBottom: '15px' }}>Stay Connected</h2>
        
        <p style={{ marginBottom: '20px', lineHeight: '1.7' }}>
          Follow us to stay updated on new features and improvements:
        </p>
        
        <div className="social-links" style={{ display: 'flex', gap: '15px' }}>
          <a 
            href="https://twitter.com/yourcompany" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#1a73e8',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
            Twitter
          </a>
          
          <a 
            href="https://github.com/yourcompany" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#1a73e8',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;