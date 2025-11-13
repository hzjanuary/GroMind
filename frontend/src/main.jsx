// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import './index.css';
import { CartProvider } from './CartContext.jsx';
import { ThemeProvider } from './ThemeContext.jsx';
import { AuthProvider } from './AuthContext.jsx'; // <- THÊM MỚI
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
