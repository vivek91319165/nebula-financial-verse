
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { ExpenseCategory, categoryColors } from '@/utils/categoryColors';

const AddExpense = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to add an expense");
      navigate('/auth');
      return;
    }

    if (!amount || !description || !category || !date) {
      toast.error("Please fill out all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          { 
            user_id: user.id, 
            amount: parseFloat(amount), 
            description,
            category,
            created_at: date.toISOString()
          }
        ]);

      if (error) throw error;

      toast.success("Expense added successfully");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to add expense");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Add New Expense</h1>
      
      <Card className="bg-nebula-space-light border-nebula-purple/20">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-nebula-space text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Lunch, Groceries, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-nebula-space text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value: ExpenseCategory) => setCategory(value)}
              >
                <SelectTrigger className="bg-nebula-space text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-nebula-space text-white">
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-nebula-space text-white",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-nebula-space-light">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-nebula-purple hover:bg-nebula-purple/80"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Expense"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpense;
