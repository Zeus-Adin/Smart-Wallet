import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './lib/auth-provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/globals.css';
import './styles/globals_styler.css';
import { PageRoutes } from './app/pageroutes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PageRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)