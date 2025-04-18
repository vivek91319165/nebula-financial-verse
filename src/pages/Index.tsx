
import { useState } from "react";
import { ArrowRight, Brain, Boxes, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NebulaBackground from "@/components/effects/NebulaBackground";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    // Simulate loading then redirect
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <NebulaBackground intensity={0.7} />
      
      <div className="z-10 container max-w-5xl px-8 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="text-gradient">Nebula</span> Budget
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
            The future of hybrid fiat/crypto budget management with AI-driven insights and 3D visualization
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-nebula-blue to-nebula-purple hover:from-nebula-blue-light hover:to-nebula-purple-light text-white px-8"
            onClick={handleGetStarted}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            )}
          </Button>
          
          <Link to="/demo">
            <Button 
              variant="outline" 
              size="lg"
              className="text-white border-white/20 hover:bg-white/10"
            >
              View Demo
            </Button>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl"
        >
          <div className="bg-nebula-space-light/60 backdrop-blur-sm p-6 rounded-xl border border-nebula-blue/20 nebula-glow">
            <div className="bg-nebula-blue/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Boxes className="text-nebula-blue h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">3D Visualization</h3>
            <p className="text-gray-300">Interact with your finances in an immersive 3D financial galaxy</p>
          </div>
          
          <div className="bg-nebula-space-light/60 backdrop-blur-sm p-6 rounded-xl border border-nebula-orange/20 nebula-glow">
            <div className="bg-nebula-orange/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Brain className="text-nebula-orange h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Insights</h3>
            <p className="text-gray-300">Get intelligent recommendations from our advanced AI</p>
          </div>
          
          <div className="bg-nebula-space-light/60 backdrop-blur-sm p-6 rounded-xl border border-nebula-purple/20 nebula-glow">
            <div className="bg-nebula-purple/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Zap className="text-nebula-purple h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Crypto Integration</h3>
            <p className="text-gray-300">Seamlessly manage both fiat and cryptocurrency in one place</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
