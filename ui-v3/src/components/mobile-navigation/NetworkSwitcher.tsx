
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { Globe } from "lucide-react";

interface NetworkSwitcherProps {
  selectedNetwork: 'mainnet' | 'testnet';
  onNetworkSwitch?: (network: 'mainnet' | 'testnet') => void;
}

const NetworkSwitcher = ({ selectedNetwork, onNetworkSwitch }: NetworkSwitcherProps) => {
  const { disconnectWallet } = useWalletConnection();

  const handleNetworkSwitch = (network: 'mainnet' | 'testnet') => {
    if (onNetworkSwitch) {
      disconnectWallet();
      onNetworkSwitch(network);
      console.log(`Switched to ${network} and disconnected wallet`);
    }
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Network</span>
        </div>
      </div>
      <div className="space-y-1">
        <Button
          variant={selectedNetwork === 'mainnet' ? "secondary" : "ghost"}
          size="sm"
          className={`w-full justify-between ${
            selectedNetwork === 'mainnet' 
              ? "bg-slate-600 text-white" 
              : "text-slate-300 hover:bg-slate-600/60 hover:text-white"
          }`}
          onClick={() => handleNetworkSwitch('mainnet')}
        >
          <span>Mainnet</span>
          {selectedNetwork === 'mainnet' && (
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          )}
        </Button>
        <Button
          variant={selectedNetwork === 'testnet' ? "secondary" : "ghost"}
          size="sm"
          className={`w-full justify-between ${
            selectedNetwork === 'testnet' 
              ? "bg-slate-600 text-white" 
              : "text-slate-300 hover:bg-slate-600/60 hover:text-white"
          }`}
          onClick={() => handleNetworkSwitch('testnet')}
        >
          <span>Testnet</span>
          {selectedNetwork === 'testnet' && (
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NetworkSwitcher;
