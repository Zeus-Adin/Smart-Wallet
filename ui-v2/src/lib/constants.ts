

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
        contractSrc: '/smart-wallet.clar'
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
        deployable: false
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
        deployable: false
    },
    {
        id: "delegate-stx",
        name: "Delegate Stx",
        description: "Earn BTC rewards by assigning your STX to a pool while keeping full control of your tokens.",
        signers: 3,
        threshold: 2,
        features: ["Single signature", "Enhanced security", "Shared control"],
        recommended: false,
        state: null,
        extension: true,
        deployable: true,

        contractName: 'ext-delegate-stx-pox-4',
        contractSrc: '/ext-delegate-stx-pox-4.clar'
    },
]