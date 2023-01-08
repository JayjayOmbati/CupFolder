const { expect } = require("chai");
const hre = require("hardhat");


describe("CupCoin contract", function(){
  //global vars
  let Token;
  let cupCoin;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 48000000;
  let tokenBlockReward = 12

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("CupCoin");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    cupCoin = await Token.deploy(tokenCap, tokenBlockReward);
  });




  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await cupCoin.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of coins to the owner", async function () {
      const ownerBalance = await cupCoin.balanceOf(owner.address);
      expect(await cupCoin.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await cupCoin.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await cupCoin.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {
    it("Should transfer coins between accounts", async function () {
      // Transfer 50 coins from owner to addr1
      await cupCoin.transfer(addr1.address, 50);
      const addr1Balance = await cupCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 coins from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await cupCoin.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await cupCoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough coins", async function () {
      const initialOwnerBalance = await cupCoin.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 coins) to owner (1000000 coins).
      // `require` will evaluate false and revert the transaction.
      await expect(
        cupCoin.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await cupCoin.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await cupCoin.balanceOf(owner.address);

      // Transfer 100 coins from owner to addr1.
      await cupCoin.transfer(addr1.address, 100);

      // Transfer another 50 coins from owner to addr2.
      await cupCoin.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await cupCoin.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await cupCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await cupCoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });






});