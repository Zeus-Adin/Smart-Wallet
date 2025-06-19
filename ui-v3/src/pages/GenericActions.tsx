import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";

const GenericActions = () => {
  const [actionType, setActionType] = useState("");
  const [parameters, setParameters] = useState("");
  const { selectedWallet } = useSelectedWallet();

  const handleExecuteAction = () => {
    if (!selectedWallet) return;
    
    console.log("Executing action:", {
      wallet: selectedWallet.address,
      actionType,
      parameters: JSON.parse(parameters || "{}")
    });
    // Here you would implement the actual action execution logic
  };

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Generic Actions</h1>
          <p className="text-slate-400">Execute custom actions with your smart wallet.</p>
          {selectedWallet && (
            <p className="text-sm text-purple-300 mt-2">
              Wallet: {selectedWallet.address}
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
              <Label htmlFor="action" className="text-slate-300">Action Type</Label>
              <Input
                id="action"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                placeholder="e.g., transfer, approve, delegate"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parameters" className="text-slate-300">Parameters (JSON)</Label>
              <Textarea
                id="parameters"
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                placeholder='{"recipient": "SP1ABC...", "amount": 100}'
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-24"
              />
            </div>

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!actionType || !parameters || !selectedWallet}
              onClick={handleExecuteAction}
            >
              Execute Action
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Pre-defined Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 border-slate-600 text-left">
                <div>
                  <div className="text-white font-medium">Approve Token</div>
                  <div className="text-slate-400 text-sm">Grant spending permission</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 border-slate-600 text-left">
                <div>
                  <div className="text-white font-medium">Delegate Voting</div>
                  <div className="text-slate-400 text-sm">Delegate governance power</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 border-slate-600 text-left">
                <div>
                  <div className="text-white font-medium">Update Metadata</div>
                  <div className="text-slate-400 text-sm">Change wallet metadata</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 border-slate-600 text-left">
                <div>
                  <div className="text-white font-medium">Batch Transfer</div>
                  <div className="text-slate-400 text-sm">Send to multiple recipients</div>
                </div>
              </Button>
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
