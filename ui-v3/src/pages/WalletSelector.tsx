
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { Plus, Play, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { useSelectedWalletContext } from "@/contexts/SelectedWalletContext";
import { useBlockchainService } from "@/hooks/useBlockchainService";
import { usePriceService } from "@/hooks/usePriceService";
import { useEffect, useState } from "react";
import WalletSelectorHeader from "@/components/wallet-selector/WalletSelectorHeader";
import WalletCard from "@/components/wallet-selector/WalletCard";
import EmptyWalletState from "@/components/wallet-selector/EmptyWalletState";
import DemoNotice from "@/components/wallet-selector/DemoNotice";
import LoadingState from "@/components/wallet-selector/LoadingState";
import AddExistingWalletDialog from "@/components/wallet-selector/AddExistingWalletDialog";
import { SmartWallet } from "@/services/smartWalletContractService";

const WalletSelector = () => {
  const { isDemoMode, walletData, connectWallet, isConnecting } = useWalletConnection();
  const { switchWallet } = useSelectedWalletContext();
  const { loadSmartWallets, smartWallets, isLoading } = useBlockchainService();
  const { calculateUsdValue, fetchPrices } = usePriceService();
  const [walletsToShow, setWalletsToShow] = useState<SmartWallet[]>([]);
  const [importedWallets, setImportedWallets] = useState<SmartWallet[]>([]);
  const [totalBalance, setTotalBalance] = useState("0.00 STX");
  const [totalUsdValue, setTotalUsdValue] = useState("$0.00");

  useEffect(() => {
    // Fetch STX prices when component mounts
    fetchPrices(['stx']);
  }, [fetchPrices]);

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

  useEffect(() => {
    // Calculate total balance and USD value from displayed wallets
    if (walletsToShow.length === 0) {
      setTotalBalance("0.00 STX");
      setTotalUsdValue("$0.00");
      return;
    }

    let totalStx = 0;
    let totalUsd = 0;

    walletsToShow.forEach(wallet => {
      // Extract numeric value from balance string (e.g., "10,000.00 STX" -> 10000)
      const balanceStr = wallet.balance.replace(/[^0-9.]/g, '');
      const balanceNum = parseFloat(balanceStr) || 0;
      totalStx += balanceNum;

      // Calculate USD value for this wallet
      const usdValue = calculateUsdValue(balanceNum.toString(), 'stx');
      const usdNum = parseFloat(usdValue.replace(/[^0-9.]/g, '')) || 0;
      totalUsd += usdNum;
    });

    setTotalBalance(`${totalStx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} STX`);
    setTotalUsdValue(`$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  }, [walletsToShow, calculateUsdValue]);

  const handleWalletAdded = (newWallet: SmartWallet) => {
    setImportedWallets(prev => [...prev, newWallet]);
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <WalletSelectorHeader
        totalBalance={totalBalance}
        usdValue={totalUsdValue}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {isDemoMode ? "Demo Smart Wallets" : "My Smart Wallets"}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
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
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              {isDemoMode ? (
                <SecondaryButton 
                  onClick={handleConnectWallet} 
                  disabled={isConnecting}
                  className="w-full sm:w-auto"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </SecondaryButton>
              ) : (
                <>
                  <AddExistingWalletDialog
                    onWalletAdded={handleWalletAdded}
                    isDemoMode={isDemoMode}
                  />
                  <PrimaryButton asChild className="w-full sm:w-auto">
                    <Link to="/create-wallet">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Wallet
                    </Link>
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : walletsToShow.length === 0 ? (
            <EmptyWalletState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
