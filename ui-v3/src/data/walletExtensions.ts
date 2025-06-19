
export interface WalletExtension {
  id: string;
  name: string;
  description: string;
  icon: string;
  comingSoon: boolean;
}

export const walletExtensions: WalletExtension[] = [
  {
    id: "stacking",
    name: "Stacking",
    description: "Earn rewards by locking STX tokens and participating in network consensus",
    icon: "📈",
    comingSoon: false
  },
  {
    id: "multisig",
    name: "Multi-Signature",
    description: "Require multiple signatures for transactions",
    icon: "👥",
    comingSoon: true
  },
  {
    id: "timelock",
    name: "Time Lock",
    description: "Add time-based restrictions to transactions",
    icon: "⏰",
    comingSoon: true
  },
  {
    id: "treasury",
    name: "Treasury Management",
    description: "Advanced treasury and fund management features",
    icon: "🏦",
    comingSoon: true
  },
  {
    id: "governance",
    name: "Governance",
    description: "Voting and proposal management capabilities",
    icon: "🗳️",
    comingSoon: true
  },
  {
    id: "recovery",
    name: "Social Recovery",
    description: "Recover wallet access through trusted contacts",
    icon: "🔐",
    comingSoon: true
  },
  {
    id: "limit",
    name: "Spending Limits",
    description: "Set daily/monthly spending limits",
    icon: "💳",
    comingSoon: true
  }
];

// Sort extensions to show enabled ones first
export const getSortedExtensions = (): WalletExtension[] => {
  return [...walletExtensions].sort((a, b) => {
    if (a.comingSoon && !b.comingSoon) return 1;
    if (!a.comingSoon && b.comingSoon) return -1;
    return 0;
  });
};
