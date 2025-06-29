import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button"; // Add this import if not present
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const GenericActions = () => {
  const { walletId } = useParams<{ walletId: `${string}.${string}` }>()
  const [action, setAction] = useState<"delegate" | "revoke">("delegate")
  const [amount, setAmount] = useState<number>(0)
  const [recipient, setRecipient] = useState<string>("")
  const [cycles, setCycles] = useState<number>(1)

  const handleExecuteAction = () => {

  };

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
              Custom Action
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="action" className="text-slate-300">Action</Label>
              <Select value={action} onValueChange={(e: "delegate" | "revoke") => setAction(e)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="delegate">Delegate</SelectItem>
                  <SelectItem value="revoke">Revoke</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action" className="text-slate-300">Amount</Label>
              <Input
                id="action"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder={`Enter ${action} amount`}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action" className="text-slate-300">Recipient</Label>
              <Input
                id="action"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={`e.g ${walletId}`}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action" className="text-slate-300">Cycles</Label>
              <Input
                id="action"
                min={1}
                value={cycles}
                onChange={(e) => setCycles(Number(e.target.value))}
                placeholder="e.g., transfer, approve, delegate"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <PrimaryButton
              className="w-full"
              disabled={!amount || !recipient || !walletId}
              onClick={handleExecuteAction}
            >
              Execute Action
            </PrimaryButton>
          </CardContent>
        </Card>

        {/* This will be updated later for extensoins */}
        <Card className="hidden bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Pre-defined Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <SecondaryButton disabled className="h-auto p-4 text-left">
                <div>
                  <div className="text-white font-medium">Approve Token</div>
                  <div className="text-slate-400 text-sm">Grant spending permission</div>
                </div>
              </SecondaryButton>

              <SecondaryButton disabled className="h-auto p-4 text-left">
                <div>
                  <div className="text-white font-medium">Delegate Voting</div>
                  <div className="text-slate-400 text-sm">Delegate governance power</div>
                </div>
              </SecondaryButton>

              <SecondaryButton disabled className="h-auto p-4 text-left">
                <div>
                  <div className="text-white font-medium">Update Metadata</div>
                  <div className="text-slate-400 text-sm">Change wallet metadata</div>
                </div>
              </SecondaryButton>

              <SecondaryButton disabled className="h-auto p-4 text-left">
                <div>
                  <div className="text-white font-medium">Batch Transfer</div>
                  <div className="text-slate-400 text-sm">Send to multiple recipients</div>
                </div>
              </SecondaryButton>
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
