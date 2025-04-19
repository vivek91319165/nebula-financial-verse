
import { Button } from "@/components/ui/button";
import { 
  Home, 
  PlusCircle, 
  BarChart3, 
  Brain, 
  Wallet, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 h-screen w-16 flex flex-col items-center py-8 bg-nebula-space border-r border-nebula-purple/20">
      <div className="flex flex-col items-center space-y-10">
        <Link to="/dashboard" className="text-nebula-purple hover:text-nebula-purple-light transition-colors duration-200">
          <div className="w-8 h-8 flex items-center justify-center bg-nebula-purple/10 rounded-lg nebula-glow">
            <Home size={20} />
          </div>
        </Link>
        
        <Link to="/add-expense" className="text-nebula-blue hover:text-nebula-blue-light transition-colors duration-200">
          <div className="w-8 h-8 flex items-center justify-center bg-nebula-blue/10 rounded-lg nebula-glow">
            <PlusCircle size={20} />
          </div>
        </Link>
        
        <Link to="/analytics" className="text-nebula-orange hover:text-nebula-orange-light transition-colors duration-200">
          <div className="w-8 h-8 flex items-center justify-center bg-nebula-orange/10 rounded-lg nebula-glow">
            <BarChart3 size={20} />
          </div>
        </Link>
        
        <Link to="/ai-insights" className="text-nebula-orange hover:text-nebula-orange-light transition-colors duration-200">
          <div className="w-8 h-8 flex items-center justify-center bg-nebula-orange/10 rounded-lg nebula-glow">
            <Brain size={20} />
          </div>
        </Link>
        
        <Link to="/wallet" className="text-nebula-purple hover:text-nebula-purple-light transition-colors duration-200">
          <div className="w-8 h-8 flex items-center justify-center bg-nebula-purple/10 rounded-lg nebula-glow">
            <Wallet size={20} />
          </div>
        </Link>
        
        <Link to="/settings" className="text-gray-400 hover:text-gray-200 transition-colors duration-200">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-800/20 rounded-lg nebula-glow">
            <Settings size={20} />
          </div>
        </Link>
      </div>

      <div className="mt-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut size={20} />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
