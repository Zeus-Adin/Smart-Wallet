import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../../../../components/ui/card";
import { TabsContent } from "../../../../components/ui/tabs";
import { Accordion } from "../../../../components/ui/accordion";
import DelegateStx from "./extensions/delegatestx";
import ExecuteTx from "./executetx";
import { useEffect, useState } from "react";
import type { ExecuteValues, SmartWallet } from "../../../../lib/types";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../../lib/auth-provider";
import { delegate_extension_contract_name } from "../../../../lib/constants";

export default function ExtensionTab() {
    const { address } = useParams<SmartWallet>()
    const [values, setValues] = useState<ExecuteValues>()
    const [dc_exists, setDc_Exists] = useState<boolean>(false)
    const [] = useState<boolean>(false)
    const [] = useState<boolean>(false)
    const { handleCCS } = useAuth()

    const validateExtensions = async () => {
        if (!address) return
        const dea = `${address.split('.')[0]}.${delegate_extension_contract_name}`
        const eccs = await handleCCS(address, dea, false)
        setDc_Exists(eccs?.found)
    }

    useEffect(() => {
        validateExtensions()
    }, [])

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
                        <DelegateStx dc_exists={dc_exists} setValues={setValues} />
                    </Accordion>
                </CardContent>
                <ExecuteTx props={{
                    action: 'extensions',
                    values: values
                }} />
            </Card>
        </TabsContent>
    );
}