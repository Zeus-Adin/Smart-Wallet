
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletConnectionProvider } from "./contexts/WalletConnectionContext";
import { SelectedWalletProvider } from "./contexts/SelectedWalletContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SendAssets from "./pages/SendAssets";
import ReceiveAssets from "./pages/ReceiveAssets";
import ActionHistory from "./pages/ActionHistory";
import ContractActions from "./pages/ContractActions";
import ContractDetails from "./pages/ContractDetails";
import GenericActions from "./pages/GenericActions";
import WalletSelector from "./pages/WalletSelector";
import CreateWallet from "./pages/CreateWallet";
import WalletDetails from "./pages/WalletDetails";
import Stacking from "./pages/Stacking";
import About from "./pages/About";
import Products from "./pages/Products";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletConnectionProvider>
        <SelectedWalletProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/wallet-selector" element={<WalletSelector />} />
                <Route path="/create-wallet" element={<CreateWallet />} />
                <Route path="/dashboard/:walletId" element={<Dashboard />} />
                <Route path="/send/:walletId" element={<SendAssets />} />
                <Route path="/receive/:walletId" element={<ReceiveAssets />} />
                <Route path="/history/:walletId" element={<ActionHistory />} />
                <Route path="/actions/:walletId" element={<GenericActions />} />
                <Route path="/contract-actions/:walletId" element={<ContractActions />} />
                <Route path="/contract-details/:walletId" element={<ContractDetails />} />
                <Route path="/wallet-details/:walletId" element={<WalletDetails />} />
                <Route path="/stacking/:walletId" element={<Stacking />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </SelectedWalletProvider>
      </WalletConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;
