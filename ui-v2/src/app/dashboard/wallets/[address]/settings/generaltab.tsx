import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { TabsContent } from "../../../../../components/ui/tabs";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../lib/auth-provider";

export default function GeneralTab() {
    const [recoveryAddress, setRecoveryAddress] = useState<string>()
    const [walletName, setWalletName] = useState<string>()
    const [dailyLimit, setDailyLimit] = useState<number>(0)
    const [isUpdating] = useState<boolean>(false)
    const { walletInfo } = useAuth()

    const handleSaveGeneral = async () => {

    }

    useEffect(() => {
    }, [walletInfo])

    return (
        <TabsContent value="general" className="space-y-4">
            <Card className="crypto-card">
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic configuration for your smart wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="wallet-name">Wallet Name</Label>
                        <Input
                            id="wallet-name"
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                            className="crypto-input"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="wallet-address">Wallet Address</Label>
                        <Input id="wallet-address" value={walletInfo?.address} disabled className="crypto-input text-gray-500" />
                        <p className="text-xs text-gray-400">The wallet address cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="daily-limit">Daily Transfer Limit</Label>
                        <div className="relative">
                            <Input
                                id="daily-limit"
                                type="number"
                                className="crypto-input pr-16"
                                value={dailyLimit}
                                onChange={(e) => setDailyLimit(Number(e.target.value))}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm font-medium text-gray-400">
                                STX
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">Maximum amount that can be transferred in a 24-hour period.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full crypto-button" onClick={handleSaveGeneral} disabled={isUpdating}>
                        {isUpdating ? "Saving Changes..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="crypto-card">
                <CardHeader>
                    <CardTitle>Recovery Settings</CardTitle>
                    <CardDescription>Configure recovery options for your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="recovery-address">Recovery Address</Label>
                        <Input
                            id="recovery-address"
                            placeholder="Enter STX address"
                            className="crypto-input"
                            value={recoveryAddress}
                            onChange={(e) => setRecoveryAddress(e.target.value)}
                        />
                        <p className="text-sm text-gray-400">Address that can recover your wallet in case of key loss.</p>
                    </div>
                    <Alert className="bg-gray-900 border-gray-800">
                        <Info className="h-4 w-4 text-blue-400" />
                        <AlertTitle>Recovery Information</AlertTitle>
                        <AlertDescription className="text-gray-400">
                            The recovery address can initiate a recovery process after a 7-day waiting period if you lose
                            access to your wallet.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </TabsContent>
    )
}