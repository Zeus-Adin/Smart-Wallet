
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";

interface SelectedWallet {
  balance: string;
}

interface TokenSelectionStepProps {
  asset: string;
  amount: string;
  selectedWallet: SelectedWallet | null;
  onAssetChange: (asset: string) => void;
  onAmountChange: (amount: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const TokenSelectionStep = ({ 
  asset, 
  amount, 
  selectedWallet, 
  onAssetChange, 
  onAmountChange, 
  onNext, 
  onBack 
}: TokenSelectionStepProps) => {
  const isValid = asset && amount;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Select Token & Amount</h3>
      
      <div className="space-y-2">
        <Label htmlFor="asset" className="text-slate-300">Select Token</Label>
        <Select value={asset} onValueChange={onAssetChange}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500">
            <SelectValue placeholder="Choose a token to send" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="stx" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Stacks (STX) - {selectedWallet?.balance || "0"} available
            </SelectItem>
            <SelectItem value="btc" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Bitcoin (BTC) - 0.05 available
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-slate-300">Amount</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-16 hover:bg-slate-600 hover:border-slate-500"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 hover:bg-slate-600"
            onClick={() => onAmountChange("1234.56")}
          >
            MAX
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <SecondaryButton 
          className="flex-1"
          onClick={onBack}
        >
          Back
        </SecondaryButton>
        <PrimaryButton 
          className="flex-1"
          disabled={!isValid}
          onClick={onNext}
        >
          Next
        </PrimaryButton>
      </div>
    </div>
  );
};

export default TokenSelectionStep;
