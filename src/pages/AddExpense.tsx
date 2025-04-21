
import { useState } from "react";
import { Camera, Wallet, Upload, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

const expenseCategories = ['food', 'transport', 'entertainment', 'utilities', 'housing', 'shopping', 'health', 'education', 'other'] as const;
type ExpenseCategory = typeof expenseCategories[number];

const AddExpense = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("fiat");
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");

  const handleSubmitExpense = async () => {
    if (!user) {
      toast.error("Please login to add expenses");
      return;
    }

    if (!amount || !category) {
      toast.error("Please fill in amount and category");
      return;
    }

    setIsSubmitting(true);
    try {
      const expenseData: Database['public']['Tables']['expenses']['Insert'] = {
        amount: parseFloat(amount),
        merchant: merchant || null,
        category, 
        description: description || null,
        currency,
        transaction_type: activeTab as Database['public']['Enums']['transaction_type'],
        user_id: user.id
      };

      const { error } = await supabase.from('expenses').insert(expenseData);

      if (error) throw error;

      toast.success("Expense added successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanReceipt = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 mr-3">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Add Expense</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="fiat" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger 
                value="fiat" 
                className="data-[state=active]:bg-nebula-blue/20 data-[state=active]:text-nebula-blue"
              >
                Fiat Transaction
              </TabsTrigger>
              <TabsTrigger 
                value="crypto" 
                className="data-[state=active]:bg-nebula-purple/20 data-[state=active]:text-nebula-purple"
              >
                Crypto Transaction
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fiat" className="space-y-6">
              <Card className="p-4 bg-nebula-space-light border-nebula-blue/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-nebula-blue/10 border border-nebula-blue/20 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer nebula-glow"
                    onClick={() => {
                      setIsScanning(true);
                      setTimeout(() => {
                        setIsScanning(false);
                      }, 2000);
                    }}
                  >
                    <div className="bg-nebula-blue/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      {isScanning ? (
                        <div className="w-6 h-6 border-2 border-nebula-blue border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="text-nebula-blue h-6 w-6" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-nebula-blue mb-1">
                      {isScanning ? "Processing..." : "Scan Receipt"}
                    </h3>
                    <p className="text-sm text-center text-gray-400">
                      {isScanning ? "Analyzing image..." : "Use OCR to automatically detect expense details"}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-nebula-blue/10 border border-nebula-blue/20 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer nebula-glow"
                  >
                    <div className="bg-nebula-blue/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Upload className="text-nebula-blue h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-nebula-blue mb-1">Upload Receipt</h3>
                    <p className="text-sm text-center text-gray-400">Upload an image of your receipt</p>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Manual Entry</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="merchant" className="text-gray-300">Merchant/Payee</Label>
                      <Input 
                        id="merchant" 
                        placeholder="Enter merchant name" 
                        className="bg-nebula-space border-nebula-blue/20"
                        value={merchant}
                        onChange={(e) => setMerchant(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                      <Input 
                        id="amount" 
                        placeholder="0.00" 
                        type="number" 
                        step="0.01" 
                        className="bg-nebula-space border-nebula-blue/20"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category" className="text-gray-300">Category</Label>
                      <Select value={category} onValueChange={(value: ExpenseCategory) => setCategory(value)}>
                        <SelectTrigger className="bg-nebula-space border-nebula-blue/20">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-nebula-space-light border-nebula-blue/20">
                          {expenseCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-gray-300">Description</Label>
                      <Input 
                        id="description" 
                        placeholder="Add description (optional)" 
                        className="bg-nebula-space border-nebula-blue/20"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-nebula-blue hover:bg-nebula-blue-light mt-4"
                    onClick={handleSubmitExpense}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Expense"}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-6">
              <Card className="p-4 bg-nebula-space-light border-nebula-purple/20">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-nebula-purple/10 border border-nebula-purple/20 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6 nebula-glow"
                  onClick={() => {
                    setIsConnecting(true);
                    setTimeout(() => {
                      setIsConnecting(false);
                    }, 2000);
                  }}
                >
                  <div className="bg-nebula-purple/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {isConnecting ? (
                      <div className="w-6 h-6 border-2 border-nebula-purple border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Wallet className="text-nebula-purple h-6 w-6" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-nebula-purple mb-1">
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </h3>
                  <p className="text-sm text-center text-gray-400 max-w-sm">
                    {isConnecting 
                      ? "Establishing connection to your wallet..." 
                      : "Connect your cryptocurrency wallet to track and record transactions"
                    }
                  </p>
                </motion.div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Transaction Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="crypto-type" className="text-gray-300">Cryptocurrency</Label>
                      <Select disabled={!isConnecting && !isConnecting}>
                        <SelectTrigger className="bg-nebula-space border-nebula-purple/20">
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent className="bg-nebula-space-light border-nebula-purple/20">
                          <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                          <SelectItem value="xlm">Stellar (XLM)</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="crypto-amount" className="text-gray-300">Amount</Label>
                      <Input 
                        id="crypto-amount" 
                        placeholder="0.00" 
                        type="number" 
                        step="0.0001" 
                        className="bg-nebula-space border-nebula-purple/20" 
                        disabled={!isConnecting && !isConnecting}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tx-type" className="text-gray-300">Transaction Type</Label>
                      <Select disabled={!isConnecting && !isConnecting}>
                        <SelectTrigger className="bg-nebula-space border-nebula-purple/20">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-nebula-space-light border-nebula-purple/20">
                          <SelectItem value="send">Send</SelectItem>
                          <SelectItem value="receive">Receive</SelectItem>
                          <SelectItem value="swap">Swap</SelectItem>
                          <SelectItem value="stake">Stake</SelectItem>
                          <SelectItem value="unstake">Unstake</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="crypto-notes" className="text-gray-300">Notes</Label>
                      <Input 
                        id="crypto-notes" 
                        placeholder="Add notes (optional)" 
                        className="bg-nebula-space border-nebula-purple/20" 
                        disabled={!isConnecting && !isConnecting}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-nebula-purple/5 p-4 rounded-lg border border-nebula-purple/10 mt-4">
                    <h4 className="text-sm font-medium text-nebula-purple mb-2">Network Information</h4>
                    <p className="text-xs text-gray-400 mb-2">Current Network: <span className="text-gray-300">Stellar Testnet</span></p>
                    <p className="text-xs text-gray-400">Estimated Gas Fee: <span className="text-gray-300">0.00001 XLM</span></p>
                  </div>
                  
                  <Button 
                    className="w-full bg-nebula-purple hover:bg-nebula-purple-light mt-4"
                    disabled={!isConnecting && !isConnecting}
                  >
                    Submit Transaction
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddExpense;
