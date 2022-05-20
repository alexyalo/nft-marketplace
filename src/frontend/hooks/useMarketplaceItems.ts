import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context';
import { ViewItem } from '../lib/Item';

export const useMarketplaceItems = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ViewItem[]>([]);
  const {marketplace, nft} = useContext(AppContext);

  const loadMarketplaceItems = async () => {
    const itemCount = await marketplace.itemCount();
console.log('itemCount', itemCount);
    const items = [];

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        const uri = await nft.tokenURI(item.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          tokenId: item.tokenId,
        });
      }
    }
    setItems(items);
    setLoading(false);
  }

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  return {
    loading,
    items,
  };
}
