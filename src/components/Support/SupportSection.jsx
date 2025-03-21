import React from 'react';
import { SUPPORT_LINKS } from '../../config';

const SupportSection = () => {
  return (
    <div className="support-section" style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ marginBottom: '15px' }}>Support This Project</h2>
      
      <p style={{ marginBottom: '20px', lineHeight: '1.7' }}>
        This argument mapping tool is provided as a free resource for everyone. If you find it 
        valuable and would like to support its continued development and maintenance, please 
        consider contributing in one of the following ways:
      </p>
      
      <div className="support-options" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <a 
          href={SUPPORT_LINKS.PATREON}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: '#f96854',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ marginRight: '15px', fontSize: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.82 2H9.38C5.97 2 3.38 4.79 3.38 8.5V19.56C3.38 20.22 4.13 20.66 4.75 20.42L12 16.96L19.25 20.42C19.87 20.66 20.62 20.21 20.62 19.56V8.5C20.62 4.79 18.02 2 14.82 2Z" fill="white"/>
            </svg>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Support on Patreon</strong>
            <span style={{ fontSize: '14px' }}>Become a patron and receive exclusive updates</span>
          </div>
        </a>
        
        <a 
          href={SUPPORT_LINKS.KOFI}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: '#29abe0',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ marginRight: '15px', fontSize: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" fill="white"/>
              <path d="M9 13C9 12.4 8.6 12 8 12C7.4 12 7 12.4 7 13C7 13.6 7.4 14 8 14C8.6 14 9 13.6 9 13Z" fill="#29abe0"/>
              <path d="M17 13C17 12.4 16.6 12 16 12C15.4 12 15 12.4 15 13C15 13.6 15.4 14 16 14C16.6 14 17 13.6 17 13Z" fill="#29abe0"/>
              <path d="M12 18C14.21 18 16 16.21 16 14H8C8 16.21 9.79 18 12 18Z" fill="#29abe0"/>
            </svg>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Buy Me a Coffee on Ko-fi</strong>
            <span style={{ fontSize: '14px' }}>Support with a one-time contribution</span>
          </div>
        </a>
        
        <a 
          href={SUPPORT_LINKS.REVOLUT}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: '#0666eb',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ marginRight: '15px', fontSize: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="white"/>
            </svg>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Donate via Revolut</strong>
            <span style={{ fontSize: '14px' }}>Quick and easy transaction</span>
          </div>
        </a>
      </div>
      
      <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f5f7fa', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
          Thank you for your support! Every contribution helps us continue to improve and maintain this tool.
        </p>
      </div>
    </div>
  );
};

export default SupportSection;