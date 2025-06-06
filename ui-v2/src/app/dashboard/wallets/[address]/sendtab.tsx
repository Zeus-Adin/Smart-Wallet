import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../../../../components/ui/card";
import CustomDropDown from "../../../../components/ui/customdropdown";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { TabsContent } from "../../../../components/ui/tabs";
import { useAuth } from "../../../../lib/auth-provider";
import { useParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import ExecuteTx from "./executetx";
import type { Token } from "../../../../lib/types";

export default function SendTab() {
    const { address } = useParams<{ address: `${string}.${string}` }>()
    const [selectedToken, setSelectedToken] = useState<Token | null>();
    const [amount, setAmount] = useState<number>(0)
    const [recipient, setRecipient] = useState<string>('')
    const [memo, setMemo] = useState<string>('')
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { balance, handleGetSwBalance } = useAuth()

    const refreshBalance = async () => {
        setRefreshing(true)
        if (address) {
            await handleGetSwBalance(address, '', 0)
            setRefreshing(false)
        }
        setRefreshing(false)
    }

    useEffect(() => {
        refreshBalance()
    }, [address])

    useEffect(() => {
        setSelectedToken(balance?.all?.[0])
    }, [balance])

    return (
        <TabsContent value="send" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white/30">Send Assets</CardTitle>
                            <CardDescription>
                                Transfer assets from your Smart Wallet to another address.
                            </CardDescription>
                        </div>
                        <Button onClick={refreshBalance} variant="outline" size="sm" className="crypto-button-outline text-white/30">
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="asset" className="text-white/30">Asset</Label>
                        <CustomDropDown onSelect={setSelectedToken} items={balance?.all ?? []} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-white/30">Amount</Label>
                        <div className="relative">
                            <Input
                                id="amount"
                                placeholder="0.00"
                                type="number"
                                className="crypto-input pr-16 text-white"
                                max={selectedToken?.actual_balance}
                                min={1}
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                        <div className="text-xs text-gray-400 flex justify-between">
                            <span>
                                Available: {Number(selectedToken?.actual_balance ?? 0).toFixed(4)}
                            </span>
                            <button className="text-primary hover:underline" onClick={() => setAmount(selectedToken?.actual_balance)}>Max</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="recipient" className="text-white/30">Recipient Address</Label>
                        <Input
                            id="recipient"
                            placeholder="Enter STX address"
                            className="crypto-input text-white"
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="memo" className="text-white/30">Memo (Optional)</Label>
                        <Input
                            id="memo"
                            placeholder="Add a note to this transaction"
                            className="crypto-input text-white"
                            onChange={(e) => setMemo(e.target.value)}
                        />
                    </div>
                </CardContent>
                <ExecuteTx props={{
                    action: 'send',
                    values: {
                        symbol: selectedToken?.symbol,
                        amount, sender: address?.toString() ?? '', recipient, memo,
                        decimal: selectedToken?.decimals,
                        asset_address: selectedToken?.token?.split('::')[0],
                        asset_name: selectedToken?.token?.split('::')[1],
                    }
                }} />
            </Card>
        </TabsContent>
    );
}
