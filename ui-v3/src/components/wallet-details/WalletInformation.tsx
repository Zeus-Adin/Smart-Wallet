
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
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center text-lg sm:text-xl">
          <Wallet className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
          {walletInfo.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-slate-300 text-xs sm:text-sm">Contract ID</label>
            <div className="text-white font-mono text-xs sm:text-sm bg-slate-700/50 p-2 sm:p-3 rounded mt-1 break-all">
              {walletInfo.contractId}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-slate-300 text-xs sm:text-sm">Owner</label>
            <div className="text-white font-mono text-xs sm:text-sm bg-slate-700/50 p-2 sm:p-3 rounded mt-1 break-all">
              {walletInfo.owner}
            </div>
          </div>
          <div>
            <label className="text-slate-300 text-xs sm:text-sm">Balance</label>
            <div className="text-white font-semibold text-sm sm:text-base bg-slate-700/50 p-2 sm:p-3 rounded mt-1">
              {walletInfo.balance}
            </div>
          </div>
          <div>
            <label className="text-slate-300 text-xs sm:text-sm">Created</label>
            <div className="text-white text-sm sm:text-base bg-slate-700/50 p-2 sm:p-3 rounded mt-1">
              {walletInfo.createdAt}
            </div>
          </div>
        </div>
      </CardContent>
    </CSWCard>
  );
};

export default WalletInformation;
