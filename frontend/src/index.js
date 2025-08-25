import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <PortfolioProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PortfolioProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
