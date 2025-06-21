import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useSendAssetsWizard } from "@/hooks/useSendAssetsWizard";
import { getStepTitle } from "@/utils/sendAssetsUtils";
import WizardStepRenderer from "@/components/send/WizardStepRenderer";

const SendAssets = () => {
   const {
      currentStep,
      amount,
      recipient,
      asset,
      assetType,
      tokenId,
      contractAddress,
      selectedWallet,
      recipients,
      isLoading,
      setCurrentStep,
      setAmount,
      setRecipient,
      setAsset,
      setTokenId,
      setContractAddress,
      handleAssetTypeChange,
      handleSendTransaction,
   } = useSendAssetsWizard();

   return (
      <WalletLayout>
         <div className="space-y-6">
            <div className="px-1">
               <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Send Assets
               </h1>
               <p className="text-slate-400 text-sm sm:text-base">
                  Transfer your tokens or NFTs to another wallet or smart
                  contract.
               </p>
               {selectedWallet && (
                  <p className="text-xs sm:text-sm text-purple-300 mt-2 break-all">
                     From: {selectedWallet.address}
                  </p>
               )}
            </div>

            <Card className="bg-slate-800/50 border-slate-700 mx-1 sm:mx-0">
               <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                     <Send className="mr-2 h-5 w-5 text-purple-400 flex-shrink-0" />
                     <span className="break-words">
                        {getStepTitle(currentStep, assetType)}
                     </span>
                  </CardTitle>
               </CardHeader>
               <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="overflow-hidden">
                     <WizardStepRenderer
                        currentStep={currentStep}
                        assetType={assetType}
                        asset={asset}
                        amount={amount}
                        tokenId={tokenId}
                        contractAddress={contractAddress}
                        recipient={recipient}
                        selectedWallet={selectedWallet}
                        recipients={recipients}
                        isLoading={isLoading}
                        onAssetTypeChange={handleAssetTypeChange}
                        onAssetChange={setAsset}
                        onAmountChange={setAmount}
                        onTokenIdChange={setTokenId}
                        onContractAddressChange={setContractAddress}
                        onRecipientChange={setRecipient}
                        onStepChange={setCurrentStep}
                        onSendTransaction={handleSendTransaction}
                     />
                  </div>
               </CardContent>
            </Card>
         </div>
      </WalletLayout>
   );
};

export default SendAssets;
