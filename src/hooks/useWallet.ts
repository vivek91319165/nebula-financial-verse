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

// Function to fetch token balances from Web3
const fetchTokenBalances = async (address: string): Promise<CryptoAsset[]> => {
  try {
    // Using Ethereum's Web3 provider
    if (!window.ethereum) {
      throw new Error('Web3 provider not found');
    }

    // Get ETH balance
    const ethBalance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    // Convert wei to ETH
    const ethInWei = parseInt(ethBalance, 16);
    const ethAmount = ethInWei / 1e18;
    
    // Fetch current ETH price (in a real app, you'd use a price feed API)
    const ethPrice = 3500; // Example fixed price, in production use price feed
    const ethValue = ethAmount * ethPrice;

    // For now, we'll just return ETH. In a real app, you'd fetch other tokens too
    return [{
      name: "Ethereum",
      symbol: "ETH",
      balance: ethAmount.toFixed(4),
      value: ethValue,
      change: 0, // In production, fetch from price API
    }];
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return [];
  }
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

  // Fetch real assets when wallet address changes
  useEffect(() => {
    const updateWalletData = async () => {
      if (walletAddress) {
        try {
          const assets = await fetchTokenBalances(walletAddress);
          setAssets(assets);
        } catch (err) {
          console.error('Error fetching wallet data:', err);
          toast.error('Failed to fetch wallet data');
        }
      } else {
        setAssets([]);
      }
    };

    updateWalletData();
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

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
    };
  }
}
