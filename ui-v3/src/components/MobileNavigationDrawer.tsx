
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Wallet, Send, History, ArrowDown, ArrowUp, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
}

const MobileNavigationDrawer = ({ 
  isOpen, 
  onOpenChange, 
  currentWallet, 
  walletId 
}: MobileNavigationDrawerProps) => {
  const location = useLocation();
  
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
      <DrawerContent className="bg-slate-800 border-slate-700">
        <DrawerHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-white">Navigation</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          {/* Wallet Info */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-sm text-slate-400">Current Wallet</div>
            <div className="text-white font-medium">{currentWallet.name}</div>
            <div className="text-xs text-slate-400 mt-1 font-mono break-all">
              {currentWallet.contractId}
            </div>
          </div>

          {/* Balance - Mobile */}
          <div className="bg-slate-700/50 rounded-lg p-3 sm:hidden">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-slate-400">Balance</div>
                <div className="text-lg font-bold text-white">{currentWallet.balance}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">USD Value</div>
                <div className="text-lg font-bold text-green-400">{currentWallet.usdValue}</div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <DrawerClose key={item.path} asChild>
                  <Button
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start font-medium ${
                      isActive 
                        ? "bg-purple-600/30 text-purple-200 border border-purple-600/50" 
                        : "text-slate-200 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <Link to={item.path}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                </DrawerClose>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavigationDrawer;
