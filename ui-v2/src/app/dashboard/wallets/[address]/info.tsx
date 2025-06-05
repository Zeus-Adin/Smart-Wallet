import { Settings, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { Button } from "../../../../components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Info() {
    const { address } = useParams<{ address: `${string}.${string}` }>()
    const [walletInfo, setWalletInfo] = useState<{ name: string, type: string, creation: string }>()

    useEffect(() => {

    }, [])

    return (
        <TabsContent value="info" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <CardTitle>Wallet Information</CardTitle>
                    <CardDescription>Details about your smart wallet configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Wallet Name:</span>
                            <span className="font-medium">{walletInfo?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Wallet Type:</span>
                            <span>{walletInfo?.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Signers:</span>
                            <span>{walletInfo?.signers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Required signatures:</span>
                            <span>
                                {walletInfo?.threshold} of {walletInfo?.signers}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Creation Date:</span>
                            <span>April 5, 2025</span>
                        </div>
                    </div>
                    <Alert className="bg-gray-900 border-gray-800">
                        <Shield className="h-4 w-4 text-primary" />
                        <AlertTitle>Security Status</AlertTitle>
                        <AlertDescription className="text-gray-400">
                            Your wallet is protected with {walletInfo?.threshold} of {walletInfo?.signers} multi-signature security.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Button
                        variant="outline"
                        className="w-full crypto-button-outline"
                        onClick={() => router(`/dashboard/wallets/${address}/settings`)}
                    >
                        <Settings className="mr-2 h-4 w-4" /> Manage Wallet Settings
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}