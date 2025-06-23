import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { useEffect, useState } from "react";
import { AccountBalanceService } from "@/services/accountBalanceService";
import { useParams } from "react-router-dom";

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

export type TokenBalanceInfo = {
   actual_balance: string;
   balance: string;
   decimals: number;
   description: string;
   image: string;
   name: string;
   properties: {
      decimals: number;
      external_url: string;
   };
   sender_address: string;
   sip: number;
   symbol: string;
   token: string;
   token_uri: string;
   tx_id: string;
};

const TokenSelectionStep = ({
   asset,
   amount,
   selectedWallet,
   onAssetChange,
   onAmountChange,
   onNext,
   onBack,
}: TokenSelectionStepProps) => {
   const isValid = asset && amount;

   const [FTBalance, setFTBalance] = useState<TokenBalanceInfo[]>([]);
   const [selectedFt, setSelectedFt] = useState<TokenBalanceInfo>();
   const { walletId } = useParams<{ walletId: string }>();

   useEffect(() => {
      async function fetchNFTBalance() {
         return await new AccountBalanceService().getFTBalance(walletId, 0);
      }

      (async () => {
         const balance = await fetchNFTBalance();
         console.log(balance);
         setFTBalance(balance);
      })();
   }, [walletId]);

   return (
      <div className="space-y-6">
         <h3 className="text-lg font-semibold text-white">
            Select Token & Amount
         </h3>

         <div className="space-y-2">
            <Label htmlFor="asset" className="text-slate-300">
               Select Token
            </Label>
            <Select
               value={asset}
               onValueChange={(value) => {
                  const ft = FTBalance.find((ft) => ft.symbol === value);

                  if (!ft) return;

                  setSelectedFt(ft);
                  onAssetChange(value);
               }}
               required
            >
               <SelectTrigger className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500">
                  <SelectValue placeholder="Choose a token to send" />
               </SelectTrigger>
               <SelectContent className="bg-slate-700 border-slate-600">
                  {FTBalance.map((ft) => (
                     <SelectItem
                        value={ft.symbol}
                        key={ft.symbol}
                        className="text-white hover:bg-slate-600 focus:bg-slate-600"
                     >
                        {ft.name} {`(${ft.symbol})`} -{" "}
                        {ft.actual_balance || "0"} available
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-300">
               Amount
            </Label>
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
                  onClick={() =>
                     onAmountChange(selectedFt?.actual_balance || "0")
                  }
               >
                  MAX
               </Button>
            </div>
         </div>

         <div className="flex gap-3">
            <SecondaryButton className="flex-1" onClick={onBack}>
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
