import { ArrowDownRight, ArrowUpRight, Clock, ExternalLink, FileCode, RefreshCw } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTx } from "../../../../lib/tx-provider";
import type { SmartWallet, TxAssetInfo } from "../../../../lib/types";
import { useAuth } from "../../../../lib/auth-provider";

export default function ActivitiesTab() {
    const { address } = useParams<SmartWallet>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [offset, setOffset] = useState<number>(0)
    const { swTx, handleGetSwTx } = useTx()
    const { balance, formatDecimals } = useAuth()

    const refreshTx = async () => {
        setRefreshing(true)
        if (address) {
            await handleGetSwTx(address, offset)
            setRefreshing(false)
        }
    }

    const loadMore = async () => {
        setOffset(prev => prev + 20)
        refreshTx()
    }

    useEffect(() => {
        refreshTx()
    }, [])

    useEffect(() => {

    }, [swTx, balance])

    return (
        <TabsContent value="activity" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>View your recent transactions and activity.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="crypto-button-outline text-white">
                                <ExternalLink className="h-4 w-4 mr-2" /> Explorer
                            </Button>
                            <Button onClick={refreshTx} variant="outline" size="sm" className="crypto-button-outline text-white/30">
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">
                        {swTx.map((tx, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${tx?.action === "receive" ? "bg-green-500/20" : tx?.action === "sent" ? "bg-red-500/20" : "bg-blue-500/20"
                                            }`}
                                    >
                                        {tx?.action === "receive"
                                            ? <ArrowDownRight className="h-4 w-4 text-green-400" />
                                            : <>
                                                {tx?.action === "sent"
                                                    ? <ArrowUpRight className="h-4 w-4 text-red-400" />
                                                    : <FileCode className="h-4 w-4 text-blue-400" />
                                                }
                                            </>
                                        }
                                    </div>
                                    <div>
                                        <div className="font-medium text-white/30">
                                            {tx?.action === "receive" ? "Received" : tx?.action === "sent" ? "Sent" : tx?.action?.replace('_', ' ')}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {tx?.action === "receive"
                                                ? `From: ${tx?.sender.slice(0, 6)}...${tx?.sender.slice(-4)}`
                                                : tx?.action === "sent"
                                                    ? `To: ${tx?.sender.slice(0, 6)}...${tx?.sender.slice(-4)}`
                                                    : `By: ${tx?.sender.slice(0, 6)}...${tx?.sender.slice(-4)}`
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {tx?.assets?.map((a: TxAssetInfo, i) => (
                                        <div key={i} className={`font-medium ${tx?.action === "receive" ? "text-green-400" : "text-red-400"}`}>
                                            {tx?.action === "receive" ? "+" : tx?.action === 'sent' ? "-" : ''}
                                            {formatDecimals(a.amount, balance?.all?.find(t => t?.symbol?.toLowerCase() === a?.symbol?.toLowerCase())?.decimals ?? 0, false)} {a.symbol}
                                        </div>
                                    ))}
                                    <div className="flex items-center text-xs text-gray-400">
                                        <Clock className="h-3 w-3 mr-1" /> {tx?.stamp}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={loadMore} variant="outline" className="w-full crypto-button-outline text-white">
                        View More Transactions
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}