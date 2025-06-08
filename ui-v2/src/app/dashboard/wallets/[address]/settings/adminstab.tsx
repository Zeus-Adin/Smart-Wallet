import { Info, Shield, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { TabsContent } from "../../../../../components/ui/tabs";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../lib/auth-provider";
import { Badge } from "../../../../../components/ui/badge";

export default function AdminsTab() {

  return (
    <TabsContent value="admins" className="space-y-4">
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle>Admins & Signers</CardTitle>
          <CardDescription>Manage who can control and sign transactions for this wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Current Admins</h3>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {/* {wallet.admins.length} {wallet.admins.length === 1 ? "Admin" : "Admins"} */}
              </Badge>
            </div>
            <div className="space-y-3">
              {/* {wallet.admins.map((admin, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                              <Users className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium">{admin.name}</div>
                              <div className="text-xs text-gray-400">
                                {admin.address.slice(0, 6)}...{admin.address.slice(-4)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                              {admin.role}
                            </Badge>
                            {admin.role !== "Owner" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                onClick={() => handleRemoveAdmin(admin.address)}
                                disabled={isUpdating}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))} */}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <h3 className="font-medium mb-3">Add New Admin</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Admin Name</Label>
                <Input
                  id="admin-name"
                  placeholder="E.g., Finance Manager"
                  className="crypto-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-address">Admin Address</Label>
                <Input
                  id="admin-address"
                  placeholder="Enter STX address"
                  className="crypto-input"
                />
              </div>
              <Button
                className="w-full crypto-button"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add Admin
              </Button>
            </div>
          </div>

          <Alert className="bg-gray-900 border-gray-800">
            <Shield className="h-4 w-4 text-primary" />
            <AlertTitle>Multi-Signature Configuration</AlertTitle>
            <AlertDescription className="text-gray-400">
              This wallet requires {1} out of {1} signatures to approve
              transactions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </TabsContent>
  )
}