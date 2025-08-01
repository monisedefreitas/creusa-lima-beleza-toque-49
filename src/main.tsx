
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx loading...');
console.log('React version:', React.version);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

console.log('Creating React root...');

const root = createRoot(rootElement);

console.log('Rendering App...');

root.render(<App />);
