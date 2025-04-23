import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AddExpenseTabs from "@/components/add-expense/AddExpenseTabs";

const expenseCategories = ['food', 'transport', 'entertainment', 'utilities', 'housing', 'shopping', 'health', 'education', 'other'] as const;
export type ExpenseCategory = typeof expenseCategories[number];

const AddExpense = () => {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");

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
          <AddExpenseTabs
            merchant={merchant}
            setMerchant={setMerchant}
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            description={description}
            setDescription={setDescription}
            currency={currency}
            setCurrency={setCurrency}
            onOcrFill={handleOcrFill}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AddExpense;
