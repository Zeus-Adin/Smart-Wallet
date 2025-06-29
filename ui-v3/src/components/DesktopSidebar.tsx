
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Send, History, ArrowDown, ArrowUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface DesktopSidebarProps {
  currentWallet: {
    name: string;
    contractId: string;
    balance: string;
    usdValue: string;
    extensions?: string[];
  };
  walletId?: string;
}

const DesktopSidebar = ({ currentWallet, walletId }: DesktopSidebarProps) => {
  const location = useLocation();
  
  // Check if stacking extension is active
  const isStackingActive = currentWallet.extensions?.some(ext => 
    ext.toLowerCase().includes('stacking') || ext.toLowerCase().includes('stack')
  );
  
  const baseNavItems = [
    { path: `/dashboard/${walletId}`, label: "Dashboard", icon: Wallet },
    { path: `/send/${walletId}`, label: "Send", icon: Send },
    { path: `/receive/${walletId}`, label: "Receive", icon: ArrowDown },
    { path: `/actions/${walletId}`, label: "Extensions", icon: Wallet },
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
    <div className="lg:col-span-1 hidden lg:block">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="mb-4 pb-4 border-b border-slate-700">
            <div className="text-sm text-slate-400">Smart Contract</div>
            <div className="text-white font-mono text-xs break-all">
              {currentWallet.contractId}
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-purple-600/30 text-purple-200 border border-purple-600/50 hover:bg-purple-600/40 hover:text-purple-100 shadow-lg shadow-purple-600/20" 
                      : "text-slate-200 hover:bg-slate-700/60 hover:text-white hover:border hover:border-slate-600/50 hover:shadow-md"
                  }`}
                >
                  <Link to={item.path}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesktopSidebar;
