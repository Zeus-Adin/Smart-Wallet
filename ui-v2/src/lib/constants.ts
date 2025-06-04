export type presetType = {
    id: string
    name: string
    description: string
    signers: number
    threshold: number
    features: string[]
    recommended: true
    state: string
    extension: boolean
    deployable: boolean
    contractName: string
    contractSrc: string
    customConfig: boolean
}

// Preset user deployable contracts
export const presetContracts = [
    {
        id: "personal",
        name: "Personal Wallet",
        description: "Simple single-signature wallet for personal use",
        signers: 1,
        threshold: 1,
        features: ["Single signature", "Low complexity", "Quick setup", "Enhanced security", "Shareable control"],
        recommended: true,
        state: null,
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
        state: null,
        extension: false,
        deployable: false,
        customConfig: true
    },
    {
        id: "business",
        name: "Business Wallet",
        description: "Advanced wallet with multiple admins and daily limits",
        signers: 5,
        threshold: 3,
        features: ["Multiple admins", "Spending limits", "Transaction policies"],
        recommended: false,
        state: null,
        extension: true,
        deployable: false,
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
        state: null,
        extension: true,
        deployable: true,

        contractName: 'ext-delegate-stx-pox-4',
        contractSrc: '/ext-delegate-stx-pox-4.clar',
        customConfig: false
    },
]