
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WalletSelectorHeaderProps {
  totalBalance: string;
  usdValue: string;
}

const WalletSelectorHeader = ({ totalBalance, usdValue }: WalletSelectorHeaderProps) => {
  return (
    <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">Smart Wallet</span>
          </Link>
          
          {/* Balance Card */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="px-4 py-2">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-slate-400">Total Balance</div>
                  <div className="text-lg font-bold text-white">{totalBalance}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">USD Value</div>
                  <div className="text-lg font-bold text-green-400">{usdValue}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </header>
  );
};

export default WalletSelectorHeader;
