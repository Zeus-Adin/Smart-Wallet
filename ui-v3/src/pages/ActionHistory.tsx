import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { History, Send, ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import { useBlockchainService } from "@/hooks/useBlockchainService";
import SecondaryButton from "@/components/ui/secondary-button";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const getAmountColor = (amount: string) => {
    return amount.startsWith("+") ? "text-green-400" : "text-red-400";
  };

  const getTransactionIcon = (assetType: string) => {
    switch (assetType) {
      case "nft":
        return Wallet;
      default:
        return Send;
    }
  };

  const getTransactionType = (transaction: any) => {
    if (transaction.assetType === 'nft') return 'nft';
    if (transaction.from === selectedWallet?.address) return 'send';
    return 'receive';
  };

  const formatAmount = (transaction: any) => {
    const isOutgoing = transaction.from === selectedWallet?.address;
    const prefix = isOutgoing ? '-' : '+';
    return `${prefix}${transaction.amount} ${transaction.asset}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "send":
        return "bg-red-600/20 text-red-400";
      case "receive":
        return "bg-green-600/20 text-green-400";
      case "nft":
        return "bg-purple-600/20 text-purple-400";
      default:
        return "bg-blue-600/20 text-blue-400";
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Action History</h1>
          <p className="text-slate-400">
            View all your wallet transactions and activities.
            {isDemoMode && " (Demo data shown)"}
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <History className="mr-2 h-5 w-5 text-purple-400" />
                Transaction History
              </CardTitle>
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardHeader>
          <CardContent>
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
                {filteredTransactions.map((tx) => {
                  const txType = getTransactionType(tx);
                  const Icon = getTransactionIcon(tx.assetType);
                  const typeColorClass = getTypeColor(txType);

                  return (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeColorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {tx.assetType === 'nft' ? 'NFT Transfer' :
                              txType === 'send' ? 'Sent Assets' : 'Received Assets'}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {txType === 'send' ? `To: ${tx.to}` : `From: ${tx.from}`} • {tx.timestamp}
                          </div>
                          <div className="text-slate-500 text-xs">
                            TX: {tx.txHash}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${getAmountColor(formatAmount(tx))}`}>
                          {formatAmount(tx)}
                        </div>
                        <div className={`text-sm capitalize ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-white">{transactionStats.total}</div>
                <div className="text-slate-400 text-sm">Total Transactions</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {transactionStats.confirmed}
                </div>
                <div className="text-slate-400 text-sm">Confirmed</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {transactionStats.pending}
                </div>
                <div className="text-slate-400 text-sm">Pending</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {transactionStats.failed}
                </div>
                <div className="text-slate-400 text-sm">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <SecondaryButton >
            Load More Transactions
          </SecondaryButton>
        </div>
      </div>
    </WalletLayout>
  );
};

export default ActionHistory;
