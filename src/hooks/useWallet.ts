
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

export type CryptoAsset = {
  name: string;
  symbol: string;
  balance: string;
  value: number;
  change: number;
};

// Simulate crypto data fetching
const fetchCryptoAssets = async (address: string): Promise<CryptoAsset[]> => {
  // This is a mock implementation
  // In a real app, you would use APIs like Moralis, Alchemy, or Chainlink to fetch real data
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  // Mock data based on address
  // In a real implementation, this would come from blockchain data
  const mockAssets: CryptoAsset[] = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      balance: "0.075",
      value: 1950,
      change: 5.2
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      balance: "2.5",
      value: 320.75,
      change: 10.4
    },
    {
      name: "Stellar",
      symbol: "XLM",
      balance: "155",
      value: 70,
      change: -2.1
    }
  ];
  
  // Use the last character of the address to randomize the data a bit
  const lastChar = address.slice(-1);
  const multiplier = (parseInt(lastChar, 16) % 5) + 0.8; // Between 0.8 and 4.8
  
  return mockAssets.map(asset => ({
    ...asset,
    balance: (parseFloat(asset.balance) * multiplier).toFixed(
      asset.symbol === "BTC" ? 3 : (asset.symbol === "ETH" ? 1 : 0)
    ),
    value: Math.round(asset.value * multiplier * 100) / 100,
    change: Math.round(asset.change * (multiplier * 0.8) * 10) / 10
  }));
};

export const useWallet = () => {
  const { user } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the user has a wallet already connected in the database
  useEffect(() => {
    const checkExistingWallet = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('wallets')
          .select('wallet_address')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .eq('wallet_type', 'metamask')
          .single();
        
        if (data && !error) {
          setWalletAddress(data.wallet_address);
        }
      } catch (err) {
        console.error('Error checking for existing wallet:', err);
      }
    };
    
    checkExistingWallet();
  }, [user]);

  // Fetch assets when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      fetchCryptoAssets(walletAddress)
        .then(fetchedAssets => {
          setAssets(fetchedAssets);
        })
        .catch(err => {
          console.error('Error fetching crypto assets:', err);
          setError('Failed to fetch crypto assets. Please try again later.');
        });
    } else {
      setAssets([]);
    }
  }, [walletAddress]);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      if (!address || !user) {
        throw new Error('Failed to connect wallet. Please try again.');
      }
      
      // Save the wallet address to the database
      const { error: upsertError } = await supabase
        .from('wallets')
        .upsert({
          user_id: user.id,
          wallet_address: address,
          wallet_type: 'metamask',
          is_active: true
        } as Database['public']['Tables']['wallets']['Insert'], { 
          onConflict: 'user_id,wallet_type',
          ignoreDuplicates: false
        });
      
      if (upsertError) throw upsertError;
      
      setWalletAddress(address);
      toast.success('Wallet connected successfully');
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
      toast.error(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (!user) return;
      
      // Update the wallet status in the database
      const { error } = await supabase
        .from('wallets')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('wallet_type', 'metamask');
      
      if (error) throw error;
      
      setWalletAddress(null);
      setAssets([]);
      toast.success('Wallet disconnected successfully');
    } catch (err: any) {
      console.error('Error disconnecting wallet:', err);
      toast.error('Failed to disconnect wallet');
    }
  };

  return {
    walletAddress,
    assets,
    connect,
    disconnect,
    isConnecting,
    error
  };
};

// Add TypeScript interface for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
    };
  }
}
