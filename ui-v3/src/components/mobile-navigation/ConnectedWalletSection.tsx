
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { User, Wallet, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface ConnectedWalletSectionProps {
  currentWallet: {
    contractId: string;
  };
}

const ConnectedWalletSection = ({ currentWallet }: ConnectedWalletSectionProps) => {
  const { walletData } = useWalletConnection();
  
  const getConnectedWalletAddress = () => {
    if (walletData?.addresses?.stx && walletData.addresses.stx.length > 0) {
      const address = walletData.addresses.stx[0].address;
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return "Not Connected";
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Connected Wallet</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-white font-medium">{getConnectedWalletAddress()}</div>
        <div className="flex flex-col space-y-1">
          <DrawerClose asChild>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="justify-start text-slate-300 hover:bg-slate-600/60 hover:text-white"
            >
              <Link to="/wallet-selector">
                <Wallet className="mr-2 h-4 w-4" />
                Switch Wallet
              </Link>
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="justify-start text-slate-300 hover:bg-slate-600/60 hover:text-white"
            >
              <Link to={`/wallet-details/${currentWallet.contractId}`}>
                <Settings className="mr-2 h-4 w-4" />
                Wallet Settings
              </Link>
            </Button>
          </DrawerClose>
        </div>
      </div>
    </div>
  );
};

export default ConnectedWalletSection;
