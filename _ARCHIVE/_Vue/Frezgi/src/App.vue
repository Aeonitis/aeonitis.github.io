<template>
  <div id="app">
    <!-- Color Settings Panel (Auto-hiding on left side) -->
    <div class="color-settings-panel" :class="{ 'hidden': !showColorPanel }">
      <!-- Logo at top -->
      <div class="panel-logo">
        <img src="https://i.imgur.com/sFfSldJ.png" alt="Frezgi Logo" class="company-logo">
      </div>
      
      <div class="color-picker-container">
        <!-- Canvas Background Color -->
        <div class="color-picker-item">
          <label for="canvas-color">Canvas:</label>
          <input
            id="canvas-color"
            type="color"
            v-model="canvasColor"
            class="color-input"
          />
        </div>
        
        <!-- Compact Node Colors (Background + Text) -->
        <div class="color-picker-section">
          <h4>Node/Text Colors</h4>
          <div v-for="(_, type) in nodeColors" :key="`node-${type}`" class="color-picker-row">
            <span class="node-type-label">{{ getNodeTypeLabel(type) }}:</span>
            <div class="color-inputs">
              <input
                :id="`bg-${type}`"
                type="color"
                v-model="nodeColors[type]"
                @change="updateEdgeColors()"
                class="color-input"
                :title="getNodeTypeLabel(type) + ' background'"
              />
              <input
                :id="`text-${type}`"
                type="color"
                v-model="textColors[type]"
                class="color-input"
                :title="getNodeTypeLabel(type) + ' text'"
              />
            </div>
          </div>
          <!-- Reset button moved up here -->
          <button @click="resetColorScheme" class="color-panel-btn reset-btn">Reset Colors</button>
        </div>
      </div>
      
      <!-- Version at bottom -->
      <div class="version-info">v0.0.10</div>
    </div>
    
    <!-- Toggle Button for Color Panel -->
    <button @click="toggleColorPanel" class="toggle-panel-btn" :class="{ 'panel-open': showColorPanel }">
      {{ showColorPanel ? '◀' : '▶' }}
    </button>

    <div ref="canvas" class="canvas" :style="{ backgroundColor: canvasColor }">
      <!-- SVG Lines -->
      <svg class="lines">
        <path
          v-for="(edge, index) in edges"
          :key="`edge-${index}-${refreshTrigger}`"
          :d="calculatePath(edge.source, edge.target)"
          :stroke="edge.color"
          fill="transparent"
          stroke-width="2"
        />
      </svg>

      <!-- Main Resolution Node -->
      <div
        class="node resolution-node"
        :style="{ 
          top: resolutionNode.position.y + 'px', 
          left: resolutionNode.position.x + 'px',
          backgroundColor: nodeColors.resolution,
          color: textColors.resolution
        }"
        @mousedown="startDrag($event, resolutionNode)"
        @mouseover="showEmojiMenu(resolutionNode)"
        @mouseleave="hideEmojiMenu(resolutionNode)"
        @dblclick="editNodeText(resolutionNode)"
      >
        {{ resolutionNode.text }}
        <div v-if="resolutionNode.showEmojis" class="emoji-menu">
          <span @click="openPopup('pro', resolutionNode)">👍</span>
          <span @click="openPopup('con', resolutionNode)">👎</span>
          <span @click="openPopup('exp', resolutionNode)">✋</span>
        </div>
      </div>

      <!-- Child Nodes -->
      <div
        v-for="(node, index) in childNodes"
        :key="index"
        :class="`node ${node.type}`"
        :style="{ 
          top: node.position.y + 'px', 
          left: node.position.x + 'px',
          backgroundColor: nodeColors[node.type],
          color: textColors[node.type]
        }"
        @mousedown="startDrag($event, node)"
        @mouseover="showEmojiMenu(node)"
        @mouseleave="hideEmojiMenu(node)"
        @dblclick="editNodeText(node)"
      >
        {{ node.text }}
        <div v-if="node.showEmojis" class="emoji-menu">
          <span @click="openPopup('pro', node)">👍</span>
          <span @click="openPopup('con', node)">👎</span>
          <span @click="openPopup('exp', node)">✋</span>
        </div>
      </div>

      <!-- Popup for Statement -->
      <div v-if="showPopup" class="popup">
        <label>
          {{ getPopupLabel(newNode.type) }}
          <input
            v-model="newNode.text"
            type="text"
            placeholder="Type your claim here..."
            ref="newNodeInput"
            @keydown.enter="addChildNode"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resolutionNode: {
        id: "resolution",
        position: { x: 300, y: 100 },
        showEmojis: false,
        text: "Main Resolution",
      },
      childNodes: [],
      edges: [],
      draggingNode: null,
      showPopup: false,
      newNode: { type: "", text: "", color: "", parent: null },
      // All color settings (9 total)
      canvasColor: "#000000", // Canvas background color
      nodeColors: {
        resolution: "#FFFFFF", // Main node background
        pro: "#008000",       // Supporting node background
        con: "#FF0000",       // Opposing node background
        exp: "#FFFF00",       // Exploring node background
      },
      textColors: {
        resolution: "#000000", // Main node text
        pro: "#FFFFFF",       // Supporting node text
        con: "#FFFFFF",       // Opposing node text
        exp: "#000000",       // Exploring node text
      },
      // Default colors for reset
      defaultColors: {
        canvas: "#000000",
        nodeColors: {
          resolution: "#FFFFFF",
          pro: "#008000",
          con: "#FF0000",
          exp: "#FFFF00",
        },
        textColors: {
          resolution: "#000000",
          pro: "#FFFFFF",
          con: "#FFFFFF",
          exp: "#000000",
        }
      },
      // Fixed node dimensions
      nodeWidth: 150,
      nodeBaseHeight: 40,
      nodeWithEmojiHeight: 80,
      refreshTrigger: 0,
      showColorPanel: false, // Start with color panel hidden
      autoHideTimeout: null,
    };
  },
  mounted() {
    // Auto-hide functionality
    document.addEventListener('mousemove', this.handleMouseMove);
    
    // Load saved color scheme if available
    this.loadColorScheme();
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  },
  methods: {
    handleMouseMove(event) {
      // Show panel when mouse is close to the left edge
      const triggerZone = 50; // pixels from left edge
      
      if (event.clientX <= triggerZone) {
        // Mouse in trigger zone - show panel
        this.showColorPanel = true;
        // Clear any existing timeout
        if (this.autoHideTimeout) {
          clearTimeout(this.autoHideTimeout);
          this.autoHideTimeout = null;
        }
      } else if (this.showColorPanel && event.clientX > 300) {
        // Mouse moved away from panel - set timeout to hide
        if (!this.autoHideTimeout) {
          this.autoHideTimeout = setTimeout(() => {
            this.showColorPanel = false;
            this.autoHideTimeout = null;
          }, 100); // 1 second before hiding
        }
      }
    },
    
    toggleColorPanel() {
      this.showColorPanel = !this.showColorPanel;
      // Clear any auto-hide timeout when manually toggling
      if (this.autoHideTimeout) {
        clearTimeout(this.autoHideTimeout);
        this.autoHideTimeout = null;
      }
    },
    
    loadColorScheme() {
      try {
        const savedScheme = localStorage.getItem('color-scheme');
        if (savedScheme) {
          const colorScheme = JSON.parse(savedScheme);
          
          // Apply saved colors
          this.canvasColor = colorScheme.canvas;
          
          // Apply node colors
          for (const type in colorScheme.nodeColors) {
            if (this.nodeColors.hasOwnProperty(type)) {
              this.nodeColors[type] = colorScheme.nodeColors[type];
            }
          }
          
          // Apply text colors
          for (const type in colorScheme.textColors) {
            if (this.textColors.hasOwnProperty(type)) {
              this.textColors[type] = colorScheme.textColors[type];
            }
          }
          
          // Update edge colors
          this.updateEdgeColors();
        }
      } catch (error) {
        console.error('Failed to load color scheme:', error);
      }
    },
    
    resetColorScheme() {
      // Reset to default colors
      this.canvasColor = this.defaultColors.canvas;
      
      // Reset node background colors
      for (const type in this.nodeColors) {
        this.nodeColors[type] = this.defaultColors.nodeColors[type];
      }
      
      // Reset text colors
      for (const type in this.textColors) {
        this.textColors[type] = this.defaultColors.textColors[type];
      }
      
      // Update edge colors
      this.updateEdgeColors();
      
      // Automatically save the reset colors
      this.saveColorScheme();
    },
    
    saveColorScheme() {
      // Save all colors to localStorage
      const colorScheme = {
        canvas: this.canvasColor,
        nodeColors: this.nodeColors,
        textColors: this.textColors
      };
      
      try {
        localStorage.setItem('color-scheme', JSON.stringify(colorScheme));
      } catch (error) {
        console.error('Failed to save color scheme:', error);
      }
    },
    
    getNodeTypeLabel(type) {
      switch(type) {
        case 'resolution': return 'Main';
        case 'pro': return 'Supporting';
        case 'con': return 'Opposing';
        case 'exp': return 'Exploring';
        default: return type.charAt(0).toUpperCase() + type.slice(1);
      }
    },
    
    updateEdgeColors() {
      // Update edge colors to match the corresponding child node type
      this.edges.forEach(edge => {
        const targetNode = this.childNodes.find(n => n.id === edge.target);
        if (targetNode) {
          // Edge color should match the child node's type color
          edge.color = this.nodeColors[targetNode.type];
        }
      });
      this.refreshTrigger++;
      
      // Auto-save when colors are updated
      this.saveColorScheme();
    },

    calculatePath(sourceId, targetId) {
      const sourceNode = this.getNodeById(sourceId);
      const targetNode = this.getNodeById(targetId);

      if (!sourceNode || !targetNode) {
        return '';
      }

      // Determine the actual height based on whether emoji menu is showing
      const sourceHeight = sourceNode.showEmojis ? this.nodeWithEmojiHeight : this.nodeBaseHeight;

      // Calculate the anchor points
      const sourceX = sourceNode.position.x + this.nodeWidth / 2;
      const sourceY = sourceNode.position.y + sourceHeight;

      // For target, use the exact top center
      const targetX = targetNode.position.x + this.nodeWidth / 2;
      const targetY = targetNode.position.y; // Top of target node

      // Create a curved path with improved control points
      const distance = Math.abs(targetY - sourceY);
      const controlPointOffset = Math.min(distance * 0.5, 80); // Limit the curve

      return `M${sourceX},${sourceY} C${sourceX},${sourceY + controlPointOffset} ${targetX},${targetY - controlPointOffset} ${targetX},${targetY}`;
    },

    startDrag(event, node) {
      event.preventDefault();
      this.draggingNode = node;

      // Store initial positions
      const startX = event.clientX;
      const startY = event.clientY;
      const nodeStartX = node.position.x;
      const nodeStartY = node.position.y;

      const moveHandler = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        // Update node position
        node.position = {
          x: nodeStartX + dx,
          y: nodeStartY + dy
        };
      };

      const upHandler = () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        
        // Check if the child node has been dragged into its parent
        if (this.draggingNode && this.draggingNode.id !== "resolution") {
          // Find the parent node for this child
          const parentEdge = this.edges.find(e => e.target === this.draggingNode.id);
          
          if (parentEdge) {
            const parentNode = this.getNodeById(parentEdge.source);
            
            // Check if the child overlaps with its parent
            if (this.nodesOverlap(this.draggingNode, parentNode)) {
              // Delete the child node and its connecting edge
              this.deleteChildNode(this.draggingNode.id);
            }
          }
        }
        
        this.draggingNode = null;
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
    },

    nodesOverlap(node1, node2) {
      // Get node1 bounding box
      const node1Left = node1.position.x;
      const node1Top = node1.position.y;
      const node1Right = node1.position.x + this.nodeWidth;
      const node1Bottom = node1.position.y + (node1.showEmojis ? this.nodeWithEmojiHeight : this.nodeBaseHeight);
      
      // Get node2 bounding box
      const node2Left = node2.position.x;
      const node2Top = node2.position.y;
      const node2Right = node2.position.x + this.nodeWidth;
      const node2Bottom = node2.position.y + (node2.showEmojis ? this.nodeWithEmojiHeight : this.nodeBaseHeight);
      
      // Check for overlap
      const horizontalOverlap = node1Left < node2Right && node1Right > node2Left;
      const verticalOverlap = node1Top < node2Bottom && node1Bottom > node2Top;
      
      // If there's both horizontal and vertical overlap, the nodes overlap
      return horizontalOverlap && verticalOverlap;
    },

    deleteChildNode(nodeId) {
      // First find all descendants of this node (children, grandchildren, etc.)
      const descendantIds = this.findAllDescendants(nodeId);
      
      // Add the node itself to the list of nodes to delete
      const nodesToDelete = [nodeId, ...descendantIds];
      
      // Remove all nodes from childNodes array
      this.childNodes = this.childNodes.filter(node => !nodesToDelete.includes(node.id));
      
      // Remove all edges connecting to any of these nodes
      this.edges = this.edges.filter(edge => 
        !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)
      );
      
      // Force SVG paths to update
      this.refreshTrigger++;
    },
    
    findAllDescendants(nodeId) {
      // Find immediate children
      const childrenIds = this.edges
        .filter(edge => edge.source === nodeId)
        .map(edge => edge.target);
      
      // Recursively find all descendants
      let allDescendants = [...childrenIds];
      
      for (const childId of childrenIds) {
        const grandchildren = this.findAllDescendants(childId);
        allDescendants = [...allDescendants, ...grandchildren];
      }
      
      return allDescendants;
    },

    getPopupLabel(type) {
      // Get parent node text
      const parentText = this.newNode.parent ? this.newNode.parent.text : '';
      
      switch(type) {
        case 'pro':
          return `Supporting: "${parentText}"`;
        case 'con':
          return `Opposing: "${parentText}"`;
        case 'exp':
          return `Exploring: "${parentText}"`;
        default:
          return 'Statement';
      }
    },

    openPopup(type, parentNode) {
      this.newNode = {
        type,
        text: "",
        color: this.nodeColors[type],
        parent: parentNode
      };
      this.showPopup = true;

      this.$nextTick(() => {
        this.$refs.newNodeInput.focus(); // Focus on the textbox after the popup is rendered
      });
    },

    closePopup() {
      this.showPopup = false;
    },

    addChildNode() {
      if (!this.newNode.text.trim()) {
        alert("Please enter a statement.");
        return;
      }

      // Create an ID for the new node
      const id = `child-${Date.now()}`;

      // Create the new node - positioned relative to the parent
      const newNode = {
        id,
        text: this.newNode.text.trim(),
        type: this.newNode.type,
        position: {
          x: this.newNode.parent.position.x + 50,
          y: this.newNode.parent.position.y + 150
        },
        showEmojis: false
      };

      // Add the node to the collection
      this.childNodes.push(newNode);

      // Create the edge with color matching the child node type
      this.edges.push({
        source: this.newNode.parent.id,
        target: id,
        color: this.nodeColors[this.newNode.type]
      });

      // Close the popup
      this.showPopup = false;
    },

    getNodeById(id) {
      if (id === "resolution") {
        return this.resolutionNode;
      }
      return this.childNodes.find(node => node.id === id);
    },

    showEmojiMenu(node) {
      node.showEmojis = true;
      this.refreshTrigger++; // Force SVG paths to update
    },

    hideEmojiMenu(node) {
      node.showEmojis = false;
      this.refreshTrigger++; // Force SVG paths to update
    },

    editNodeText(node) {
      const newText = prompt("Edit Node Text:", node.text);
      if (newText !== null && newText.trim() !== "") {
        node.text = newText.trim();
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
  margin: 0;
  transition: background-color 0.3s ease;
}

.node {
  position: absolute;
  width: 150px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  cursor: grab;
  box-sizing: border-box;
  z-index: 2;
  transition: height 0.2s ease, background-color 0.3s ease, color 0.3s ease;
}

.resolution-node {
  font-weight: bold;
}

.emoji-menu {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}

.lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  transition: stroke 0.3s ease;
}

.popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  color: black;
}

button {
  margin: 5px;
  padding: 5px 10px;
}

input {
  margin: 10px 0;
  padding: 5px;
  width: 100%;
}

/* Color Settings Panel Styles */
.color-settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(40, 40, 40, 0.9);
  color: white;
  padding: 10px;
  z-index: 100;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  width: 210px;
  transition: transform 0.3s ease;
  transform: translateX(0);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.color-settings-panel.hidden {
  transform: translateX(-100%);
}

/* Logo styles */
.panel-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  padding: 10px 5px 15px;
  border-bottom: 1px solid #555;
}

/* Company logo */
.company-logo {
  width: 100%;
  max-height: 60px;
  object-fit: contain;
}

/* Version number */
.version-info {
  font-size: 11px;
  color: #999;
  text-align: center;
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid #555;
}

.color-picker-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
  overflow-y: auto;
  margin: 5px 0;
}

.color-picker-section {
  margin-top: 5px;
}

.color-picker-section h4 {
  margin: 0 0 5px 0;
  font-size: 13px;
  color: #ccc;
  border-bottom: 1px dotted #555;
  padding-bottom: 3px;
}

.color-picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.color-picker-item label {
  flex: 1;
  text-align: left;
  margin-right: 5px;
  font-size: 13px;
}

.color-picker-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.node-type-label {
  font-size: 13px;
  flex: 1;
}

.color-inputs {
  display: flex;
  gap: 5px;
}

.color-input {
  width: 25px;
  height: 25px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  padding: 0;
}

.reset-btn {
  margin-top: 8px;
  width: 100%;
  background-color: #444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 12px;
}

.reset-btn:hover {
  background-color: #555;
}

.toggle-panel-btn {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: rgba(60, 60, 60, 0.7);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  width: 20px;
  height: 60px;
  padding: 0;
  cursor: pointer;
  z-index: 99;
  transition: left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-panel-btn.panel-open {
  left: 210px;
}
</style>