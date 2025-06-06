import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../../../../components/ui/card";
import CustomDropDown from "../../../../components/ui/customdropdown";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { TabsContent } from "../../../../components/ui/tabs";
import { useAuth } from "../../../../lib/auth-provider";
import { useParams } from "react-router-dom";
import type { StacksNetworkName } from "@stacks/network";
import { RefreshCw } from "lucide-react";
import ExecuteTx from "./executetx";
import type { Token } from "../../../../lib/types";

export default function SendTab() {
    const { address } = useParams<{ address: `${string}.${string}` }>()
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [amount, setAmount] = useState<number>(0)
    const [recipient, setRecipient] = useState<string>('')
    const [memo, setMemo] = useState<string>('')
    const [network, setNetwork] = useState<StacksNetworkName>()
    const [allBalance, setAllBalance] = useState<Token[]>([])

    const { balance, handleGetBalance } = useAuth()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const refreshBalance = async () => {
        setRefreshing(true)
        if (address) {
            await handleGetBalance(address, '', 0)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        refreshBalance()
    }, [])

    useEffect(() => {
        const allBalances = [
            balance?.stxBalance,
            ...(balance?.ftBalance ?? []),
        ];
        setAllBalance(allBalances)
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
                        <CustomDropDown onSelect={setSelectedToken} items={allBalance} />
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
                                Available: {selectedToken?.actual_balance}
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
                    action: 'sendftasset',
                    values: {
                        symbol: selectedToken?.symbol,
                        amount, recipient, memo,
                        decimal: selectedToken?.decimal,
                        asset_address: selectedToken?.contractId?.split('::')[0],
                        asset_name: selectedToken?.contractId?.split('::')[1],
                    }
                }} />
            </Card>
        </TabsContent>
    );
}
