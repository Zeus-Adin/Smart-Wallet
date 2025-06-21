
import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, Wallet } from "lucide-react";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";

const ReceiveAssets = () => {
  const { selectedWallet } = useSelectedWallet();

  const copyToClipboard = () => {
    if (selectedWallet?.address) {
      navigator.clipboard.writeText(selectedWallet.address);
    }
  };

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Receive Assets</h1>
          <p className="text-slate-400">Share your wallet address to receive STX and other assets.</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ArrowDown className="mr-2 h-5 w-5 text-green-400" />
              Your Wallet Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              {/* QR Code Placeholder */}
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                <div className="text-black text-sm text-center">
                  QR Code<br />
                  {selectedWallet?.address?.substring(0, 8)}...
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">Your Smart Wallet Address:</p>
                <div className="flex items-center space-x-2">
                  <Input
                    value={selectedWallet?.address || "Loading..."}
                    readOnly
                    className="bg-slate-700/50 border-slate-600 text-white text-center"
                  />
                  <Button 
                    onClick={copyToClipboard} 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!selectedWallet?.address}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Supported Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <div className="text-white font-medium">Stacks (STX)</div>
                  <div className="text-slate-400 text-sm">Native Stacks token</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <div>
                  <div className="text-white font-medium">Bitcoin (BTC)</div>
                  <div className="text-slate-400 text-sm">Wrapped Bitcoin</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <div>
                  <div className="text-white font-medium">USDC</div>
                  <div className="text-slate-400 text-sm">USD Coin</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <div>
                  <div className="text-white font-medium">NFTs</div>
                  <div className="text-slate-400 text-sm">Non-fungible tokens</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Wallet className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-blue-300 font-medium">Security Notice</h3>
                <p className="text-blue-200 text-sm">
                  Only share your wallet address with trusted sources. Never share your private keys or seed phrase.
                  This address can be used to send assets to your smart wallet securely.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WalletLayout>
  );
};

export default ReceiveAssets;
