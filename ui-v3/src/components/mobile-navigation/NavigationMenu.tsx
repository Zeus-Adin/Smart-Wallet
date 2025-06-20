
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface NavigationMenuProps {
  navItems: NavigationItem[];
}

const NavigationMenu = ({ navItems }: NavigationMenuProps) => {
  const location = useLocation();

  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-400 px-2 font-medium">Menu</div>
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
  );
};

export default NavigationMenu;
