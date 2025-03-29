import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

/**
 * Export the argument map as a PNG image
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} fileName - The file name for the exported image
 */
export const exportToImage = async (element, fileName) => {
  try {
    // Temporarily adjust styles for better export quality
    const nodes = element.querySelectorAll('.react-flow__node');
    const edges = element.querySelectorAll('.react-flow__edge');
    const originalNodeStyles = [];
    const originalEdgeStyles = [];

    // Enhance node appearance for export
    nodes.forEach(node => {
      originalNodeStyles.push({
        element: node,
        boxShadow: node.style.boxShadow,
        border: node.style.border
      });
      
      // Enhance shadows and borders for the export
      node.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      node.style.border = '2px solid #e0e0e0';
    });

    // Enhance edge appearance for export
    edges.forEach(edge => {
      originalEdgeStyles.push({
        element: edge,
        strokeWidth: edge.style.strokeWidth
      });
      
      // Make edges more visible
      const paths = edge.querySelectorAll('path');
      paths.forEach(path => {
        path.setAttribute('stroke-width', '2');
      });
    });

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      backgroundColor: '#f8f8f8',
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true
    });

    // Add logo watermark
    const ctx = canvas.getContext('2d');
    const logo = new Image();
    
    // Wait for logo to load
    await new Promise((resolve, reject) => {
      logo.onload = resolve;
      logo.onerror = reject;
      logo.src = '/logo.png'; // Path to your logo in public folder
    }).catch(err => {
      console.error('Failed to load logo for watermark:', err);
      // Continue without watermark if logo fails to load
    });

    // If logo loaded successfully, draw it
    if (logo.complete && logo.naturalHeight !== 0) {
      // Position in bottom right with padding
      const padding = 20;
      const maxSize = 100; // Max size for the logo
      const logoWidth = Math.min(logo.width, maxSize);
      const logoHeight = Math.min(logo.height, maxSize);
      const ratio = Math.min(logoWidth / logo.width, logoHeight / logo.height);
      const scaledWidth = logo.width * ratio;
      const scaledHeight = logo.height * ratio;
      
      // Draw logo in bottom right corner
      ctx.globalAlpha = 0.6; // Make logo semi-transparent
      ctx.drawImage(
        logo,
        canvas.width - scaledWidth - padding,
        canvas.height - scaledHeight - padding,
        scaledWidth,
        scaledHeight
      );
      ctx.globalAlpha = 1.0;

      // Add version number near the logo
      ctx.font = '12px Roboto, Arial, sans-serif';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      const version = 'v0.0.10'; // TODO: Get this from config.js
      const versionWidth = ctx.measureText(version).width;
      ctx.fillText(
        version,
        canvas.width - versionWidth - padding,
        canvas.height - padding + 5
      );
    }

    // Convert to blob and save
    canvas.toBlob(blob => {
      saveAs(blob, fileName);
    });

    // Restore original styles
    originalNodeStyles.forEach(({ element, boxShadow, border }) => {
      element.style.boxShadow = boxShadow;
      element.style.border = border;
    });

    originalEdgeStyles.forEach(({ element, strokeWidth }) => {
      const paths = element.querySelectorAll('path');
      paths.forEach(path => {
        path.setAttribute('stroke-width', strokeWidth || '1');
      });
    });
  } catch (error) {
    console.error('Error exporting image:', error);
    alert('Failed to export image. Please try again.');
  }
};

/**
 * Export the argument map as a .trie file (JSON format)
 * @param {Object} mapData - The map data to export
 * @param {string} fileName - The file name for the exported file
 */
export const exportToTrie = (mapData, fileName) => {
  try {
    // Create a new object with only the necessary data
    const exportData = {
      version: '0.0.10',
      timestamp: new Date().toISOString(),
      nodes: mapData.nodes.map(node => ({
        id: node.id,
        position: node.position,
        data: {
          label: node.data.label,
          type: node.data.type
        }
      })),
      edges: mapData.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target
      })),
      styles: mapData.styles || {}
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create blob and save
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error exporting .trie file:', error);
    alert('Failed to export file. Please try again.');
  }
};

/**
 * Import an argument map from a .trie file
 * @param {File} file - The .trie file to import
 * @returns {Promise<Object>} The imported map data
 */
export const importFromTrie = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importData = JSON.parse(event.target.result);
        
        // Validate the format
        if (!importData.nodes || !importData.edges) {
          throw new Error('Invalid .trie file format');
        }
        
        // Process nodes to ensure they have the correct structure
        const nodes = importData.nodes.map(node => ({
          id: node.id,
          type: 'default', // Ensure we're using the custom node type
          position: node.position,
          data: {
            label: node.data.label,
            type: node.data.type
          }
        }));
        
        // Process edges
        const edges = importData.edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'default',
          markerEnd: {
            type: 'arrowclosed'
          }
        }));
        
        // If styles are included, we could apply them here
        if (importData.styles) {
          // This would be handled by the AppContext
          localStorage.setItem('arg-map-node-styles', JSON.stringify(importData.styles));
        }
        
        resolve({ nodes, edges, styles: importData.styles });
      } catch (error) {
        console.error('Error parsing .trie file:', error);
        reject(new Error('Failed to parse file. Make sure it is a valid .trie file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading the file.'));
    };
    
    reader.readAsText(file);
  });
};