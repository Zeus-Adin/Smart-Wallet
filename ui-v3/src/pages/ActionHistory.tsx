
import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { History } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import { useBlockchainService } from "@/hooks/useBlockchainService";
import SecondaryButton from "@/components/ui/secondary-button";
import TransactionItem from "@/components/transaction/TransactionItem";

const ActionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedWallet } = useSelectedWallet();
  const { transactions, loadRecentData, isLoading, isDemoMode } = useBlockchainService();

  useEffect(() => {
    if (selectedWallet?.address) {
      console.log('Loading transaction data for:', selectedWallet.address);
      loadRecentData(selectedWallet.address);
    }
  }, [selectedWallet?.address, loadRecentData]);

  const filteredTransactions = useMemo(() =>
    transactions.filter(tx =>
      tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.asset.toLowerCase().includes(searchTerm.toLowerCase())
    ), [transactions, searchTerm]
  );

  const transactionStats = useMemo(() => ({
    total: transactions.length,
    confirmed: transactions.filter(tx => tx.status === 'confirmed').length,
    pending: transactions.filter(tx => tx.status === 'pending').length,
    failed: transactions.filter(tx => tx.status === 'failed').length
  }), [transactions]);

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div className="px-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Action History</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            View all your wallet transactions and activities.
            {isDemoMode && " (Demo data shown)"}
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 mx-1 sm:mx-0">
          <CardHeader className="px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                <History className="mr-2 h-5 w-5 text-purple-400 flex-shrink-0" />
                Transaction History
              </CardTitle>
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-400">Loading transactions...</div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-400">No transactions found</div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((tx) => (
                  <TransactionItem 
                    key={tx.id} 
                    transaction={tx} 
                    showFullDetails={true}
                    selectedWalletAddress={selectedWallet?.address}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 mx-1 sm:mx-0">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-white text-lg sm:text-xl">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-white">{transactionStats.total}</div>
                <div className="text-slate-400 text-xs sm:text-sm">Total</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                  {transactionStats.confirmed}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">Confirmed</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                  {transactionStats.pending}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">Pending</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-red-400">
                  {transactionStats.failed}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center px-1">
          <SecondaryButton className="w-full sm:w-auto">
            Load More Transactions
          </SecondaryButton>
        </div>
      </div>
    </WalletLayout>
  );
};

export default ActionHistory;
