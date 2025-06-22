
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBlockchainService } from "@/hooks/useBlockchainService";
import SecondaryButton from "../ui/secondary-button";
import CSWCard from "@/components/ui/csw-card";
import TransactionItem from "../transaction/TransactionItem";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";

interface ActivityItem {
  id: string;
  type: 'send' | 'receive' | 'stacking';
  asset: string;
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const RecentActivity = ({ activities = [] }: RecentActivityProps) => {
  const { walletId } = useParams();
  const { selectedWallet } = useSelectedWallet();
  const { loadRecentData, transactions, isLoading } = useBlockchainService();
  const [weeklyTransactionCount, setWeeklyTransactionCount] = useState(0);

const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stxUsd, setStxUsd] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (walletId) {
      loadRecentData(walletId);
    }
  }, [walletId, loadRecentData]);

  useEffect(() => {
    // Calculate transactions from the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyTransactions = transactions.filter(tx => {
      // Parse timestamp and check if it's within the last week
      const txDate = new Date();
      if (tx.timestamp.includes('hour') || tx.timestamp.includes('day')) {
        const num = parseInt(tx.timestamp);
        if (tx.timestamp.includes('hour')) {
          txDate.setHours(txDate.getHours() - num);
        } else if (tx.timestamp.includes('day')) {
          txDate.setDate(txDate.getDate() - num);
        }
      } else if (tx.timestamp.includes('week')) {
        const weeks = parseInt(tx.timestamp);
        txDate.setDate(txDate.getDate() - (weeks * 7));
      }
      
      return txDate >= oneWeekAgo;
    });

    setWeeklyTransactionCount(weeklyTransactions.length);
  }, [transactions]);

  // Use fetched transactions or fallback to provided activities
  const displayActivities = transactions.length > 0 ? transactions.slice(0, 3) : activities.slice(0, 3);

  return (
    <CSWCard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-medium text-white flex items-center">
          <Activity className="mr-2 h-5 w-5 text-purple-400" />
          Recent Activity
        </CardTitle>
        <SecondaryButton asChild size="sm">
          <Link to={`/history/${walletId}`}>
            View All
          </Link>
        </SecondaryButton>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <div className="space-y-3">
          {loading && activities.length === 0 ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32 mb-1" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            ))
          ) : (
            activities.slice(0, 5).map((activity) => {
              const Icon = getActivityIcon(activity.action);
              const activityColor = getActivityColor(activity.action);
              const statusColor = getStatusColor(activity.status);
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${activityColor}`} />
                    </div>
                    <div>
                      <div className="text-white font-medium capitalize">
                        {activity.action} {activity.asset}
                      </div>
                      <div className="text-slate-400 text-sm">{activity.timestamp}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${activityColor}`}>
                      {activity.action === 'sent' ? '-' : '+'}{formatAmount(activity.amount, 6)} {activity.asset}
                      {activity.asset === 'STX' && stxUsd && (
                        <span className="text-xs text-slate-400 ml-2">
                          (${((Number(activity.amount) / 1e6) * stxUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD)
                        </span>
                      )}
                    </div>
                    <div className={`text-sm capitalize ${statusColor}`}>
                      {activity.status}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Only show the button if there are more than 5 activities */}
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleRefresh} 
            variant="secondary"
            className="flex items-center justify-center min-w-[90px]"
            disabled={refreshing || loading}
          >
            {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </div>
      </CardContent>
    </CSWCard>
  );
};

export default RecentActivity;
