
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Image, TrendingUp } from "lucide-react";
import CSWCard from "@/components/ui/csw-card";

interface Asset {
  name: string;
  symbol: string;
  balance: string;
  usdValue: string;
  type: 'token' | 'nft';
}

interface AssetOverviewProps {
  assets?: Asset[];
}

const AssetOverview = ({ assets = [] }: AssetOverviewProps) => {
  // Default mock assets if none provided
  const defaultAssets: Asset[] = [
    {
      name: "Stacks",
      symbol: "STX",
      balance: "10,000.00",
      usdValue: "$20,000.00",
      type: "token"
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      balance: "0.5",
      usdValue: "$25,000.00",
      type: "token"
    },
    {
      name: "Cool NFTs",
      symbol: "NFT",
      balance: "3",
      usdValue: "$1,500.00",
      type: "nft"
    }
  ];

  const displayAssets = assets.length > 0 ? assets : defaultAssets;

  const getAssetIcon = (type: string) => {
    return type === 'nft' ? Image : Coins;
  };

  const totalUsdValue = displayAssets.reduce((total, asset) => {
    const value = parseFloat(asset.usdValue.replace(/[$,]/g, ''));
    return total + value;
  }, 0);

  return (
    <CSWCard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-medium text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
          Asset Overview
        </CardTitle>
        <div className="text-right">
          <div className="text-sm text-slate-400">Total Value</div>
          <div className="text-lg font-bold text-green-400">
            ${totalUsdValue.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAssets.map((asset, index) => {
            const Icon = getAssetIcon(asset.type);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{asset.name}</div>
                    <div className="text-slate-400 text-sm">{asset.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{asset.balance}</div>
                  <div className="text-slate-400 text-sm">{asset.usdValue}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </CSWCard>
  );
};

export default AssetOverview;
