
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MiniCardProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  variant?: "default" | "blue" | "purple" | "orange" | "green";
  onClick?: () => void;
  className?: string;
  pulseEffect?: boolean;
}

const MiniCard = ({
  icon: Icon,
  label,
  value,
  variant = "default",
  onClick,
  className,
  pulseEffect = false,
}: MiniCardProps) => {
  const variantClasses = {
    default: "bg-card text-card-foreground border-border",
    blue: "bg-nebula-blue/10 text-nebula-blue border-nebula-blue/20",
    purple: "bg-nebula-purple/10 text-nebula-purple border-nebula-purple/20",
    orange: "bg-nebula-orange/10 text-nebula-orange border-nebula-orange/20",
    green: "bg-nebula-green/10 text-green-400 border-green-400/20",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Card 
        className={cn(
          "p-3 cursor-pointer transition-all border shadow-sm nebula-glow",
          variantClasses[variant],
          className,
          pulseEffect && "animate-pulse-slow"
        )}
        onClick={onClick}
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            variant === "blue" && "bg-nebula-blue/20",
            variant === "purple" && "bg-nebula-purple/20",
            variant === "orange" && "bg-nebula-orange/20",
            variant === "green" && "bg-nebula-green/20",
            variant === "default" && "bg-gray-200/10"
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-medium">{label}</div>
            {value && <div className="text-sm mt-0.5">{value}</div>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MiniCard;
