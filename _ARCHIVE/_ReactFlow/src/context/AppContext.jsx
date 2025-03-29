import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Create a context
export const AppContext = createContext();

// Default node styles
const DEFAULT_NODE_STYLES = {
  resolution: { background: '#f0e6f6', text: '#000000' },
  because: { background: '#e6f6e6', text: '#000000' },
  but: { background: '#f6e6e6', text: '#000000' },
  however: { background: '#e6e6f6', text: '#000000' }
};

// AppContextProvider component
export const AppContextProvider = ({ children }) => {
  // State for node styles
  const [nodeStyles, setNodeStyles] = useLocalStorage('arg-map-node-styles', DEFAULT_NODE_STYLES);
  
  // State for current map
  const [currentMap, setCurrentMap] = useState({ nodes: [], edges: [] });
  
  // State for managing the initial resolution
  const [resolution, setResolution] = useState('');
  
  // State for prompting user about WIP on return
  const [showWipPrompt, setShowWipPrompt] = useState(false);
  
  // Check if there's a WIP state to restore on component mount
  useEffect(() => {
    const savedWip = localStorage.getItem('arg-map-wip');
    if (savedWip) {
      try {
        const wipData = JSON.parse(savedWip);
        if (wipData && wipData.nodes && wipData.nodes.length > 0) {
          setShowWipPrompt(true);
        }
      } catch (error) {
        console.error('Error parsing saved WIP state:', error);
      }
    }
  }, []);

  // Update node text
  const updateNodeText = useCallback((nodeId, newText) => {
    setCurrentMap(prevMap => {
      const updatedNodes = prevMap.nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, label: newText } } 
          : node
      );
      return { ...prevMap, nodes: updatedNodes };
    });
  }, []);

  // Update node style for a specific type
  const updateNodeStyle = useCallback((nodeType, colors) => {
    setNodeStyles(prevStyles => ({
      ...prevStyles,
      [nodeType]: colors
    }));
  }, [setNodeStyles]);

  // Delete a node
  const deleteNode = useCallback((nodeId) => {
    setCurrentMap(prevMap => {
      // Find all child nodes that connect to this node
      const childEdges = prevMap.edges.filter(edge => edge.source === nodeId);
      const childNodeIds = childEdges.map(edge => edge.target);
      
      // Recursively collect all descendants
      const getAllDescendants = (nodeIds) => {
        let descendants = [...nodeIds];
        
        nodeIds.forEach(id => {
          const childEdges = prevMap.edges.filter(edge => edge.source === id);
          const childIds = childEdges.map(edge => edge.target);
          
          if (childIds.length > 0) {
            descendants = [...descendants, ...getAllDescendants(childIds)];
          }
        });
        
        return descendants;
      };
      
      const descendantIds = getAllDescendants(childNodeIds);
      const nodesToRemove = [nodeId, ...descendantIds];
      
      // Filter out the node and all its descendants
      const updatedNodes = prevMap.nodes.filter(node => !nodesToRemove.includes(node.id));
      
      // Filter out any edges that involve the removed nodes
      const updatedEdges = prevMap.edges.filter(
        edge => !nodesToRemove.includes(edge.source) && !nodesToRemove.includes(edge.target)
      );
      
      return {
        nodes: updatedNodes,
        edges: updatedEdges
      };
    });
  }, []);

  // Save current WIP state to localStorage
  const saveWipState = useCallback((mapState) => {
    if (mapState && mapState.nodes && mapState.nodes.length > 0) {
      localStorage.setItem('arg-map-wip', JSON.stringify(mapState));
    }
  }, []);

  // Load WIP state from localStorage
  const loadWipState = useCallback(() => {
    const savedWip = localStorage.getItem('arg-map-wip');
    if (savedWip) {
      try {
        return JSON.parse(savedWip);
      } catch (error) {
        console.error('Error parsing saved WIP state:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Clear WIP state from localStorage
  const clearWipState = useCallback(() => {
    localStorage.removeItem('arg-map-wip');
    setShowWipPrompt(false);
  }, []);

  // Handle continuing with WIP or starting fresh
  const handleContinueWip = useCallback(() => {
    setShowWipPrompt(false);
    // The actual loading will happen in the ArgumentMap component
  }, []);

  const handleStartFresh = useCallback(() => {
    clearWipState();
    setCurrentMap({ nodes: [], edges: [] });
  }, [clearWipState]);

  // Context value
  const contextValue = {
    // Node styles
    nodeStyles,
    updateNodeStyle,
    resetNodeStyles: () => setNodeStyles(DEFAULT_NODE_STYLES),
    
    // Current map
    currentMap,
    setCurrentMap,
    updateNodeText,
    deleteNode,
    
    // Resolution
    resolution,
    setResolution,
    
    // WIP state management
    saveWipState,
    loadWipState,
    clearWipState,
    showWipPrompt,
    handleContinueWip,
    handleStartFresh
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// WIP Prompt Component
export const WipPrompt = () => {
  const { showWipPrompt, handleContinueWip, handleStartFresh } = useContext(AppContext);

  if (!showWipPrompt) return null;

  return (
    <div className="wip-prompt" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h3>Continue Previous Work?</h3>
        <p>We found a previously saved argument map. Would you like to continue working on it?</p>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          <button 
            onClick={handleContinueWip}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Continue
          </button>
          <button 
            onClick={handleStartFresh}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
};