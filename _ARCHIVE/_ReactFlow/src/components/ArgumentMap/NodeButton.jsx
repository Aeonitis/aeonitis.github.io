import React from 'react';

// Button styles based on node type
const buttonStyles = {
  because: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    color: '#2e7d32',
    border: '1px solid #2e7d32'
  },
  but: {
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
    color: '#c62828',
    border: '1px solid #c62828'
  },
  however: {
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    color: '#1565c0',
    border: '1px solid #1565c0'
  }
};

const NodeButton = ({ nodeId, type, label }) => {
  const handleClick = () => {
    // This function is defined in ArgumentMap and exposed via window
    if (typeof window.addNodeToArgumentMap === 'function') {
      window.addNodeToArgumentMap(nodeId, type);
    }
  };

  // Get the style for this button type
  const style = buttonStyles[type] || {
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd'
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '13px',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s ease',
        fontWeight: 'medium',
        ...style
      }}
      title={`Add a ${label} statement`}
    >
      {label}
    </button>
  );
};

export default NodeButton;