
import WalletLayout from "@/components/WalletLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wallet, FileText } from "lucide-react";
import { useState } from "react";

const ContractDetails = () => {
  const [contractAddress, setContractAddress] = useState("SP1ABC...XYZ123.smart-wallet-v1");

  const contractInfo = {
    address: "SP1ABC...XYZ123.smart-wallet-v1",
    owner: "SP1ABC...XYZ123",
    version: "1.0.0",
    deployedAt: "Block #123,456",
    sourceCode: `(define-data-var owner principal tx-sender)
(define-data-var balance uint u0)

(define-public (transfer (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) (err u401))
    (asserts! (>= (var-get balance) amount) (err u402))
    (var-set balance (- (var-get balance) amount))
    (ok true)
  )
)

(define-read-only (get-balance)
  (var-get balance)
)

(define-read-only (get-owner)
  (var-get owner)
)`,
    functions: [
      {
        name: "transfer",
        type: "public",
        args: ["amount: uint", "recipient: principal"],
        description: "Transfer tokens to another address"
      },
      {
        name: "get-balance",
        type: "read-only",
        args: [],
        description: "Get current balance"
      },
      {
        name: "get-owner",
        type: "read-only",
        args: [],
        description: "Get contract owner"
      }
    ]
  };

  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contract Details</h1>
          <p className="text-slate-400">View and interact with smart contract information.</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-purple-400" />
              Contract Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm">Contract Address</label>
                <Input
                  value={contractInfo.address}
                  readOnly
                  className="bg-slate-700/50 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Owner</label>
                <Input
                  value={contractInfo.owner}
                  readOnly
                  className="bg-slate-700/50 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Version</label>
                <Input
                  value={contractInfo.version}
                  readOnly
                  className="bg-slate-700/50 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Deployed At</label>
                <Input
                  value={contractInfo.deployedAt}
                  readOnly
                  className="bg-slate-700/50 border-slate-600 text-white mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Available Functions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contractInfo.functions.map((func, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{func.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        func.type === "public" ? "bg-green-600/20 text-green-300" : "bg-blue-600/20 text-blue-300"
                      }`}>
                        {func.type}
                      </span>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Call Function
                    </Button>
                  </div>
                  <div className="text-slate-400 text-sm mb-1">
                    Arguments: {func.args.length > 0 ? func.args.join(", ") : "None"}
                  </div>
                  <div className="text-slate-300 text-sm">{func.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-400" />
              Source Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={contractInfo.sourceCode}
              readOnly
              className="bg-slate-900/50 border-slate-600 text-green-300 font-mono text-sm min-h-64"
            />
            <div className="flex justify-end mt-4">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                View on Explorer
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-700/50">
          <CardContent className="p-6">
            <div className="space-y-2">
              <h3 className="text-blue-300 font-medium">Contract Verification</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-200 text-sm">Contract source code is verified and matches deployed bytecode</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WalletLayout>
  );
};

export default ContractDetails;
