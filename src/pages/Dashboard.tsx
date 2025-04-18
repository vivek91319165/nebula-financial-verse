import { DollarSign, ArrowDownRight, ArrowUpRight, Wallet, Brain, Boxes } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import DashboardSplitView from "@/components/dashboard/DashboardSplitView";
import FloatingActionButton from "@/components/dashboard/FloatingActionButton";
import MiniCard from "@/components/dashboard/MiniCard";
import BudgetGalaxy from "@/components/visualization/BudgetGalaxy";

const Dashboard = () => {
  // Sample fiat content
  const FiatContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Balance"
          value="$4,750.00"
          description="+$250 this month"
          icon={DollarSign}
          variant="blue"
        />
        <StatCard
          title="Monthly Spending"
          value="$2,120.50"
          description="65% of budget"
          icon={ArrowDownRight}
          variant="blue"
        />
      </div>
      
      <h3 className="text-nebula-blue font-semibold mt-6 mb-3">Recent Transactions</h3>
      <ExpensesList />
    </div>
  );
  
  // Sample crypto content
  const CryptoContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Crypto Balance"
          value="$2,340.75"
          description="0.075 BTC | 2.5 ETH"
          icon={Wallet}
          variant="purple"
        />
        <StatCard
          title="Monthly Gain"
          value="+$320.25"
          description="13.7% increase"
          icon={ArrowUpRight}
          variant="purple"
        />
      </div>
      
      <h3 className="text-nebula-purple font-semibold mt-6 mb-3">Your Assets</h3>
      <div className="space-y-2">
        {[
          { name: "Bitcoin (BTC)", amount: "0.075 BTC", value: "$1,950.00", change: "+5.2%" },
          { name: "Ethereum (ETH)", amount: "2.5 ETH", value: "$320.75", change: "+10.4%" },
          { name: "Stellar (XLM)", amount: "155 XLM", value: "$70.00", change: "-2.1%" }
        ].map((asset, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-nebula-purple/5 rounded-lg border border-nebula-purple/10">
            <div>
              <p className="font-medium text-sm">{asset.name}</p>
              <p className="text-xs text-gray-400">{asset.amount}</p>
            </div>
            <div>
              <p className="font-medium text-right">{asset.value}</p>
              <p className={`text-xs text-right ${asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {asset.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MiniCard 
            icon={Brain} 
            label="AI Insights" 
            value="3 new tips" 
            variant="orange"
            pulseEffect
          />
          <MiniCard 
            icon={Wallet} 
            label="Blockchain TX" 
            value="All systems normal" 
            variant="purple"
          />
          <MiniCard 
            icon={Boxes} 
            label="3D View" 
            value="Enabled" 
            variant="blue"
          />
        </div>
        
        <DashboardSplitView 
          fiatContent={<FiatContent />} 
          cryptoContent={<CryptoContent />} 
        />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Financial Galaxy</h2>
          <BudgetGalaxy />
        </div>
      </div>
      
      <FloatingActionButton to="/add-expense" label="Add Expense" />
    </MainLayout>
  );
};

export default Dashboard;
