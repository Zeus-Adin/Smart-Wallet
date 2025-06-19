
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900/80 border-t border-slate-800/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold text-white">Smart Wallet</span>
            </div>
            <p className="text-slate-400 text-sm">
              Next-generation blockchain wallet solution for secure asset management.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">Features</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">Documentation</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Guides</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">API Docs</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Support</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms & Conditions</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 Smart Wallet. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy</a>
              <Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
