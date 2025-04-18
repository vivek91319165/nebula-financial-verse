
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nebula-space p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Welcome to Nebula Budget</h1>
      <p className="text-gray-300 mb-8 text-center max-w-md">
        Your hybrid fiat/crypto budget management system with AI-driven insights and 3D visualization
      </p>
      <Button 
        onClick={() => navigate('/auth')}
        className="bg-nebula-purple hover:bg-nebula-purple-light"
      >
        Get Started
      </Button>
    </div>
  );
};

export default Index;
