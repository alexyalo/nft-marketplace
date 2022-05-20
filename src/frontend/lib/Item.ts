import { ethers } from 'ethers';

export type Item = {
  itemId: number;
  tokenId: number;
  price: ethers.BigNumber;
  seller: string;
  sold: boolean;
}

export type ViewItem = {
  name: string;
  description: string;
  image: string;
  itemId: number;
  tokenId: number;
  totalPrice: ethers.BigNumber;
  seller: string;
  price?: ethers.BigNumber;
  sold?: boolean;
}
