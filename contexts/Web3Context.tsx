import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

// Define the context type
interface Web3ContextType {
  provider: ethers.providers.JsonRpcProvider | null;
  wallet: string | null;
}

// Create context with initial typed value
const initialContextValue: Web3ContextType = {
  provider: null,
  wallet: null,
};

export const Web3Context = createContext<Web3ContextType>(initialContextValue);

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
  const [wallet] = useState<string | null>(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const newProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_POLYGON_RPC_URL
      );
      setProvider(newProvider);
    };

    initWeb3().catch(console.error);
  }, []);

  const contextValue: Web3ContextType = {
    provider,
    wallet,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}