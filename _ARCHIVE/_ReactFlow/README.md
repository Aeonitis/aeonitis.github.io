# Static

## Project structure for react flow
```
project-root/
├── public/
│   ├── index.html               // Main HTML template
│   ├── favicon.ico              // Site favicon
│   ├── logo.png                 // Your company logo
│   └── manifest.json            // Metadata for the React app
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── global.css       // Global styles (e.g., Roboto font import)
│   ├── components/
│   │   ├── ArgumentMap/
│   │   │   ├── ArgumentMap.jsx  // Component handling the argument map
│   │   │   ├── NodeCustomization.jsx // Component for color picker UI
│   │   │   └── NodeButton.jsx   // Reusable button for "because/but/however"
│   │   ├── About/
│   │   │   └── AboutPage.jsx    // "About" section with mission statement
│   │   ├── Feedback/
│   │   │   └── FeedbackPage.jsx // Contact/feedback form or email link
│   │   └── Support/
│   │       └── SupportSection.jsx // Display links to Patreon, Ko-fi, etc.
│   ├── context/
│   │   └── AppContext.jsx       // Context API for saving WIP state in browser
│   ├── hooks/
│   │   └── useLocalStorage.js   // Custom hook for managing local storage
│   ├── pages/
│   │   ├── Home.jsx             // Landing page with "State your Claim" input
│   │   ├── About.jsx            // Wrapper for AboutPage component
│   │   ├── Feedback.jsx         // Wrapper for FeedbackPage component
│   │   └── NotFound.jsx         // 404 page for unknown routes
│   ├── utils/
│   │   ├── exportUtils.js       // Functions for exporting as PNG or .trie
│   │   ├── validationUtils.js   // Input validation logic for sentences
│   │   └── sampleResolutions.js // JSON file with sample resolutions
│   ├── App.jsx                  // Main application structure with routing
│   ├── index.jsx                // React entry point
│   └── config.js                // Configuration constants (e.g., site version)
├── .gitignore                   // Git ignore rules
├── package.json                 // Dependencies and scripts
├── README.md                    // Project documentation
└── webpack.config.js            // Webpack configuration (if needed)
```


## App Explanation 
Argument Mapping Tool for GitHub Pages deployment. Here's a summary of what I've provided:

### Core Components:
1. **ArgumentMap.jsx** - The main React Flow implementation for creating and manipulating argument maps
2. **NodeCustomization.jsx** - Color picker UI for styling different node types
3. **NodeButton.jsx** - Reusable button components for adding new nodes
4. **AppContext.jsx** - Context API for state management, including saving work-in-progress

### Utility Files:
1. **exportUtils.js** - Handles exporting maps as PNG with watermark and .trie file serialization
2. **validationUtils.js** - Validates input statements for argument nodes
3. **sampleResolutions.js** - Provides sample resolution statements
4. **useLocalStorage.js** - Custom hook for persisting data in browser storage

### Pages:
1. **Home.jsx** - Landing page with resolution input
2. **About.jsx** - About page with mission statement
3. **Feedback.jsx** - Contact page with email link
4. **NotFound.jsx** - 404 page for unknown routes

### Additional Files:
1. **App.jsx** - Main application structure with routing
2. **index.jsx** - React entry point
3. **config.js** - Configuration constants
4. **global.css** - Global styles with Roboto font import
5. **package.json** - Dependencies and scripts for GitHub Pages deployment
6. **manifest.json** - Web app manifest
7. **index.html** - HTML template
8. **.gitignore** - Git ignore rules
9. **README.md** - Project documentation

### Deployment:
For GitHub Pages deployment, make sure to:
1. Add your logo.png and favicon.ico to the public directory
2. Run `npm run deploy` which will build and deploy your site

The app is fully functional and includes all the requested features:
- React Flow for argument mapping
- Custom node styling
- Export/import functionality
- Work-in-progress saving
- Logo watermarking on exports
- Site version display
- Mobile-responsive design
