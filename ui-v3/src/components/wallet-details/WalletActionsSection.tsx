
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CSWCard from "@/components/ui/csw-card";
import GreenButton from "@/components/ui/green-button";
import RedButton from "@/components/ui/red-button";
import SecondaryButton from "@/components/ui/secondary-button";

const WalletActionsSection = () => {
  return (
    <CSWCard>
      <CardHeader>
        <CardTitle className="text-white">Wallet Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <GreenButton>
            Open Dashboard
          </GreenButton>
          <SecondaryButton>
            Export Configuration
          </SecondaryButton>
          <RedButton>
            Transfer Ownership
          </RedButton>
        </div>
      </CardContent>
    </CSWCard>
  );
};

export default WalletActionsSection;
