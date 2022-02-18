//SPDX-License-Identifier: UNLICENSED

pragma solidity >= 0.5.0 < 0.9.0;

import "./Token.sol";

contract EthSwap{
    string public name="EthSwap Instant Exchange";
    Token public token;
    uint public price=100000000000000000;

    constructor(Token _token) {
        token=_token;
    }

    event tokenPurchased(address buyer,address token,uint256 value);
    event tokenSold(address seller,address token,uint256 value);

    //functions
    function multiply(uint x,uint y) internal pure returns(uint z){
        require(y == 0 || (z = x * y) / y == x);
    }//ds-math

    function buyTokens(uint _numberOfToken) public payable returns(bool success){
        require(msg.value == multiply(_numberOfToken ,price));
        require(token.balanceOf(address(this)) >= _numberOfToken);
        token.transfer(msg.sender, _numberOfToken);
        emit tokenPurchased(msg.sender,address(this),_numberOfToken);
        return true;
    }

    function sellTokens(uint _numberOfToken) public returns(bool success){
        require(token.balanceOf(msg.sender)>= _numberOfToken);
        uint etherAmount=_numberOfToken*price;
        require(address(this).balance>=etherAmount);
        

        token.transferFrom(msg.sender, address(this), _numberOfToken);

        payable(msg.sender).transfer(etherAmount);
        emit tokenSold(msg.sender, address(this), _numberOfToken);
        return true;
    }
    
}