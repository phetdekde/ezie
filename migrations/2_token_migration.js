const Token = artifacts.require("Token");

module.exports = async function (deployer) {
  deployer.deploy(Token);

  // await deployer.deploy(Token, 'NFT GAME', 'NFTG');
  // let tokenInstance = await Token.deployed();
  // await tokenInstance.mint(100, 200, 1000); // Token id 0
  // await tokenInstance.mint(255, 100, 2000); // Token id 1
  // let pet0 = await tokenInstance.getTokenDetails(0);
  // let pet1 = await tokenInstance.getTokenDetails(1);
  // console.log("PET 1 = " + pet0 + "\nPET 2 = " + pet1);
};
