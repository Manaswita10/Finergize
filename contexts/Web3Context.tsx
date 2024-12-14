// contexts/Web3Context.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

export const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_POLYGON_RPC_URL);
      setProvider(provider);
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ provider, wallet }}>
      {children}
    </Web3Context.Provider>
  );
}