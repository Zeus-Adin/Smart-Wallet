import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, Wallet, Download } from "lucide-react";
import QRCode from 'react-qr-code';
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useBlockchainServices } from "@/hooks/useBlockchainServices";
import { getClientConfig } from "@/utils/chain-config";
import { fetchStxUsdPrice } from "@/lib/stxPrice";
import PrimaryButton from "@/components/ui/primary-button";

const ReceiveAssets = () => {
  const { walletId } = useParams<{ walletId: `${string}.${string}` }>()
  const { depositSTX } = useBlockchainServices();
  const { toast } = useToast();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<{txid:string, network:string}|null>(null);
  const [copied, setCopied] = useState(false);
  const [stxUsd, setStxUsd] = useState<number | null>(null);

  useEffect(() => {
    fetchStxUsdPrice().then(setStxUsd);
  }, []);

  const copyToClipboard = () => {
    if (walletId) {
      navigator.clipboard.writeText(walletId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleDeposit = async () => {
    if (!walletId || !depositAmount) return;
    setIsDepositing(true);
    try {
      // Convert to micro-STX (blockchain decimals)
      const microStxAmount = (Number(depositAmount) * 1e6).toFixed(0);
      const result = await depositSTX({ to: walletId, amount: microStxAmount });
      setDepositSuccess(result);
      toast({
        title: "Deposit Successful",
        description: `Transaction ID: ${result.txid}`,
        variant: "default",
      });
    } catch (e) {
      toast({ title: "Deposit Failed", description: String(e), variant: "destructive" });
    } finally {
      setIsDepositing(false);
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
                <div className="text-black text-sm text-center flex items-center justify-center">
                  <QRCode value={walletId} size={150} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">Your Smart Wallet Address:</p>
                <div className="flex items-center space-x-2">
                  <Input
                    value={walletId || "Loading..."}
                    readOnly
                    className="bg-slate-700/50 border-slate-600 text-white text-center"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!walletId}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <PrimaryButton className="mx-auto w-1/3 flex items-center justify-center gap-2 text-base font-semibold" onClick={() => setShowDepositModal(true)} disabled={!walletId}>
                <Download className="w-4 h-4 mr-1" />
                Deposit
              </PrimaryButton>
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

        <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
          <DialogContent className="bg-slate-800/90 border text-white border-slate-700 shadow-xl">
            <DialogHeader>
              <DialogTitle>Deposit to Smart Wallet</DialogTitle>
            </DialogHeader>
            {depositSuccess ? (
              <div className="flex flex-col gap-4 items-center">
                <div className="text-green-400 font-bold text-lg">Deposit Successful!</div>
                <div className="text-white text-sm break-all">TxID: {depositSuccess.txid}</div>
                <a
                  href={getClientConfig(walletId).explorer(`txid/${depositSuccess.txid}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline mt-2"
                >
                  View on Explorer
                </a>
                <Button onClick={() => { setShowDepositModal(false); setDepositSuccess(null); setDepositAmount(""); }}>Close</Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  <label className="text-slate-300 text-sm">Asset</label>
                  <Input value="STX" readOnly className="bg-slate-700/50 border-slate-600 text-white" />
                  <label className="text-slate-300 text-sm">Amount</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    disabled={isDepositing}
                  />
                  {depositAmount && stxUsd && (
                    <div className="text-xs text-slate-400 mt-1">
                      ≈ ${(Number(depositAmount) * stxUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                    </div>
                  )}
                  <label className="text-slate-300 text-sm">To Wallet</label>
                  <div className="flex items-center space-x-2">
                    <Input value={walletId || "Loading..."} readOnly className="bg-slate-700/50 border-slate-600 text-white text-center" />
                    <Button onClick={copyToClipboard} className="bg-purple-600 hover:bg-purple-700" disabled={!walletId}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleDeposit} disabled={!depositAmount || isDepositing} className="bg-green-600 hover:bg-green-700 w-full">
                    {isDepositing ? "Depositing..." : `Deposit ${(Number(depositAmount)).toLocaleString(undefined, { maximumFractionDigits: 6 })} STX`}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </WalletLayout>
  );
};

export default ReceiveAssets;
