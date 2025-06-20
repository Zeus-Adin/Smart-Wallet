
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SecondaryButton from "../ui/secondary-button";
import CSWCard from "@/components/ui/csw-card";

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

  // Default mock activities if none provided
  const defaultActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'receive',
      asset: 'STX',
      amount: '+500.00',
      timestamp: '2 hours ago',
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'send',
      asset: 'STX',
      amount: '-100.50',
      timestamp: '1 day ago',
      status: 'confirmed'
    },
    {
      id: '3',
      type: 'stacking',
      asset: 'STX',
      amount: '+25.00',
      timestamp: '3 days ago',
      status: 'confirmed'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  const getActivityIcon = (type: string) => {
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

  return (
    <CSWCard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-medium text-white flex items-center">
          <Activity className="mr-2 h-5 w-5 text-purple-400" />
          Recent Activity
        </CardTitle>
        <SecondaryButton asChild size="sm" >
          <Link to={`/history/${walletId}`}>
            View All
          </Link>
        </SecondaryButton>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const activityColor = getActivityColor(activity.type);
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
                      {activity.type} {activity.asset}
                    </div>
                    <div className="text-slate-400 text-sm">{activity.timestamp}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${activityColor}`}>
                    {activity.amount} {activity.asset}
                  </div>
                  <div className={`text-sm capitalize ${statusColor}`}>
                    {activity.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </CSWCard>
  );
};

export default RecentActivity;
