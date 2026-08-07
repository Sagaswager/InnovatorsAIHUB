
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Inject Agentation visual feedback script only in development mode
if (import.meta.env.DEV) {
  const script = document.createElement('script');
  script.src = "https://www.agentation.com/mcp";
  script.async = true;
  document.head.appendChild(script);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
