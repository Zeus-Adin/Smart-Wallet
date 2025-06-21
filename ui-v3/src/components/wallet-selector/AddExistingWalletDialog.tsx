import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GreenButton from "../ui/green-button";
import PrimaryButton from "../ui/primary-button";

interface AddExistingWalletDialogProps {
  onWalletAdded: (wallet: any) => void;
  isDemoMode: boolean;
}

const AddExistingWalletDialog = ({ onWalletAdded, isDemoMode }: AddExistingWalletDialogProps) => {
  const [open, setOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [walletData, setWalletData] = useState<any>(null);
  const { toast } = useToast();

  const handleVerifyContract = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a smart wallet address to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('idle');

    try {
      // Simulate contract verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock verification result
      const mockWalletData = {
        id: walletAddress,
        name: "Imported Smart Wallet",
        contractId: walletAddress,
        balance: "0.00 STX",
        usdValue: "$0.00",
        extensions: ["Multi-sig"],
        createdAt: new Date().toISOString().split('T')[0],
        isImported: true
      };

      setWalletData(mockWalletData);
      setVerificationStatus('success');

      toast({
        title: "Contract Verified",
        description: "Smart wallet contract verified successfully!",
      });
    } catch (error) {
      setVerificationStatus('error');
      toast({
        title: "Verification Failed",
        description: "Could not verify the smart wallet contract. Please check the address.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddWallet = () => {
    if (walletData && verificationStatus === 'success') {
      onWalletAdded(walletData);
      setOpen(false);
      setWalletAddress("");
      setWalletData(null);
      setVerificationStatus('idle');

      toast({
        title: "Wallet Added",
        description: "Smart wallet has been added to your list successfully!",
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setWalletAddress("");
    setWalletData(null);
    setVerificationStatus('idle');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50"
          disabled={isDemoMode}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Existing Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Add Existing Smart Wallet</DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter the address of an existing smart wallet contract to add it to your list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-white">
              Smart Wallet Address
            </Label>
            <Input
              id="address"
              placeholder="SP1ABC...XYZ123.smart-wallet-v1"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {verificationStatus !== 'idle' && (
            <div className={`flex items-center space-x-2 p-3 rounded-md ${verificationStatus === 'success'
              ? 'bg-green-900/20 border border-green-700'
              : 'bg-red-900/20 border border-red-700'
              }`}>
              {verificationStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <div className="text-sm">
                {verificationStatus === 'success'
                  ? 'Smart wallet contract verified successfully!'
                  : 'Failed to verify smart wallet contract.'
                }
              </div>
            </div>
          )}

          {walletData && verificationStatus === 'success' && (
            <div className="bg-slate-700/50 p-3 rounded-md space-y-2">
              <div className="text-sm font-medium">Wallet Details:</div>
              <div className="text-sm text-slate-300">
                <div>Name: {walletData.name}</div>
                <div>Contract: {walletData.contractId}</div>
                <div>Extensions: {walletData.extensions.join(', ')}</div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Cancel
          </Button>

          {verificationStatus !== 'success' ? (
            <PrimaryButton
              type="button"
              onClick={handleVerifyContract}
              disabled={isVerifying || !walletAddress.trim()}
            >
              {isVerifying ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Verify Contract
                </>
              )}
            </PrimaryButton>
          ) : (
            <GreenButton
              type="button"
              onClick={handleAddWallet}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Wallet
            </GreenButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExistingWalletDialog;
