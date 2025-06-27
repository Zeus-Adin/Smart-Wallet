import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SecondaryButton from "@/components/ui/secondary-button";
import { Textarea } from "@/components/ui/textarea";
import WalletLayout from "@/components/WalletLayout";
import { useAccountBalanceService } from "@/hooks/useAccountBalanceService";
import { FileText, Wallet } from "lucide-react";
import { useParams } from "react-router-dom";

export default function NftCollections() {
	const { walletId } = useParams<{ walletId: `${string}.${string}` }>()
	const { nftBalance } = useAccountBalanceService(walletId)

	return (
		<WalletLayout>
		  <div className="space-y-6">
			 <div>
				<h1 className="text-3xl font-bold text-white mb-2">NFT Collections</h1>
				<p className="text-slate-400">View and interact with your nfts.</p>
			 </div>
  
			 <Card className="bg-slate-800/50 border-slate-700">
				<CardHeader>
				  {/* <CardTitle className="text-white flex items-center">
					 <Wallet className="mr-2 h-5 w-5 text-purple-400" />
					 Contract Information
				  </CardTitle> */}
				</CardHeader>
				<CardContent className="space-y-4">
				  
				</CardContent>
			 </Card>
		  </div>
		</WalletLayout>
	 )
}
