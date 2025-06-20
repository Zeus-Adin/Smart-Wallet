
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import CSWCard from "@/components/ui/csw-card";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">Smart Wallet</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Terms Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Terms & Conditions
            </h1>
            <p className="text-slate-400">
              Last updated: June 19, 2025
            </p>
          </div>

          <CSWCard>
            <CardContent className="p-8 space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                <p className="text-slate-300 leading-relaxed">
                  By accessing and using Smart Wallet, you accept and agree to be bound by the terms and provision of this agreement.
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">2. Use License</h2>
                <p className="text-slate-300 leading-relaxed">
                  Permission is granted to temporarily download one copy of Smart Wallet per device for personal,
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained in Smart Wallet</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">3. Wallet Security</h2>
                <p className="text-slate-300 leading-relaxed">
                  You are responsible for maintaining the security of your wallet and private keys. Smart Wallet does not store
                  your private keys and cannot recover them if lost. Always ensure you have secure backups of your recovery phrases.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">4. Beta Software</h2>
                <p className="text-slate-300 leading-relaxed">
                  Smart Wallet is currently in beta. The software may contain bugs or errors and is provided "as is" without
                  warranty of any kind. Use at your own risk and never invest more than you can afford to lose.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">5. Disclaimer</h2>
                <p className="text-slate-300 leading-relaxed">
                  The materials on Smart Wallet are provided on an 'as is' basis. Smart Wallet makes no warranties,
                  expressed or implied, and hereby disclaims and negates all other warranties including without limitation,
                  implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
                  of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">6. Limitations</h2>
                <p className="text-slate-300 leading-relaxed">
                  In no event shall Smart Wallet or its suppliers be liable for any damages (including, without limitation,
                  damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                  to use Smart Wallet, even if Smart Wallet or its authorized representative has been notified orally or
                  in writing of the possibility of such damage.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">7. Governing Law</h2>
                <p className="text-slate-300 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws and you irrevocably
                  submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">8. Contact Information</h2>
                <p className="text-slate-300 leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us through our support channels.
                </p>
              </section>
            </CardContent>
          </CSWCard>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
