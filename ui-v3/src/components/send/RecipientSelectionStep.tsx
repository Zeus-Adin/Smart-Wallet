
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recipient } from "@/services/transactionDataService";
import { Button } from "@/components/ui/button";

interface RecipientSelectionStepProps {
  recipient: string;
  recipients: Recipient[];
  onRecipientChange: (recipient: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const RecipientSelectionStep = ({ 
  recipient, 
  recipients, 
  onRecipientChange, 
  onNext, 
  onBack 
}: RecipientSelectionStepProps) => {
  const isValid = recipient.trim() !== '';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Select Recipient</h3>
      
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-slate-300">Recipient Address</Label>
        <Input
          id="recipient"
          value={recipient}
          onChange={(e) => onRecipientChange(e.target.value)}
          placeholder="SP1ABCD... or wallet address"
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
        />
      </div>

      {recipients.length > 0 && (
        <div className="space-y-3">
          <Label className="text-slate-300">Recent Recipients</Label>
          <div className="space-y-2">
            {recipients.map((recentRecipient, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50">
                <div>
                  <div className="text-white text-sm">{recentRecipient.address}</div>
                  <div className="text-slate-400 text-xs">Last sent: {recentRecipient.lastSent} • {recentRecipient.frequency} transactions</div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/20" 
                  onClick={() => onRecipientChange(recentRecipient.address)}
                >
                  Use
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <SecondaryButton 
          className="flex-1"
          onClick={onBack}
        >
          Back
        </SecondaryButton>
        <PrimaryButton 
          className="flex-1"
          disabled={!isValid}
          onClick={onNext}
        >
          Next
        </PrimaryButton>
      </div>
    </div>
  );
};

export default RecipientSelectionStep;
