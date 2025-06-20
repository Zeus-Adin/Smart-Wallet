
import WalletLayout from "@/components/WalletLayout";
import ActiveExtensions from "@/components/dashboard/ActiveExtensions";
import AssetOverview from "@/components/dashboard/AssetOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CSWCard from "@/components/ui/csw-card";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import { usePriceService } from "@/hooks/usePriceService";
import { useBlockchainService } from "@/hooks/useBlockchainService";
import { Activity, ArrowUpRight, DollarSign, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { walletId } = useParams();
  const { selectedWallet: walletData, isLoading } = useSelectedWallet();
  const { calculateUsdValue, fetchPrices } = usePriceService();
  const { loadRecentData, transactions } = useBlockchainService();
  const [calculatedUsdValue, setCalculatedUsdValue] = useState("$0.00");

  useEffect(() => {
    // Fetch prices for tokens when component mounts
    fetchPrices(['stx', 'btc']);
  }, [fetchPrices]);

  useEffect(() => {
    // Load transaction data when wallet data is available
    if (walletData?.address) {
      loadRecentData(walletData.address);
    }
  }, [walletData?.address, loadRecentData]);

  useEffect(() => {
    // Calculate USD value when prices are available and wallet data changes
    if (walletData?.balance) {
      const balanceAmount = walletData.balance.replace(' STX', '');
      const newUsdValue = calculateUsdValue(balanceAmount, 'stx');
      setCalculatedUsdValue(newUsdValue);
    }
  }, [walletData?.balance, calculateUsdValue]);

  if (isLoading) {
    return (
      <WalletLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading wallet data...</div>
        </div>
      </WalletLayout>
    );
  }

  if (!walletData) {
    return (
      <WalletLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Wallet not found</div>
        </div>
      </WalletLayout>
    );
  }

  // Check if stacking extension is active
  const isStackingActive = walletData.extensions?.some(ext =>
    ext.toLowerCase().includes('stacking') || ext.toLowerCase().includes('stack')
  );

  const StackSTXButton = () => (
    <PrimaryButton asChild className="w-full sm:w-auto">
      <Link to={`/stacking/${walletId}`}>
        <TrendingUp className="mr-2 h-4 w-4" />
        Stack STX
      </Link>
    </PrimaryButton>
  );

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm sm:text-base">Manage your smart wallet assets and activities</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <SecondaryButton asChild variant={undefined} className="w-full sm:w-auto">
              <Link to={`/send/${walletId}`}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Send Assets
              </Link>
            </SecondaryButton>
            {isStackingActive && <StackSTXButton />}
          </div>
        </div>

        {/* Balance Overview with calculated USD values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-1 sm:px-0">
          <CSWCard>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white break-all">{walletData.balance}</div>
              <p className="text-xs text-slate-400">STX Balance</p>
            </CardContent>
          </CSWCard>

          <CSWCard>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">USD Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-400">{calculatedUsdValue}</div>
              <p className="text-xs text-slate-400">Current market value</p>
            </CardContent>
          </CSWCard>

          <CSWCard className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Activity</CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white">{transactions.length}</div>
              <p className="text-xs text-slate-400">Recent transactions</p>
            </CardContent>
          </CSWCard>
        </div>

        {/* Enhanced Quick Actions - 4 columns on large, 2 on mobile */}
        <CSWCard className="mx-1 sm:mx-0">
          <CardHeader>
            <CardTitle className="text-white text-lg sm:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link 
              to={`/send/${walletId}`} 
              className="group relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white rounded-lg p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex flex-col items-center justify-center h-16 sm:h-20 text-xs sm:text-sm font-medium">
                <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 transform group-hover:rotate-12 transition-transform duration-300" />
                Send
              </div>
            </Link>

            <Link 
              to={`/receive/${walletId}`} 
              className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-lg p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex flex-col items-center justify-center h-16 sm:h-20 text-xs sm:text-sm font-medium">
                <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 rotate-180 transform group-hover:rotate-[168deg] transition-transform duration-300" />
                Receive
              </div>
            </Link>

            {isStackingActive && (
              <Link 
                to={`/stacking/${walletId}`} 
                className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 text-white rounded-lg p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center h-16 sm:h-20 text-xs sm:text-sm font-medium">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 transform group-hover:scale-110 transition-transform duration-300" />
                  Stack
                </div>
              </Link>
            )}

            <Link 
              to={`/history/${walletId}`} 
              className="group relative overflow-hidden bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 text-white rounded-lg p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex flex-col items-center justify-center h-16 sm:h-20 text-xs sm:text-sm font-medium">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 transform group-hover:pulse transition-transform duration-300" />
                History
              </div>
            </Link>
          </CardContent>
        </CSWCard>

        {/* Asset Overview and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 px-1 sm:px-0">
          <AssetOverview />
          <RecentActivity />
        </div>

        {/* Active Extensions Section */}
        {walletData.extensions && walletData.extensions.length > 0 && (
          <div className="px-1 sm:px-0">
            <ActiveExtensions extensions={walletData.extensions} />
          </div>
        )}

      </div>
    </WalletLayout>
  );
};

export default Dashboard;
