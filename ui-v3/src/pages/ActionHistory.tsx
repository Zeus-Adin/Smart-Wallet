import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { History ,ArrowDownLeft, ArrowUpRight, TrendingUp, Loader2, ExternalLink, X, ArrowDownRight, Clock, FileCode, RefreshCw, Send, Wallet, ArrowDownLeft as IncomingArrow, Filter } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import SecondaryButton from "@/components/ui/secondary-button";
import { TxInfo, TransactionDataService } from "@/services/transactionDataService";
import { fetchStxUsdPrice } from "@/lib/stxPrice";
import { Skeleton } from "@/components/ui/skeleton";
import{ formatAddressField, formatAmount } from "@/lib/txFormatUtils"
import { useParams } from "react-router-dom";
import { getClientConfig } from "@/utils/chain-config"


const transactionService = new TransactionDataService();

const ActionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedWallet } = useSelectedWallet();
  const [transactions, setTransactions] = useState<TxInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  const [refreshing, setRefreshing] = useState(false);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [stxUsd, setStxUsd] = useState<number | null>(null);

  const { walletId } = useParams<{walletId:`${string}.${string}`}>();
  const fetchTransactions = useCallback((currentOffset: number = 0) => {
    if (!walletId && !selectedWallet?.address) return;
    setIsLoading(true);
    transactionService.handleGetSwTx(
      walletId ? walletId : selectedWallet?.address,
      currentOffset,
      (cb) => {
        if (currentOffset === 0) {
          setTransactions(cb([]));
          setHasMore(cb([]).length === 20);
        } else {
          setTransactions(prev => {
            const newTxs = cb(prev).filter(tx => !prev.some(existing => existing.tx === tx.tx));
            setHasMore(newTxs.length === 20);
            return [...prev, ...newTxs];
          });
        }
        setIsLoading(false);
        return [];
      }
    );
  }, [selectedWallet, walletId]);

  useEffect(() => {
    setOffset(0);
    fetchTransactions(0);
  }, [fetchTransactions]);

  useEffect(() => {
    fetchStxUsdPrice().then(setStxUsd);
  }, []);

  // const loadMore = () => {
  //   const newOffset = offset + 20;
  //   setOffset(newOffset);
  //   fetchTransactions(newOffset);
  // };

  const handleRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    setDisplayCount(5);
    fetchTransactions(0);
    setRefreshing(false);
  };

  const handleClearSearch = () => setSearchTerm("");

  const filteredTransactions = useMemo(() =>
    transactions.filter(tx =>
      (filterAction === "all" || tx.action === filterAction) &&
      (tx.assets[0]?.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.tx?.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [transactions, searchTerm, filterAction]
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
    if (action === "contract_call" || action === "smart_contract") return FileCode;
    if (action === "refresh") return RefreshCw;
    return History;
  };

  const config = getClientConfig(walletId ? walletId : selectedWallet?.address);

  const transactionStats = useMemo(() => ({
    total: transactions.length,
    confirmed: transactions.filter(tx => tx.tx_status === 'confirmed').length,
    pending: transactions.filter(tx => tx.tx_status === 'pending').length,
    failed: transactions.filter(tx => tx.tx_status === 'failed').length
  }), [transactions]);

  const txActions = useMemo(() =>
    Array.from(new Set(transactions.map(tx => tx.action)))
  , [transactions]);


  // Helper to get a user-friendly label for each transaction type/action
  const getTxLabel = (tx: TxInfo) => {
    if (tx.action === 'sent') return 'Send';
    if (tx.action === 'receive') return 'Receive';
    if (tx.action === 'contract_call') return 'Contract Call';
    if (tx.action === 'contract_deploy') return 'Contract Deploy';
    if (tx.action?.toLowerCase().includes('airdrop')) return 'Airdrop';
    if (tx.action?.toLowerCase().includes('send-many')) return 'Send-Many';
    if (tx.action?.toLowerCase().includes('mint')) return 'Mint';
    if (tx.action?.toLowerCase().includes('transfer')) return 'Token Transfer';
    return tx.action?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Other';
  };

  const assetDecimals = (symbol: string) => {
    if (symbol === 'STX') return 6;
    if (symbol === 'SBTC') return 8;
    return 6;
  };

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Action History</h1>
          <p className="text-slate-400">
            View all your wallet transactions and activities.
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <History className="mr-2 h-5 w-5 text-purple-400" />
                Transaction History
              </CardTitle>
              <div className="relative flex items-center gap-2">
                 {/* Active filters display */}
                {(filterAction !== 'all') && (
                  <div className="flex items-center gap-2 mr-2">
                    {filterAction !== 'all' && (
                      <span className="flex items-center bg-slate-700 text-white rounded px-2 py-1 text-xs">
                        {getTxLabel({action: filterAction, assets: [], sender: '', stamp: '', time: '', tx: '', tx_status: ''} as TxInfo)}
                        <button onClick={() => setFilterAction('all')} className="ml-1 text-slate-400 hover:text-white focus:outline-none">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
                <div className="relative">
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
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none z-10"
                      aria-label="Clear search"
                      style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', height: '1.5rem', width: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="relative ml-2">
                  <button
                    type="button"
                    className="flex items-center px-2 py-1 bg-slate-700/50 border border-slate-600 rounded hover:bg-slate-700 focus:outline-none"
                    tabIndex={0}
                    onClick={() => setShowFilter((prev) => !prev)}
                  >
                    <Filter className="w-5 h-5 text-slate-400" />
                  </button>
                  {showFilter && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded shadow-lg z-20 p-4"
                      onMouseLeave={() => setShowFilter(false)}
                      onMouseEnter={() => setShowFilter(true)}
                    >
                      <div className="mb-2">
                        <label className="block text-xs text-slate-400 mb-1">Action</label>
                        <select value={filterAction} onChange={e => setFilterAction(e.target.value)} className="w-full bg-slate-700 text-white rounded p-1 focus:ring-2 focus:ring-purple-400">
                          <option value="all">All</option>
                          {txActions.map(action => (
                            <option key={action} value={action}>{getTxLabel({action, assets: [], sender: '', stamp: '', time: '', tx: '', tx_status: ''} as TxInfo)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                <Button onClick={handleRefresh} variant="secondary" className="ml-2 flex items-center justify-center min-w-[90px]" disabled={refreshing || isLoading}>
                  {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-20">
            <div
              style={{ maxHeight: '420px', overflowY: 'auto' }}
              className="custom-scrollbar"
            >
              {isLoading && transactions.length === 0 ? (
                <div className="flex flex-col gap-3 max-h-auto py-8">
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
                  {visibleTransactions.map((tx) => {
                    const Icon = getTransactionIcon(tx.action);
                    const amountPrefix = tx.action === 'sent' ? '-' : '+';
                    const asset = tx.assets[0]?.symbol || 'STX';
                    const amount = tx.assets[0]?.amount || '0';
                    const isSmartContractCall = tx.action === 'contract_call' || tx.action === 'smart_contract';
                    const isContractDeploy = tx.action === 'contract_deploy';
                    const hideAmount = (isSmartContractCall && (!amount || amount === '0'));
                    return (
                      <div key={tx.tx} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAmountColor(tx.action)} bg-slate-600/20`}>
                            <Icon className={`h-5 w-5 ${tx.action === 'receive' ? 'text-green-400 rotate-180' : ''}`} />
                          </div>
                          <div>
                            <div className="text-white font-medium capitalize">
                              {getTxLabel(tx)}{!(isSmartContractCall || isContractDeploy) ? ` ${asset}` : ''}
                            </div>
                            <div className="text-slate-400 text-sm whitespace-pre-line">
                              {tx.action === 'sent'
                                ? `To: ${tx.sender}`
                                : `From: ${tx.sender}`}
                              {' • '}{tx.stamp}
                            </div>
                            <div className="text-slate-500 text-xs flex items-center gap-2">
                              TX: {tx.tx}
                              <a
                                href={`${config.explorer(`txid/${tx.tx}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-slate-400 hover:text-white">
                               <ExternalLink
                                  className="w-4 h-4 text-slate-400 hover:text-white"/>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {!hideAmount && (
                            <div className={`font-medium ${getAmountColor(tx.action)}`}>
                              {amountPrefix}{formatAmount(amount, assetDecimals(asset))} {asset}
                              {asset === 'STX' && stxUsd && (
                                <span className="text-xs text-slate-400 ml-2">
                                  (${((Number(amount) / 1e6) * stxUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD)
                                </span>
                              )}
                            </div>
                          )}
                          <div className={`text-sm capitalize ${getStatusColor(tx.tx_status)}`}>
                            {tx.tx_status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <style>{`
              
            `}</style>
            <div className="absolute bottom-6 right-6 z-20">
              <SecondaryButton
                onClick={() => setDisplayCount(displayCount + 5)}
                disabled={isLoading || displayCount >= filteredTransactions.length }
                className="min-w-[180px]"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {displayCount >= filteredTransactions.length ? 'All Transactions Loaded' : 'Load More Transactions'}
              </SecondaryButton>
            </div>
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
      </div>
    </WalletLayout>
  );
};

export default ActionHistory;
