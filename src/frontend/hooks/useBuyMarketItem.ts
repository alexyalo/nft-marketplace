import { useContext } from 'react';
import { AppContext } from '../context';
import { ViewItem } from '../lib/Item';

export const useBuyMarketItem = () => {
  const { marketplace } = useContext(AppContext);

  const buyMarketItem = async (item: ViewItem) => {
    const res = await marketplace.purchaseItem(item.itemId, { value: item.totalPrice });
    await res.wait();
  }

  return { buyMarketItem };
}