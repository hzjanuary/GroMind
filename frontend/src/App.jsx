import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Checkout from './Checkout.jsx';
import Account from './Account.jsx';
import MyOrders from './MyOrders.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/account" element={<Account />} />
      <Route path="/orders" element={<MyOrders />} />
    </Routes>
  );
}

export default App;
