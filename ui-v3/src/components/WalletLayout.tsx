
import { useLocation, useParams } from "react-router-dom";
import { ReactNode, useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import WalletHeader from "./WalletHeader";
import MobileNavigationDrawer from "./MobileNavigationDrawer";
import DesktopSidebar from "./DesktopSidebar";

interface WalletLayoutProps {
  children: ReactNode;
}

const WalletLayout = ({ children }: WalletLayoutProps) => {
  const { walletId } = useParams();
  const { selectedWallet } = useSelectedWallet();
  const [selectedNetwork, setSelectedNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNetworkSwitch = (network: 'mainnet' | 'testnet') => {
    setSelectedNetwork(network);
    console.log(`Switched to ${network}`);
    // Here you would implement actual network switching logic
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!selectedWallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading wallet...</div>
      </div>
    );
  }

  const currentWallet = {
    name: selectedWallet.name,
    contractId: selectedWallet.contractId,
    balance: selectedWallet.balance,
    usdValue: selectedWallet.usdValue
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <WalletHeader
        currentWallet={currentWallet}
        selectedNetwork={selectedNetwork}
        onNetworkSwitch={handleNetworkSwitch}
        onMobileMenuToggle={handleMobileMenuToggle}
      />

      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        currentWallet={currentWallet}
        walletId={walletId}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <DesktopSidebar
            currentWallet={currentWallet}
            walletId={walletId}
          />

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLayout;
