import { RefreshCw, Settings } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type SmartWallet } from "../../../../lib/types";
import { useAuth } from "../../../../lib/auth-provider";

export default function NftTab() {
    const router = useNavigate()
    const { address } = useParams<SmartWallet>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { handleGetBalance, getRates } = useAuth()

    const refreshBalance = async () => {
        setRefreshing(true)
        if (address) {
            await handleGetBalance(address, '', 0)
            getRates()
            setRefreshing(false)
        }
        setRefreshing(false)
    }

    useEffect(() => {
        refreshBalance()
    }, [address])


    return (
        <TabsContent value="nft" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white/30">NFT Assets</CardTitle>
                            <CardDescription>Details about your smart wallet configuration</CardDescription>
                        </div>
                        <Button onClick={refreshBalance} variant="outline" size="sm" className="crypto-button-outline text-white/30">
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">


                </CardContent>
                <CardFooter>
                    <Button
                        disabled
                        variant="outline"
                        className="w-full crypto-button-outline text-white"
                    >
                        <Settings className="mr-2 h-4 w-4" /> Manage Wallet Settings
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}