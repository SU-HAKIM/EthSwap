const EthSwap = artifacts.require("../contracts/EthSwap.sol");
const Token = artifacts.require("../contracts/Token.sol");

contract("EthSwap", (accounts) => {
    let token;
    let ethSwap;
    let initialSupply = 750000;
    let price = '100000000000000000';
    let buyingToken = 100;
    let sellingToken = 50;

    it("contract has a name", () => {
        return Token.deployed().then(inst => {
            token = inst;
            return EthSwap.deployed()
        }).then(inst => {
            ethSwap = inst;
            return ethSwap.name();
        }).then(name => {
            assert.equal(name, "EthSwap Instant Exchange");
            return token.balanceOf(ethSwap.address);
        }).then(balance => {
            assert.equal(balance.toNumber(), initialSupply);
            return ethSwap.token();
        }).then(address => {
            assert.notEqual(address, 0x0);
        })
    });

    it("enables user to buy tokens", () => {
        return Token.deployed().then(inst => {
            token = inst;

            return EthSwap.deployed()
        }).then(inst => {
            ethSwap = inst;
            return token.transfer(ethSwap.address, initialSupply, { from: accounts[0] });
        }).then(receipt => {


            return ethSwap.buyTokens(buyingToken, { from: accounts[1], value: 1 });
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf('revert') >= 0, "should send right amount of ether");

            return ethSwap.buyTokens(800000, { from: accounts[1], value: buyingToken * price });
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf('revert') >= 0, "can not sell more than initial supply");

            return ethSwap.buyTokens.call(buyingToken, { from: accounts[1], value: buyingToken * price });

        }).then(success => {
            assert.equal(success, true, "should return true");

            return ethSwap.buyTokens(buyingToken, { from: accounts[1], value: buyingToken * Number(price) });
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, "should trigger one event");
            assert.equal(receipt.logs[0].event, "tokenPurchased", "should trigger 'tokenPurchased' event");
            assert.equal(receipt.logs[0].args.buyer, accounts[1], "logs the account buying token");
            assert.equal(receipt.logs[0].args.token, ethSwap.address, "logs the account selling token");
            assert.equal(receipt.logs[0].args.value, buyingToken, "logs the amount of token is being bought");

            return token.balanceOf(accounts[1]);
        }).then(balance => {
            assert.equal(balance.toNumber(), buyingToken);
        })
    });

    it("enables a client to sell his/her token", () => {
        return Token.deployed().then(inst => {
            token = inst;

            return EthSwap.deployed()
        }).then(inst => {
            ethSwap = inst;

            return token.approve(ethSwap.address, sellingToken, { from: accounts[1] })
        }).then(receipt => {
            return token.allowance(accounts[1], ethSwap.address);
        }).then(balance => {
            assert.equal(balance, sellingToken);
            return ethSwap.sellTokens(200, { from: accounts[1] })
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf('revert') >= 0, "should not be able to sell more than tokens he has");
            return web3.eth.getBalance(ethSwap.address);

        }).then(balance => {
            assert(balance >= sellingToken * Number(price), "should has enough balance");

            return ethSwap.sellTokens.call(sellingToken, { from: accounts[1] })

        }).then(success => {
            assert.equal(success, true, "should return true");

            return ethSwap.sellTokens(sellingToken, { from: accounts[1] })

        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, "should trigger one event");
            assert.equal(receipt.logs[0].event, "tokenSold", "should trigger 'tokenSold' event");
            assert.equal(receipt.logs[0].args.seller, accounts[1], "logs the account selling token");
            assert.equal(receipt.logs[0].args.token, ethSwap.address, "logs the account buying token");
            assert.equal(receipt.logs[0].args.value, sellingToken, "logs the amount of token is being bought");

            return token.balanceOf(accounts[1]);
        }).then(balance => {
            assert.equal(balance.toNumber(), buyingToken - sellingToken, "logs amount of buyers token");

            return web3.eth.getBalance(ethSwap.address);
        }).then(balance => {
            assert.equal(balance, (buyingToken * Number(price)) - (sellingToken * Number(price)), "logs ethSwap balance");
        })
    })
})