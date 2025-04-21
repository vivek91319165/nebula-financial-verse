
import React from "react";
import { cn } from "@/lib/utils";

type TitleProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;

export const Title = ({ 
  children, 
  className,
  ...props 
}: TitleProps) => {
  return (
    <h1 
      className={cn(
        "text-2xl font-bold tracking-tight text-white mb-4", 
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

export const Subtitle = ({ 
  children, 
  className,
  ...props 
}: TitleProps) => {
  return (
    <h2 
      className={cn(
        "text-xl font-semibold text-white/90", 
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export const Paragraph = ({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p 
      className={cn(
        "text-base text-white/80", 
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};
