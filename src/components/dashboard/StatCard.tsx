
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "blue" | "purple" | "orange" | "green";
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
  className,
}: StatCardProps) => {
  const variantClasses = {
    default: "bg-card text-card-foreground",
    blue: "bg-nebula-blue/10 text-nebula-blue border-nebula-blue/20",
    purple: "bg-nebula-purple/10 text-nebula-purple border-nebula-purple/20",
    orange: "bg-nebula-orange/10 text-nebula-orange border-nebula-orange/20",
    green: "bg-nebula-green/10 text-green-400 border-green-400/20",
  };

  return (
    <Card className={cn("border shadow-md nebula-glow", variantClasses[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 opacity-70" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;
