import WalletLayout from "@/components/WalletLayout";
import ExtensionSelector from "@/components/extensions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button"; // Add this import if not present
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContractType, getVerifiedContracts } from "@/data/walletTypes";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GenericActions = () => {
  const { walletId } = useParams<{ walletId: `${string}.${string}` }>()
  const [walletExtensions, setWalletExtensions] = useState<ContractType[]>([])
  const [extensionIndex, setExtensionIndex] = useState<number>(0)
  const [genericValues, setGenericValues] = useState<Record<string, string>>()

  const handleElementsValueChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGenericValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    async function init() {
      const verifiedContracts = await getVerifiedContracts(walletId)
      const extensions = verifiedContracts.filter((c) => c.ext && c.isDeployed)
      setWalletExtensions(extensions)
    }
    init()
  }, [])

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Extension</h1>
          <p className="text-slate-400">Execute actions from deployed extension contracts using your Smart Wallet.</p>
          {walletId && (
            <p className="text-sm text-purple-300 mt-2">
              Wallet: {walletId}
            </p>
          )}
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-purple-400" />
              {walletExtensions[extensionIndex]?.label ?? 'NA'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ExtensionSelector extensionInfo={walletExtensions?.[extensionIndex]} />
          </CardContent>
        </Card>

        {/* This will be updated later for extensoins */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Wallet Extensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">

              {walletExtensions.map((ext, i) => (
                <SecondaryButton key={i} onClick={() => setExtensionIndex(i)} className="h-auto p-4 text-left">
                  <div>
                    <div className="text-white font-medium">{ext.label}</div>
                    <div className="text-slate-400 text-sm">{ext.name}</div>
                  </div>
                </SecondaryButton>
              ))}

            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-700/50">
          <CardContent className="p-6">
            <div className="space-y-2">
              <h3 className="text-blue-300 font-medium">Action Guidelines</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Ensure parameters are properly formatted as JSON</li>
                <li>• Double-check recipient addresses before executing</li>
                <li>• Some actions may require additional confirmations</li>
                <li>• Transaction fees will apply for all actions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </WalletLayout>
  );
};

export default GenericActions;
