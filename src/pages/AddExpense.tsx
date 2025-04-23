
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ReceiptOcrSection from "@/components/add-expense/ReceiptOcrSection";
import ManualExpenseForm from "@/components/add-expense/ManualExpenseForm";
import CryptoExpenseForm from "@/components/add-expense/CryptoExpenseForm";

const expenseCategories = ['food', 'transport', 'entertainment', 'utilities', 'housing', 'shopping', 'health', 'education', 'other'] as const;
type ExpenseCategory = typeof expenseCategories[number];

const AddExpense = () => {
  const [activeTab, setActiveTab] = useState("fiat");

  // Manual entry states
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");

  // When OCR scan fills details
  const handleOcrFill = (ocrData: any) => {
    if (ocrData.merchant) setMerchant(ocrData.merchant);
    if (ocrData.amount) setAmount(ocrData.amount);
    if (ocrData.category) setCategory(ocrData.category as ExpenseCategory);
    if (ocrData.description) setDescription(ocrData.description);
    if (ocrData.currency) setCurrency(ocrData.currency);
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <button className="text-gray-400 mr-3 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
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
                <ReceiptOcrSection onOcrFill={handleOcrFill} />
                <ManualExpenseForm
                  merchant={merchant}
                  amount={amount}
                  category={category}
                  description={description}
                  currency={currency}
                  setMerchant={setMerchant}
                  setAmount={setAmount}
                  setCategory={setCategory}
                  setDescription={setDescription}
                  setCurrency={setCurrency}
                />
              </Card>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-6">
              <Card className="p-4 bg-nebula-space-light border-nebula-purple/20">
                <CryptoExpenseForm />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddExpense;
