import React from "react";
import ETH from "../images/eth-logo.png";
import Hakim from "../images/Hakim.svg";

const BuyCard = ({
  tokens,
  ethSwapBalance,
  handleBuyChange,
  buyToken,
  buyBalance,
  buy,
}) => {
  return (
    <div className="container w-50 mx-auto mt-3">
      <div className="card card-body">
        <h4 className="text-info my-2 mx-auto">Buying Token</h4>
        <p className="d-flex justify-content-between mb-2">
          <span style={{ fontWeight: "bold" }}>Input</span>
          <span className="text-muted">Available Tokens: {tokens}</span>
        </p>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={buyToken}
            onChange={handleBuyChange}
          />
          <span className="input-group-text" id="basic-addon2">
            <img
              src={Hakim}
              alt="eth pic"
              style={{ width: 25, height: 25, marginRight: 5 }}
            />
            HM
          </span>
        </div>
        <p className="d-flex justify-content-between mb-2">
          <span style={{ fontWeight: "bold" }}>Output</span>
          <span className="text-muted">Balance:{ethSwapBalance}</span>
        </p>
        <div className="input-group mb-2">
          <input
            type="number"
            className="form-control"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            disabled
            value={buyBalance}
          />
          <span className="input-group-text" id="basic-addon2">
            <img
              src={ETH}
              alt="eth pic"
              style={{ width: 25, height: 25, marginRight: 5 }}
            />
            <span>ETH</span>
          </span>
        </div>
        <small className="text-muted">Token Price : 0.1 ETH</small>
        <button className="btn btn-primary btn-block mt-2" onClick={buy}>
          SWAP
        </button>
      </div>
    </div>
  );
};

export default BuyCard;
