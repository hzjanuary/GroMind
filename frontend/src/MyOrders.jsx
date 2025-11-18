import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SimpleLayout from './layouts/SimpleLayout.jsx';

const BACKEND_URL = 'http://localhost:5000';

export default function MyOrders() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ordered':
        return 'Đã đặt';
      case 'pending':
        return 'Đang giao';
      case 'completed':
        return 'Hoàn thành';
      default:
        return 'Không rõ';
    }
  };

  // Removed debug logging to avoid unnecessary work

  // don't early return (keep hooks consistent); we'll show message in render if not authenticated

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Error fetching orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
    else setLoading(false);
  }, [token]);

  if (loading)
    return (
      <SimpleLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
          <p>Đang tải...</p>
        </div>
      </SimpleLayout>
    );

  if (!token) {
    return (
      <SimpleLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
          <p>Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Quay về trang chủ
          </Button>
        </div>
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const items = order.items || [];
              const displayedItems = isExpanded ? items : items.slice(0, 3);
              const hasMore = items.length > 3;

              return (
                <Card key={order._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
                      <span>
                        Đơn #{order._id} -{' '}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : '—'}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getStatusColor(
                          order.status || 'ordered',
                        )}`}
                      >
                        {getStatusLabel(order.status || 'ordered')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {displayedItems.map((it, i) => (
                        <li key={i} className="flex justify-between">
                          <span>
                            {it.name} x {it.quantity}
                          </span>
                          <span>
                            {(it.price * it.quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </li>
                      ))}
                    </ul>
                    {hasMore && !isExpanded && (
                      <button
                        onClick={() => setExpandedOrderId(order._id)}
                        className="text-blue-600 dark:text-blue-400 hover:underline mt-2 text-sm"
                      >
                        ... xem thêm ({items.length - 3} sản phẩm)
                      </button>
                    )}
                    {isExpanded && hasMore && (
                      <button
                        onClick={() => setExpandedOrderId(null)}
                        className="text-blue-600 dark:text-blue-400 hover:underline mt-2 text-sm"
                      >
                        ← ẩn bớt
                      </button>
                    )}
                    <div className="mt-2 font-bold flex justify-between">
                      <span>Tổng:</span>
                      <span>{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}
