import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SecondaryButton from "@/components/ui/secondary-button"; // Add this import if not present
import { Badge } from "@/components/ui/badge";
import { Wallet, Settings, Plus, Trash2, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { handleCCS } from "@/services/smartWalletContractService";
import { useBlockchainService } from "@/hooks/useBlockchainService";
import GreenButton from "@/components/ui/green-button";
import PrimaryButton from "@/components/ui/primary-button";
import { useAccountBalanceService } from "@/hooks/useAccountBalanceService";
import { formatNumber } from "@/utils/numbers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type WalletInfo = {
  smart_contract?: {
    contract_id?: string;
    tx_sender?: string;
  };
  owner?: string;
  balance?: string | number;
  block_time_iso?: string;
};

const WalletDetails = () => {
  const { walletId } = useParams<{ walletId: `${string}.${string}` }>();
  const [searchParams] = useSearchParams();
  const { addAdmin, transferOwnership } = useBlockchainService();
  const { toast } = useToast();

  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [owner, setOwner] = useState("");
  const [adminInput, setAdminInput] = useState("");
  const [newOwnerInput, setNewOwnerInput] = useState("");
  const [activeExtensions, setActiveExtensions] = useState([
    { id: "multisig", name: "Multi-Signature", status: "active" },
    { id: "timelock", name: "Time Lock", status: "active" },
  ]);
  const [copiedField, setCopiedField] = useState<"contractId" | "owner" | null>(
    null
  );
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [transactionType, setTransactionType] = useState<
    "addAdmin" | "transferOwnership" | null
  >(null);

  const availableExtensions = [
    {
      id: "treasury",
      name: "Treasury Management",
      description: "Advanced treasury features",
    },
    {
      id: "governance",
      name: "Governance",
      description: "Voting and proposals",
    },
    {
      id: "recovery",
      name: "Social Recovery",
      description: "Recover through trusted contacts",
    },
    {
      id: "limit",
      name: "Spending Limits",
      description: "Set transaction limits",
    },
  ];

  // Get contract owner principal (address before the first dot)
  const contractOwner = walletId ? walletId.split(".")[0] : "";
  const { stxBalance } = useAccountBalanceService(walletId);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (!walletId) return;
      const info = await handleCCS(walletId, walletId, true);
      setWalletInfo({
        ...info,
        smart_contract: info.smart_contract,
        owner: contractOwner,
        balance: stxBalance.actual_balance ?? "-",
        block_time_iso: info.block_time_iso,
      });
      setOwner(contractOwner);
    };
    fetchWalletInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletId, searchParams, stxBalance]);

  const handleAddExtension = (extensionId: string) => {
    const extension = availableExtensions.find((ext) => ext.id === extensionId);
    if (extension) {
      setActiveExtensions([
        ...activeExtensions,
        {
          id: extension.id,
          name: extension.name,
          status: "active",
        },
      ]);
    }
  };

  const handleRemoveExtension = (extensionId: string) => {
    setActiveExtensions(
      activeExtensions.filter((ext) => ext.id !== extensionId)
    );
  };

  const handleTransaction = async () => {
    setIsSigning(true);
    if (transactionType === "addAdmin") {
      if (!walletId || !adminInput) {
        setIsSigning(false);
        return;
      }

      try {
        const result = await addAdmin({
          contractAddress: walletId,
          adminAddress: adminInput,
        });
        if (result) {
          toast({
            title: "Admin Added",
            description: `Successfully added admin: ${adminInput}`,
            variant: "default",
          });
        }
        setIsSigning(false);
        setShowAdminModal(false);
        setAdminInput("");
      } catch (error) {
        setIsSigning(false);
      }
    } else if (transactionType === "transferOwnership") {
      if (!walletId || !newOwnerInput) {
        setIsSigning(false);
        return;
      }
      try {
        const result = await transferOwnership({
          contractAddress: walletId,
          newOwnerAddress: newOwnerInput,
        });
        if (result) {
          toast({
            title: "Ownership Transferred",
            description: `Ownership transferred to: ${newOwnerInput}`,
            variant: "default",
          });
        }
        setIsSigning(false);
        setShowTransferModal(false);
        setNewOwnerInput("");
      } catch (error) {
        setIsSigning(false);
      }
    }
  };

  const handleCopy = (value: string, field: "contractId" | "owner") => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet Details</h1>
          <p className="text-slate-400">
            Manage your smart wallet configuration and extensions.
          </p>
        </div>

        {/* Wallet Information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-purple-400" />
              {
                /* {walletInfo?.smart_contract?.contract_id || walletId || */
                "Personal Smart Wallet"
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm">Contract ID</label>
                <div className="flex items-center">
                  <div className="text-white font-mono text-sm bg-slate-700/50 p-2 rounded mt-1 flex-1">
                    {walletInfo?.smart_contract?.contract_id || walletId}
                  </div>
                  <button
                    className="ml-2 p-1 rounded hover:bg-slate-600 transition-colors"
                    onClick={() =>
                      handleCopy(
                        walletInfo?.smart_contract?.contract_id ||
                        walletId ||
                        "",
                        "contractId"
                      )
                    }
                    aria-label="Copy Contract ID"
                  >
                    {copiedField === "contractId" ? (
                      <Check
                        className="text-green-400 animate-pulse"
                        size={18}
                      />
                    ) : (
                      <Copy className="text-slate-400" size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Owner</label>
                <div className="flex items-center">
                  <div className="text-white font-mono text-sm bg-slate-700/50 p-2 rounded mt-1 flex-1">
                    {walletInfo?.owner || owner}
                  </div>
                  <button
                    className="ml-2 p-1 rounded hover:bg-slate-600 transition-colors"
                    onClick={() =>
                      handleCopy(walletInfo?.owner || owner || "", "owner")
                    }
                    aria-label="Copy Owner"
                  >
                    {copiedField === "owner" ? (
                      <Check
                        className="text-green-400 animate-pulse"
                        size={18}
                      />
                    ) : (
                      <Copy className="text-slate-400" size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Balance</label>
                <div className="text-white font-semibold bg-slate-700/50 p-2 rounded mt-1">
                  {walletInfo && walletInfo.balance !== undefined
                    ? `${formatNumber(Number(walletInfo.balance), 2)} STX`
                    : "-"}
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm">Created</label>
                <div className="text-white bg-slate-700/50 p-2 rounded mt-1">
                  {walletInfo?.block_time_iso
                    ? new Date(walletInfo.block_time_iso).toLocaleString()
                    : "-"}
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
                        <span className="text-white font-medium">
                          {extension.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-green-600/20 text-green-300"
                        >
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
              <p className="text-slate-400 text-sm">
                Add new functionality to your wallet
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableExtensions
                  .filter(
                    (ext) =>
                      !activeExtensions.find((active) => active.id === ext.id)
                  )
                  .map((extension) => (
                    <div
                      key={extension.id}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div>
                        <div className="text-white font-medium">
                          {extension.name}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {extension.description}
                        </div>
                      </div>
                      <PrimaryButton
                        size="sm"
                        onClick={() => handleAddExtension(extension.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </PrimaryButton>
                    </div>
                  ))}
                {availableExtensions.filter(
                  (ext) =>
                    !activeExtensions.find((active) => active.id === ext.id)
                ).length === 0 && (
                    <div className="text-center py-8">
                      <Plus className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-400">
                        All available extensions are installed
                      </p>
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
                <a href={`/dashboard/${walletId}`}>Open Dashboard</a>
              </GreenButton>
              <SecondaryButton>Export Configuration</SecondaryButton>
              <Button
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600/20"
                onClick={() => {
                  setTransactionType("transferOwnership");
                  setShowTransferModal(true);
                }}
              >
                Transfer Ownership
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                onClick={() => {
                  setTransactionType("addAdmin");
                  setShowAdminModal(true);
                }}
              >
                Add Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Admin Modal */}
        <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
          <DialogContent className="bg-slate-800/90 border text-white border-slate-700 shadow-xl">
            <DialogHeader>
              <DialogTitle>Add Admin Principal</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Admin principal..."
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                className="bg-slate-700/50 text-white px-2 py-1 rounded border border-slate-600 focus:outline-none"
                disabled={isSigning}
              />
            </div>
            <DialogFooter>
              <SecondaryButton
                variant="outline"
                onClick={handleTransaction}
                disabled={!adminInput || isSigning}
              >
                {isSigning ? "Waiting for signature..." : "Add Admin & Sign"}
              </SecondaryButton>
              <Button
                variant="ghost"
                onClick={() => setShowAdminModal(false)}
                disabled={isSigning}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Transfer Ownership Modal */}
        <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
          <DialogContent className="bg-slate-800/90 border text-white border-slate-700 shadow-xl">
            <DialogHeader>
              <DialogTitle>Transfer Ownership</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="New owner principal..."
                value={newOwnerInput}
                onChange={(e) => setNewOwnerInput(e.target.value)}
                className="bg-slate-700/50 text-white px-2 py-1 rounded border border-slate-600 focus:outline-none"
                disabled={isSigning}
              />
            </div>
            <DialogFooter>
              <SecondaryButton
                variant="outline"
                onClick={handleTransaction}
                disabled={!newOwnerInput || isSigning}
              >
                {isSigning ? "Waiting for signature..." : "Transfer & Sign"}
              </SecondaryButton>
              <Button
                variant="ghost"
                onClick={() => setShowTransferModal(false)}
                disabled={isSigning}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WalletLayout>
  );
};

export default WalletDetails;
