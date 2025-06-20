
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Wallet, Send, History, ArrowDown, ArrowUp, X } from "lucide-react";
import WalletInfoCard from "./mobile-navigation/WalletInfoCard";
import NavigationMenu from "./mobile-navigation/NavigationMenu";
import ConnectedWalletSection from "./mobile-navigation/ConnectedWalletSection";
import NetworkSwitcher from "./mobile-navigation/NetworkSwitcher";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentWallet: {
    name: string;
    contractId: string;
    balance: string;
    usdValue: string;
    extensions?: string[];
  };
  walletId?: string;
  selectedNetwork?: 'mainnet' | 'testnet';
  onNetworkSwitch?: (network: 'mainnet' | 'testnet') => void;
}

const MobileNavigationDrawer = ({ 
  isOpen, 
  onOpenChange, 
  currentWallet, 
  walletId,
  selectedNetwork = 'mainnet',
  onNetworkSwitch
}: MobileNavigationDrawerProps) => {
  // Check if stacking extension is active
  const isStackingActive = currentWallet.extensions?.some(ext => 
    ext.toLowerCase().includes('stacking') || ext.toLowerCase().includes('stack')
  );
  
  const baseNavItems = [
    { path: `/dashboard/${walletId}`, label: "Dashboard", icon: Wallet },
    { path: `/send/${walletId}`, label: "Send", icon: Send },
    { path: `/receive/${walletId}`, label: "Receive", icon: ArrowDown },
    { path: `/actions/${walletId}`, label: "Actions", icon: Wallet },
    { path: `/contract-actions/${walletId}`, label: "Contract Actions", icon: Wallet },
    { path: `/history/${walletId}`, label: "History", icon: History },
    { path: `/contract-details/${walletId}`, label: "Contract Details", icon: Wallet },
  ];

  // Add stacking item only if extension is active
  const navItems = isStackingActive 
    ? [
        ...baseNavItems.slice(0, 3), // Dashboard, Send, Receive
        { path: `/stacking/${walletId}`, label: "Stacking", icon: ArrowUp },
        ...baseNavItems.slice(3) // Actions, Contract Actions, History, Contract Details
      ]
    : baseNavItems;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-slate-800 border-slate-700 h-[85vh]">
        <DrawerHeader className="border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-white">Navigation</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            <WalletInfoCard currentWallet={currentWallet} />

            <Separator className="bg-slate-600" />

            <NavigationMenu navItems={navItems} />

            <Separator className="bg-slate-600" />

            <ConnectedWalletSection currentWallet={currentWallet} />

            <NetworkSwitcher 
              selectedNetwork={selectedNetwork} 
              onNetworkSwitch={onNetworkSwitch} 
            />

            <div className="h-4"></div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavigationDrawer;
