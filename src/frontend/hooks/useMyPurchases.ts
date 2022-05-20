import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import { Item, ViewItem } from '../lib/Item';

export const useMyPurchases = () => {
  const { marketplace, nft, account } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<ViewItem[]>([]);

  const loadPurchasedItems = async () => {
    const filter = marketplace.filters.Bought(null, null, null, null, null, account);
    const result = await marketplace.queryFilter(filter);

    const purchases = await Promise.all(result.map(async i => {
      const item = i.args as unknown as Item;
      const uri = await nft.tokenURI(item.tokenId);
      const response = await fetch(uri);
      const metadata = await response.json();

      const totalPrice = await marketplace.getTotalPrice(item.itemId);
      return {
        totalPrice,
        price: item.price,
        itemId: item.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        tokenId: item.tokenId,
        seller: item.seller,
      };
    }));

    setLoading(false);
    setPurchases(purchases);
  }

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  return {
    loading,
    purchases,
  };
}
