
import OptionButton from "@/components/ui/option-button";
import { Coins, Image } from "lucide-react";

interface AssetTypeSelectorProps {
  assetType: 'token' | 'nft';
  onAssetTypeChange: (type: 'token' | 'nft') => void;
}

const AssetTypeSelector = ({ assetType, onAssetTypeChange }: AssetTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Select Asset Type</h3>
      <div className="flex gap-3">
        <OptionButton
          isSelected={assetType === 'token'}
          onClick={() => onAssetTypeChange('token')}
          className="flex-1 h-12"
        >
          <Coins className="mr-2 h-5 w-5" />
          Token
        </OptionButton>
        
        <OptionButton
          isSelected={assetType === 'nft'}
          onClick={() => onAssetTypeChange('nft')}
          className="flex-1 h-12"
        >
          <Image className="mr-2 h-5 w-5" />
          NFT
        </OptionButton>
      </div>
    </div>
  );
};

export default AssetTypeSelector;
