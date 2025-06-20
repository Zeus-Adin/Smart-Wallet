
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Activity } from "lucide-react";

interface TransactionItemProps {
  transaction: {
    id: string;
    type: 'send' | 'receive' | 'stacking';
    asset: string;
    amount: string;
    timestamp: string;
    status: 'confirmed' | 'pending' | 'failed';
    from?: string;
    to?: string;
    txHash?: string;
  };
  showFullDetails?: boolean;
  selectedWalletAddress?: string;
}

const TransactionItem = ({ transaction, showFullDetails = false, selectedWalletAddress }: TransactionItemProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return ArrowUpRight;
      case 'receive':
        return ArrowDownLeft;
      case 'stacking':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'send':
        return 'text-red-400';
      case 'receive':
        return 'text-green-400';
      case 'stacking':
        return 'text-purple-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatAmount = () => {
    const isOutgoing = transaction.from === selectedWalletAddress;
    const prefix = isOutgoing ? '-' : '+';
    return `${prefix}${transaction.amount} ${transaction.asset}`;
  };

  const getAmountColor = () => {
    const amount = formatAmount();
    return amount.startsWith('+') ? 'text-green-400' : 'text-red-400';
  };

  const Icon = getTransactionIcon(transaction.type);
  const activityColor = getActivityColor(transaction.type);
  const statusColor = getStatusColor(transaction.status);

  return (
    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${activityColor}`} />
        </div>
        <div>
          <div className="text-white font-medium capitalize">
            {transaction.type} {transaction.asset}
          </div>
          <div className="text-slate-400 text-sm">{transaction.timestamp}</div>
          {showFullDetails && transaction.txHash && (
            <div className="text-slate-500 text-xs break-all">
              TX: {transaction.txHash}
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium ${showFullDetails ? getAmountColor() : activityColor}`}>
          {showFullDetails ? formatAmount() : `${transaction.amount} ${transaction.asset}`}
        </div>
        <div className={`text-sm capitalize ${statusColor}`}>
          {transaction.status}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
