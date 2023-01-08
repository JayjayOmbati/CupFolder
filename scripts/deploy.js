const hre = require("hardhat");

async function main() {
  const CupCoin = await hre.ethers.getContractFactory("CupCoin");
  const cupCoin = await CupCoin.deploy(48000000, 12);

  await cupCoin.deployed();

  console.log("Cup Coin deployed: SUCESSS", cupCoin.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
