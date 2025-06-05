import { useParams } from "react-router-dom";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../../../../../components/ui/accordion";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { useState } from "react";

export default function DelegateStx() {
    const { address } = useParams<{ address: `${string}.${string}` }>()
    const [action, setAction] = useState<string>()
    const [amount, setAmount] = useState<number>()
    const [delegateToAddress, setDelegateToAddress] = useState<string>()
    const [cycles, setCycles] = useState<number>(1)
    const [poxAddress, setPoxAddress] = useState<{ version: number, hashbytes: string }>()

    return (
        <AccordionItem value="item-1">
            <AccordionTrigger className="text-white/30 p-2">Delegate Stx</AccordionTrigger>
            <AccordionContent className="p-5 w-full flex flex-col gap-5">
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
            </AccordionContent>
        </AccordionItem>
    )
}