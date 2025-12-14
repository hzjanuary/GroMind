import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SimpleLayout from './layouts/SimpleLayout.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToastContainer } from './Toast.jsx';
import {
  AlertCircle,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

export default function AdminDashboard() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchFeatured, setSearchFeatured] = useState('');

  // Form states
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    unit: '',
    category: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Toast helper function
  const showToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/orders/all`, authHeader);
      setOrders(res.data.orders || []);
    } catch {
      showToast('error', 'Lỗi khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm:', err);
    }
  };

  useEffect(() => {
    // Force dark mode for admin dashboard
    const root = document.documentElement;
    root.classList.add('dark');

    // Cleanup: restore to previous state when leaving admin
    return () => {
      const theme = localStorage.getItem('theme');
      if (theme !== 'dark') {
        root.classList.remove('dark');
      }
    };
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      if (isAuthenticated && user?.username === 'admin') {
        setLoading(true);
        try {
          const [ordersRes, categoriesRes, productsRes] = await Promise.all([
            axios.get(`${BACKEND_URL}/api/orders/all`, authHeader),
            axios.get(`${BACKEND_URL}/api/categories`),
            axios.get(`${BACKEND_URL}/api/products`),
          ]);
          setOrders(ordersRes.data.orders || []);
          setCategories(categoriesRes.data || []);
          setProducts(productsRes.data || []);
        } catch (err) {
          console.error('Error loading data:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if user is admin
  if (!isAuthenticated || user?.username !== 'admin') {
    return (
      <SimpleLayout>
        <div className="container mx-auto p-4">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Không có quyền truy cập</h1>
            <p className="text-gray-300 mb-4">
              Chỉ quản trị viên mới có thể truy cập trang này.
            </p>
            <Button onClick={() => navigate('/')}>Quay về trang chủ</Button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  // Order management
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(
        `${BACKEND_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        authHeader,
      );
      if (res.data.success) {
        showToast('success', 'Cập nhật trạng thái thành công');
        fetchOrders();
      }
    } catch (err) {
      showToast(
        'error',
        err.response?.data?.error || 'Lỗi cập nhật trạng thái',
      );
    }
  };

  // Category management
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/categories`,
        { name: newCategory },
        authHeader,
      );
      if (res.data.success) {
        showToast('success', 'Thêm danh mục thành công');
        setNewCategory('');
        fetchCategories();
      }
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Lỗi thêm danh mục');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Xác nhận xóa danh mục này?')) return;
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/categories/${categoryId}`,
        authHeader,
      );
      if (res.data.success) {
        showToast('success', 'Xóa danh mục thành công');
        fetchCategories();
      }
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Lỗi xóa danh mục');
    }
  };

  const handleUpdateCategory = async (categoryId, newName) => {
    if (!newName.trim()) {
      showToast('error', 'Tên danh mục không được để trống');
      return;
    }
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/categories/${categoryId}`,
        { name: newName },
        authHeader,
      );
      if (res.data.success) {
        showToast('success', 'Cập nhật danh mục thành công');
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Lỗi cập nhật danh mục');
    }
  };

  // Product management
  const handleAddProduct = async () => {
    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      !newProduct.unit.trim() ||
      !newProduct.category
    ) {
      showToast('error', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/products`,
        {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          unit: newProduct.unit,
          category: newProduct.category,
        },
        authHeader,
      );
      if (res.data.success) {
        showToast('success', 'Thêm sản phẩm thành công');
        setNewProduct({
          name: '',
          price: '',
          unit: '',
          category: '',
        });
        fetchProducts();
      }
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Lỗi thêm sản phẩm');
    }
  };

  const handleUpdateProduct = async () => {
    if (
      !editingProduct.name.trim() ||
      !editingProduct.price ||
      !editingProduct.unit.trim()
    ) {
      showToast('error', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/products/${editingProduct._id}`,
        {
          name: editingProduct.name,
          price: parseFloat(editingProduct.price),
          unit: editingProduct.unit,
          category: editingProduct.category,
        },
        authHeader,
      );
      if (res.data.success) {
        showToast('success', 'Cập nhật sản phẩm thành công');
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Lỗi cập nhật sản phẩm');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Xác nhận xóa sản phẩm này?')) return;
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/products/${productId}`,
        authHeader,
      );
      if (res.data.success) {
        showToast('success', 'Xóa sản phẩm thành công');
        fetchProducts();
      }
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Lỗi xóa sản phẩm');
    }
  };

  // Xóa hết khuyến mãi - sử dụng API backend
  const handleClearAllFeatured = async () => {
    const featuredProducts = products.filter((p) => p.isFeatured);
    if (featuredProducts.length === 0) {
      showToast('error', 'Không có sản phẩm khuyến mãi nào');
      return;
    }
    if (
      !confirm(
        `Xác nhận xóa tất cả ${featuredProducts.length} sản phẩm khỏi khuyến mãi?`,
      )
    )
      return;

    try {
      setLoading(true);
      const res = await axios.delete(
        `${BACKEND_URL}/api/products/featured/clear-all`,
        authHeader,
      );
      if (res.data.success) {
        showToast('success', res.data.message);
        fetchProducts();
      }
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Lỗi khi xóa khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
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
        return status;
    }
  };

  return (
    <SimpleLayout>
      <div className="dark min-h-screen bg-gray-900">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">
              Bảng điều khiển Quản trị
            </h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              ← Quay về trang chủ
            </Button>
          </div>

          <ToastContainer toasts={toasts} onClose={removeToast} />

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="catalog">Danh mục & Sản phẩm</TabsTrigger>
              <TabsTrigger value="featured">Khuyến mãi</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Quản lý đơn hàng</h2>
              {loading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-gray-300">Không có đơn hàng nào.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order._id ? null : order._id,
                          )
                        }
                      >
                        <div className="flex-1">
                          <div className="font-semibold">
                            Đơn #{order._id.slice(-6)}
                          </div>
                          <div className="text-sm text-gray-300">
                            Từ: {order.username || order.phone}
                          </div>
                          <div className="text-sm text-gray-300">
                            Tổng: {order.totalAmount?.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {getStatusLabel(order.status || 'ordered')}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                              expandedOrder === order._id ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {expandedOrder === order._id && (
                        <div className="mt-4 space-y-3 border-t pt-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Chi tiết sản phẩm:
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {order.items?.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} x{item.quantity} -{' '}
                                  {item.price?.toLocaleString('vi-VN')}đ
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              Địa chỉ giao hàng:
                            </h4>
                            <p className="text-sm">
                              {[
                                order.address?.houseNumber,
                                order.address?.street,
                                order.address?.ward,
                                order.address?.district,
                                order.address?.city,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                            {order.phone && (
                              <p className="text-sm">SĐT: {order.phone}</p>
                            )}
                          </div>

                          <div className="pt-3 border-t">
                            <label className="block text-sm font-semibold mb-2">
                              Thay đổi trạng thái:
                            </label>
                            <div className="flex gap-2">
                              {[
                                { value: 'ordered', label: 'Đã đặt' },
                                { value: 'pending', label: 'Đang giao' },
                                { value: 'completed', label: 'Hoàn thành' },
                              ].map((s) => (
                                <Button
                                  key={s.value}
                                  size="sm"
                                  variant={
                                    order.status === s.value
                                      ? 'default'
                                      : 'outline'
                                  }
                                  onClick={() =>
                                    handleUpdateOrderStatus(order._id, s.value)
                                  }
                                >
                                  {s.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Catalog Tab - Hierarchical Categories & Products */}
            <TabsContent value="catalog" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Quản lý Danh mục & Sản phẩm
              </h2>

              {/* Add Category Section */}
              <div className="border rounded-lg p-4 bg-transparent">
                <h3 className="font-semibold mb-3">Thêm danh mục mới</h3>
                <div className="flex gap-2">
                  <input
                    placeholder="Tên danh mục mới"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="p-2 border rounded flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Button onClick={handleAddCategory} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm
                  </Button>
                </div>
              </div>

              {/* Categories with Expandable Products */}
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Category Header */}
                    <div
                      className="p-3 bg-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-700"
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === cat._id ? null : cat._id,
                        )
                      }
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            expandedCategory === cat._id ? 'rotate-180' : ''
                          }`}
                        />
                        <span className="font-semibold">{cat.name}</span>
                        <span className="text-sm text-gray-400 ml-2">
                          (
                          {
                            products.filter((p) => p.category === cat._id)
                              .length
                          }{' '}
                          sản phẩm)
                        </span>
                      </div>

                      {/* Category Edit/Delete Buttons */}
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {editingCategory === cat._id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateCategory(cat._id, cat.name)
                              }
                            >
                              Lưu
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCategory(null)}
                            >
                              Hủy
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCategory(cat._id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(cat._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Category Edit Input */}
                    {editingCategory === cat._id && (
                      <div
                        className="p-3 bg-transparent border-t flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          value={cat.name}
                          onChange={(e) =>
                            setCategories(
                              categories.map((c) =>
                                c._id === cat._id
                                  ? { ...c, name: e.target.value }
                                  : c,
                              ),
                            )
                          }
                          className="p-2 border rounded flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          autoFocus
                        />
                      </div>
                    )}

                    {/* Products List */}
                    {expandedCategory === cat._id && (
                      <div className="p-3 bg-gray-900 space-y-3 border-t border-gray-700">
                        {/* Add Product Form */}
                        {newProduct.category === cat._id ? (
                          <div className="p-3 border rounded-lg space-y-2 bg-transparent">
                            <h4 className="font-semibold text-sm">
                              Thêm sản phẩm vào {cat.name}
                            </h4>
                            <input
                              placeholder="Tên sản phẩm"
                              value={newProduct.name}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  name: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                            />
                            <input
                              placeholder="Giá"
                              type="number"
                              value={newProduct.price}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  price: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                            />
                            <input
                              placeholder="Đơn vị"
                              value={newProduct.unit}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  unit: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={handleAddProduct}
                                className="flex-1"
                              >
                                Lưu
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setNewProduct({
                                    name: '',
                                    price: '',
                                    unit: '',
                                    category: '',
                                  })
                                }
                                className="flex-1"
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full gap-2"
                            onClick={() =>
                              setNewProduct({
                                name: '',
                                price: '',
                                unit: '',
                                category: cat._id,
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                            Thêm sản phẩm
                          </Button>
                        )}

                        {/* Products List */}
                        <div className="space-y-2">
                          {products
                            .filter((p) => p.category === cat._id)
                            .map((prod) => (
                              <div
                                key={prod._id}
                                className="p-2 border rounded bg-gray-100 dark:bg-gray-800"
                              >
                                {editingProduct?._id === prod._id ? (
                                  <div className="space-y-2">
                                    <input
                                      placeholder="Tên sản phẩm"
                                      value={editingProduct.name}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          name: e.target.value,
                                        })
                                      }
                                      className="w-full p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                                    />
                                    <input
                                      placeholder="Giá"
                                      type="number"
                                      value={editingProduct.price}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          price: e.target.value,
                                        })
                                      }
                                      className="w-full p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                                    />
                                    <input
                                      placeholder="Đơn vị"
                                      value={editingProduct.unit}
                                      onChange={(e) =>
                                        setEditingProduct({
                                          ...editingProduct,
                                          unit: e.target.value,
                                        })
                                      }
                                      className="w-full p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={handleUpdateProduct}
                                        className="flex-1"
                                      >
                                        Lưu
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingProduct(null)}
                                        className="flex-1"
                                      >
                                        Hủy
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-semibold text-sm">
                                        {prod.name}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        {prod.price?.toLocaleString('vi-VN')}đ /{' '}
                                        {prod.unit}
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={() => setEditingProduct(prod)}
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={() =>
                                          handleDeleteProduct(prod._id)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {products.filter((p) => p.category === cat._id)
                          .length === 0 && (
                          <p className="text-sm text-gray-300 text-center py-4">
                            Chưa có sản phẩm nào
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Featured Products Tab */}
            <TabsContent value="featured" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Quản lý Sản phẩm Khuyến mãi
                </h2>
                <Button
                  variant="outline"
                  onClick={handleClearAllFeatured}
                  disabled={
                    loading || products.filter((p) => p.isFeatured).length === 0
                  }
                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                >
                  Xóa hết khuyến mãi
                </Button>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Thêm sản phẩm khuyến mãi không giới hạn. Chỉ 4 sản phẩm đầu tiên
                hiển thị trên trang chủ.
              </p>

              {/* Featured Products List */}
              <div className="space-y-3">
                {products
                  .filter((p) => p.isFeatured)
                  .map((prod, index) => (
                    <div
                      key={prod._id}
                      className="p-4 border rounded-lg bg-transparent space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{prod.name}</div>
                            {index < 4 && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                                Hiển thị trang chủ
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-200 font-medium mt-1">
                            Giá gốc: {prod.price?.toLocaleString('vi-VN')}đ /{' '}
                            {prod.unit}
                          </div>
                          {prod.discountPercent > 0 && (
                            <div className="text-sm font-semibold text-red-400 mt-1">
                              Giá sau giảm:{' '}
                              {Math.round(
                                prod.price * (1 - prod.discountPercent / 100),
                              ).toLocaleString('vi-VN')}
                              đ
                              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                                -{prod.discountPercent}%
                              </span>
                            </div>
                          )}
                          {prod.discountEndTime && (
                            <div className="text-xs text-gray-400 mt-1">
                              Kết thúc:{' '}
                              {new Date(prod.discountEndTime).toLocaleString(
                                'vi-VN',
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `${BACKEND_URL}/api/products/${prod._id}/featured`,
                                { isFeatured: false },
                                authHeader,
                              );
                              setProducts(
                                products.map((p) =>
                                  p._id === prod._id
                                    ? {
                                        ...p,
                                        isFeatured: false,
                                        discountPercent: 0,
                                        discountEndTime: null,
                                      }
                                    : p,
                                ),
                              );
                              showToast('success', 'Đã xóa khỏi khuyến mãi');
                            } catch {
                              showToast('error', 'Lỗi khi cập nhật');
                            }
                          }}
                        >
                          Xóa
                        </Button>
                      </div>

                      {/* Discount Settings */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                        <div>
                          <label className="text-xs font-medium mb-1 block">
                            % Giảm giá
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={prod.discountPercent || 0}
                            onChange={(e) => {
                              const val = Math.min(
                                100,
                                Math.max(0, parseInt(e.target.value) || 0),
                              );
                              setProducts(
                                products.map((p) =>
                                  p._id === prod._id
                                    ? { ...p, discountPercent: val }
                                    : p,
                                ),
                              );
                            }}
                            className="w-full p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium mb-1 block">
                            Thời gian kết thúc
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={
                                prod.discountEndTime
                                  ? new Date(prod.discountEndTime)
                                      .toISOString()
                                      .split('T')[0]
                                  : ''
                              }
                              onChange={(e) => {
                                if (e.target.value) {
                                  const date = new Date(e.target.value);
                                  const currentTime = prod.discountEndTime
                                    ? new Date(prod.discountEndTime)
                                    : new Date();
                                  date.setHours(currentTime.getHours());
                                  date.setMinutes(currentTime.getMinutes());

                                  setProducts(
                                    products.map((p) =>
                                      p._id === prod._id
                                        ? { ...p, discountEndTime: date }
                                        : p,
                                    ),
                                  );
                                }
                              }}
                              className="flex-1 p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white"
                            />
                            <input
                              type="time"
                              value={
                                prod.discountEndTime
                                  ? (() => {
                                      const date = new Date(
                                        prod.discountEndTime,
                                      );
                                      const hh = String(
                                        date.getHours(),
                                      ).padStart(2, '0');
                                      const mm = String(
                                        date.getMinutes(),
                                      ).padStart(2, '0');
                                      return `${hh}:${mm}`;
                                    })()
                                  : ''
                              }
                              onChange={(e) => {
                                if (e.target.value) {
                                  const [hh, mm] = e.target.value.split(':');
                                  const currentDate = prod.discountEndTime
                                    ? new Date(prod.discountEndTime)
                                    : new Date();
                                  currentDate.setHours(parseInt(hh));
                                  currentDate.setMinutes(parseInt(mm));

                                  setProducts(
                                    products.map((p) =>
                                      p._id === prod._id
                                        ? { ...p, discountEndTime: currentDate }
                                        : p,
                                    ),
                                  );
                                }
                              }}
                              className="flex-1 p-2 border rounded text-sm bg-gray-800 border-gray-600 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={async () => {
                          try {
                            await axios.put(
                              `${BACKEND_URL}/api/products/${prod._id}`,
                              {
                                name: prod.name,
                                price: prod.price,
                                unit: prod.unit,
                                category: prod.category,
                                discountPercent: prod.discountPercent || 0,
                                discountEndTime: prod.discountEndTime || null,
                              },
                              authHeader,
                            );
                            showToast('success', 'Đã cập nhật giảm giá');
                          } catch {
                            showToast('error', 'Lỗi khi cập nhật');
                          }
                        }}
                      >
                        Lưu thay đổi
                      </Button>
                    </div>
                  ))}
              </div>

              {products.filter((p) => p.isFeatured).length === 0 && (
                <p className="text-sm text-gray-300 text-center py-4">
                  Chưa có sản phẩm khuyến mãi
                </p>
              )}

              <>
                <hr className="my-4" />
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">
                    Thêm sản phẩm khuyến mãi (
                    {products.filter((p) => p.isFeatured).length} sản phẩm)
                  </h3>
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchFeatured}
                    onChange={(e) => setSearchFeatured(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                <div className="space-y-2">
                  {products
                    .filter((p) => !p.isFeatured)
                    .filter((p) =>
                      p.name
                        .toLowerCase()
                        .includes(searchFeatured.toLowerCase()),
                    )
                    .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
                    .map((prod) => (
                      <div
                        key={prod._id}
                        className="p-3 border rounded flex justify-between items-start"
                      >
                        <div>
                          <div className="font-semibold text-sm">
                            {prod.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {prod.price?.toLocaleString('vi-VN')}đ / {prod.unit}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `${BACKEND_URL}/api/products/${prod._id}/featured`,
                                { isFeatured: true },
                                authHeader,
                              );
                              setProducts(
                                products.map((p) =>
                                  p._id === prod._id
                                    ? { ...p, isFeatured: true }
                                    : p,
                                ),
                              );
                              showToast('success', 'Đã thêm vào khuyến mãi');
                            } catch {
                              showToast('error', 'Lỗi khi cập nhật');
                            }
                          }}
                        >
                          Thêm
                        </Button>
                      </div>
                    ))}
                </div>
              </>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SimpleLayout>
  );
}
