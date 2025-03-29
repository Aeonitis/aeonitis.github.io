<template>
  <div id="app">
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
        @dblclick="editNodeText(resolutionNode)"
      >
        {{ resolutionNode.text }} <!-- Use this to dynamically display the text -->
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
        text: "Main Resolution", // Add the text property here
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

      // Create the edge
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
  background-color: black; /* Changed background to black */
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black; /* Set background to black */
  border: none;
  overflow: hidden;
  margin: 0;
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
  background-color: white; /* Changed background to white */
  color: black; /* Changed text to black */
  font-weight: bold; /* Made text bold */
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