
import WalletLayout from "@/components/WalletLayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import WalletInformation from "@/components/wallet-details/WalletInformation";
import ActiveExtensionsSection from "@/components/wallet-details/ActiveExtensionsSection";
import AvailableExtensionsSection from "@/components/wallet-details/AvailableExtensionsSection";
import WalletActionsSection from "@/components/wallet-details/WalletActionsSection";

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

  const filteredAvailableExtensions = availableExtensions.filter(
    ext => !activeExtensions.find(active => active.id === ext.id)
  );

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet Details</h1>
          <p className="text-slate-400">Manage your smart wallet configuration and extensions.</p>
        </div>

        <WalletInformation walletInfo={walletInfo} />

        <div className="grid lg:grid-cols-2 gap-6">
          <ActiveExtensionsSection 
            activeExtensions={activeExtensions}
            onRemoveExtension={handleRemoveExtension}
          />
          <AvailableExtensionsSection 
            availableExtensions={filteredAvailableExtensions}
            onAddExtension={handleAddExtension}
          />
        </div>

        <WalletActionsSection />
      </div>
    </WalletLayout>
  );
};

export default WalletDetails;
