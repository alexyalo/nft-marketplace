import { ethers } from 'ethers'
import { useContext, useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { AppContext } from '../context';

const client = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0' });

type CreateNFTProps = {
  image: string;
  price: string;
  name: string;
  description: string;
}

export const useCreateNFT = () => {
  const { marketplace, nft } = useContext(AppContext);

  const createNFT = async ({ image, name, price, description }: CreateNFTProps) => {
    if (!image || !price || !name || !description) return;

    const mintThenList = async (result: { path: string }) => {
      const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
      await (await nft.mint(uri)).wait();
      // Todo improve getting the generated token id
      const id = await nft.tokenCount();
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      const listingPrice = ethers.utils.parseEther(price);
      await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
    }

    try {
      const result = await client.add(JSON.stringify({ image, name, description }));
      mintThenList(result);
    } catch (err) {
      console.log('ipfs uri upload error', err);
    }
  }

  return {
    createNFT,
  }
}