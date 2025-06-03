import { Route, Routes } from "react-router-dom";
import Home from "./page";
import Dashboard from "./dashboard/page";
import WalletDashboard from "./dashboard/wallets/[address]/page";
import NoWallets from "./dashboard/no-wallets/page";
import CreateWallet from "./dashboard/create-wallet/page";
import WalletSettings from "./dashboard/wallets/[address]/settings/page";

export function PageRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/wallets/:address" element={<WalletDashboard />} />
            <Route path="/dashboard/wallets/:address/settings" element={<WalletSettings />} />
            <Route path="/dashboard/no-wallets" element={<NoWallets />} />
            <Route path="/dashboard/create-wallet" element={<CreateWallet />} />
        </Routes>
    )
}