import React from 'react';
import { COMPANY_INFO } from '../../config';

const AboutPage = () => {
  return (
    <div className="about-page-content" style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ marginBottom: '15px' }}>Our Mission</h2>
      
      <div className="mission-statement" style={{ marginBottom: '30px' }}>
        <p style={{ marginBottom: '15px', lineHeight: '1.7' }}>
          Our mission is to empower critical thinking through accessible visual argument mapping. 
          In a world filled with complex debates and discussions, the ability to clearly structure and 
          analyze arguments is essential for productive dialogue and sound decision-making.
        </p>
        
        <p style={{ marginBottom: '15px', lineHeight: '1.7' }}>
          We believe that visual argument mapping offers a powerful way to:
        </p>
        
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li style={{ marginBottom: '10px' }}>Clarify complex reasoning</li>
          <li style={{ marginBottom: '10px' }}>Identify logical strengths and weaknesses</li>
          <li style={{ marginBottom: '10px' }}>Bridge understanding between different perspectives</li>
          <li style={{ marginBottom: '10px' }}>Foster more rigorous and productive discussions</li>
        </ul>
        
        <p style={{ lineHeight: '1.7' }}>
          Our tool is designed to be intuitive and accessible, whether you're a student learning critical 
          thinking, a professional analyzing options, or anyone engaged in thoughtful debate. By making 
          argument mapping free and easy to use, we hope to contribute to clearer reasoning and better 
          communication across diverse fields and topics.
        </p>
      </div>
      
      <h2 style={{ marginBottom: '15px' }}>About the Tool</h2>
      
      <p style={{ marginBottom: '15px', lineHeight: '1.7' }}>
        This argument mapping tool allows you to:
      </p>
      
      <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '10px' }}>Create a visual representation of your argument</li>
        <li style={{ marginBottom: '10px' }}>Add supporting reasons ("because" statements)</li>
        <li style={{ marginBottom: '10px' }}>Include counterarguments ("but" statements)</li>
        <li style={{ marginBottom: '10px' }}>Incorporate qualifying or exploratory thoughts ("however" statements)</li>
        <li style={{ marginBottom: '10px' }}>Customize the appearance of your argument map</li>
        <li style={{ marginBottom: '10px' }}>Export your work in multiple formats for sharing or future editing</li>
      </ul>
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>
        <p style={{ marginBottom: '10px' }}>
          To learn more about argument mapping and critical thinking, visit our website:
        </p>
        <a 
          href={COMPANY_INFO.WEBSITE} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#1a73e8', 
            fontWeight: '500', 
            textDecoration: 'none'
          }}
        >
          {COMPANY_INFO.WEBSITE.replace('https://', '')}
        </a>
      </div>
    </div>
  );
};

export default AboutPage;