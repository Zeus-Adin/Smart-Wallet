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
import { useAccountBalanceService } from "@/hooks/useAccountBalanceService";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";

const ReceiveAssets = () => {
  const { selectedWallet } = useSelectedWallet();
  const { walletId } = useParams<{ walletId: `${string}.${string}` }>()
  const { depositSTX } = useBlockchainServices();
  const { toast } = useToast();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<{txid:string, network:string}|null>(null);
  const [copied, setCopied] = useState(false);
  const [stxUsd, setStxUsd] = useState<number | null>(null);
  const userWalletAddress = selectedWallet?.address || "";
  const { stxBalance, loading: balanceLoading, error: balanceError, ftBalance } = useAccountBalanceService(userWalletAddress);
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<'STX' | string>('STX');

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

  // Helper to get available balance for selected asset
  const getAvailableBalance = () => {
    if (selectedAsset === 'STX') {
      return stxBalance?.balance ? Number(stxBalance.balance) / 1e6 : 0;
    }
    const ft = ftBalance?.find(ft => ft.symbol === selectedAsset);
    return ft ? Number(ft.balance) / Math.pow(10, ft.decimals || 6) : 0;
  };
  const available = getAvailableBalance();

  // Handler for Max button
  const handleMax = () => {
    if (available > 0) {
      setDepositAmount(available.toFixed(6));
      setShowMaxWarning(true);
    }
  };

  // Handler for input change (prevent exceeding balance)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val || isNaN(Number(val))) {
      setDepositAmount(val);
      return;
    }
    if (Number(val) > available) {
      setDepositAmount(available.toFixed(6));
    } else {
      setDepositAmount(val);
    }
    setShowMaxWarning(false);
  };

  console.log("ftBalance:", ftBalance);
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
                  <select
                    value={selectedAsset}
                    onChange={e => {
                      setSelectedAsset(e.target.value);
                      setDepositAmount("");
                      setShowMaxWarning(false);
                    }}
                    className="bg-slate-700/50 border-slate-600 text-white rounded p-2"
                    disabled={isDepositing || balanceLoading}
                  >
                    <option value="STX">STX (Available: {stxBalance?.balance ? (Number(stxBalance.balance) / 1e6).toLocaleString(undefined, { maximumFractionDigits: 6 }) : 0})</option>
                    {ftBalance && ftBalance.map(ft => (
                      <option key={ft.symbol} value={ft.symbol}>
                        {ft.symbol} (Available: {Number(ft.balance) / Math.pow(10, ft.decimals || 6)})
                      </option>
                    ))}
                  </select>
                  <label className="text-slate-300 text-sm flex items-center justify-between">
                    Amount
                    <Button
                      type="button"
                      size="sm"
                      className="ml-2 bg-slate-600 hover:bg-slate-700 text-xs px-2 py-1"
                      onClick={handleMax}
                      disabled={balanceLoading || available === 0}
                    >
                      Max
                    </Button>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder={balanceLoading ? "Loading..." : `Max: ${available.toFixed(6)}`}
                    value={depositAmount}
                    onChange={handleAmountChange}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    disabled={isDepositing || balanceLoading}
                  />
                  {showMaxWarning && (
                    <div className="text-xs text-yellow-400 mt-1">Warning: You are about to deposit your entire {selectedAsset} balance.</div>
                  )}
                  {depositAmount && stxUsd && selectedAsset === 'STX' && (
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
                  {balanceError && (
                    <div className="text-xs text-red-400 mt-1">Error loading balance.</div>
                  )}
                  <div className="text-xs text-slate-400 mt-1">Available: {balanceLoading ? "Loading..." : `${available.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${selectedAsset}`}</div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleDeposit}
                    disabled={!depositAmount || isDepositing || Number(depositAmount) > available || Number(depositAmount) <= 0 || balanceLoading}
                    className="bg-green-600 hover:bg-green-700 w-full"
                  >
                    {isDepositing ? `Depositing...` : `Deposit ${(Number(depositAmount)).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${selectedAsset}`}
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
