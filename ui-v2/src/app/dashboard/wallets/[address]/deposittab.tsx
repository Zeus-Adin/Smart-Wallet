import { RefreshCw } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../lib/auth-provider";
import { type ContractAddress, type SmartWallet, type Token } from "../../../../lib/types";
import ExecuteTx from "./executetx";
import { Label } from "../../../../components/ui/label";
import CustomDropDown from "../../../../components/ui/customdropdown";
import { Input } from "../../../../components/ui/input";

export default function DepositTab() {
    const router = useNavigate()
    const { address } = useParams<SmartWallet>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [selectedToken, setSelectedToken] = useState<Token | null>()
    const [action, setAction] = useState<string>('')
    const [amount, setAmount] = useState<number>(0)
    const [recipient, setRecipient] = useState<string>(address ? address?.toString() : '')
    const [memo, setMemo] = useState<string>('')
    const { userData, rates, authUserBalance, handleGetBalance, getRates } = useAuth()

    const refreshBalance = async () => {
        setRefreshing(true)
        const authed_user = userData?.addresses?.stx?.[0]?.address
        if (!authed_user) {
            setRefreshing(false)
            return
        }
        await handleGetBalance(authed_user, '', 0)
        await getRates()

        setRefreshing(false)
    }

    useEffect(() => {
        refreshBalance()
    }, [])

    useEffect(() => {
        setSelectedToken(authUserBalance?.all?.[0])
    }, [authUserBalance])

    return (
        <TabsContent value="deposit" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white/30">Deposit Informations</CardTitle>
                            <CardDescription>Details about your smart wallet configuration</CardDescription>
                        </div>
                        <Button onClick={refreshBalance} variant="outline" size="sm" className="crypto-button-outline text-white/30">
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="asset" className="text-white/30">Assets</Label>
                        <CustomDropDown onSelect={setSelectedToken} items={authUserBalance?.all ?? []} />
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
                            value={recipient}
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
                    action: 'deposit',
                    values: {
                        action: 'ft',
                        symbol: selectedToken?.symbol,
                        amount, sender: userData?.addresses?.stx?.[0]?.address ?? '', recipient, memo,
                        decimal: selectedToken?.decimals,
                        asset_address: selectedToken?.token?.split('::')[0],
                        asset_name: selectedToken?.token?.split('::')[1],
                    }
                }} />
            </Card>
        </TabsContent>
    )
}