import { ArrowRight, ExternalLink, Sparkles, Wallet } from "lucide-react"
import { Navbar } from "../../components/navbar"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"

export default function NotFound() {
    console.log({ notfound: 'Not found' })

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <Navbar />
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 crypto-blur-bg">
                    <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                                        <Sparkles className="h-3 w-3 mr-1" /> Next Generation Wallet
                                    </Badge>
                                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none crypto-gradient-text">
                                        Oops!
                                    </h1>
                                    <p className="max-w-[600px] text-gray-400 md:text-xl">
                                        The page you’re looking for doesn’t exist or has moved.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link to="/">
                                        <Button className="inline-flex h-12 items-center justify-center rounded-md crypto-button px-8 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                            Return to Home
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link to="/docs">
                                        <Button
                                            variant="outline"
                                            className="inline-flex h-12 items-center justify-center rounded-md crypto-button-outline px-8 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            Documentation
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative h-[350px] w-full overflow-hidden rounded-xl crypto-card-highlight p-6 shadow-lg">
                                    <div className="absolute inset-0 bg-grid-white/5 bg-[bottom_1px_right_1px] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                                        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                            <Wallet className="h-10 w-10 text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2 crypto-gradient-text">Smart Contract Wallet</h2>
                                        <p className="max-w-md text-gray-400">
                                            A secure smart contract solution designed to hold assets in the name of one or more users,
                                            enhancing both security and usability.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
                <p className="text-xs text-gray-500">© 2025 Smart Wallet. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs text-gray-500 hover:text-gray-400" to="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs text-gray-500 hover:text-gray-400" to="#">
                        Privacy
                    </Link>
                    <Link
                        className="text-xs text-gray-500 hover:text-gray-400"
                        to="https://polimartlabs.gitbook.io/smart-wallet"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Docs <ExternalLink className="h-3 w-3 inline" />
                    </Link>
                </nav>
            </footer>
        </div>
    )
}