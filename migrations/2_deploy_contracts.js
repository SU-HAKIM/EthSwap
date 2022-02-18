var EthSwap = artifacts.require("./EthSwap.sol");
var Token = artifacts.require("./Token.sol");

module.exports = async function (deployer) {
    await deployer.deploy(Token);
    const token = await Token.deployed();
    await deployer.deploy(EthSwap, Token.address);
    const ethSwap = await EthSwap.deployed();

    await token.transfer(ethSwap.address, 750000);

};
