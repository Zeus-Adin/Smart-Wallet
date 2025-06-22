
import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { History } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import { useBlockchainService } from "@/hooks/useBlockchainService";
import SecondaryButton from "@/components/ui/secondary-button";
import TransactionItem from "@/components/transaction/TransactionItem";

const limit = 20;

const ActionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedWallet } = useSelectedWallet();
  const { transactions, loadRecentData, hasMoreTxs, isLoading, isDemoMode } = useBlockchainService();

  const [offset, setOffset] = useState(0);
  const [stxUsd, setStxUsd] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(5);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (selectedWallet?.address) {
      console.log('Loading transaction data for:', selectedWallet.address);
      loadRecentData(selectedWallet.address, currentOffset, limit);
    }
  }, [selectedWallet?.address, loadRecentData, currentOffset]);

  useEffect(() => {
    fetchStxUsdPrice().then(setStxUsd);
  }, []);

  const loadMore = () => {
    const newOffset = offset + 20;
    setOffset(newOffset);
    fetchTransactions(newOffset);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    setDisplayCount(5);
    await fetchTransactions(0);
    setRefreshing(false);
  };

  const handleClearSearch = () => setSearchTerm("");

  // Unique types and actions for dropdowns
  const txTypes = useMemo(() => Array.from(new Set(transactions.map(tx => tx.assetType || "other"))), [transactions]);
  const txActions = useMemo(() => Array.from(new Set(transactions.map(tx => tx.action || "other"))), [transactions]);

  const filteredTransactions = useMemo(() =>
    transactions.filter(tx =>
      (filterType === "all" || tx.assetType === filterType) &&
      (filterAction === "all" || tx.action === filterAction) &&
      (tx.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from?.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [transactions, searchTerm, filterType, filterAction]
  );

  const visibleTransactions = filteredTransactions.slice(0, displayCount);

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

  const getAmountColor = (action: string) => {
    return action === 'sent' ? "text-red-400" : "text-green-400";
  };

  const getTransactionIcon = (action: string, assetType?: string) => {
    if (action === "sent") return Send;
    if (assetType === "nft") return Wallet;
    if (action === "receive") return Send;
    if (action === "pending") return Clock;
    if (action === "contract_call") return FileCode;
    if (action === "refresh") return RefreshCw;
    return History;
  };

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
              <div className="relative flex items-center gap-2">
                 {/* Active filters display */}
                {(filterType !== 'all' || filterAction !== 'all') && (
                  <div className="flex items-center gap-2 mr-2">
                    {filterType !== 'all' && (
                      <span className="flex items-center bg-slate-700 text-white rounded px-2 py-1 text-xs">
                        {filterType}
                        <button onClick={() => setFilterType('all')} className="ml-1 text-slate-400 hover:text-white focus:outline-none">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filterAction !== 'all' && (
                      <span className="flex items-center bg-slate-700 text-white rounded px-2 py-1 text-xs">
                        {getTxLabel({action: filterAction, assetType: undefined} as Transaction)}
                        <button onClick={() => setFilterAction('all')} className="ml-1 text-slate-400 hover:text-white focus:outline-none">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-96 max-w-lg bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-12"
                  style={{ paddingRight: searchTerm ? '2.5rem' : undefined }}
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none z-10"
                    aria-label="Clear search"
                    style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', height: '1.5rem', width: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <div className="relative ml-2 group">
                  <button type="button" className="flex items-center px-2 py-1 bg-slate-700/50 border border-slate-600 rounded hover:bg-slate-700 focus:outline-none" tabIndex={0}>
                    <Filter className="w-5 h-5 text-slate-400" />
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded shadow-lg z-20 p-4 hidden group-hover:block">
                    <div className="mb-2">
                      <label className="block text-xs text-slate-400 mb-1">Type</label>
                      <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-slate-700 text-white rounded p-1">
                        <option value="all">All</option>
                        {txTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Action</label>
                      <select value={filterAction} onChange={e => setFilterAction(e.target.value)} className="w-full bg-slate-700 text-white rounded p-1">
                        <option value="all">All</option>
                        {txActions.map(action => <option key={action} value={action}>{getTxLabel({action, assetType: undefined} as Transaction)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleRefresh} variant="secondary" className="ml-2 flex items-center justify-center min-w-[90px]" disabled={refreshing || isLoading}>
                  {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && transactions.length === 0 ? (
              <div className="flex flex-col gap-3 py-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48 mb-1" />
                        <Skeleton className="h-2 w-40" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleTransactions.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-400">No transactions found</div>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleTransactions.map((tx) => (
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
      </div>
    </WalletLayout>
  );
};

export default ActionHistory;
