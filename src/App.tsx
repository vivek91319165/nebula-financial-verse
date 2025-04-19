
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Analytics from "./pages/Analytics";
import AiInsights from "./pages/AiInsights";
import Settings from "./pages/Settings";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import AuthProvider from "./providers/AuthProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-insights" element={<AiInsights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
