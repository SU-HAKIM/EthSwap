import React, { useEffect, useState } from "react";
import getContract from "./getWeb3";
import Web3 from 'web3';
import "./App.css";
import Navbar from "./components/Navbar";
import SellCard from "./components/Sellcard";
import BuyCard from "./components/BuyCard";
import Navigate from "./components/Navigate";

import Token from "./contracts/Token.json";
import EthSwap from "./contracts/EthSwap.json";

const App = () => {
  let tokenPrice = 0.1;
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contracts, setContracts] = useState({
    token: null,
    ethSwap: null
  });
  const [contractAddress, setContractAddress] = useState({
    token: null,
    ethSwap: null
  });
  const [option, setOption] = useState('buy');
  const [address, setAddress] = useState('');
  //info
  const [ethSwapBalance, setEthSwapBalance] = useState(null);
  const [buyerBalance, setBuyerBalance] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [buyerTokens, setBuyerTokens] = useState(null);
  //actions
  const [buyBalance, setBuyBalance] = useState(0);
  const [buyToken, setBuyToken] = useState(0);
  const [buySuccess, setBuySuccess] = useState(false)
  //sell
  const [sellBalance, setSellBalance] = useState(0);
  const [sellToken, setSellToken] = useState(0);
  const [sellSuccess, setSellSuccess] = useState(false)

  useEffect(() => {
    connectWallet();
  }, [buySuccess, sellSuccess])

  const connectWallet = async () => {
    if (typeof window !== undefined && typeof window.ethereum !== undefined) {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      let web3 = new Web3(window.ethereum);
      setWeb3(web3);
      let token = await getContract(web3, Token);
      let ethSwap = await getContract(web3, EthSwap);
      setContracts({ token: token.contracts, ethSwap: ethSwap.contracts });
      setContractAddress({ token: token.address, ethSwap: ethSwap.address });
      let accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      setAddress(ethSwap.address)
      //set info
      let tokens = await token.contracts.methods.balanceOf(ethSwap.address).call();
      setTokens(tokens);
      let ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      let ethSwapBalanceInEther = await web3.utils.fromWei(ethSwapBalance, 'ether')

      setEthSwapBalance(ethSwapBalanceInEther);
      //buyer
      let buyersToken = await token.contracts.methods.balanceOf(accounts[0]).call();
      setBuyerTokens(buyersToken);
      let buyerBalance = await web3.eth.getBalance(accounts[0]);
      let buyerBalanceInEther = await web3.utils.fromWei(buyerBalance, 'ether')
      setBuyerBalance(buyerBalanceInEther);
      console.log(buyersToken, buyerBalance);
    }
  }


  const handleBuyChange = (e) => {
    let tokens = e.target.value;
    let price = tokens * tokenPrice;
    setBuyToken(tokens);
    setBuyBalance(price);
  }
  const handleSellChange = (e) => {
    let tokens = e.target.value;
    let price = tokens * tokenPrice;
    setSellToken(tokens);
    setSellBalance(price);
  }

  const buy = async (e) => {
    let success = await contracts.ethSwap.methods.buyTokens(buyToken).send({ from: accounts[0], value: Number(buyBalance) * '1000000000000000000' });
    setBuySuccess(success);
    setBuyToken(0)
  }

  const sell = async (e) => {
    let approve = await contracts.token.methods.approve(contractAddress.ethSwap, sellToken).send({ from: accounts[0] });
    let success = await contracts.ethSwap.methods.sellTokens(sellToken).send({ from: accounts[0], value: Number(buyBalance) * '1000000000000000000' });
    setSellSuccess(success);
    setSellToken(0);
  }

  return (
    <>
      <Navbar address={address} />
      <Navigate setOption={setOption} />
      {option === "buy" ?
        <BuyCard tokens={tokens} ethSwapBalance={ethSwapBalance} handleBuyChange={handleBuyChange} buyToken={buyToken} buyBalance={buyBalance} buy={buy} />
        :
        option === "sell"
          ?
          <SellCard buyerTokens={buyerTokens} buyerBalance={buyerBalance} handleSellChange={handleSellChange} sellToken={sellToken} sellBalance={sellBalance} sell={sell} />
          :
          ''
      }
    </>
  );
}


export default App;


/**
 * 
 * const connectToMetaMask = async () => {
    if (typeof window !== undefined && typeof window.ethereum !== undefined) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let web3 = new Web3(window.ethereum);
        let accounts = await web3.eth.getAccounts();
        const contract = await getContract(web3);
        setWeb3(web3);
        setContract(contract);
        setAccounts(accounts);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Please install Meta Mask")
    }
  }
 */