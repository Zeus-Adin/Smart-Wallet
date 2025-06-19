
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const Header = () => {
  const { isWalletConnected, connectWallet, disconnectWallet, isConnecting, walletData, isDemoMode } = useWalletConnection();

  const handleWalletAction = () => {
    if (isWalletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isWalletConnected && walletData?.addresses?.stx && walletData.addresses.stx.length > 0) {
      const address = walletData.addresses.stx[0].address;
      const prefix = isDemoMode ? "Demo: " : "";
      return `${prefix}${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return "Connect Wallet";
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">Smart Wallet</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={scrollToFeatures}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <Link to="/products" className="text-slate-300 hover:text-white transition-colors">Products</Link>
            <Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              asChild 
              variant="outline" 
              className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500"
            >
              <a 
                href="https://polimartlabs.gitbook.io/smart-wallet/overview/why-smart-wallet" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Docs
              </a>
            </Button>
            {isWalletConnected ? (
              <div className="flex items-center space-x-2">
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                  <Link to="/wallet-selector">My Wallets</Link>
                </Button>
                <Button 
                  onClick={handleWalletAction}
                  variant="outline" 
                  className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500"
                  disabled={isConnecting}
                >
                  {getButtonText()}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleWalletAction}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isConnecting}
              >
                {getButtonText()}
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
