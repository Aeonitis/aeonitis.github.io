import React, { useState, useContext } from 'react';
import { CirclePicker } from 'react-color';
import { AppContext } from '../../context/AppContext';

// Gear icon SVG for the toggle button
const GearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// Node types with default labels and descriptions
const nodeTypes = [
  {
    id: 'resolution',
    label: 'Resolution',
    description: 'The main claim or statement of your argument',
    defaultColor: '#f0e6f6'
  },
  {
    id: 'because',
    label: 'Because',
    description: 'Supporting reasons that strengthen your claim',
    defaultColor: '#e6f6e6'
  },
  {
    id: 'but',
    label: 'But',
    description: 'Opposing arguments or counterpoints',
    defaultColor: '#f6e6e6'
  },
  {
    id: 'however',
    label: 'However',
    description: 'Qualifying statements or explorations',
    defaultColor: '#e6e6f6'
  }
];

// Predefined color options that work well together
const colorOptions = [
  '#f0e6f6', '#e6f6e6', '#f6e6e6', '#e6e6f6', // Pastel colors
  '#ffcccc', '#ccffcc', '#ccccff', '#ffffcc', // Light colors
  '#d1c4e9', '#c5e1a5', '#ffcc80', '#b3e0ff', // Medium intensity
  '#9575cd', '#7cb342', '#ffa726', '#29b6f6', // Stronger colors
];

const NodeCustomization = ({ collapsible = false }) => {
  const { nodeStyles, updateNodeStyle } = useContext(AppContext);
  const [selectedNodeType, setSelectedNodeType] = useState(nodeTypes[0].id);
  const [isExpanded, setIsExpanded] = useState(!collapsible); // If collapsible, start collapsed

  // Handle color change from the color picker
  const handleColorChange = (color) => {
    updateNodeStyle(selectedNodeType, color.hex);
  };

  // Get the current color for the selected node type
  const getCurrentColor = () => {
    return nodeStyles[selectedNodeType] || 
      nodeTypes.find(type => type.id === selectedNodeType)?.defaultColor ||
      '#ffffff';
  };

  // Reset to default color
  const handleResetColor = () => {
    const defaultColor = nodeTypes.find(type => type.id === selectedNodeType)?.defaultColor;
    if (defaultColor) {
      updateNodeStyle(selectedNodeType, defaultColor);
    }
  };

  // Toggle panel expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="node-customization" style={{ 
      padding: collapsible && !isExpanded ? '10px' : '15px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Customize Node Colors</h3>
      
      <div className="node-type-tabs" style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '15px'
      }}>
        {nodeTypes.map(type => (
          <button 
            key={type.id}
            onClick={() => setSelectedNodeType(type.id)}
            style={{
              padding: '8px 12px',
              background: selectedNodeType === type.id ? '#f0f0f0' : 'transparent',
              border: 'none',
              borderBottom: selectedNodeType === type.id ? '2px solid #1a73e8' : 'none',
              cursor: 'pointer',
              fontWeight: selectedNodeType === type.id ? 'bold' : 'normal',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {type.label}
          </button>
        ))}
      </div>
      
      <div className="node-type-description" style={{ marginBottom: '15px' }}>
        <p style={{ margin: 0, color: '#666' }}>
          {nodeTypes.find(type => type.id === selectedNodeType)?.description}
        </p>
      </div>
      
      <div className="color-preview" style={{ 
        width: '100%',
        height: '50px',
        backgroundColor: getCurrentColor(),
        borderRadius: '4px',
        marginBottom: '15px',
        border: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        {getCurrentColor()}
      </div>
      
      <div className="color-picker-container" style={{ marginBottom: '15px' }}>
        <CirclePicker 
          colors={colorOptions}
          color={getCurrentColor()}
          onChange={handleColorChange}
          width="100%"
          circleSize={24}
          circleSpacing={12}
        />
      </div>
      
      <button 
        onClick={handleResetColor}
        style={{
          padding: '8px 12px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset to Default
      </button>
    </div>
  );
};

export default NodeCustomization;