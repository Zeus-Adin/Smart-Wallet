import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SecondaryButton from "@/components/ui/secondary-button"; // Add this import if not present
import { Badge } from "@/components/ui/badge";
import { Wallet, Settings, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import GreenButton from "@/components/ui/green-button";
import PrimaryButton from "@/components/ui/primary-button";

const WalletDetails = () => {
  const { walletId } = useParams();
  const [activeExtensions, setActiveExtensions] = useState([
    { id: "multisig", name: "Multi-Signature", status: "active" },
    { id: "timelock", name: "Time Lock", status: "active" }
  ]);

  const availableExtensions = [
    { id: "treasury", name: "Treasury Management", description: "Advanced treasury features" },
    { id: "governance", name: "Governance", description: "Voting and proposals" },
    { id: "recovery", name: "Social Recovery", description: "Recover through trusted contacts" },
    { id: "limit", name: "Spending Limits", description: "Set transaction limits" }
  ];

  const walletInfo = {
    name: "Personal Wallet",
    contractId: walletId || "SP1ABC...XYZ123.smart-wallet-v1",
    owner: "SP1ABC...XYZ123",
    balance: "1,234.56 STX",
    createdAt: "2024-01-15",
    version: "1.0.0"
  };

  const handleAddExtension = (extensionId: string) => {
    const extension = availableExtensions.find(ext => ext.id === extensionId);
    if (extension) {
      setActiveExtensions([...activeExtensions, {
        id: extension.id,
        name: extension.name,
        status: "active"
      }]);
    }
  };

  const handleRemoveExtension = (extensionId: string) => {
    setActiveExtensions(activeExtensions.filter(ext => ext.id !== extensionId));
  };

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet Details</h1>
          <p className="text-slate-400">Manage your smart wallet configuration and extensions.</p>
        </div>

        {/* Wallet Information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-purple-400" />
              {walletInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm">Contract ID</label>
                <div className="text-white font-mono text-sm bg-slate-700/50 p-2 rounded mt-1">
                  {walletInfo.contractId}
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Owner</label>
                <div className="text-white font-mono text-sm bg-slate-700/50 p-2 rounded mt-1">
                  {walletInfo.owner}
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Balance</label>
                <div className="text-white font-semibold bg-slate-700/50 p-2 rounded mt-1">
                  {walletInfo.balance}
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Created</label>
                <div className="text-white bg-slate-700/50 p-2 rounded mt-1">
                  {walletInfo.createdAt}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Extensions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="mr-2 h-5 w-5 text-purple-400" />
                Active Extensions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeExtensions.length === 0 ? (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">No extensions installed</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeExtensions.map((extension) => (
                    <div
                      key={extension.id}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white font-medium">{extension.name}</span>
                        <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                          {extension.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExtension(extension.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Extensions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Available Extensions</CardTitle>
              <p className="text-slate-400 text-sm">Add new functionality to your wallet</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableExtensions
                  .filter(ext => !activeExtensions.find(active => active.id === ext.id))
                  .map((extension) => (
                    <div
                      key={extension.id}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div>
                        <div className="text-white font-medium">{extension.name}</div>
                        <div className="text-slate-400 text-sm">{extension.description}</div>
                      </div>
                      <PrimaryButton
                        size="sm"
                        onClick={() => handleAddExtension(extension.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </PrimaryButton>
                    </div>
                  ))}
                {availableExtensions.filter(ext => !activeExtensions.find(active => active.id === ext.id)).length === 0 && (
                  <div className="text-center py-8">
                    <Plus className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400">All available extensions are installed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Wallet Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <GreenButton >
                Open Dashboard
              </GreenButton>
              <SecondaryButton>
                Export Configuration
              </SecondaryButton>
              <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                Transfer Ownership
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </WalletLayout>
  );
};

export default WalletDetails;
