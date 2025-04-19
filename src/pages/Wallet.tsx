
import { useState, useEffect } from "react";
import { Wallet as WalletIcon, Plus, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useWallet } from "@/hooks/useWallet";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Wallet = () => {
  const { 
    connect, 
    disconnect, 
    isConnecting, 
    walletAddress, 
    assets, 
    error 
  } = useWallet();
  
  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Crypto Wallet</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-nebula-space-light border-nebula-purple/20">
              <CardHeader>
                <CardTitle className="text-nebula-purple">Wallet Connection</CardTitle>
                <CardDescription>Connect your Web3 wallet to manage your crypto assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-900/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {walletAddress ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-nebula-purple/10 border border-nebula-purple/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-nebula-purple/20 flex items-center justify-center mr-3">
                            <WalletIcon className="h-5 w-5 text-nebula-purple" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Connected Wallet</p>
                            <p className="font-mono text-white">
                              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-nebula-purple/30 text-nebula-purple"
                          onClick={disconnect}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>View on Explorer</span>
                      <a 
                        href={`https://etherscan.io/address/${walletAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-nebula-purple hover:text-nebula-purple-light"
                      >
                        Etherscan <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={connect}
                    className="w-full bg-nebula-purple hover:bg-nebula-purple-light"
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="bg-nebula-space-light border-nebula-purple/20 h-full">
              <CardHeader>
                <CardTitle className="text-nebula-purple">Your Crypto Assets</CardTitle>
                <CardDescription>View and manage your cryptocurrency portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                {!walletAddress ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <WalletIcon className="h-12 w-12 text-nebula-purple/30 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Wallet Connected</h3>
                    <p className="text-gray-400 mb-6 max-w-md">
                      Connect your Web3 wallet to view your cryptocurrency assets and manage your portfolio
                    </p>
                    <Button
                      onClick={connect}
                      className="bg-nebula-purple hover:bg-nebula-purple-light"
                      disabled={isConnecting}
                    >
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </Button>
                  </div>
                ) : assets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="rounded-full bg-nebula-purple/10 p-4 mb-4">
                      <Plus className="h-8 w-8 text-nebula-purple" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Assets Found</h3>
                    <p className="text-gray-400 max-w-md">
                      Your connected wallet doesn't have any detectable assets. You can add custom tokens or try another wallet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assets.map((asset, index) => (
                      <div key={index} className="p-4 rounded-lg bg-nebula-purple/5 border border-nebula-purple/10 flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-nebula-purple/20 flex items-center justify-center mr-2">
                              <span className="text-xs font-medium text-nebula-purple">{asset.symbol.slice(0, 3)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{asset.name}</p>
                              <p className="text-xs text-gray-400">{asset.balance} {asset.symbol}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">${asset.value.toFixed(2)}</p>
                          <p className={`text-xs ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Wallet;
