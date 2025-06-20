
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
        {isLoading ? (
          <div className="text-slate-400 text-center py-4">Loading transactions...</div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
              <div className="text-sm text-slate-400">Last 7 Days</div>
              <div className="text-xl font-bold text-white">{weeklyTransactionCount} Transactions</div>
            </div>
            
            <div className="space-y-3">
              {displayActivities.map((activity) => (
                <TransactionItem 
                  key={activity.id} 
                  transaction={activity} 
                  selectedWalletAddress={selectedWallet?.address}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </CSWCard>
  );
};

export default RecentActivity;
