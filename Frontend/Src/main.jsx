import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './Styles/variables.css';
import './Styles/global.css';
import './Styles/animations.css';
import './Styles/responsive.css';
import './Styles/react-pages.css';

const routerBasename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename={routerBasename}>
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
