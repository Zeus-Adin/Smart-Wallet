import { Route, Routes } from "react-router-dom";
import Home from "./page";
import Dashboard from "./dashboard/page";
import WalletDashboard from "./dashboard/wallets/[address]/page";
import NoWallets from "./dashboard/no-wallets/page";
import CreateWallet from "./dashboard/create-wallet/page";
import WalletSettings from "./dashboard/wallets/[address]/settings/page";
import SupportPage from "./support/page";
import DocsPage from "./docs/page";
import NotFound from "./404/page";

export function PageRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/wallets/:address" element={<WalletDashboard />} />
            <Route path="/dashboard/wallets/:address/settings" element={<WalletSettings />} />
            <Route path="/dashboard/no-wallets" element={<NoWallets />} />
            <Route path="/dashboard/create-wallet" element={<CreateWallet />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}