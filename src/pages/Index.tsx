
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import NebulaBackground from '@/components/effects/NebulaBackground';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NebulaBackground intensity={1.5} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4"
      >
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold text-white mb-6 text-center"
        >
          Nebula Budget
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-gray-300 mb-12 text-center max-w-2xl"
        >
          Your hybrid fiat/crypto budget management system with AI-driven insights and 3D visualization
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-x-4"
        >
          <Button 
            onClick={() => navigate('/auth?mode=login')}
            className="bg-nebula-blue hover:bg-nebula-blue-light text-lg px-8 py-6"
            size="lg"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/auth?mode=signup')}
            className="bg-nebula-purple hover:bg-nebula-purple-light text-lg px-8 py-6"
            size="lg"
          >
            Sign Up
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
