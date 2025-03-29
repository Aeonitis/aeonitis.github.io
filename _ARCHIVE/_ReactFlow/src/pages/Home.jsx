import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import ArgumentMap from '../components/ArgumentMap/ArgumentMap';
import { validateResolution, getRandomSampleResolution } from '../utils/validationUtils';

const Home = () => {
  const { resolution, setResolution } = useContext(AppContext);
  const [resolutionInput, setResolutionInput] = useState('');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef(null);

  // Effect for cycling sample resolutions in the placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => prev + 1);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Get a new sample resolution for the placeholder
  const getPlaceholder = () => {
    return `Try: "${getRandomSampleResolution()}"`;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate the resolution
    const result = validateResolution(resolutionInput);
    
    if (result.valid) {
      // Set the resolution and show the map
      setResolution(resolutionInput);
      setIsMapVisible(true);
      setValidationError('');
      setSuggestion(result.suggestion || '');
    } else {
      // Show validation error
      setValidationError(result.message);
      setSuggestion('');
      // Focus the input for correction
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="home-container">
      {!isMapVisible ? (
        <div className="resolution-input-container" style={{
          maxWidth: '600px',
          margin: '100px auto',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: '20px', color: '#333' }}>
            Create Your Argument Map
          </h1>
          
          <p style={{ marginBottom: '30px', color: '#666' }}>
            Start by entering a clear, concise resolution statement. This will be the foundation of your argument map.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input
                ref={inputRef}
                type="text"
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder={getPlaceholder()}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  fontSize: '16px',
                  border: `1px solid ${validationError ? '#e57373' : '#ccc'}`,
                  borderRadius: '4px',
                  outline: 'none'
                }}
              />
              
              {validationError && (
                <div style={{ 
                  color: '#e57373', 
                  textAlign: 'left', 
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {validationError}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              style={{
                backgroundColor: '#1a73e8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Create Argument Map
            </button>
          </form>
        </div>
      ) : (
        <div className="argument-map-page" style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>{resolution}</h2>
          
          {suggestion && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '10px', 
              backgroundColor: '#e8f4fd', 
              borderRadius: '4px',
              color: '#0277bd',
              fontSize: '14px'
            }}>
              Tip: {suggestion}
            </div>
          )}
          
          <div className="argument-map-container" style={{ width: '100%' }}>
            <ArgumentMap initialResolution={resolution} />
          </div>
          
          <button
            onClick={() => {
              setIsMapVisible(false);
              setResolutionInput('');
            }}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create New Argument Map
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;