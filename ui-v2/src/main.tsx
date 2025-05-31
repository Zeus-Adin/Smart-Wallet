import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './app/page'
import { AuthProvider } from './lib/auth-provider';
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css';
import './styles/globals_styler.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)