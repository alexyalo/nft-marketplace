import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import { ViewItem } from '../lib/Item';

export const useMyListedItems = () => {
  const { marketplace, nft, account } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ViewItem[]>([]);
  const [soldItems, setSoldItems] = useState<ViewItem[]>([]);

  const loadListedItems = async () => {
    const itemCount = await marketplace.itemCount();
    const listedItems = [];
    const soldItems = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);

      if (item.seller.toLowerCase() === account) {
        const uri = await nft.tokenURI(item.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();

        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        const viewItem: ViewItem = {
          totalPrice,
          price: item.price,
          tokenId: item.tokenId,
          itemId: item.itemId,
          seller: item.seller,
          sold: item.sold,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        };
        listedItems.push(viewItem);

        if (item.sold) soldItems.push(viewItem);
      }
    }

    setLoading(false);
    setItems(listedItems);
    setSoldItems(soldItems);
  }

  useEffect(() => {
    loadListedItems();
  }, []);

  return {
    loading,
    items,
    soldItems,
  };
}
