import type { presetType } from "./types"

export const sbtcMainnetAddress = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token'
export const sbtcTestnetAddress = 'SN69P7RZRKK8ERQCCABHT2JWKB2S4DHH9H74231T.sbtc-token'
export const wallet_contract_name = 'smart-wallet'
export const delegate_extension_contract_name = 'ext-delegate-stx-pox-4'
// Preset user deployable contracts
export const presetContracts: presetType[] = [
    {
        id: "personal",
        name: "Personal Wallet",
        function_name: 'deploy',
        description: "Simple single-signature wallet for personal use",
        signers: 1,
        threshold: 1,
        features: ["Single signature", "Low complexity", "Quick setup", "Enhanced security", "Shareable control"],
        recommended: true,
        state: '',
        extension: false,
        deployable: true,

        contractName: 'smart-wallet',
        contractSrc: '/smart-wallet.clar',
        customConfig: false
    },

    {
        id: "delegate-stx",
        name: "Delegate Stx",
        function_name: 'delegate-stx',
        description: "Earn BTC rewards by assigning your STX to a pool while keeping full control of your tokens.",
        signers: 1,
        threshold: 1,
        features: ["Single signature", "Enhanced security", "Yeild"],
        recommended: false,
        state: '',
        extension: true,
        deployable: true,

        contractName: 'ext-delegate-stx-pox-4',
        contractSrc: '/ext-delegate-stx-pox-4.clar',
        customConfig: false
    },
]