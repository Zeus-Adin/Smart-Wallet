
import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, Activity, DollarSign } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import ActiveExtensions from "@/components/dashboard/ActiveExtensions";
import AssetOverview from "@/components/dashboard/AssetOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  const { walletId } = useParams();
  const { selectedWallet: walletData, isLoading } = useSelectedWallet();

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
    <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
      <Link to={`/stacking/${walletId}`}>
        <TrendingUp className="mr-2 h-4 w-4" />
        Stack STX
      </Link>
    </Button>
  );

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400">Manage your smart wallet assets and activities</p>
          </div>
          <div className="flex space-x-2">
            <Button asChild variant="outline" className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500">
              <Link to={`/send/${walletId}`}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Send Assets
              </Link>
            </Button>
            {isStackingActive && <StackSTXButton />}
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{walletData.balance}</div>
              <p className="text-xs text-slate-400">STX Balance</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">USD Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{walletData.usdValue}</div>
              <p className="text-xs text-slate-400">Current market value</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Activity</CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">5</div>
              <p className="text-xs text-slate-400">Recent transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Extensions Section */}
        {walletData.extensions && walletData.extensions.length > 0 && (
          <ActiveExtensions extensions={walletData.extensions} />
        )}

        {/* Asset Overview and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetOverview />
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600 hover:text-white hover:border-slate-500">
              <Link to={`/send/${walletId}`}>
                <ArrowUpRight className="h-6 w-6 mb-2" />
                Send
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600 hover:text-white hover:border-slate-500">
              <Link to={`/receive/${walletId}`}>
                <ArrowUpRight className="h-6 w-6 mb-2 rotate-180" />
                Receive
              </Link>
            </Button>
            {isStackingActive && (
              <Button asChild variant="outline" className="h-20 flex-col border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600 hover:text-white hover:border-slate-500">
                <Link to={`/stacking/${walletId}`}>
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Stack
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="h-20 flex-col border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600 hover:text-white hover:border-slate-500">
              <Link to={`/history/${walletId}`}>
                <Activity className="h-6 w-6 mb-2" />
                History
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </WalletLayout>
  );
};

export default Dashboard;
