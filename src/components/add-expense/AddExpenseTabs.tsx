
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ReceiptOcrSection from "@/components/add-expense/ReceiptOcrSection";
import ManualExpenseForm from "@/components/add-expense/ManualExpenseForm";
import CryptoExpenseForm from "@/components/add-expense/CryptoExpenseForm";
import { Dispatch, SetStateAction, useState } from "react";
import type { ExpenseCategory } from "@/pages/AddExpense";

interface Props {
  merchant: string;
  setMerchant: Dispatch<SetStateAction<string>>;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  category: ExpenseCategory;
  setCategory: Dispatch<SetStateAction<ExpenseCategory>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  currency: string;
  setCurrency: Dispatch<SetStateAction<string>>;
  onOcrFill: (ocrData: any) => void;
}

/**
 * Contains the tab switching UI, OCR section, and links to forms.
 */
const AddExpenseTabs = ({
  merchant,
  setMerchant,
  amount,
  setAmount,
  category,
  setCategory,
  description,
  setDescription,
  currency,
  setCurrency,
  onOcrFill,
}: Props) => {
  const [activeTab, setActiveTab] = useState("fiat");

  return (
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
          <ReceiptOcrSection onOcrFill={onOcrFill} />
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
  );
};

export default AddExpenseTabs;
