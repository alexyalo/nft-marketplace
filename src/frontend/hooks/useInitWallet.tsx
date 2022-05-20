import { useState, useEffect } from 'react';
import { setWalletListeners } from '../lib/wallet';

export const useInitConnectedWallet = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);

  const init = async () => {
    if (window.ethereum) {
      setWalletListeners(setAccount);

      try {
        const accounts = await window.ethereum.request({
          // method: "eth_accounts",
          method: 'eth_requestAccounts'
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.log("err", err);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Metamask not found');
    }
  }

  useEffect(() => {
    init();
  }, []);

  return {
    account,
    loading,
  };
};
