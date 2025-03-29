import React, { useState, useEffect, useRef } from 'react';

const ColorPickerPopup = ({ initialColor, onColorChange, onClose, title }) => {
  const [color, setColor] = useState(initialColor || '#ffffff');
  const [r, setR] = useState(255);
  const [g, setG] = useState(255);
  const [b, setB] = useState(255);
  const pickerRef = useRef(null);
  
  // Parse RGB values from initial color on mount
  useEffect(() => {
    if (initialColor) {
      if (initialColor.startsWith('#')) {
        const hex = initialColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        setR(r);
        setG(g);
        setB(b);
      }
    }
  }, [initialColor]);

  // Convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Update RGB and color when RGB inputs change
  const handleRGBChange = (value, setter, component) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      setter(numValue);
      let newColor;
      if (component === 'r') {
        newColor = rgbToHex(numValue, g, b);
      } else if (component === 'g') {
        newColor = rgbToHex(r, numValue, b);
      } else {
        newColor = rgbToHex(r, g, numValue);
      }
      setColor(newColor);
    }
  };

  // Handle clicks outside the color picker to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Apply color and close
  const handleApply = () => {
    onColorChange(color);
    onClose();
  };

  // Handle gradient click
  const handleGradientClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate color from position
    const xRatio = Math.max(0, Math.min(1, x / rect.width));
    const yRatio = Math.max(0, Math.min(1, y / rect.height));
    
    // Convert position to RGB
    const r = Math.round(255 * (1 - xRatio));
    const b = Math.round(255 * xRatio);
    const g = Math.round(255 * (1 - yRatio));
    
    setR(r);
    setG(g);
    setB(b);
    setColor(rgbToHex(r, g, b));
  };

  return (
    <div 
      ref={pickerRef}
      className="color-picker-popup"
      style={{
        background: '#333',
        borderRadius: '8px',
        padding: '15px',
        width: '250px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        color: 'white',
        userSelect: 'none'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <span>{title || 'Color Picker'}</span>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >×</button>
      </div>
      
      <div 
        className="color-preview"
        style={{
          width: '100%',
          height: '40px',
          background: color,
          borderRadius: '4px',
          marginBottom: '10px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      ></div>
      
      <div 
        className="color-gradient"
        style={{
          width: '100%',
          height: '150px',
          background: 'linear-gradient(to right, red, blue), linear-gradient(to bottom, transparent, black)',
          backgroundBlendMode: 'lighten',
          borderRadius: '4px',
          marginBottom: '10px',
          cursor: 'crosshair',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
        onClick={handleGradientClick}
      ></div>
      
      <div className="rgb-inputs" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <input 
            type="text" 
            value={r}
            onChange={(e) => handleRGBChange(e.target.value, setR, 'r')}
            style={{
              width: '100%',
              padding: '5px',
              background: '#555',
              border: 'none',
              borderRadius: '4px',
              textAlign: 'center',
              color: 'white',
              marginBottom: '5px'
            }}
          />
          <div>R</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <input 
            type="text" 
            value={g}
            onChange={(e) => handleRGBChange(e.target.value, setG, 'g')}
            style={{
              width: '100%',
              padding: '5px',
              background: '#555',
              border: 'none',
              borderRadius: '4px',
              textAlign: 'center',
              color: 'white',
              marginBottom: '5px'
            }}
          />
          <div>G</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <input 
            type="text" 
            value={b}
            onChange={(e) => handleRGBChange(e.target.value, setB, 'b')}
            style={{
              width: '100%',
              padding: '5px',
              background: '#555',
              border: 'none',
              borderRadius: '4px',
              textAlign: 'center',
              color: 'white',
              marginBottom: '5px'
            }}
          />
          <div>B</div>
        </div>
      </div>
      
      <button
        onClick={handleApply}
        style={{
          width: '100%',
          padding: '8px',
          background: '#1a73e8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Apply
      </button>
    </div>
  );
};

export default ColorPickerPopup;