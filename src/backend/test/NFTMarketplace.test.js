const { expect } = require('chai');

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe('NFTMarketplace', () => {
  let deployer, addr1, addr2, nft, marketplace;
  const feePercent = 1;
  const URI = 'test-uri';

  beforeEach(async () => {
    const NFT = await ethers.getContractFactory("NFT");
    const Marketplace = await ethers.getContractFactory("Marketplace");
    [deployer, addr1, addr2] = await ethers.getSigners();
    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  })

  describe('Deployment', () => {
    it('should track name and symbol of the nft collection', async () => {
      expect(await nft.name()).to.equal('BANANA PASS');
      expect(await nft.symbol()).to.equal('PASS');
    });

    it('should track feeAccount and feePercent of the marketplace', async () => {
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(feePercent);
    });
  });

  describe('Minting NFTs', () => {
    it('should track each minted NFT', async () => {
      await nft.connect(addr1).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);

      await nft.connect(addr2).mint(URI);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe('Minting NFTs', () => {
    beforeEach(async () => {
      await nft.connect(addr1).mint(URI);
      await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
    });

    it('should track newly created item, transfer nft from seller to marketplace and emit Offered event', async () => {
      await expect(marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1)))
        .to.emit(marketplace, "Offered")
        .withArgs(
          1,
          nft.address,
          1,
          toWei(1),
          addr1.address,
        );
      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      expect(await marketplace.itemCount()).to.equal(1);

      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nft.address);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(toWei(1));
      expect(item.sold).to.equal(false);
    });

    it('should fail if price is zero', async () => {
      await expect(
        marketplace.connect(addr1).makeItem(nft.address, 1, 0)
      ).to.be.revertedWith('Price must be greater than zero');
    })
  });

  describe('Purchasing marketplace items', () => {
    const price = 2;
    let totalPriceInWei;

    beforeEach(async () => {
      await nft.connect(addr1).mint(URI);
      await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
      await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price));
      totalPriceInWei = await marketplace.getTotalPrice(1);
    });

    it('should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event', async () => {
      const sellerInitialEthBal = await addr1.getBalance();
      const feeAccountInitialEthBal = await deployer.getBalance();

      await expect(marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei }))
        .to.emit(marketplace, "Bought")
        .withArgs(
          1,
          nft.address,
          1,
          toWei(price),
          addr1.address,
          addr2.address,
        );
      const finalSellerBal = await addr1.getBalance();
      const finalFeeAccountBal = await deployer.getBalance();
      expect(+fromWei(finalSellerBal)).to.equal(+price + +fromWei(sellerInitialEthBal));
      const fee = (feePercent / 100) * price;
      expect(+fromWei(finalFeeAccountBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal));
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
      expect((await marketplace.items(1)).sold).to.equal(true);
    });

    it('should fail for invalid item ids, sold items, and when not enough ether is paid', async () => {
      await expect(
        marketplace.connect(addr2).purchaseItem(2, {value: totalPriceInWei})
      ).to.be.revertedWith("item doesn't exist");
      await expect(
        marketplace.connect(addr2).purchaseItem(0, {value: totalPriceInWei})
      ).to.be.revertedWith("item doesn't exist");
      
      await expect(
        marketplace.connect(addr2).purchaseItem(1, {value: toWei(price)})
      ).to.be.revertedWith('not enough ether to cover item price and market fee');

      await marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei});
      await expect(
        marketplace.connect(deployer).purchaseItem(1, {value: totalPriceInWei})
      ).to.be.revertedWith("item already sold");
    })
  })
});
