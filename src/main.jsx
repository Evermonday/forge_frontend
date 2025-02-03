import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import AppProvider from './contexts/AppContext.jsx';
import { StrictMode } from 'react';


createRoot(document.getElementById('root'))
    .render(
        <AppProvider>
            <App />
        </AppProvider>
    );
