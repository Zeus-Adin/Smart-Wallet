export type presetType = {
    id: string
    name: string
    description: string
    signers: number
    threshold: number
    features: string[]
    recommended: boolean
    state: string
    extension: boolean
    deployable: boolean
    contractName: string
    contractSrc: string
    customConfig: boolean
}

export const sbtcMainnetAddress = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token'
export const sbtcTestnetAddress = 'SN69P7RZRKK8ERQCCABHT2JWKB2S4DHH9H74231T.sbtc-token'

// Preset user deployable contracts
export const presetContracts: presetType[] = [
    {
        id: "personal",
        name: "Personal Wallet",
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
        id: "multisig",
        name: "Multi-Signature Wallet",
        description: "Secure wallet requiring multiple approvals for transactions",
        signers: 3,
        threshold: 2,
        features: ["Multiple signers", "Enhanced security", "Shared control"],
        recommended: false,
        state: 'null',
        extension: false,
        deployable: false,

        contractName: 'smart-wallet',
        contractSrc: '/smart-wallet.clar',
        customConfig: true,
    },
    {
        id: "business",
        name: "Business Wallet",
        description: "Advanced wallet with multiple admins and daily limits",
        signers: 5,
        threshold: 3,
        features: ["Multiple admins", "Spending limits", "Transaction policies"],
        recommended: false,
        state: '',
        extension: true,
        deployable: false,

        contractName: 'ext-delegate-stx-pox-4',
        contractSrc: '/ext-delegate-stx-pox-4.clar',
        customConfig: true
    },
    {
        id: "delegate-stx",
        name: "Delegate Stx",
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