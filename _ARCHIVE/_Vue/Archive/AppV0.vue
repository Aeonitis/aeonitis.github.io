<template>
  <div id="app">
    <h1>Interactive Argument Mapping</h1>
    <div ref="canvas" class="canvas">
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
        :style="{ top: resolutionNode.position.y + 'px', left: resolutionNode.position.x + 'px' }"
        @mousedown="startDrag($event, resolutionNode)"
        @mouseover="showEmojiMenu(resolutionNode)"
        @mouseleave="hideEmojiMenu(resolutionNode)"
      >
        Main Resolution
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
        :style="{ top: node.position.y + 'px', left: node.position.x + 'px' }"
        @mousedown="startDrag($event, node)"
        @mouseover="showEmojiMenu(node)"
        @mouseleave="hideEmojiMenu(node)"
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
        <h3>Add {{ newNode.type.toUpperCase() }} Node</h3>
        <label>
          Statement:
          <input v-model="newNode.text" type="text" placeholder="Enter statement" />
        </label>
        <button @click="addChildNode">Create</button>
        <button @click="closePopup">Cancel</button>
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
      },
      childNodes: [],
      edges: [],
      draggingNode: null,
      showPopup: false,
      newNode: { type: "", text: "", color: "", parent: null },
      nodeColors: {
        pro: "green",
        con: "red",
        exp: "yellow",
      },
      // Fixed node dimensions
      nodeWidth: 150,
      nodeBaseHeight: 40, // Height without emoji menu
      nodeWithEmojiHeight: 80, // Height with emoji menu
      refreshTrigger: 0 // Used to force re-render of SVG paths
    };
  },
  methods: {
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
        this.draggingNode = null;
      };
      
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
    },
    
    openPopup(type, parentNode) {
      this.newNode = { 
        type, 
        text: "", 
        color: this.nodeColors[type], 
        parent: parentNode 
      };
      this.showPopup = true;
    },
    
    closePopup() {
      this.showPopup = false;
    },
    
    addChildNode() {
      if (!this.newNode.text) {
        alert("Please enter a statement.");
        return;
      }
      
      // Create an ID for the new node
      const id = `child-${Date.now()}`;
      
      // Create new node - positioned below and to the right of the parent
      const newNode = {
        id,
        text: this.newNode.text,
        type: this.newNode.type,
        position: {
          x: this.newNode.parent.position.x + 50,
          y: this.newNode.parent.position.y + 150
        },
        showEmojis: false
      };
      
      // Add the node to the collection
      this.childNodes.push(newNode);
      
      // Create the edge
      this.edges.push({
        source: this.newNode.parent.id,
        target: id,
        color: this.nodeColors[this.newNode.type]
      });
      
      // Close the popup
      this.closePopup();
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
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  overflow: hidden;
  margin-top: 20px;
}

.node {
  position: absolute;
  width: 150px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: white;
  cursor: grab;
  box-sizing: border-box;
  z-index: 2;
  transition: height 0.2s ease; /* Smooth height transition */
}

.resolution-node {
  background-color: blue;
}

.node.pro {
  background-color: green;
}

.node.con {
  background-color: red;
}

.node.exp {
  background-color: yellow;
  color: black;
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
  margin-top: 10px;
  padding: 5px 10px;
}

input {
  margin: 10px 0;
  padding: 5px;
  width: 100%;
}
</style>