import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Checkout from './Checkout.jsx';
import Account from './Account.jsx';
import MyOrders from './MyOrders.jsx';
import Favorites from './Favorites.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import CategoryDetail from './components/CategoryDetail.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import AuthRequired from './AuthRequired.jsx';
import NotFound from './NotFound.jsx';
import { ToastContainer } from './Toast.jsx';

function App() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (event) => {
      const { type, message } = event.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/:productName" element={<ProductDetail />} />
        <Route path="/danh-muc/:slug" element={<CategoryDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/auth-required" element={<AuthRequired />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
