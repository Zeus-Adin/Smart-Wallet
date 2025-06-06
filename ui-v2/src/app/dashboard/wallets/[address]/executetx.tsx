import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { CardFooter } from "../../../../components/ui/card"
import { useAuth } from "../../../../lib/auth-provider"
import { networkFrom, type StacksNetworkName } from "@stacks/network"
import { useParams } from "react-router-dom"
import type { SmartWallet, ExecuteTxProps } from "../../../../lib/types"
import { useTx } from "../../../../lib/tx-provider"
import { Cl, Pc, serializeCV } from "@stacks/transactions"
import type { CallContractParams } from "@stacks/connect/dist/types/methods"
import { hexToBytes } from '@noble/hashes/utils';
import { delegate_extension_contract_name } from "../../../../lib/constants"

export default function ExecuteTx({ props }: ExecuteTxProps) {
    const { address } = useParams<SmartWallet>()
    const [network, setNetwork] = useState<StacksNetworkName>()
    const { handleGetClientConfig } = useAuth()
    const { eFees, handleContractCall } = useTx()
    const [executing, setExecuting] = useState<boolean>(false)
    const { userData } = useAuth()

    const executeContractFtTransfer = async () => {
        let txOp: CallContractParams
        if (!props?.values) return
        const { symbol, amount, recipient, memo, decimal, asset_address, asset_name } = props.values
        if (!address || !amount || !decimal || !recipient) return

        const isStx = symbol === "STX"
        const finalAmount = amount * decimal
        if (isStx) {
            setExecuting(true)
            const postConditions = [Pc.principal(address).willSendLte(finalAmount).ustx()]
            txOp = {
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
        } else {
            if (!asset_address || !asset_name) return
            setExecuting(true)

            const postConditions = [Pc.principal(address).willSendLte(finalAmount).ft(asset_address, asset_name)]
            txOp = {
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
        }
        await handleContractCall(txOp)
        setExecuting(false)
    }

    const executeContractExtensionCall = async () => {
        if (!props?.values || !props?.action) return
        const { action, amount, cycles, poxAddress, recipient } = props?.values
        const extension_owner = address?.split('.')[0]
        if (!action || !amount || !cycles || !recipient || !address || !extension_owner) return
        setExecuting(true)

        const decimal = 1000000
        const delegateAmount = amount * decimal
        const postConditions = [Pc.principal(address).willSendLte(delegateAmount).ustx()]

        let serializedPayload
        if (poxAddress?.version && poxAddress?.hashbytes) {
            serializedPayload = hexToBytes(serializeCV(
                Cl.tuple({
                    "action": Cl.stringAscii('delegate'),
                    "amount-ustx": Cl.uint(delegateAmount),
                    "delegate-to": Cl.principal(recipient),
                    "until-burn-ht": Cl.none(),
                    "pox-addr": Cl.tuple({
                        'version': Cl.bufferFromAscii(poxAddress?.version),
                        'hashbytes': Cl.bufferFromAscii(poxAddress?.hashbytes)
                    })
                })
            ))
        } else {
            serializedPayload = hexToBytes(serializeCV(
                Cl.tuple({
                    "action": Cl.stringAscii('delegate'),
                    "amount-ustx": Cl.uint(delegateAmount),
                    "delegate-to": Cl.principal(recipient),
                    "until-burn-ht": Cl.none(),
                    "pox-addr": Cl.none(),
                })
            ))
        }
        console.log({ addresdd: `${extension_owner}.${delegate_extension_contract_name}` })
        const txOp = {
            contract: address,
            functionName: action,
            functionArgs: [
                Cl.contractPrincipal(extension_owner, delegate_extension_contract_name),
                Cl.buffer(serializedPayload)
            ],
            network,
            postConditions
        }
        await handleContractCall(txOp)
        setExecuting(false)
    }

    const execute = () => {
        console.log({ address, props })
        if (!props?.action) return

        const { action } = props
        switch (action) {
            case 'sendftasset':
                executeContractFtTransfer()
                break;
            case 'extensions':
                executeContractExtensionCall()
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        if (address) {
            const { network } = handleGetClientConfig(address)
            setNetwork(network)
        }
    }, [])

    return (
        < CardFooter className="flex flex-col space-y-2" >
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
                    <span className="font-medium text-white">{props?.values?.amount || props?.values?.id || 0} {props?.values?.symbol || props?.values?.name || 'NA'}</span>
                </div>
            </div>
            <Button disabled={executing} className="w-full crypto-button" onClick={execute}>Send Transaction</Button>
        </CardFooter >
    )
}