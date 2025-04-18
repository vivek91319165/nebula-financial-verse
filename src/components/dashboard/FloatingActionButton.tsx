
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingActionButtonProps {
  to: string;
  label?: string;
}

const FloatingActionButton = ({ to, label = "Add" }: FloatingActionButtonProps) => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to={to}>
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-nebula-blue to-nebula-purple hover:from-nebula-blue-light hover:to-nebula-purple-light shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle size={24} />
          <span className="sr-only">{label}</span>
        </Button>
      </Link>
    </motion.div>
  );
};

export default FloatingActionButton;
