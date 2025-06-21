import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Send, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import SecondaryButton from "../ui/secondary-button";
import PrimaryButton from "../ui/primary-button";

const HeroSection = () => {
  const { isWalletConnected, connectWallet, connectDemoWallet, isConnecting } = useWalletConnection();

  const handleGetStarted = () => {
    if (isWalletConnected) {
      // Navigate to dashboard if already connected
      window.location.href = '/wallet-selector';
    } else {
      // Connect wallet if not connected
      connectWallet();
    }
  };

  const handleDemoMode = () => {
    connectDemoWallet();
    // Navigate to wallet selector after connecting demo wallet
    setTimeout(() => {
      window.location.href = '/wallet-selector';
    }, 100);
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block">
            <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
              ⚡ Next Generation Wallet
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Deploy Smart Wallets
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                with
              </span>
              <br />
              Ease and Confidence
            </h1>

            <div className="space-y-2">
              <p className="text-xl text-slate-300">Seamless. Secure. Scalable.</p>
              <p className="text-slate-400 max-w-md">
                Start your blockchain journey with tools designed to empower every user.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <PrimaryButton
              onClick={handleGetStarted}
              size="lg"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : isWalletConnected ? "Go to Dashboard" : "Connect Wallet"}
              <Send className="ml-2 h-4 w-4" />
            </PrimaryButton>
            <SecondaryButton
              onClick={handleDemoMode}
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Try Demo
            </SecondaryButton>
          </div>
        </div>

        <div className="lg:flex justify-center">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md w-full">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="h-8 w-8 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Smart Contract Wallet</h3>
                <p className="text-slate-400 text-sm">
                  A secure smart contract solution designed to hold assets in the name of one or more users, enhancing both security and usability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
