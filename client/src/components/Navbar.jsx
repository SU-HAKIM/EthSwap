import React from "react";

const Navbar = ({ address }) => {
  return (
    <div className="bg-dark">
      <div className="container py-1 d-flex justify-content-between align-items-center">
        <h6 className="lead text-white">Token Exchange</h6>
        <p className="text-muted">Address : {address}</p>
      </div>
    </div>
  );
};

export default Navbar;
