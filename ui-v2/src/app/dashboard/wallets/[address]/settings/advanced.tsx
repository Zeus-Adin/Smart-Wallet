import { AlertTriangle, Share2Icon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { TabsContent } from "../../../../../components/ui/tabs";
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { SmartWallet } from "../../../../../lib/types";
import type { CallContractParams } from "@stacks/connect/dist/types/methods";
import { Cl } from "@stacks/transactions";
import { useAuth } from "../../../../../lib/auth-provider";
import { useTx } from "../../../../../lib/tx-provider";

export default function AdvancedTab() {
    const { address } = useParams<SmartWallet>()
    const [adminAddress, setAdminAddress] = useState<string>()
    const [enableState, setEnableState] = useState<boolean>(false)
    const [processing, setProcessing] = useState<boolean>(false)
    const { handleGetClientConfig } = useAuth()
    const { handleContractCall } = useTx()

    const enableAsAdmin = async () => {
        if (!address || !address || !enableState) return
        setProcessing(true)

        const { network } = handleGetClientConfig(address)
        const txOp: CallContractParams = {
            contract: address,
            functionName: 'enable-admin',
            functionArgs: [
                Cl.principal(address),
                Cl.bool(enableState)
            ],
            network,
            postConditionMode: 'deny'
        }
        await handleContractCall(txOp)
        setProcessing(false)
    }

    const shareWallet = async () => {
        if (!address || !address || !enableState) return
        setProcessing(true)

        const { network } = handleGetClientConfig(address)
        const txOp: CallContractParams = {
            contract: address,
            functionName: 'transfer-wallet',
            functionArgs: [
                Cl.principal(address)
            ],
            network,
            postConditionMode: 'deny'
        }
        await handleContractCall(txOp)
        setProcessing(false)
    }

    return (
        <TabsContent value="advanced" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <CardTitle className="text-white/30">Advanced Settings</CardTitle>
                    <CardDescription>Configure advanced features and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    <div className="space-y-2">
                        <Label htmlFor="required-confirmations" className="text-white">Admin Address</Label>
                        <Input placeholder="Enter admin address" id="wallet-address" value={adminAddress} className="crypto-input text-gray-500" onChange={(e) => setAdminAddress(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time-lock" className="text-white">Admin State</Label>
                        <select
                            value={String(enableState)}
                            id="time-lock"
                            className="flex text-white h-10 w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 crypto-input"
                            onChange={(e) => setEnableState(Boolean(e.target.value))}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>

                    <Alert className="bg-yellow-900/20 border-yellow-800">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <AlertTitle>Advanced Features</AlertTitle>
                        <AlertDescription className="text-gray-300">
                            Caution: This address will be granted administrative privileges to manage this wallet.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Button disabled={processing} onClick={enableAsAdmin} className="w-full crypto-button">Enable As Admin</Button>
                </CardFooter>
            </Card>

            <Card className="crypto-card border-red-900/30">
                <CardHeader>
                    <CardTitle className="text-red-400">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg border border-red-900/30 bg-red-900/10">
                        <h3 className="font-medium text-red-400 mb-2">Share Wallet</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Permanently share access to this wallet. This action is irreversible.
                        </p>
                        <Button disabled={processing} onClick={shareWallet} variant="destructive" className="w-full bg-red-900 hover:bg-red-800">
                            <Share2Icon className="mr-2 h-4 w-4" /> Share Wallet
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Alert className="w-full bg-gray-900 border-gray-800">
                        <InfoIcon color="orange" className="h-4 w-4 text-red-400" />
                        <AlertTitle className="text-yellow-200">Security Warning: Risk of Unauthorized Access</AlertTitle>
                        <AlertDescription className="text-gray-400">
                            If you're unsure about this action, please refrain from proceeding. Granting access to an untrusted party could result in the loss of asset's.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}