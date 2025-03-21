import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import { AppContextProvider } from './context/AppContext';
import Home from './pages/Home';
import About from './pages/About';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';
import './assets/styles/global.css';

const App = () => {
  return (
    <Router>
      <AppContextProvider>
        <div className="app-container">
          {/* Header with Navigation */}
          <header className="app-header">
            <div className="logo-container">
              <img src="/logo.png" alt="Logo" className="app-logo" />
            </div>
            
            <nav className="main-nav">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/feedback">Feedback</Link>
                </li>
              </ul>
            </nav>
          </header>

          {/* Main Content */}
          <main className="app-content">
            <ReactFlowProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ReactFlowProvider>
          </main>

          {/* Footer */}
          <footer className="app-footer">
            <div className="support-links">
              <a href="https://patreon.com/yourcompany" target="_blank" rel="noopener noreferrer">
                Support on Patreon
              </a>
              <a href="https://ko-fi.com/yourcompany" target="_blank" rel="noopener noreferrer">
                Buy me a coffee
              </a>
              <a href="https://revolut.me/yourcompany" target="_blank" rel="noopener noreferrer">
                Donate via Revolut
              </a>
            </div>
            
            <div className="version">
              v1.0.0
            </div>
          </footer>
        </div>
      </AppContextProvider>
    </Router>
  );
};

export default App;