import React from "react";

const Navigate = ({ setOption }) => {
  return (
    <div className="container w-50 mx-auto mt-2 d-flex justify-content-between">
      <button className="btn" onClick={() => setOption("buy")}>
        Buy
      </button>
      <p>&lt; &gt;</p>
      <button className="btn" onClick={() => setOption("sell")}>
        Sell
      </button>
    </div>
  );
};

export default Navigate;
