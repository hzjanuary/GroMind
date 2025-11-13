import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { Button } from '@/components/ui/button';
import SimpleLayout from './layouts/SimpleLayout.jsx';

const BACKEND_URL = 'http://localhost:5000';

export default function Account() {
  const { user, token, refreshUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [username, setUsername] = useState(user?.username || '');
  const [newAddr, setNewAddr] = useState({
    houseNumber: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    label: '',
    phone: '',
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setName(user?.name || '');
    setUsername(user?.username || '');
    setAddresses(user?.addresses || []);
  }, [user]);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  if (!isAuthenticated) {
    return (
      <SimpleLayout>
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Tài khoản của tôi</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              ← Quay về trang chủ
            </Button>
          </div>
          <p>Vui lòng đăng nhập để quản lý tài khoản.</p>
        </div>
      </SimpleLayout>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/auth/update-profile`,
        { name, username },
        authHeader,
      );
      if (res.data.success) {
        setStatus({ type: 'success', text: 'Cập nhật thành công' });
        refreshUser();
      }
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'Lỗi' });
    }
  };

  const handleAddAddress = async () => {
    // client-side phone validation
    const phoneRegex = /^0\d{9,10}$/;
    if (newAddr.phone && !phoneRegex.test(newAddr.phone)) {
      setStatus({
        type: 'error',
        text: 'Số điện thoại không hợp lệ (ví dụ: 0xxxxxxxxx)',
      });
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/addresses`,
        newAddr,
        authHeader,
      );
      if (res.data.success) {
        setAddresses(res.data.addresses);
        setNewAddr({
          houseNumber: '',
          street: '',
          ward: '',
          district: '',
          city: '',
          label: '',
          phone: '',
        });
        refreshUser();
      }
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'Lỗi' });
    }
  };

  const handleDeleteAddress = async (idx) => {
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/auth/addresses/${idx}`,
        authHeader,
      );
      if (res.data.success) {
        setAddresses(res.data.addresses);
        refreshUser();
      }
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'Lỗi' });
    }
  };

  return (
    <SimpleLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Tài khoản của tôi</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Quay về trang chủ
          </Button>
        </div>

        <section className="mb-6">
          <h2 className="font-semibold mb-2">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              placeholder="Username (tùy chọn)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded"
            />
            <div />
            <Button onClick={handleUpdateProfile}>Lưu thông tin</Button>
          </div>
          {status && (
            <p
              className={
                status.type === 'error' ? 'text-red-500' : 'text-green-500'
              }
            >
              {status.text}
            </p>
          )}
        </section>

        <section>
          <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
          <div className="space-y-3 mb-4">
            {addresses.length === 0 && (
              <p className="text-muted-foreground">Chưa có địa chỉ.</p>
            )}
            {addresses.map((a, i) => (
              <div
                key={i}
                className="p-3 border rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    {a.label || `Địa chỉ ${i + 1}`}
                  </div>
                  <div className="text-sm">
                    {[a.houseNumber, a.street, a.ward, a.district, a.city]
                      .filter(Boolean)
                      .join(', ')}
                    {a.phone && <div className="text-sm">SĐT: {a.phone}</div>}
                  </div>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteAddress(i)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border rounded space-y-2">
            <input
              placeholder="Nhãn (ví dụ: Nhà, Cơ quan)"
              value={newAddr.label}
              onChange={(e) =>
                setNewAddr({ ...newAddr, label: e.target.value })
              }
              className="p-2 border rounded w-full"
            />
            <input
              placeholder="Số điện thoại liên hệ"
              value={newAddr.phone}
              onChange={(e) =>
                setNewAddr({ ...newAddr, phone: e.target.value })
              }
              className="p-2 border rounded w-full"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                placeholder="Số nhà"
                value={newAddr.houseNumber}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, houseNumber: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                placeholder="Đường"
                value={newAddr.street}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, street: e.target.value })
                }
                className="p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                placeholder="Phường / Xã"
                value={newAddr.ward}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, ward: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                placeholder="Quận / Huyện"
                value={newAddr.district}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, district: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                placeholder="Tỉnh / TP"
                value={newAddr.city}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, city: e.target.value })
                }
                className="p-2 border rounded"
              />
            </div>
            <Button onClick={handleAddAddress}>Thêm địa chỉ</Button>
          </div>
        </section>
      </div>
    </SimpleLayout>
  );
}
