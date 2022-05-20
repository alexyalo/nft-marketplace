import { useContext } from 'react'
import { AppContext } from '../context'

export const useAccount = () => {
  const {account} = useContext(AppContext);

  return account;
}