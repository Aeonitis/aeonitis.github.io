import React, { useState, useRef, useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { AppContext } from '../../context/AppContext';
import { validateStatement } from '../../utils/validationUtils';
import ColorPickerPopup from './ColorPickerPopup';

// Define node types and their default colors
const NODE_TYPES = {
  resolution: { label: 'Resolution', color: '#f0e6f6' },
  because: { label: 'Because', color: '#e6f6e6' },
  but: { label: 'But', color: '#f6e6e6' },
  however: { label: 'However', color: '#e6e6f6' }
};

const CustomNode = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeText, setNodeText] = useState(data.label);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorTarget, setColorTarget] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);
  const nodeRef = useRef(null);
  
  const { updateNodeText, nodeStyles, updateNodeStyle, deleteNode } = useContext(AppContext);

  // Get the appropriate color based on node type and custom styles
  const nodeColor = nodeStyles[data.type]?.background || NODE_TYPES[data.type]?.color || '#f0f0f0';
  const textColor = nodeStyles[data.type]?.text || '#000000';

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleInputBlur = () => {
    if (validateStatement(nodeText)) {
      updateNodeText(id, nodeText);
      setIsEditing(false);
    } else {
      alert('Please enter a valid statement (a complete sentence with at least 3 words).');
      setNodeText(data.label);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handleOpenColorPicker = (target) => {
    setColorTarget(target);
    setShowColorPicker(true);
  };

  const handleColorChange = (color) => {
    if (colorTarget === 'background') {
      updateNodeStyle(data.type, { background: color, text: textColor });
    } else if (colorTarget === 'text') {
      updateNodeStyle(data.type, { background: nodeColor, text: color });
    }
  };

  const handleDeleteNode = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      deleteNode(id);
    }
  };

  // Handler for adding a child node with the specified type - using the proper popup dialog
  const handleAddChildNode = (nodeType) => {
    // Use the global window function to show the proper dialogue
    if (typeof window.showAddChildNodeDialog === 'function') {
      window.showAddChildNodeDialog(id, nodeType);
      setShowAddChild(false);
    }
  };

  // Get emoji for the node type
  const getNodeEmoji = (type) => {
    switch (type) {
      case 'because': return '👍';
      case 'but': return '👎';
      case 'however': return '✋';
      default: return '';
    }
  };

  // Only show target handle if not a resolution node
  const showTargetHandle = data.type !== 'resolution';

  return (
    <div 
      ref={nodeRef}
      className="node-wrapper"
      style={{ 
        background: nodeColor,
        borderRadius: '8px',
        padding: '16px', 
        paddingRight: '36px',
        minWidth: '200px',
        maxWidth: '350px',
        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.15)',
        border: `2px solid ${data.selected ? '#1a73e8' : 'transparent'}`,
        position: 'relative',
        wordBreak: 'break-word',
        color: textColor
      }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Handles for connections */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: nodeColor, border: '1px solid #555' }}
        />
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: nodeColor, border: '1px solid #555' }}
      />
      
      {/* Control buttons - visible only on hover */}
      {!isEditing && isHovered && (
        <div className="node-control-buttons" style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          display: 'flex',
          gap: '5px',
          transition: 'opacity 0.2s ease',
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? 'auto' : 'none'
        }}>
          {/* Style button */}
          <button
            onClick={() => handleOpenColorPicker('background')}
            style={{
              width: '24px',
              height: '24px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}
            title="Change node style"
          >
            🎨
          </button>

          {/* Add child node button */}
          <button
            onClick={() => setShowAddChild(true)}
            style={{
              width: '24px',
              height: '24px',
              background: '#1a73e8',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
            title="Add child node"
          >
            +
          </button>
          
          {/* Delete node button */}
          <button
            onClick={handleDeleteNode}
            style={{
              width: '24px',
              height: '24px',
              background: 'rgba(255,80,80,0.8)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
            title="Delete node"
          >
            ×
          </button>
        </div>
      )}

      {/* Node Type Label (small, top-left) */}
      {data.type !== 'resolution' && (
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '8px',
          fontSize: '11px',
          fontWeight: 'bold',
          opacity: 0.7,
          display: 'flex',
          alignItems: 'center',
          gap: '3px'
        }}>
          <span>{data.type}</span>
        </div>
      )}

      {/* Color picker popup */}
      {showColorPicker && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}>
          <ColorPickerPopup
            initialColor={colorTarget === 'background' ? nodeColor : textColor}
            onColorChange={handleColorChange}
            onClose={() => setShowColorPicker(false)}
            title={colorTarget === 'background' ? 'Background Color' : 'Text Color'}
          />
        </div>
      )}

      {/* Add Child Node Popup - Positioned at the center of the screen */}
      {showAddChild && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          width: '280px'
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '12px', 
            textAlign: 'center',
            fontSize: '16px',
            borderBottom: '1px solid #eee',
            paddingBottom: '8px'
          }}>
            Add Child Node
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
            <button 
              onClick={() => handleAddChildNode('because')}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: '#e6f6e6',
                border: '1px solid #2e7d32',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '22px' }}>👍</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>Support</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Add a supporting argument</div>
              </div>
            </button>
            
            <button 
              onClick={() => handleAddChildNode('but')}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: '#f6e6e6',
                border: '1px solid #c62828',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '22px' }}>👎</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>Oppose</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Add a counterargument</div>
              </div>
            </button>
            
            <button 
              onClick={() => handleAddChildNode('however')}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: '#e6e6f6',
                border: '1px solid #1565c0',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '22px' }}>✋</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>Explore</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Add a qualifying statement</div>
              </div>
            </button>
          </div>
          
          <button 
            onClick={() => setShowAddChild(false)}
            style={{ 
              padding: '8px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Main Content */}
      {data.type === 'resolution' && (
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '5px', 
          fontSize: '14px',
          textAlign: 'center',
        }}>
          Resolution
        </div>
      )}
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={nodeText}
          onChange={(e) => setNodeText(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          style={{ 
            width: '100%', 
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '0px',
            fontSize: '14px',
            color: '#000'
          }}
          autoFocus
        />
      ) : (
        <div className="node-content" style={{ 
          marginTop: data.type !== 'resolution' ? '22px' : '0px',
          fontSize: '14px', 
          lineHeight: '1.5',
          textAlign: 'center',
          padding: '0 5px'
        }}>
          {data.label}
        </div>
      )}
    </div>
  );
};

export default CustomNode;