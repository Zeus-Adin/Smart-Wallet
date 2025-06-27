import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Wallet, Plus, Check, Clock, User, Globe, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { getSortedExtensions } from "@/data/walletExtensions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import SecondaryButton from "@/components/ui/secondary-button";
import PrimaryButton from "@/components/ui/primary-button";
import { ContractTypes, getVerifiedContracts, type ContractType } from "@/data/walletTypes";
import { BlockchainService } from "@/services/blockchainService";
import axios from "axios";

const CreateWallet = () => {
  const { walletData } = useWalletConnection()
  const [description, setDescription] = useState("")
  const [selectedContract, setSelectedContract] = useState<ContractType>()
  const [isCreating, setIsCreating] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<'mainnet' | 'testnet'>('mainnet')
  const [verifiedContracts, setVerifiedContracts] = useState<ContractType[]>([])

  const getConnectedWalletAddress = () => {
    if (walletData?.addresses?.stx && walletData.addresses.stx.length > 0) {
      const address = walletData.addresses.stx[0].address;
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return "Not Connected";
  };

  const handleExtensionToggle = (contract: ContractType) => {
    setSelectedContract(contract)
  };

  const handleCreateWallet = async () => {
    setIsCreating(true);
    const deployContract = new BlockchainService
    const clarityCode: string = (await axios.get(selectedContract?.src)).data;
    deployContract.deployContract({
      name: selectedContract.name,
      clarityCode: clarityCode,
      clarityVersion: 3
    })
    // Simulate wallet creation
    setTimeout(() => {
      setIsCreating(false);
    }, 2000);
  };

  const handleNetworkSwitch = (network: 'mainnet' | 'testnet') => {
    setSelectedNetwork(network);
    console.log(`Switched to ${network}`);
  };

  useEffect(() => {
    async function init() {
      const vContracts = await getVerifiedContracts(walletData?.addresses?.stx[0]?.address)
      console.log({ vContracts })
      setVerifiedContracts(vContracts)
    }
    init()
  }, [walletData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Simple Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">Smart Wallet</span>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Connected Wallet Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SecondaryButton size="sm" >
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden lg:inline">{getConnectedWalletAddress()}</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </SecondaryButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white">
                  <DropdownMenuLabel>Connected Wallet</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700" asChild>
                    <Link to="/wallet-selector">
                      <Wallet className="mr-2 h-4 w-4" />
                      Switch Wallet
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Network Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SecondaryButton size="sm">
                    <Globe className="mr-2 h-4 w-4" />
                    <span className="hidden lg:inline">{selectedNetwork}</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </SecondaryButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700 text-white">
                  <DropdownMenuLabel>Select Network</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="hover:bg-slate-700 focus:bg-slate-700"
                    onClick={() => handleNetworkSwitch('mainnet')}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Mainnet</span>
                      {selectedNetwork === 'mainnet' && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-slate-700 focus:bg-slate-700"
                    onClick={() => handleNetworkSwitch('testnet')}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Testnet</span>
                      {selectedNetwork === 'testnet' && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Smart Wallet</h1>
            <p className="text-slate-400">Deploy a new smart contract wallet with custom extensions.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Wallet Configuration */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wallet className="mr-2 h-5 w-5 text-purple-400" />
                  Wallet Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm">Wallet Name</label>
                  <Input
                    disabled
                    value={selectedContract?.name}
                    placeholder="e.g., My Personal Wallet"
                    className="bg-slate-700/50 border-slate-600 text-white mt-1"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm">Description (Optional)</label>
                  <Textarea
                    disabled
                    value={selectedContract?.description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this wallet's purpose..."
                    className="bg-slate-700/50 border-slate-600 text-white mt-1"
                    rows={3}
                  />
                </div>

                <div className="pt-4">
                  <PrimaryButton
                    onClick={handleCreateWallet}
                    disabled={isCreating || !selectedContract}
                    className="w-full"
                  >
                    {isCreating ? (
                      "Creating Wallet..."
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Smart Wallet
                      </>
                    )}
                  </PrimaryButton>
                </div>
              </CardContent>
            </Card>

            {/* Extensions Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Select Extensions</CardTitle>
                <p className="text-slate-400 text-sm">Choose extensions to add to your smart wallet</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verifiedContracts.map((contract) => (
                    <div
                      key={contract.name}
                      className={`p-3 rounded-lg border transition-colors ${contract.comingSoon
                        ? "border-slate-600 bg-slate-700/20 opacity-60 cursor-not-allowed"
                        : selectedContract?.name === contract.name
                          ? "border-purple-600/50 bg-purple-600/10 cursor-pointer"
                          : "border-slate-600 bg-slate-700/30 hover:border-slate-500 cursor-pointer"
                        }`}
                      onClick={contract.isDeployed ? null : () => handleExtensionToggle(contract)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedContract?.name === contract.name}
                          disabled={contract.isDeployed}
                          onChange={() => handleExtensionToggle(contract)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{contract.icon}</span>
                            <span className={`font-medium ${contract.comingSoon ? 'text-slate-400' : 'text-white'}`}>
                              {contract.name}
                            </span>
                            {contract.comingSoon && (
                              <div className="flex items-center space-x-1 px-2 py-1 bg-slate-600/50 rounded-full">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <span className="text-xs text-slate-400">Coming Soon</span>
                              </div>
                            )}
                            {selectedContract?.name === contract.name && !contract.comingSoon && (
                              <Check className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${contract.comingSoon ? 'text-slate-500' : 'text-slate-400'}`}>
                            {contract.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}

          <Card className="bg-blue-900/20 border-blue-700/50">
            <CardContent className="p-6">
              <h3 className="text-blue-300 font-medium mb-3">Creation Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="text-blue-200">
                  <span className="text-blue-300">Name:</span> {selectedContract?.label}
                </div>

                <div className="text-blue-200">
                  <span className="text-blue-300">Contract Name:</span> {selectedContract?.name}
                </div>

                <div className="text-blue-200">
                  <span className="text-blue-300">Estimated Gas:</span> ~0.05 STX
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default CreateWallet;
