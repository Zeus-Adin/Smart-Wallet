
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";

const EmptyWalletState = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-12 text-center">
        <div className="mb-6">
          <Wallet className="h-20 w-20 text-slate-500 mx-auto mb-4" />
          <div className="w-16 h-1 bg-slate-600 mx-auto mb-6"></div>
        </div>
        <h3 className="text-2xl font-semibold text-white mb-3">No Smart Wallets Found</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          You don't have any smart wallets yet. Smart wallets offer enhanced security features like multi-signature support, time-locks, and programmable conditions.
        </p>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
          <Link to="/create-wallet">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Smart Wallet
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyWalletState;
