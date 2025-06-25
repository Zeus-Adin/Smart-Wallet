
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StxBalance } from "@/services/accountBalanceService";
import { Coins, Icon, Image, TrendingUp } from "lucide-react";
import { NFTBalanceResponse } from "../send/NFTSelectionStep";
import { TokenBalanceInfo } from "../send/TokenSelectionStep";
import { formatNumber } from "@/utils/numbers";
import { TokenMarketData } from "@/hooks/useGetRates";

interface Asset {
  name: string;
  symbol: string;
  balance: string;
  usdValue: string;
  type: 'token' | 'nft';
}

const AssetOverview = ({ assets = [], stx, nfts, fts, stxRate, btcRate }: { assets: Asset[], stx: StxBalance, nfts: NFTBalanceResponse[], fts: TokenBalanceInfo[], stxRate: { [key: string]: TokenMarketData } | TokenMarketData, btcRate: { [key: string]: TokenMarketData } | TokenMarketData }) => {

  const getAssetIcon = (type: string) => {
    return type === 'nft' ? Image : Coins;
  };

  const NftIcon = getAssetIcon("nft")

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-medium text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
          Asset Overview
        </CardTitle>
        <div className="text-right">
          <div className="text-sm text-slate-400">Total Value</div>
          <div className="text-lg font-bold text-green-400">
            {/* ${totalUsdValue.toLocaleString()} */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
			<div className="space-y-3">
				<div
					className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
				>
					<div className="flex items-center space-x-3">
					<div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
						<NftIcon className="h-4 w-4 text-purple-400" />
					</div>
					<div>
						<div className="text-white font-medium">STX</div>
						<div className="text-slate-400 text-sm">{formatNumber(Number(stx.actual_balance), stx.decimals)} STX</div>

					</div>
					</div>
					<div className="text-right">
						<div className="text-white text-sm font-medium">${formatNumber(Number(stx.actual_balance) * Number(stxRate.current_price), 2)}</div>
					</div>
				</div>
			</div>

			{fts.map(ft => <div className="space-y-3">
				<div
					className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
				>
					<div className="flex items-center space-x-3">
					<div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
						<NftIcon className="h-4 w-4 text-purple-400" />
					</div>
					<div>
						<div className="text-white font-medium">{ft.symbol}</div>
						<div className="text-slate-400 text-sm">{formatNumber(Number(ft.actual_balance), ft.decimals)} {ft.symbol}</div>
					</div>
					</div>
					<div className="text-right">
						<div className="text-white text-sm font-medium">${formatNumber(Number(ft.actual_balance) * Number(btcRate.current_price), 2)}</div>
					</div>
				</div>
			</div>)}

			<div className="space-y-3">
				<div
					className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
				>
					<div className="flex items-center space-x-3">
					<div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
						<NftIcon className="h-4 w-4 text-purple-400" />
					</div>
					<div>
						<div className="text-white font-medium">NFTs</div>
						{/* <div className="text-slate-400 text-sm">Nft</div> */}
					</div>
					</div>
					<div className="text-right">
					<div className="text-white font-medium">{nfts.length}</div>
					{/* <div className="text-slate-400 text-sm">{asset.usdValue}</div> */}
					</div>
				</div>
			</div>
      </CardContent>
    </Card>
  );
};

export default AssetOverview;
