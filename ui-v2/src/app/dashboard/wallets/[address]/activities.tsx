import { ArrowDownRight, ArrowUpRight, Clock, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTx } from "../../../../lib/tx-provider";
import type { SmartWallet } from "../../../../lib/types";

// Mock transaction data
const mockTransactions = [
    {
        type: "receive",
        amount: "0.25 STX",
        from: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        date: "2 hours ago",
        status: "completed",
    },
    {
        type: "send",
        amount: "0.1 STX",
        to: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
        date: "1 day ago",
        status: "completed",
    },
    {
        type: "receive",
        amount: "10 MNO",
        from: "SP2X0TZ59D5SZ8ACQ6PEHZ72CZQB8XFGDYB5SKE5Z",
        date: "3 days ago",
        status: "completed",
    },
]

export default function Activities() {
    const { address } = useParams<SmartWallet>()
    const [walletTx, setWalletTx] = useState<any[]>([])
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { swTx, handleGetSwTx } = useTx()

    const refreshTx = async () => {
        setRefreshing(true)
        if (address) {
            await handleGetSwTx(address, 0)
            console.log({ address })
            setRefreshing(false)
        }
    }

    useEffect(() => {
        console.log({ swTx })
    }, [swTx])

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
                    <div className="space-y-4">
                        {mockTransactions.map((tx, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${tx.type === "receive" ? "bg-green-500/20" : "bg-blue-500/20"
                                            }`}
                                    >
                                        {tx.type === "receive" ? (
                                            <ArrowDownRight className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <ArrowUpRight className="h-4 w-4 text-blue-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium">{tx.type === "receive" ? "Received" : "Sent"}</div>
                                        <div className="text-xs text-gray-400">
                                            {tx.type === "receive"
                                                ? `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                                                : `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-medium ${tx.type === "receive" ? "text-green-400" : ""}`}>
                                        {tx.type === "receive" ? "+" : "-"}
                                        {tx.amount}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400">
                                        <Clock className="h-3 w-3 mr-1" /> {tx.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full crypto-button-outline text-white">
                        View All Transactions
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}