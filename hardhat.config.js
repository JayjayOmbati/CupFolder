require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/*
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

*/

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mainnet: {
      url: process.env.CHAINSTACK_BNBCHAIN_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
