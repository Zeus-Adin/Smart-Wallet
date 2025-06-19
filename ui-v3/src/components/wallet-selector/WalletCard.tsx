
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Settings } from "lucide-react";

interface SmartWallet {
  id: string;
  name: string;
  balance: string;
  extensions: string[];
  createdAt: string;
}

interface WalletCardProps {
  wallet: SmartWallet;
  isDemoMode: boolean;
}

const WalletCard = ({ wallet, isDemoMode }: WalletCardProps) => {
  // Use "demo" as the wallet ID for demo wallets to enable special routing
  const walletId = isDemoMode ? "demo" : wallet.id;
  
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-600/50 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-purple-400" />
            {wallet.name}
            {isDemoMode && (
              <span className="ml-2 px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
                Demo
              </span>
            )}
          </CardTitle>
          {!isDemoMode && (
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              asChild
            >
              <Link to={`/wallet-details/${wallet.id}`}>
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-slate-400 text-sm">Contract ID</div>
          <div className="text-white font-mono text-sm">{wallet.id.slice(0, 20)}...</div>
        </div>
        
        <div>
          <div className="text-slate-400 text-sm">Balance</div>
          <div className="text-white font-semibold">{wallet.balance}</div>
        </div>

        <div>
          <div className="text-slate-400 text-sm">Extensions</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {wallet.extensions.map((extension, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded"
              >
                {extension}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Link to={`/dashboard/${walletId}`}>
              {isDemoMode ? "Explore Demo" : "Open Wallet"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
