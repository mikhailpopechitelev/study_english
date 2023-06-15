import React from 'react';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(<App />);

/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/
