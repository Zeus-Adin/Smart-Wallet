
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NFTSelectionStepProps {
  asset: string;
  tokenId: string;
  contractAddress: string;
  onAssetChange: (asset: string) => void;
  onTokenIdChange: (tokenId: string) => void;
  onContractAddressChange: (contractAddress: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const NFTSelectionStep = ({ 
  asset, 
  tokenId, 
  contractAddress, 
  onAssetChange, 
  onTokenIdChange, 
  onContractAddressChange, 
  onNext, 
  onBack 
}: NFTSelectionStepProps) => {
  const isValid = asset && tokenId && contractAddress;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Select NFT Details</h3>
      
      <div className="space-y-2">
        <Label htmlFor="nftAsset" className="text-slate-300">Select NFT</Label>
        <Select value={asset} onValueChange={onAssetChange}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500">
            <SelectValue placeholder="Choose an NFT to send" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="cool-nft-123" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Cool NFT #123
            </SelectItem>
            <SelectItem value="rare-collectible-456" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Rare Collectible #456
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tokenId" className="text-slate-300">Token ID</Label>
          <Input
            id="tokenId"
            value={tokenId}
            onChange={(e) => onTokenIdChange(e.target.value)}
            placeholder="123"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 hover:bg-slate-600 hover:border-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractAddress" className="text-slate-300">Contract Address</Label>
          <Input
            id="contractAddress"
            value={contractAddress}
            onChange={(e) => onContractAddressChange(e.target.value)}
            placeholder="SP1ABC...XYZ123.nft-contract"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 hover:bg-slate-600 hover:border-slate-500"
          />
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

export default NFTSelectionStep;
