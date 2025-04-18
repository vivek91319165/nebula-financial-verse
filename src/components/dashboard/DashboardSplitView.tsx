
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight } from "lucide-react";
import StatCard from "./StatCard";

interface SplitViewProps {
  fiatContent: React.ReactNode;
  cryptoContent: React.ReactNode;
}

const DashboardSplitView = ({ fiatContent, cryptoContent }: SplitViewProps) => {
  const [viewMode, setViewMode] = useState<"split" | "fiat" | "crypto">("split");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="split" className="w-[300px]">
            <TabsList className="grid grid-cols-3 bg-nebula-space-light">
              <TabsTrigger 
                value="fiat" 
                onClick={() => setViewMode("fiat")}
                className="data-[state=active]:bg-nebula-blue/20 data-[state=active]:text-nebula-blue"
              >
                Fiat
              </TabsTrigger>
              <TabsTrigger 
                value="split" 
                onClick={() => setViewMode("split")}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-nebula-blue/20 data-[state=active]:to-nebula-purple/20 data-[state=active]:text-white"
              >
                Split
              </TabsTrigger>
              <TabsTrigger 
                value="crypto" 
                onClick={() => setViewMode("crypto")}
                className="data-[state=active]:bg-nebula-purple/20 data-[state=active]:text-nebula-purple"
              >
                Crypto
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 relative transition-all duration-300 ease-in-out">
        {viewMode === "split" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-nebula-space-light border-nebula-blue/20 p-4 h-[70vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-nebula-blue font-semibold">Fiat Overview</h3>
                <Button variant="outline" size="sm" className="border-nebula-blue/20 text-nebula-blue hover:text-nebula-blue-light">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </div>
              {fiatContent}
            </Card>
            
            <Card className="bg-nebula-space-light border-nebula-purple/20 p-4 h-[70vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-nebula-purple font-semibold">Crypto Overview</h3>
                <Button variant="outline" size="sm" className="border-nebula-purple/20 text-nebula-purple hover:text-nebula-purple-light">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </div>
              {cryptoContent}
            </Card>
          </div>
        ) : viewMode === "fiat" ? (
          <Card className="bg-nebula-space-light border-nebula-blue/20 p-4 h-[70vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-nebula-blue font-semibold">Fiat Overview</h3>
              <Button variant="outline" size="sm" className="border-nebula-blue/20 text-nebula-blue hover:text-nebula-blue-light">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
            {fiatContent}
          </Card>
        ) : (
          <Card className="bg-nebula-space-light border-nebula-purple/20 p-4 h-[70vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-nebula-purple font-semibold">Crypto Overview</h3>
              <Button variant="outline" size="sm" className="border-nebula-purple/20 text-nebula-purple hover:text-nebula-purple-light">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
            {cryptoContent}
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardSplitView;
