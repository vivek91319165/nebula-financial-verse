import { DollarSign, ArrowDownRight, ArrowUpRight, Wallet, Brain, Boxes } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import DashboardSplitView from "@/components/dashboard/DashboardSplitView";
import FloatingActionButton from "@/components/dashboard/FloatingActionButton";
import MiniCard from "@/components/dashboard/MiniCard";
import BudgetGalaxy from "@/components/visualization/BudgetGalaxy";
import ExpensesList from "@/components/dashboard/ExpensesList";
import UpdateBalanceDialog from "@/components/dashboard/UpdateBalanceDialog";
import { useBalance } from "@/hooks/useBalance";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { balance, isLoading: balanceLoading } = useBalance();
  const { data: monthlySpending, isLoading: expensesLoading } = useMonthlyExpenses();
  const { walletAddress, assets, connect, isConnecting } = useWallet();

  // Compute total crypto value and monthly change
  const totalCryptoValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const monthlyChange = assets.length > 0 
    ? assets.reduce((sum, asset) => sum + (asset.value * asset.change / 100), 0)
    : 0;
  const averageChange = assets.length > 0 
    ? (assets.reduce((sum, asset) => sum + asset.change, 0) / assets.length)
    : 0;

  // Sample fiat content
  const FiatContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <StatCard
            title="Total Balance"
            value={balanceLoading ? "Loading..." : `$${balance?.toFixed(2) || '0.00'}`}
            description="Update your balance"
            icon={DollarSign}
            variant="blue"
          />
          <div className="absolute top-4 right-4">
            <UpdateBalanceDialog />
          </div>
        </div>
        <StatCard
          title="Monthly Spending"
          value={expensesLoading ? "Loading..." : `$${monthlySpending?.toFixed(2) || '0.00'}`}
          description={`${monthlySpending && balance ? ((monthlySpending / balance) * 100).toFixed(0) : 0}% of balance`}
          icon={ArrowDownRight}
          variant="blue"
        />
      </div>
      
      <h3 className="text-nebula-blue font-semibold mt-6 mb-3">Recent Transactions</h3>
      <ExpensesList />
    </div>
  );

  // Real crypto content
  const CryptoContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Investment"
          value={walletAddress ? `$${totalCryptoValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Not Connected"}
          description={walletAddress 
            ? `${assets.length} ${assets.length === 1 ? 'asset' : 'assets'} in your portfolio`
            : "Connect your wallet to view investments"
          }
          icon={Wallet}
          variant="purple"
        />
        <div className="relative">
          <StatCard
            title="Monthly Return"
            value={walletAddress 
              ? `${monthlyChange >= 0 ? '+' : ''}$${monthlyChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "Not Connected"
            }
            description={walletAddress 
              ? `${averageChange >= 0 ? '+' : ''}${averageChange.toFixed(1)}% average change`
              : "Connect your wallet to view returns"
            }
            icon={ArrowUpRight}
            variant="purple"
          />
          {!walletAddress && (
            <div className="absolute bottom-4 right-4">
              <Button
                size="sm"
                variant="outline"
                className="border-nebula-purple text-nebula-purple"
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-nebula-purple font-semibold mt-6 mb-3">Your Assets</h3>
      {!walletAddress ? (
        <div className="flex flex-col items-center justify-center p-8 bg-nebula-space-light rounded-lg border border-nebula-purple/10">
          <Wallet className="h-12 w-12 text-nebula-purple/30 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Wallet Connected</h3>
          <p className="text-sm text-gray-400 text-center mb-6 max-w-md">
            Connect your Web3 wallet to view your cryptocurrency assets and manage your portfolio
          </p>
          <div className="flex gap-4">
            <Button
              onClick={connect}
              className="bg-nebula-purple hover:bg-nebula-purple-light"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
            <Link to="/wallet">
              <Button variant="outline" className="border-nebula-purple/20 text-nebula-purple">
                Manage Wallets
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-nebula-purple/5 rounded-lg border border-nebula-purple/10">
              <div>
                <p className="font-medium text-sm">{asset.name} ({asset.symbol})</p>
                <p className="text-xs text-gray-400">{asset.balance} {asset.symbol}</p>
              </div>
              <div>
                <p className="font-medium text-right">${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className={`text-xs text-right ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </p>
              </div>
            </div>
          ))}
          <div className="text-right mt-2">
            <Link to="/wallet">
              <Button size="sm" variant="ghost" className="text-nebula-purple hover:text-nebula-purple-light">
                Manage Wallets →
              </Button>
            </Link>
          </div>
        </div>
      )}
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
