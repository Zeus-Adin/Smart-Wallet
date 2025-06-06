import { ChevronRight, Layers, RefreshCw, Wallet } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../lib/auth-provider";
import { useEffect, useState } from "react";


export default function AssetsTab() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { address } = useParams<{ address: string }>();
    const [walletAssets, setWalletAssets] = useState<any[]>([])
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { balance, rates, handleGetBalance } = useAuth()

    const refresh = async () => {
        setRefreshing(true)
        if (address) {
            await handleGetBalance(address, '', 0)
            setRefreshing(false)
        }
    }

    function stringToColor(str?: string): string {
        if (!str) return "hsl(0, 0%, 60%)"; // default neutral gray

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`; // bright and vibrant
    }

    useEffect(() => {
        const allBalances = [
            balance?.stxBalance,
            ...(balance?.ftBalance ?? []),
        ];
        console.log({ allBalances, balance })
        setWalletAssets(allBalances)
    }, [balance])

    return (
        <TabsContent value="assets" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white/30">Your Assets</CardTitle>
                            <CardDescription>View and manage all assets in your Smart Wallet.</CardDescription>
                        </div>
                        <Button onClick={refresh} variant="outline" size="sm" className="crypto-button-outline text-white/30">
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">

                        {walletAssets.map((v, id) => (
                            <div key={id} className="flex items-center justify-between rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors crypto-card-glow">
                                <div className="flex items-center">
                                    <div className="token-icon token-icon-stx mr-3">
                                        {v?.image
                                            ? <img width='100%' src={v?.image} />
                                            : <span className="font-bold" style={{ color: stringToColor(v?.symbol ?? 'NA') }}>{v?.symbol ?? 'NA'}</span>
                                        }
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="font-medium text-white/30">{v?.name}</div>
                                        <div className="text-sm text-gray-400">{v?.symbol}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-white">
                                        {v?.actual_balance}
                                    </div>
                                    <div className="text-sm text-gray-400">≈ {((v?.actual_balance) * (rates?.[v?.symbol === 'sBTC' ? 'btc' : v?.symbol?.toLowerCase()]?.current_price ?? 0)).toFixed(2)}</div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors crypto-card-glow">
                            <div className="flex items-center">
                                <div className="token-icon mr-3">
                                    <Layers className="h-5 w-5 text-purple-400" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="font-medium">NFT Collectibles</div>
                                    <div className="text-sm text-gray-400">Digital Assets</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">{balance?.nftBalance?.length} Items</div>
                                <Button variant="ghost" size="sm" className="text-primary">
                                    View <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => {
                        searchParams.set('tab', 'deposit')
                        setSearchParams(searchParams)
                    }} className="w-full crypto-button">
                        <Wallet className="mr-2 h-4 w-4" /> Deposit Assets
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}