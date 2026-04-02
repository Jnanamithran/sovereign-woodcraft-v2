import asyncHandler from '../middleware/asyncHandler.js';
import { getOrders as readOrders, writeOrders } from '../utils/jsonData.js';

// Helper functions
const findOrderById = (orders, id) => {
  return orders.find(o => o._id === id);
};

const findOrdersByUserId = (orders, userId) => {
  return orders.filter(o => o.user === userId);
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const orders = await readOrders();
  
  // Generate new order ID
  const maxId = orders.reduce((max, o) => {
    const id = parseInt(o._id, 10);
    return id > max ? id : max;
  }, 0);

  const order = {
    _id: (maxId + 1).toString(),
    orderItems: orderItems.map((x) => ({
      ...x,
      product: x._id,
      _id: undefined,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: false,
    isDelivered: false,
    createdAt: new Date().toISOString(),
    paidAt: null,
    deliveredAt: null,
    paymentResult: null
  };

  orders.push(order);
  await writeOrders(orders);

  res.status(201).json(order);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await readOrders();
  const userOrders = findOrdersByUserId(orders, req.user._id);
  res.json(userOrders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const orders = await readOrders();
  const order = findOrderById(orders, req.params.id);

  if (order) {
    // Mock user population
    const orderWithUser = {
      ...order,
      user: {
        name: 'User Name', // In real app, this would come from user lookup
        email: 'user@example.com'
      }
    };
    res.json(orderWithUser);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const orders = await readOrders();
  const orderIndex = orders.findIndex(o => o._id === req.params.id);

  if (orderIndex !== -1) {
    orders[orderIndex].isPaid = true;
    orders[orderIndex].paidAt = new Date().toISOString();
    orders[orderIndex].paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    await writeOrders(orders);
    res.json(orders[orderIndex]);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const orders = await readOrders();
  const orderIndex = orders.findIndex(o => o._id === req.params.id);

  if (orderIndex !== -1) {
    orders[orderIndex].isDelivered = true;
    orders[orderIndex].deliveredAt = new Date().toISOString();

    await writeOrders(orders);
    res.json(orders[orderIndex]);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await readOrders();
  // Mock user population
  const ordersWithUsers = orders.map(order => ({
    ...order,
    user: {
      id: order.user,
      name: 'User Name' // In real app, this would come from user lookup
    }
  }));
  res.json(ordersWithUsers);
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
  const orders = await readOrders();
  const orderIndex = orders.findIndex(o => o._id === req.params.id);

  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1);
    await writeOrders(orders);
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});