import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "../../../../components/ui/card";
import CustomDropDown from "../../../../components/ui/customdropdown";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { TabsContent } from "../../../../components/ui/tabs";
import { useAuth, type Token } from "../../../../lib/auth-provider";
import { useParams } from "react-router-dom";
import type { StacksNetworkName } from "@stacks/network";
import { useTx } from "../../../../lib/tx-provider";
import { Cl, Pc, PostConditionMode } from "@stacks/transactions";
import type { CallContractParams } from "@stacks/connect/dist/types/methods";

export default function SendTab() {
    const { address } = useParams<{ address: `${string}.${string}` }>()
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [amount, setAmount] = useState<number>(0)
    const [recipient, setRecipient] = useState<string>('')
    const [memo, setMemo] = useState<string>('')
    const [network, setNetwork] = useState<StacksNetworkName>()
    const [allBalance, setAllBalance] = useState<Token[]>([])

    const { balance, handleGetBalance, handleGetClientConfig } = useAuth()
    const { eFees, handleGetTxEstimates, handleContractCall } = useTx()

    const refreshBalance = async () => {
        if (address) {
            handleGetBalance(address, '', 0)
        }
    }

    const sendTx = async () => {
        const isStx = selectedToken?.symbol === "STX"
        const assetId = selectedToken?.contractId
        console.log({ isStx, assetId })
        if (!address) return

        const decimal = selectedToken?.decimal ?? 0
        const finalAmount = amount * decimal
        const postConditions = isStx
            ? [Pc.principal(address).willSendLte(finalAmount).ustx()]
            : [
                Pc.principal(address).willSendLte(finalAmount).ft(
                    assetId.split('::')[0],
                    assetId.split('::')[1]
                )
            ]
        const txOp: CallContractParams = {
            contract: address,
            functionName: isStx ? 'stx-transfer' : 'sip010-transfer',
            functionArgs: [
                Cl.uint(Math.round(finalAmount)),
                Cl.principal(recipient),
                memo ? Cl.some(Cl.bufferFromAscii(memo)) : Cl.none()
            ],
            network,
            postConditions
        }

        handleContractCall(txOp)
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

    useEffect(() => {

        if (!address) return

    }, [selectedToken, amount, recipient, address])

    useEffect(() => {
        const { network } = handleGetClientConfig(address)
        setNetwork(network)
    }, [selectedToken])

    return (
        <TabsContent value="send" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <CardTitle className="text-white">Send Assets</CardTitle>
                    <CardDescription>
                        Transfer assets from your Smart Wallet to another address.
                    </CardDescription>
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
                            className="crypto-input"
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="memo" className="text-white/30">Memo (Optional)</Label>
                        <Input
                            id="memo"
                            placeholder="Add a note to this transaction"
                            className="crypto-input"
                            onChange={(e) => setMemo(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div>
                        <h1></h1>
                    </div>
                    <div className="w-full p-3 rounded-lg bg-gray-900 mb-2">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Network</span>
                            <span className="capitalize text-white">{network}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Network Fee</span>
                            <span className="capitalize text-white">{eFees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Amount</span>
                            <span className="font-medium text-white">{amount} {selectedToken?.symbol}</span>
                        </div>
                    </div>
                    <Button className="w-full crypto-button" onClick={sendTx}>Send Transaction</Button>
                </CardFooter>
            </Card>
        </TabsContent>
    );
}
