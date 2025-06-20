
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import { Plus, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { useBlockchainService } from "@/hooks/useBlockchainService";
import { useEffect, useState } from "react";
import WalletSelectorHeader from "@/components/wallet-selector/WalletSelectorHeader";
import WalletCard from "@/components/wallet-selector/WalletCard";
import EmptyWalletState from "@/components/wallet-selector/EmptyWalletState";
import DemoNotice from "@/components/wallet-selector/DemoNotice";
import LoadingState from "@/components/wallet-selector/LoadingState";
import AddExistingWalletDialog from "@/components/wallet-selector/AddExistingWalletDialog";
import { SmartWallet } from "@/services/smartWalletContractService";

const WalletSelector = () => {
  const { isDemoMode, walletData } = useWalletConnection();
  const { loadSmartWallets, smartWallets, isLoading } = useBlockchainService();
  const [walletsToShow, setWalletsToShow] = useState<SmartWallet[]>([]);
  const [importedWallets, setImportedWallets] = useState<SmartWallet[]>([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (isDemoMode) {
        console.log('Loading demo wallets...');
        await loadSmartWallets('demo-address');
      } else if (walletData?.addresses?.stx?.[0]?.address) {
        console.log('Fetching wallet data for:', walletData.addresses.stx[0].address);
        try {
          await loadSmartWallets(walletData.addresses.stx[0].address);
        } catch (error) {
          console.error('Failed to fetch wallet data:', error);
        }
      }
    };

    fetchWalletData();
  }, [isDemoMode, walletData, loadSmartWallets]);

  useEffect(() => {
    // In demo mode, only show the demo wallets from smartWallets
    // In normal mode, combine detected wallets with imported wallets
    if (isDemoMode) {
      setWalletsToShow(smartWallets);
    } else {
      const allWallets = [...smartWallets, ...importedWallets];
      setWalletsToShow(allWallets);
    }
  }, [smartWallets, importedWallets, isDemoMode]);

  const handleWalletAdded = (newWallet: SmartWallet) => {
    setImportedWallets(prev => [...prev, newWallet]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <WalletSelectorHeader
        totalBalance="1,234.56 STX"
        usdValue="$2,469.12"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isDemoMode ? "Demo Smart Wallets" : "My Smart Wallets"}
              </h1>
              <p className="text-slate-400">
                {isDemoMode
                  ? "Explore the demo wallets to see how smart wallets work."
                  : "Select a smart wallet to manage or create a new one."
                }
              </p>
              {isDemoMode && (
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                  <Play className="mr-1 h-3 w-3" />
                  Demo Mode
                </div>
              )}
            </div>
            {!isDemoMode && (
              <div className="flex gap-3">
                <AddExistingWalletDialog
                  onWalletAdded={handleWalletAdded}
                  isDemoMode={isDemoMode}
                />
                <PrimaryButton asChild>
                  <Link to="/create-wallet">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Wallet
                  </Link>
                </PrimaryButton>
              </div>
            )}
          </div>

          {isLoading ? (
            <LoadingState />
          ) : walletsToShow.length === 0 ? (
            <EmptyWalletState />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {walletsToShow.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  isDemoMode={isDemoMode}
                />
              ))}
            </div>
          )}

          {isDemoMode && <DemoNotice />}
        </div>
      </div>
    </div>
  );
};

export default WalletSelector;
