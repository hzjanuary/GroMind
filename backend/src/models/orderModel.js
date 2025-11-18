const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const addressSchema = new mongoose.Schema(
  {
    houseNumber: String,
    street: String,
    ward: String,
    district: String,
    city: String,
    phone: String,
    label: String,
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  username: { type: String, required: false },
  items: [orderItemSchema],
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: addressSchema,
  paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['ordered', 'pending', 'completed'],
    default: 'ordered',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
