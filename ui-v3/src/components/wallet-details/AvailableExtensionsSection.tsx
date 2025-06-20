
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CSWCard from "@/components/ui/csw-card";
import PrimaryButton from "@/components/ui/primary-button";
import { Plus } from "lucide-react";

interface AvailableExtension {
  id: string;
  name: string;
  description: string;
}

interface AvailableExtensionsSectionProps {
  availableExtensions: AvailableExtension[];
  onAddExtension: (extensionId: string) => void;
}

const AvailableExtensionsSection = ({ availableExtensions, onAddExtension }: AvailableExtensionsSectionProps) => {
  return (
    <CSWCard>
      <CardHeader>
        <CardTitle className="text-white">Available Extensions</CardTitle>
        <p className="text-slate-400 text-sm">Add new functionality to your wallet</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableExtensions.length === 0 ? (
            <div className="text-center py-8">
              <Plus className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">All available extensions are installed</p>
            </div>
          ) : (
            availableExtensions.map((extension) => (
              <div
                key={extension.id}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div>
                  <div className="text-white font-medium">{extension.name}</div>
                  <div className="text-slate-400 text-sm">{extension.description}</div>
                </div>
                <PrimaryButton
                  size="sm"
                  onClick={() => onAddExtension(extension.id)}
                >
                  <Plus className="h-4 w-4" />
                </PrimaryButton>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </CSWCard>
  );
};

export default AvailableExtensionsSection;
