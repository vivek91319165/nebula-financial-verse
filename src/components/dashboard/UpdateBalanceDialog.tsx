
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBalance } from '@/hooks/useBalance';
import { ArrowUpRight } from 'lucide-react';

const UpdateBalanceDialog = () => {
  const [open, setOpen] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const { updateBalance } = useBalance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newBalance);
    if (!isNaN(amount)) {
      updateBalance.mutate(amount, {
        onSuccess: () => setOpen(false)
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-nebula-blue/20 text-nebula-blue hover:text-nebula-blue-light">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Update Balance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Total Balance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            step="0.01"
            value={newBalance}
            onChange={(e) => setNewBalance(e.target.value)}
            placeholder="Enter new balance"
          />
          <Button type="submit" disabled={updateBalance.isPending}>
            {updateBalance.isPending ? 'Updating...' : 'Update Balance'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBalanceDialog;
