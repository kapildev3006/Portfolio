import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <PortfolioProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PortfolioProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
