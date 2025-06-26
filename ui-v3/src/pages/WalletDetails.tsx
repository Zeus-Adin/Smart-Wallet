import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SecondaryButton from "@/components/ui/secondary-button"; // Add this import if not present
import { Badge } from "@/components/ui/badge";
import { Wallet, Settings, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { handleCCS } from "@/services/smartWalletContractService";
import { BlockchainService } from "@/services/blockchainService";
import GreenButton from "@/components/ui/green-button";
import PrimaryButton from "@/components/ui/primary-button";

type WalletInfo = {
  smart_contract?: {
    contract_id?: string;
    tx_sender?: string;
  };
  balance?: string | number;
  block_time_iso?: string;
};


const WalletDetails = () => {
   const { walletId } = useParams<{walletId:`${string}.${string}`}>()
  const [searchParams] = useSearchParams();

  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [owner, setOwner] = useState("");
  const [adminInput, setAdminInput] = useState("");
  const [txStatus, setTxStatus] = useState("");
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

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (!walletId) return;
      const info = await handleCCS(walletId, walletId, true);
      setWalletInfo(info);
      setOwner(info?.smart_contract?.tx_sender || "");
    };
    fetchWalletInfo();
  }, [walletId, searchParams]);

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

  // Placeholder for contract call to transfer ownership
  const handleTransferOwnership = async () => {
    setTxStatus("Transferring ownership...");
    // TODO: Replace with actual contract call
    const blockchainService = new BlockchainService();
    // Example: await blockchainService.callContractFunction({ ... })
    setTimeout(() => setTxStatus("Ownership transferred (mock)!"), 1500);
  };

  // Placeholder for contract call to add admin
  const handleAddAdmin = async () => {
    setTxStatus("Adding admin...");
    // TODO: Replace with actual contract call
    const blockchainService = new BlockchainService();
    // Example: await blockchainService.callContractFunction({ ... })
    setTimeout(() => setTxStatus(`Admin ${adminInput} added (mock)!`), 1500);
    setAdminInput("");
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
              {walletInfo?.smart_contract?.contract_id || walletId || "Smart Wallet"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm">Contract ID</label>
                <div className="text-white font-mono text-sm bg-slate-700/50 p-2 rounded mt-1">
                  {walletInfo?.smart_contract?.contract_id || walletId}
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Owner</label>
                <div className="text-white font-mono text-sm bg-slate-700/50 p-2 rounded mt-1">
                  {owner}
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Balance</label>
                <div className="text-white font-semibold bg-slate-700/50 p-2 rounded mt-1">
                  {/* TODO: Fetch and display real balance */}
                  {walletInfo?.balance || "-"}
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Created</label>
                <div className="text-white bg-slate-700/50 p-2 rounded mt-1">
                  {walletInfo?.block_time_iso || "-"}
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
            <div className="flex flex-wrap gap-4 items-center">
              <GreenButton asChild>
                <a href={`/dashboard/${walletId}`}>
                  Open Dashboard
                </a>
              </GreenButton>
              <SecondaryButton>
                Export Configuration
              </SecondaryButton>
              <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20" onClick={handleTransferOwnership}>
                Transfer Ownership
              </Button>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Admin principal..."
                  value={adminInput}
                  onChange={e => setAdminInput(e.target.value)}
                  className="bg-slate-700/50 text-white px-2 py-1 rounded border border-slate-600 focus:outline-none"
                />
                <Button variant="outline" onClick={handleAddAdmin} disabled={!adminInput}>
                  Add Admin
                </Button>
              </div>
              {txStatus && <span className="text-xs text-slate-400 ml-2">{txStatus}</span>}
            </div>
          </CardContent>
        </Card>
      </div>
    </WalletLayout>
  );
};

export default WalletDetails;
