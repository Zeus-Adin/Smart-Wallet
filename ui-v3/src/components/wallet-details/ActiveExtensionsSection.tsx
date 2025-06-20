
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CSWCard from "@/components/ui/csw-card";
import { Settings, Trash2 } from "lucide-react";

interface Extension {
  id: string;
  name: string;
  status: string;
}

interface ActiveExtensionsSectionProps {
  activeExtensions: Extension[];
  onRemoveExtension: (extensionId: string) => void;
}

const ActiveExtensionsSection = ({ activeExtensions, onRemoveExtension }: ActiveExtensionsSectionProps) => {
  return (
    <CSWCard>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="mr-2 h-5 w-5 text-purple-400" />
          Active Extensions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeExtensions.length === 0 ? (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No extensions installed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeExtensions.map((extension) => (
              <div
                key={extension.id}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white font-medium">{extension.name}</span>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                    {extension.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveExtension(extension.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </CSWCard>
  );
};

export default ActiveExtensionsSection;
