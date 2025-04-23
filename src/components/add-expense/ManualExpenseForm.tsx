
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

const expenseCategories = ['food', 'transport', 'entertainment', 'utilities', 'housing', 'shopping', 'health', 'education', 'other'] as const;
type ExpenseCategory = typeof expenseCategories[number];

interface ManualExpenseFormProps {
  merchant: string;
  amount: string;
  category: ExpenseCategory;
  description: string;
  currency: string;
  setMerchant: (m: string) => void;
  setAmount: (a: string) => void;
  setCategory: (c: ExpenseCategory) => void;
  setDescription: (d: string) => void;
  setCurrency: (c: string) => void;
}

const ManualExpenseForm = ({
  merchant,
  amount,
  category,
  description,
  currency,
  setMerchant,
  setAmount,
  setCategory,
  setDescription
}: ManualExpenseFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        transaction_type: "fiat",
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-3">Manual Entry</h3>
      <div className="space-y-3">
        <div>
          <Label htmlFor="merchant" className="text-gray-300">Merchant/Payee</Label>
          <Input 
            id="merchant" 
            placeholder="Enter merchant name" 
            className="bg-nebula-space border-nebula-blue/20 text-white placeholder:text-gray-500"
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
            className="bg-nebula-space border-nebula-blue/20 text-white placeholder:text-gray-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-gray-300">Category</Label>
          <Select value={category} onValueChange={(value: ExpenseCategory) => setCategory(value)}>
            <SelectTrigger className="bg-nebula-space border-nebula-blue/20 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-nebula-space-light border-nebula-blue/20">
              {expenseCategories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-white hover:bg-nebula-blue/20">
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
            className="bg-nebula-space border-nebula-blue/20 text-white placeholder:text-gray-500"
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
  );
};

export default ManualExpenseForm;
