import { Settings, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { Button } from "../../../../components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../lib/auth-provider";
import type { Info, SmartWallet } from "../../../../lib/types";
import { formatDistanceToNow } from 'date-fns';

export default function InfoTab() {
    const { address } = useParams<SmartWallet>()
    const [walletInfo, setWalletInfo] = useState<Info>()
    const [wcc_Exists, setWcc_Exists] = useState<boolean>(false)
    const { handleCCS } = useAuth()
    const router = useNavigate()

    const refresh = async () => {
        if (!address) return
        const wcc = await handleCCS(address, address, true)
        const date = new Date(wcc?.tx_info?.block_time_iso)
        const timeAgo = formatDistanceToNow(date, { addSuffix: true })
        const info: Info = {
            name: address?.split('.')[1].replace('-', ' '),
            deployer: wcc?.tx_info?.sender_address,
            type: wcc?.tx_info?.tx_type.replace('_', ' '),
            sponsored: wcc?.tx_info?.sponsored,
            creation: timeAgo,
            owner: wcc?.tx_info?.sender_address,
            version: wcc?.tx_info?.smart_contract?.clarity_version,
            tx: wcc?.tx_info?.tx_id,
            status: wcc?.tx_info?.tx_status,
        }
        console.log({ wcc })
        setWcc_Exists(wcc?.found)
        setWalletInfo(info)
    }

    useEffect(() => {
        refresh()
    }, [])

    return (
        <TabsContent value="info" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <CardTitle className="text-white/30">Wallet Information</CardTitle>
                    <CardDescription>Details about your smart wallet configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-white/30">Wallet Name:</span>
                            <span className="font-medium text-white">{walletInfo?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/30">Wallet Type:</span>
                            <span className="text-white">{walletInfo?.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/30">Wallet Status:</span>
                            <span className="text-white">{walletInfo?.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/30">Sponsored:</span>
                            <span className="text-white">{walletInfo?.sponsored?.toString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/30">Clarity Version:</span>
                            <span className="text-white">
                                {walletInfo?.version}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Creation Date:</span>
                            <span className="text-white">{walletInfo?.creation}</span>
                        </div>
                    </div>
                    <Alert className="bg-gray-900 border-gray-800">
                        <ShieldCheck color="green" className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-white/30">Security Status</AlertTitle>
                        <AlertDescription className="text-gray-400">
                            Your account is now fully set up. You may begin using the platform and manage your account at any time.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Button
                        disabled
                        variant="outline"
                        className="w-full crypto-button-outline text-white"
                        onClick={() => router(`/dashboard/wallets/${address}/settings`)}
                    >
                        <Settings className="mr-2 h-4 w-4" /> Manage Wallet Settings
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}