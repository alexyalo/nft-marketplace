import { useState, useEffect } from 'react';
import { CustomAppContext } from '../context';
import { useInitConnectedWallet } from './useInitWallet';
import { useContracts } from './useContracts';

export const useApp = () => {
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<CustomAppContext>({} as unknown as CustomAppContext);
  const {
    nft,
    marketplace,
    loading: contractsLoading,
  } = useContracts();
  const { account, loading: web3Loading } = useInitConnectedWallet();

  useEffect(() => {
    if (!web3Loading && !contractsLoading) {
      setContext(x => ({
        account,
        nft: nft!,
        marketplace: marketplace!,
      }));
      setLoading(false);
    }
  }, [contractsLoading, web3Loading]);

  return {
    context,
    loading,
  }
}