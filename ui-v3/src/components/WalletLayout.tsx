import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useSelectedWallet } from "@/hooks/useSelectedWallet";
import WalletHeader from "./WalletHeader";
import MobileNavigationDrawer from "./MobileNavigationDrawer";
import DesktopSidebar from "./DesktopSidebar";
import { useAccountBalanceService } from "@/hooks/useAccountBalanceService";
import useGetRates from "@/hooks/useGetRates";
import { formatNumber } from "@/utils/numbers";

interface WalletLayoutProps {
   children: ReactNode;
}

const WalletLayout = ({ children }: WalletLayoutProps) => {
   const { walletId } = useParams();
   const { selectedWallet } = useSelectedWallet();
   const [selectedNetwork, setSelectedNetwork] = useState<
      "mainnet" | "testnet"
   >("mainnet");
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [networkParams, setNetworkParams] = useSearchParams();

	const { stxBalance, loading, error } = useAccountBalanceService(walletId)
  const { rates: stxRate } = useGetRates("stx")

   const handleNetworkSwitch = (network: "mainnet" | "testnet") => {
      setSelectedNetwork(network);
      setNetworkParams({ network });
   };

   const handleMobileMenuToggle = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
   };

   useEffect(() => {
      if (!networkParams.get("network")) {
         const initialNetwork = "mainnet";
         setSelectedNetwork(initialNetwork);
         setNetworkParams({ network: initialNetwork });
      } else {
         const network = networkParams.get("network") as "mainnet" | "testnet";
         setSelectedNetwork(network);
      }
   }, [networkParams, setNetworkParams]);

   if (!selectedWallet) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-white">Loading wallet...</div>
         </div>
      );
   }

   const currentWallet = {
      name: selectedWallet.name,
      contractId: selectedWallet.contractId,
      balance: stxBalance ? `${formatNumber(+stxBalance.actual_balance, 2)} STX` : "0.00",
      usdValue: stxBalance && stxRate ? `$${formatNumber(+stxBalance.actual_balance * +stxRate.current_price, 2)}` : "0.00",
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
         <WalletHeader
            currentWallet={currentWallet}
            selectedNetwork={selectedNetwork}
            onNetworkSwitch={handleNetworkSwitch}
            onMobileMenuToggle={handleMobileMenuToggle}
         />

         <MobileNavigationDrawer
            isOpen={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
            currentWallet={currentWallet}
            walletId={walletId}
         />

         <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-4 gap-8">
               <DesktopSidebar
                  currentWallet={currentWallet}
                  walletId={walletId}
               />

               {/* Main Content */}
               <div className="lg:col-span-3">{children}</div>
            </div>
         </div>
      </div>
   );
};

export default WalletLayout;
