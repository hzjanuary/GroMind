import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext.jsx';
import SimpleLayout from './layouts/SimpleLayout.jsx';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthContext.jsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth required page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth-required');
    }
  }, [isAuthenticated, navigate]);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [payment, setPayment] = useState('cash');
  const [submitted, setSubmitted] = useState(false);
  const [submittedTotal, setSubmittedTotal] = useState(null);
  const [submittedPhone, setSubmittedPhone] = useState(null);
  const [submittedAddress, setSubmittedAddress] = useState(null);
  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState(user?.addresses || []);
  const [useSaved, setUseSaved] = useState(savedAddresses.length > 0);
  const [selectedAddrIndex, setSelectedAddrIndex] = useState(0);

  useEffect(() => {
    setSavedAddresses(user?.addresses || []);
    setUseSaved((user?.addresses || []).length > 0);
    // default name from account when available
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation
    const newErrors = {};
    if (!name || !name.trim()) newErrors.name = 'Họ tên là bắt buộc';

    // Determine phone source: from saved address or manual input
    const phoneFromSaved =
      useSaved && savedAddresses[selectedAddrIndex]
        ? savedAddresses[selectedAddrIndex].phone
        : null;
    const phoneToValidate = phoneFromSaved || phone;

    // Only validate phone if not coming from saved address (where it's already validated)
    if (!useSaved || !phoneFromSaved) {
      const phoneRegex = /^0\d{9,10}$/;
      if (!phoneToValidate || !phoneRegex.test(phoneToValidate))
        newErrors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0xxxxxxxxx)';
    }

    if (!useSaved) {
      if (!houseNumber || !houseNumber.trim())
        newErrors.houseNumber = 'Số nhà/địa chỉ là bắt buộc';
      if (!street || !street.trim()) newErrors.street = 'Đường là bắt buộc';
      if (!ward || !ward.trim()) newErrors.ward = 'Phường/Xã là bắt buộc';
      if (!district || !district.trim())
        newErrors.district = 'Quận/Huyện là bắt buộc';
      if (!city || !city.trim()) newErrors.city = 'Tỉnh/Thành phố là bắt buộc';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // scroll to top of form so user sees errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    // Build order payload
    const items = cartItems.map((i) => ({
      productId: i._id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }));

    let addressPayload = null;
    // If using saved address, prefer address object and phone from it
    if (useSaved && savedAddresses[selectedAddrIndex]) {
      addressPayload = savedAddresses[selectedAddrIndex];
    } else {
      addressPayload = { houseNumber, street, ward, district, city };
    }

    const phoneToSend = useSaved
      ? savedAddresses[selectedAddrIndex]?.phone || phone
      : phone;

    const payload = {
      items,
      customerName: name,
      phone: phoneToSend,
      address: addressPayload,
      paymentMethod: payment,
      totalAmount,
    };

    try {
      // Try to use the token from context, fallback to localStorage
      const savedToken = token || localStorage.getItem('token');
      const headers = savedToken
        ? { Authorization: `Bearer ${savedToken}` }
        : {};

      // Capture the current total and phone before we clear the cart
      const finalTotal = totalAmount;
      const finalPhone = phoneToSend;
      const finalAddress = addressPayload;
      await axios.post('http://localhost:5000/api/orders', payload, {
        headers,
      });
      setSubmittedTotal(finalTotal);
      setSubmittedPhone(finalPhone);
      setSubmittedAddress(finalAddress);
      setSubmitted(true);
      clearCart();
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Order submit error', err);
      alert(err.response?.data?.error || 'Lỗi khi gửi đơn hàng');
    }
  };

  const fullAddress = [houseNumber, street, ward, district, city]
    .filter(Boolean)
    .join(', ');

  if (submitted) {
    return (
      <SimpleLayout>
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle>Đặt hàng thành công</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Cảm ơn {name || 'khách hàng'} — đơn hàng của bạn đã được đặt.
              </p>
              {(submittedPhone ?? phone) && (
                <p>Số điện thoại: {submittedPhone ?? phone}</p>
              )}
              {submittedAddress ? (
                <p>
                  Địa chỉ:{' '}
                  {[
                    submittedAddress.houseNumber,
                    submittedAddress.street,
                    submittedAddress.ward,
                    submittedAddress.district,
                    submittedAddress.city,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              ) : (
                fullAddress && <p>Địa chỉ: {fullAddress}</p>
              )}
              <p className="mt-2">
                Số tiền:{' '}
                {(submittedTotal ?? totalAmount).toLocaleString('vi-VN')}đ
              </p>
            </CardContent>
          </Card>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Thanh toán</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Quay về trang chủ
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Họ và tên</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full rounded-md border p-2 bg-input text-foreground ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {!useSaved && (
              <div>
                <label className="block text-sm font-medium">
                  Số điện thoại
                </label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`mt-1 block w-full rounded-md border p-2 bg-input text-foreground ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                  type="tel"
                  placeholder="0xxxxxxxx"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            )}

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Địa chỉ giao hàng</legend>
              {savedAddresses && savedAddresses.length > 0 ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useSaved}
                      onChange={(e) => setUseSaved(e.target.checked)}
                    />{' '}
                    Sử dụng địa chỉ đã lưu
                  </label>
                  {useSaved && (
                    <select
                      className="w-full p-2 border rounded"
                      value={selectedAddrIndex}
                      onChange={(e) =>
                        setSelectedAddrIndex(Number(e.target.value))
                      }
                    >
                      {savedAddresses.map((a, idx) => (
                        <option key={idx} value={idx}>
                          {a.label || `Địa chỉ ${idx + 1}`} -{' '}
                          {[a.houseNumber, a.street, a.ward, a.district, a.city]
                            .filter(Boolean)
                            .join(', ')}
                          {a.phone ? ` — ${a.phone}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Bạn chưa có địa chỉ lưu. Vui lòng nhập địa chỉ bên dưới.
                </p>
              )}

              {!useSaved && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        required
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        placeholder="Số nhà"
                        className={`mt-1 block w-full rounded-md border p-2 bg-input text-foreground ${
                          errors.houseNumber ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.houseNumber && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.houseNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Đường"
                        className={`mt-1 block w-full rounded-md border p-2 bg-input text-foreground ${
                          errors.street ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.street && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.street}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <input
                        required
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        placeholder="Phường / Xã"
                        className={`mt-1 block w-full rounded-md border p-2 bg-input text-foreground ${
                          errors.ward ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.ward && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.ward}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Quận / Huyện"
                        className={`mt-1 block w-full rounded-md border p-2 bg-input text-foreground ${
                          errors.district ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.district && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.district}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Tỉnh / TP"
                        className={`mt-1 block w-full rounded-md border p-2 bg-input text-foreground ${
                          errors.city ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </fieldset>

            <div>
              <label className="block text-sm font-medium">
                Phương thức thanh toán
              </label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="mt-1 block w-full rounded-md border p-2 bg-input text-foreground"
              >
                <option value="cash">Tiền mặt khi nhận hàng</option>
                <option value="card">Thanh toán thẻ</option>
              </select>
            </div>

            <Button type="submit">Xác nhận đặt hàng</Button>
          </form>

          <aside>
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {cartItems.map((item) => (
                    <li key={item._id} className="flex justify-between">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between font-bold">
                  <span>Tổng:</span>
                  <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              </CardContent>
              <CardFooter>
                <small className="text-muted-foreground">
                  Bạn sẽ được chuyển đến trang xác nhận sau khi đặt hàng.
                </small>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </SimpleLayout>
  );
}
