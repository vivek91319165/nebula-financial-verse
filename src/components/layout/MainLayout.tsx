
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-nebula-space">
      <Navbar />
      <main className="flex-1 pl-16 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
