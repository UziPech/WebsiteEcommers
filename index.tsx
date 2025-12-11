import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './frontend/App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Prevent double-initialization (fixes "createRoot" warning and WebGL Context Lost)
// @ts-ignore
if (!window.reactRoot) {
  rootElement.innerHTML = ''; // Clean slate to prevent React conflicts
  // @ts-ignore
  window.reactRoot = ReactDOM.createRoot(rootElement);
}

// @ts-ignore
window.reactRoot.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);