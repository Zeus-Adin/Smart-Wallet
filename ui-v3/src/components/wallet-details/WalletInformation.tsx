
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CSWCard from "@/components/ui/csw-card";
import { Wallet } from "lucide-react";

interface WalletInfo {
  name: string;
  contractId: string;
  owner: string;
  balance: string;
  createdAt: string;
  version: string;
}

interface WalletInformationProps {
  walletInfo: WalletInfo;
}

const WalletInformation = ({ walletInfo }: WalletInformationProps) => {
  return (
    <CSWCard>
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
    </CSWCard>
  );
};

export default WalletInformation;
