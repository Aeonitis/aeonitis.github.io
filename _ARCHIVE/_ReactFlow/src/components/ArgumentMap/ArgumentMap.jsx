import React, { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  MarkerType,
  Panel,
  ConnectionLineType,
  ConnectionMode,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AppContext } from '../../context/AppContext';
import CustomNode from './CustomNode';
import { exportToImage, exportToTrie, importFromTrie } from '../../utils/exportUtils';

// Main ArgumentMap component
const ArgumentMap = ({ initialResolution }) => {
  const { 
    saveWipState, 
    loadWipState, 
    nodeStyles, 
    setCurrentMap,
    deleteNode,
    updateNodeText
  } = useContext(AppContext);
  
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeTypeSelector, setNodeTypeSelector] = useState(null);
  const [connectionState, setConnectionState] = useState(null);
  const { project } = useReactFlow();
  
  // Initialize the resolution node when component mounts or resolution changes
  useEffect(() => {
    if (initialResolution && !nodes.length) {
      setTimeout(() => {
        const initialNodes = [
          {
            id: '1',
            type: 'custom',
            position: { x: 350, y: 50 },
            data: { 
              label: initialResolution,
              type: 'resolution',
            },
          },
        ];
        setNodes(initialNodes);
      }, 100);
    }
  }, [initialResolution, setNodes, nodes.length]);

  // Save current map state to context when it changes
  useEffect(() => {
    if (nodes.length > 0) {
      setCurrentMap({ nodes, edges });
      saveWipState({ nodes, edges });
    }
  }, [nodes, edges, setCurrentMap, saveWipState]);

  // Try to load saved WIP state when component mounts
  useEffect(() => {
    const savedState = loadWipState();
    if (savedState && savedState.nodes && savedState.nodes.length > 0) {
      setNodes(savedState.nodes);
      setEdges(savedState.edges || []);
    }
  }, [loadWipState, setNodes, setEdges]);

  // Implement the addChildNode function for direct node creation from stance buttons
  useEffect(() => {
    if (reactFlowInstance) {
      // Implementation of the addChildNode function
      window.addChildNodeImpl = (parentId, nodeType) => {
        // Find the parent node
        const parentNode = nodes.find(node => node.id === parentId);
        if (!parentNode) return;
        
        // Generate a new node ID
        const newNodeId = (nodes.length + 1).toString();
        
        // Calculate position below parent node - much closer now
        const newPosition = {
          x: parentNode.position.x,
          y: parentNode.position.y + 60, // Position much closer to parent node
        };
        
        // Create new node
        const newNode = {
          id: newNodeId,
          type: 'custom',
          position: newPosition,
          data: {
            label: `Enter your ${nodeType} statement`,
            type: nodeType,
          },
        };
        
        // Create connection (edge) from parent to new node
        const nodeTypeColor = nodeStyles[nodeType]?.background || '#cccccc';
        const newEdge = {
          id: `e${parentId}-${newNodeId}`,
          source: parentId,
          target: newNodeId,
          type: 'default', 
          data: { type: nodeType },
          style: { stroke: nodeTypeColor, strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: nodeTypeColor
          },
        };
        
        // Add new node and edge
        setNodes(nds => [...nds, newNode]);
        setEdges(eds => [...eds, newEdge]);
        
        // Center view on the new node
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.2 });
        }, 50);
      };
    }
    
    return () => {
      // Cleanup
      window.addChildNodeImpl = undefined;
    };
  }, [reactFlowInstance, nodes, setNodes, setEdges, nodeStyles]);

  // Start connection
  const onConnectStart = useCallback((_, { nodeId }) => {
    setConnectionState({ sourceId: nodeId });
  }, []);

  // Handle connection end
  const onConnectEnd = useCallback((event) => {
    if (!connectionState || !connectionState.sourceId) return;
    
    // The position where the connection ends
    const targetPosition = project({
      x: event.clientX,
      y: event.clientY,
    });
    
    // Generate a new ID for the node
    const newNodeId = (nodes.length + 1).toString();
    
    // Create a new node at the position
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: targetPosition,
      data: { 
        label: `Enter your statement`,
        type: 'because', // Default, will be updated when user selects
      },
    };
    
    // Add the new node
    setNodes(nds => [...nds, newNode]);
    
    // In onConnectEnd:
  setNodeTypeSelector({
    top: event.clientY,
    left: event.clientX,
    sourceId: connectionState.sourceId,
    targetId: newNodeId,
    selectedType: null,
    statement: ''
  });
    
    // Reset the connection state
    setConnectionState(null);
  }, [connectionState, project, nodes.length, setNodes]);

  // Create a new connection with the selected node type
  const createConnection = useCallback((sourceId, targetId, nodeType, statement) => {
    // Get color for this node type
    const nodeTypeColor = nodeStyles[nodeType]?.background || '#cccccc';
    
    // Add edge with appropriate styling
    const newEdge = {
      id: `e${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: 'default',
      data: { type: nodeType },
      animated: false,
      style: { stroke: nodeTypeColor, strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: nodeTypeColor
      },
    };
    
    // Update the target node type and statement
    setNodes(nds => nds.map(node => {
      if (node.id === targetId) {
        return {
          ...node,
          data: {
            ...node.data,
            type: nodeType,
            label: statement || `Enter your ${nodeType} statement`
          }
        };
      }
      return node;
    }));
    
    setEdges(eds => [...eds, newEdge]);
    
    // Close the selector
    setNodeTypeSelector(null);
  }, [nodeStyles, setNodes, setEdges]);

  // Export the argument map as an image
  const handleExportImage = useCallback(() => {
    if (reactFlowInstance && reactFlowWrapper.current) {
      exportToImage(reactFlowWrapper.current, 'argument-map.png');
    }
  }, [reactFlowInstance]);

  // Export the argument map as a .trie file
  const handleExportTrie = useCallback(() => {
    if (nodes.length > 0) {
      exportToTrie({ nodes, edges, styles: nodeStyles }, 'argument-map.trie');
    }
  }, [nodes, edges, nodeStyles]);

  // Import from a .trie file
  const handleImportTrie = useCallback(async (event) => {
    try {
      const file = event.target.files[0];
      const importedData = await importFromTrie(file);
      
      if (importedData && importedData.nodes && importedData.edges) {
        setNodes(importedData.nodes);
        setEdges(importedData.edges);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Failed to import the file. Please ensure it is a valid .trie file.');
    }
  }, [setNodes, setEdges]);

  // Update node positions after drag
  const onNodeDragStop = useCallback((_, node) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
    );
  }, [setNodes]);

  const handleInit = (instance) => {
    setReactFlowInstance(instance);
    
    // Force a layout refresh on init
    setTimeout(() => {
      instance.fitView({ padding: 0.2 });
      instance.zoomTo(1.0); // Set a fixed zoom level
      
      // Center the viewport
      if (nodes.length > 0) {
        const node = nodes[0];
        instance.setCenter(node.position.x, node.position.y);
      }
    }, 200);
  };

  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #eee' }}>
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onInit={handleInit}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={{ custom: CustomNode }}
          connectionMode={ConnectionMode.Loose}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Controls position="bottom-right" />
          <Background color="#f8f8f8" gap={16} size={1} variant="dots" />
          
          <Panel position="top-left" style={{ margin: '10px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '5px',
              borderRadius: '4px'
            }}>
              <button 
                onClick={handleExportImage}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >Export as PNG</button>
              <button 
                onClick={handleExportTrie}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >Export as .trie</button>
              <label className="import-button" style={{ 
                padding: '5px 10px', 
                fontSize: '12px',
                backgroundColor: '#f0f0f0', 
                borderRadius: '4px', 
                cursor: 'pointer',
                border: '1px solid #ccc',
                margin: 0
              }}>
                Import .trie
                <input 
                  type="file" 
                  accept=".trie" 
                  onChange={handleImportTrie} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
          </Panel>
          
          {/* Node Type Selector Popup */}
          {nodeTypeSelector && (
            <div style={{
              position: 'absolute',
              top: nodeTypeSelector.top,
              left: nodeTypeSelector.left,
              background: 'white',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Select Node Type:</div>
              <button 
                onClick={() => createConnection(nodeTypeSelector.sourceId, nodeTypeSelector.targetId, 'because')}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  background: '#e6f6e6',
                  border: '1px solid #2e7d32',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '16px' }}>👍</span> Support (Because)
              </button>
              <button 
                onClick={() => createConnection(nodeTypeSelector.sourceId, nodeTypeSelector.targetId, 'but')}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  background: '#f6e6e6',
                  border: '1px solid #c62828',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '16px' }}>👎</span> Oppose (But)
              </button>
              <button 
                onClick={() => createConnection(nodeTypeSelector.sourceId, nodeTypeSelector.targetId, 'however')}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  background: '#e6e6f6',
                  border: '1px solid #1565c0',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '16px' }}>✋</span> Explore (However)
              </button>
              <button 
                onClick={() => setNodeTypeSelector(null)}
                style={{ 
                  padding: '5px 10px',
                  background: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '5px'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

// Make the showAddChildNodeDialog function available globally for CustomNode components
window.showAddChildNodeDialog = (parentId, nodeType) => {
  // This will be defined when the component mounts
  if (window.showAddChildNodeDialogImpl) {
    window.showAddChildNodeDialogImpl(parentId, nodeType);
  }
};

export default ArgumentMap;