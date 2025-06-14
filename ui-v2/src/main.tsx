// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './lib/auth-provider';
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css';
import './styles/globals_styler.css';
import { PageRoutes } from './app/pageroutes';
import { TxProvider } from './lib/tx-provider';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <TxProvider>
        <PageRoutes />
      </TxProvider>
    </AuthProvider>
  </BrowserRouter>
  //</StrictMode>
)