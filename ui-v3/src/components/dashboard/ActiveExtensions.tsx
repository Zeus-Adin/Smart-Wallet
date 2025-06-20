
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import CSWCard from "@/components/ui/csw-card";

interface ActiveExtensionsProps {
  extensions: string[];
}

const ActiveExtensions = ({ extensions }: ActiveExtensionsProps) => {
  const { walletId } = useParams();

  const getExtensionIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'multi-sig':
        return '👥';
      case 'time-lock':
        return '⏰';
      case 'treasury':
        return '🏦';
      case 'stacking':
        return '📈';
      case 'governance':
        return '🗳️';
      case 'recovery':
        return '🔐';
      default:
        return '⚙️';
    }
  };

  return (
    <CSWCard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-medium text-white flex items-center">
          <Settings className="mr-2 h-5 w-5 text-purple-400" />
          Active Extensions
        </CardTitle>
        <Link to={`/wallet-details/${walletId}`}>
          <Badge variant="outline" className="border-green-600 text-green-400 hover:bg-green-600/10 transition-colors cursor-pointer">
            {extensions.length} Active
          </Badge>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {extensions.map((extension, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 bg-slate-700/30 rounded-lg"
            >
              <span className="text-lg">{getExtensionIcon(extension)}</span>
              <span className="text-sm text-slate-200">{extension}</span>
              <CheckCircle className="h-3 w-3 text-green-400 ml-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </CSWCard>
  );
};

export default ActiveExtensions;
