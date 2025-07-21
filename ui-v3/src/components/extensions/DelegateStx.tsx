import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import PrimaryButton from "../ui/primary-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useParams } from "react-router-dom"
import { ContractType } from "@/data/walletTypes"

interface Props {
    extensionInfo: ContractType
}

const DelegateStx: React.FC<Props> = ({ extensionInfo }) => {
    const { walletId } = useParams<{ walletId: string }>()
    const [action, setAction] = useState<'delegate' | 'revoke'>('delegate')
    const [amount, setAmount] = useState<number>(0)
    const [recipient, setRecipient] = useState<string>('')
    const [cycles, setCycles] = useState<number>(1)

    async function handleExecuteAction() {

        const txPayload = {
            extension: '',
            action,
            amount,
            "": recipient,
            "": cycles
        }

    }

    useEffect(() => {
        console.log({ extensionInfo })
    }, [extensionInfo])

    return (
        <div className="flex flex-col gap-3">
            <div className="space-y-2">
                <Label htmlFor="action" className="text-slate-300">Action</Label>
                <Select value={action} onValueChange={(e: "delegate" | "revoke") => setAction(e)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="delegate">Delegate</SelectItem>
                        <SelectItem value="revoke">Revoke</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="action" className="text-slate-300">Amount</Label>
                <Input
                    id="action"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder={`Enter ${action} amount`}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="action" className="text-slate-300">Recipient</Label>
                <Input
                    id="action"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder={`e.g ${walletId}`}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="action" className="text-slate-300">Cycles</Label>
                <Input
                    id="action"
                    min={1}
                    value={cycles}
                    onChange={(e) => setCycles(Number(e.target.value))}
                    placeholder="e.g., transfer, approve, delegate"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
            </div>

            <PrimaryButton
                className="w-full"
                disabled={!amount || !recipient || !walletId}
                onClick={handleExecuteAction}
            >
                Execute Action
            </PrimaryButton>
        </div>
    )
}

export default DelegateStx