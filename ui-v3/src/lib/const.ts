export type SmartWalletTypes = {
    label: string
    name: string
    extensions: string[]
    ext: boolean
}

export const ContractTypes: SmartWalletTypes[] = [
    {
        label: "Personal Wallet",
        name: "smart-wallet",
        extensions: ["Multi-sig", "Delegate STX"],
        ext: false
    },
    {
        label: "Delegate STX",
        name: "ext-delegate-stx-pox-4",
        extensions: [],
        ext: true
    }
]