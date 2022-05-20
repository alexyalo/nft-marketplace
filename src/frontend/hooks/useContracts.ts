import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';

import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';

export const useContracts = () => {
  const [nft, setNFT] = useState<Contract>();
  const [marketplace, setMarketplace] = useState<Contract>();
  const [loading, setLoading] = useState(true);
  
  const loadContracts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

    setMarketplace(marketplace);
    setNFT(nft);
    setLoading(false);
  }

  useEffect(() => {
    loadContracts();
  }, []);

  return {
    nft,
    marketplace,
    loading,
  }
}