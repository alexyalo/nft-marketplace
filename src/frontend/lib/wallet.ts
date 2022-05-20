
export const setWalletListeners = (setAccount: React.Dispatch<React.SetStateAction<string>>) => {
  const logout = () => {
    console.log('Disconnected wallet');
  }
  window.ethereum.on("accountsChanged", (_accounts: string[]) => {
    setAccount(_accounts[0]);
    logout();
    return;
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });

  window.ethereum.on('disconnect', () => {
    logout();
  });
};
