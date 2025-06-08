"use client"

import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Check, ChevronRight, AlertCircle, Hourglass } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Badge } from "../../../components/ui/badge"
import ProtectedRoute from "../../../components/protected-route"
import { Navbar } from "../../../components/navbar"
import { presetContracts } from "../../../lib/constants"
import { useAuth } from "../../../lib/auth-provider"
import { useTx } from "../../../lib/tx-provider"
import type { DeployContractParams } from "@stacks/connect/dist/types/methods"
import axios from "axios"

export default function CreateWallet() {
  const router = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedContract = searchParams.get('contract') ?? 0
  const currentTab = searchParams.get('tab') ?? 'contract'
  const [selectedPreset, setSelectedPreset] = useState(presetContracts[Number(selectedContract)])

  // Configure Values
  const [walletName, setWalletName] = useState("")
  const [signers, setSigners] = useState(1)
  const [threshold, setThreshold] = useState(1)

  const [isDeploying, setIsDeploying] = useState(false)
  const { userData, handleGetClientConfig } = useAuth()
  const { handleContractDeploy } = useTx()

  const handlePresetSelect = (preset: any) => {
    setSelectedPreset(preset)
    setSigners(preset.signers)
    setThreshold(preset.threshold)
  }

  const handleDeploy = async () => {
    const sp = selectedPreset;

    if (!sp?.contractName || !sp?.contractSrc) {
      console.error("Missing contract name or source");
      return;
    }

    const name: string = sp.contractName;
    const clarityCode: string = (await axios.get(sp.contractSrc)).data;
    setIsDeploying(true);

    try {
      const authed_user = userData?.addresses?.stx?.[0]?.address
      const { network } = handleGetClientConfig(authed_user)

      const params: DeployContractParams = {
        name,
        clarityCode,
        clarityVersion: 3,
        network,
        postConditionMode: 'deny'
      }
      console.log({ params })
      handleContractDeploy(params);
    } catch (error) {
      console.error(error);
      setIsDeploying(false);
    } finally {
      setIsDeploying(false);
    }
  };


  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col p-4 md:p-8 bg-black crypto-blur-bg">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-2 text-gray-400 hover:text-white"
              onClick={() => router("/dashboard/no-wallets")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl text-white font-bold">Create Smart Wallet</h1>
            <p className="text-gray-400">Deploy a new smart wallet with your preferred settings</p>
          </div>

          <Tabs defaultValue="contract" value={currentTab} className="space-y-6" onValueChange={(val) => {
            searchParams.set('tab', val)
            setSearchParams(searchParams)
          }}>
            <TabsList className="crypto-tab-list grid w-full grid-cols-2 bg-gray-900/50 p-1 rounded-lg">
              <TabsTrigger value="contract" className="crypto-tab data-[state=active]:crypto-tab-active">
                Contracts
              </TabsTrigger>
              <TabsTrigger disabled={!selectedPreset?.customConfig} value="custom" className="crypto-tab data-[state=active]:crypto-tab-active">
                Custom Configuration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contract" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {presetContracts.map((contract) => (
                  <Card
                    key={contract.id}
                    className={`crypto-card hover:border-primary/50 cursor-pointer transition-all ${selectedPreset.id === contract.id ? "border-primary" : "border-gray-800"
                      }`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{contract.name}</CardTitle>

                        {contract.recommended && (<Badge className="bg-primary/20 text-primary border-primary/30">Recommended</Badge>)}
                        {contract.extension && (<Badge className="bg-orange-300/30 text-orange-300 border-orange-300/30">Extension</Badge>)}

                      </div>
                      <CardDescription>{contract.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Signers:</span>
                          <span>{contract.signers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Required signatures:</span>
                          <span>
                            {contract.threshold} of {contract.signers}
                          </span>
                        </div>
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Features:</h4>
                          <ul className="space-y-1">
                            {contract.features.map((feature, index) => (
                              <li key={index} className="text-xs text-gray-400 flex items-center">
                                <Check className="h-3 w-3 text-green-400 mr-2" /> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {contract?.state && (
                          <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Status:</h4>
                            <ul className="space-y-1">
                              <li className="text-xs text-gray-400 flex items-center">
                                <Hourglass className="h-3 w-3 text-orange-400 mr-2" />
                                <Check className="h-3 w-3 text-green-400 mr-2" />
                                <Link to={``} >{'tx'}</Link>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={!contract.deployable}
                        variant="outline"
                        className="w-full crypto-button-outline text-white"
                        onClick={() => handlePresetSelect(contract)}
                      >
                        {selectedPreset.id === contract.id ? "Selected" : "Select"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle>Custom Wallet Configuration</CardTitle>
                  <CardDescription>Configure your smart wallet with custom settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-name">Wallet Name</Label>
                    <Input
                      id="wallet-name"
                      placeholder="My Smart Wallet"
                      className="crypto-input"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signers">Number of Signers</Label>
                    <Input
                      id="signers"
                      type="number"
                      min="1"
                      max="10"
                      className="crypto-input"
                      value={signers}
                      onChange={(e) => setSigners(Number.parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-400">The total number of addresses that can sign transactions</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Required Signatures</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="1"
                      max={signers}
                      className="crypto-input"
                      value={threshold}
                      onChange={(e) => setThreshold(Number.parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-400">How many signatures are required to approve a transaction</p>
                  </div>
                  <Alert className="bg-gray-900 border-gray-800">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription className="text-gray-400">
                      Make sure you have access to all signer addresses. Lost access cannot be recovered without a
                      recovery mechanism.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-4">
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle>Deployment Summary</CardTitle>
                <CardDescription>Review your wallet configuration before deployment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Configuration:</span>
                    <span className="font-medium text-white">{selectedPreset.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{selectedPreset.contractName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white">{handleGetClientConfig(userData?.addresses?.stx?.[0]?.address)?.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Required signatures:</span>
                    <span className="text-white">
                      {selectedPreset.threshold} of {selectedPreset.signers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deployment by:</span>
                    <span className="text-white text-wrap">{userData?.addresses?.stx?.[0]?.address}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full crypto-button" onClick={handleDeploy} disabled={isDeploying}>
                  {isDeploying ? (
                    <>Deploying Smart Wallet...</>
                  ) : (
                    <>
                      Deploy Smart Wallet <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}