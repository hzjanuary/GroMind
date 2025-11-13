/**
 * Script: claim_orders_by_phone.js
 * Usage:
 *   node src/scripts/claim_orders_by_phone.js --dry
 *   node src/scripts/claim_orders_by_phone.js --apply
 *
 * This script finds orders without `username` and attempts to match them to a user
 * by phone number (matching any address.phone). If a single matching user is found,
 * the script will set order.user and order.username. Use --dry to see proposed changes.
 */

const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry') || !args.includes('--apply');

async function run() {
  await connectDB();

  console.log('Searching orders without username...');
  const orders = await Order.find({
    $or: [
      { username: { $exists: false } },
      { username: null },
      { username: '' },
    ],
  });
  console.log(`Found ${orders.length} guest orders`);

  let proposed = [];

  for (const o of orders) {
    const phone = o.phone;
    if (!phone) continue;

    // find users that have an address with the same phone
    const users = await User.find({ 'addresses.phone': phone }).lean();
    if (users.length === 1) {
      const u = users[0];
      proposed.push({
        orderId: o._id.toString(),
        phone,
        userId: u._id.toString(),
        username: u.username || u.name,
      });
    } else if (users.length > 1) {
      console.warn(
        `Multiple users matched phone ${phone} for order ${o._id} — skipping`,
      );
    } else {
      // no user matched
    }
  }

  console.log('Proposed assignments:', proposed);

  if (dryRun) {
    console.log('Dry run mode — no changes made. To apply, run with --apply');
    process.exit(0);
  }

  // apply changes
  for (const p of proposed) {
    try {
      await Order.updateOne(
        { _id: p.orderId },
        {
          $set: {
            user: mongoose.Types.ObjectId(p.userId),
            username: p.username,
          },
        },
      );
      console.log(
        `Updated order ${p.orderId} -> user ${p.userId} (${p.username})`,
      );
    } catch (err) {
      console.error('Error updating order', p.orderId, err);
    }
  }

  console.log('Done');
  process.exit(0);
}

run().catch((err) => {
  console.error('Script error', err);
  process.exit(1);
});
