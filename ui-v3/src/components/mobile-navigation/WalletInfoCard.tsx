
interface WalletInfoCardProps {
  currentWallet: {
    name: string;
    contractId: string;
    balance: string;
    usdValue: string;
  };
}

const WalletInfoCard = ({ currentWallet }: WalletInfoCardProps) => {
  return (
    <>
      <div className="bg-slate-700/50 rounded-lg p-3">
        <div className="text-xs sm:text-sm text-slate-400">Current Wallet</div>
        <div className="text-white font-medium text-sm sm:text-base">{currentWallet.name}</div>
        <div className="text-xs text-slate-400 mt-1 font-mono break-all">
          {currentWallet.contractId}
        </div>
      </div>

      <div className="bg-slate-700/50 rounded-lg p-3">
        <div className="flex justify-between">
          <div className="flex-1 mr-2">
            <div className="text-xs sm:text-sm text-slate-400">Balance</div>
            <div className="text-base sm:text-lg font-bold text-white break-all">{currentWallet.balance}</div>
          </div>
          <div className="flex-1">
            <div className="text-xs sm:text-sm text-slate-400">USD Value</div>
            <div className="text-base sm:text-lg font-bold text-green-400 break-all">{currentWallet.usdValue}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletInfoCard;
