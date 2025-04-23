
import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CryptoExpenseForm = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  return (
    <div>
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
    </div>
  );
};

export default CryptoExpenseForm;
