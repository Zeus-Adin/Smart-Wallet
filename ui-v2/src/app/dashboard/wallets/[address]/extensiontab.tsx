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
import { Cl, Pc } from "@stacks/transactions";
import type { CallContractParams } from "@stacks/connect/dist/types/methods";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion";
import DelegateStx from "./extensions/delegatestx";

export default function ExtensionTab() {
    const { address } = useParams<{ address: `${string}.${string}` }>()
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [amount, setAmount] = useState<number>(0)
    const [recipient, setRecipient] = useState<string>('')
    const [memo, setMemo] = useState<string>('')
    const [network, setNetwork] = useState<StacksNetworkName>()

    const { handleGetClientConfig } = useAuth()
    const { eFees, handleContractCall } = useTx()

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

        if (!address) return

    }, [selectedToken, amount, recipient, address])

    useEffect(() => {
        const { network } = handleGetClientConfig(address)
        setNetwork(network)
    }, [selectedToken])

    return (
        <TabsContent value="extension" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <CardTitle className="text-white">Extension's</CardTitle>
                    <CardDescription>
                        Manage deployed extensions and enhance the functionality of your Smart Wallet.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full rounded-md border">
                        <DelegateStx />
                    </Accordion>
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