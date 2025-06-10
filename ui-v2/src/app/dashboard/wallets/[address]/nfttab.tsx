import { RefreshCw, Search, SendIcon, Settings } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type nftBalanceValues, type SmartWallet } from "../../../../lib/types";
import { useAuth } from "../../../../lib/auth-provider";

export default function NftTab() {
    const { address } = useParams<SmartWallet>()
    const [searchParams] = useSearchParams()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [configExplorer, setConfigExplorer] = useState<string>()
    const [configChain, setConfigChain] = useState<string>()
    const { balance, handleGetBalance, getRates, handleGetClientConfig } = useAuth()

    const refreshBalance = async () => {
        setRefreshing(true)
        if (address) {
            await handleGetBalance(address, '', 0)
            getRates()
            setRefreshing(false)
        }
        setRefreshing(false)
    }

    function stringToColor(str?: string): string {
        if (!str) return "hsl(0, 0%, 60%)";

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    }

    useEffect(() => {
        refreshBalance()
    }, [address])

    useEffect(() => {
        const { explorer, chain } = handleGetClientConfig(address)
        setConfigExplorer(explorer)
        setConfigChain(chain)
    }, [address, balance, searchParams])

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
                    <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">
                        {
                            balance?.nftBalance.map((v: nftBalanceValues, id: number) => (
                                <div key={id} className="flex items-center justify-between rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors crypto-card-glow">
                                    <div className="flex items-center">
                                        <div className="token-icon token-icon-stx  mr-3" style={{ borderRadius: '0px' }}>
                                            {v?.image
                                                ? <img width='100%' src={v?.image} />
                                                : <span className="capitalize font-bold" style={{ color: stringToColor(v?.asset_name ?? 'NA') }}>{v?.asset_name?.substring(0, 1) ?? 'NA'}</span>
                                            }
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="capitalize font-medium text-white/30">{v?.asset_name}</div>
                                            <div className="text-sm text-gray-400">{v?.contract_name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex text-sm text-gray-400 gap-4">
                                            <Link className="flex justify-center items-center" to={`${configExplorer}txid/${v?.asset_address}?chain=${configChain}`} target="_blank">
                                                <Search size={20} />
                                            </Link>
                                            <Button>
                                                <SendIcon />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
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