import { ethers } from 'ethers';
import { createContext } from 'react';

export type CustomAppContext = {
  account: string;
  nft: ethers.Contract;
  marketplace: ethers.Contract;
}

export const AppContext = createContext<CustomAppContext>({
  account: '',
  nft: {} as unknown as ethers.Contract,
  marketplace: {} as unknown as ethers.Contract,
});
