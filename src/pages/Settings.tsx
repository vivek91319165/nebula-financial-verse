
import { useState } from "react";
import { Wallet, Network, Sliders, Palette, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const Settings = () => {
  const [nebulaIntensity, setNebulaIntensity] = useState(0.7);
  const [isTestnet, setIsTestnet] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("cosmic");

  const themes = [
    { id: "cosmic", name: "Cosmic Violet", color: "#9b87f5" },
    { id: "celestial", name: "Celestial Blue", color: "#1EAEDB" },
    { id: "solar", name: "Solar Flare", color: "#F97316" },
    { id: "dark", name: "Dark Matter", color: "#0F172A" },
  ];

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 mr-3">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-8">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <Card className="p-6 bg-nebula-space-light border-gray-700">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Nebula Intensity</h3>
                        <p className="text-sm text-gray-400">Adjust the visual effects intensity to optimize performance</p>
                      </div>
                      <Sliders className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-gray-300">Background Particles</Label>
                          <span className="text-gray-400">{Math.round(nebulaIntensity * 100)}%</span>
                        </div>
                        <Slider
                          value={[nebulaIntensity * 100]}
                          max={100}
                          step={1}
                          onValueChange={(value) => setNebulaIntensity(value[0] / 100)}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Low (Better Performance)</span>
                          <span className="text-xs text-gray-500">High (Better Visuals)</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-gray-300">3D Visualization Quality</Label>
                            <p className="text-xs text-gray-500 mt-1">Higher settings require more GPU power</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm text-gray-400">Medium</Label>
                            <Button variant="outline" size="sm" className="h-7 px-2">Change</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-gray-300">Animation Effects</Label>
                            <p className="text-xs text-gray-500 mt-1">UI transition animations</p>
                          </div>
                          <Switch checked={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6">
              <Card className="p-6 bg-nebula-space-light border-gray-700">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Wallet Management</h3>
                        <p className="text-sm text-gray-400">Configure your cryptocurrency wallets and networks</p>
                      </div>
                      <Wallet className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <div className="bg-nebula-purple/10 p-4 rounded-lg border border-nebula-purple/20">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-nebula-purple/20 rounded-full flex items-center justify-center mr-3">
                              <Wallet className="h-4 w-4 text-nebula-purple" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">Connected Wallet</h4>
                              <p className="text-xs text-gray-400">0x71C7...F9E2</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-8 text-xs">Disconnect</Button>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-gray-300">Network Mode</Label>
                            <p className="text-xs text-gray-500 mt-1">Use testnet for development</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm text-gray-400">{isTestnet ? "Testnet" : "Mainnet"}</Label>
                            <Switch 
                              checked={isTestnet}
                              onCheckedChange={setIsTestnet}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-800">
                        <Button className="w-full" variant="outline">
                          <Network className="h-4 w-4 mr-2" />
                          Add New Wallet
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="p-6 bg-nebula-space-light border-gray-700">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Visual Theme</h3>
                        <p className="text-sm text-gray-400">Customize the appearance of your interface</p>
                      </div>
                      <Palette className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {themes.map((theme) => (
                        <div 
                          key={theme.id}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                            selectedTheme === theme.id 
                              ? "border-white" 
                              : "border-transparent hover:border-gray-600"
                          }`}
                          onClick={() => setSelectedTheme(theme.id)}
                        >
                          <div 
                            className="w-full h-24 rounded-md mb-2" 
                            style={{ 
                              background: `linear-gradient(to bottom right, ${theme.color}, ${theme.id === "dark" ? "#000" : "#0F172A"})` 
                            }}
                          />
                          <h4 className="font-medium text-white">{theme.name}</h4>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-gray-800">
                      <Button className="w-full">
                        Apply Theme
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
