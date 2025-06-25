import { handleCCS } from "@/services/smartWalletContractService"

export type ContractType = {
    icon: string
    name: string
    src: string
    label: string
    description: string
    extensions: string[]
    ext: boolean
    recomended: boolean
    comingSoon: boolean
    isDeployed: boolean
}

export const ContractTypes: ContractType[] = [
    {
        icon: "👥",
        name: "smart-wallet",
        src: '/smart-wallet.clar',
        label: "Personal Wallet",
        description: 'The Personal Wallet is a Clarity-based smart contract designed to function as an extendible, secure wallet that supports standard token operations and admin-controlled contract calls',
        extensions: ["Multi-sig", "Delegate STX"],
        ext: false,
        recomended: true,
        comingSoon: false,
        isDeployed: false
    },
    {
        icon: "📈",
        name: "ext-delegate-stx-pox-4",
        src: '/ext-delegate-stx-pox-4.clar',
        label: "Delegate STX",
        description: 'This smart contract acts as an extension module for smart wallets or DAOs, allowing them to interact with the Stacks PoX-4 contract (ST000000000000000000002AMW42H.pox-4) by delegating or revoking STX delegation rights via payload-based function calls.',
        extensions: [],
        ext: true,
        recomended: false,
        comingSoon: false,
        isDeployed: false
    }
]


// Sort extensions to show enabled ones first
export const getVerifiedContracts = async (walletId: string): Promise<ContractType[]> => {

    const deployedContractCheck = await Promise.all(ContractTypes.map(async (info) => {
        const found = await handleCCS(walletId, `${walletId}.${info.name}`, false)
        return { ...info, isDeployed: found?.found }
    }))

    return [...deployedContractCheck].sort((a, b) => {
        if ((a.comingSoon && !b.comingSoon) || (a.isDeployed && !b.isDeployed)) return 1;
        if ((!a.comingSoon && b.comingSoon) || (!a.isDeployed && b.isDeployed)) return -1;
        return 0;
    })
};