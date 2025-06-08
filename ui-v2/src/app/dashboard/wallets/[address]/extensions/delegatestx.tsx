import { AlertTriangle, Settings } from "lucide-react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../../../components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import type { SmartWallet, ExecuteValuesProps } from '../../../../../lib/types'
import { useEffect, useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { useNavigate, useParams } from "react-router-dom"



export default function DelegateStx({ dc_exists, setValues }: ExecuteValuesProps) {
    const router = useNavigate()
    const { address } = useParams<SmartWallet>()
    const [action, setAction] = useState<string>()
    const [amount, setAmount] = useState<number>()
    const [delegateToAddress, setDelegateToAddress] = useState<string>()
    const [cycles, setCycles] = useState<number>(1)
    const [poxAddress] = useState<{ version?: string, hashbytes?: string } | undefined>()

    useEffect(() => {
        setValues({
            action,
            sender: address?.toString() ?? '',
            amount,
            cycles,
            recipient: delegateToAddress,
            poxAddress
        })
    }, [action, amount, delegateToAddress, cycles, poxAddress])

    return (
        <AccordionItem value="item-1">
            <AccordionTrigger className="text-white/30 p-2">Delegate Stx</AccordionTrigger>
            <AccordionContent className="p-5 w-full flex flex-col gap-5">
                {dc_exists
                    ?
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="action" className="text-white/30">Action</Label>
                            <select id="action" className="flex h-10 w-full text-white rounded-md border border-gray-800 bg-gray-900 px-2 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 crypto-input"
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                            >
                                <option value="">Select action</option>
                                <option value="delegate">Delegate (STX)</option>
                                <option value="revoke">Revoke (STX)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-white/30">Amount</Label>
                            <div className="relative">
                                <Input
                                    id="amount"
                                    placeholder="0.00"
                                    type="number"
                                    className="crypto-input pr-16 text-white"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recipient" className="text-white/30">Recipient</Label>
                            <div className="relative">
                                <Input
                                    id="recipient"
                                    placeholder="Enter address..."
                                    type="text"
                                    className="crypto-input pr-16 text-white"
                                    value={delegateToAddress}
                                    onChange={(e) => setDelegateToAddress(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cycles" className="text-white/30">Cycles</Label>
                            <div className="relative">
                                <Input
                                    id="cycles"
                                    type="number"
                                    min={1}
                                    max={12}
                                    className="crypto-input pr-16 text-white"
                                    value={cycles}
                                    onChange={(e) => setCycles(Number.parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </>
                    : <Alert className="bg-gray-900 border-gray-800">
                        <AlertTriangle color="orange" className="h-4 w-4" />
                        <AlertTitle className="text-white/30">Delegation Smart Contract Not Found</AlertTitle>
                        <AlertDescription className="text-white flex flex-col gap-1">
                            <p>The delegation smart contract is not deployed on the network. Please deploy the contract to enable delegation functionality.</p>
                            <div className="flex">
                                <Button variant="outline"
                                    className="w-50 crypto-button-outline text-white ml-auto"
                                    onClick={() => router(`/dashboard/create-wallet?contract=1`)}
                                >
                                    <Settings className="mr-2 h-4 w-4" /> Deploy Contract
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                }

            </AccordionContent>
        </AccordionItem>
    )
}