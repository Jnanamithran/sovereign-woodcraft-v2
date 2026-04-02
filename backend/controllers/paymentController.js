import asyncHandler from '../middleware/asyncHandler.js';

// In-memory data stores
let payments = [];
let orders = []; // This should be imported from orderController or shared
let nextPaymentId = 1;

// Helper functions
const findPaymentById = (id) => {
  return payments.find(p => p._id === id);
};

const findPaymentByIntentId = (intentId) => {
  return payments.find(p => p.paymentIntentId === intentId);
};

// @desc    Create payment intent (mock)
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId, paymentMethodId } = req.body;

  // Find the order (this would need to be imported or shared)
  const order = orders.find(o => o._id === orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if order is already paid
  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Create mock payment intent
  const paymentIntentId = `pi_${Math.random().toString(36).substr(2, 9)}`;
  
  const payment = {
    _id: nextPaymentId.toString(),
    order: order._id,
    amount: order.totalPrice,
    currency: 'usd',
    paymentMethod: 'stripe',
    paymentIntentId: paymentIntentId,
    status: 'requires_confirmation',
    stripeCustomerId: `cus_${Math.random().toString(36).substr(2, 9)}`,
    stripePaymentMethodId: paymentMethodId,
    metadata: {
      orderId: order._id.toString(),
      userId: order.user.toString(),
    },
    createdAt: new Date().toISOString()
  };

  payments.push(payment);
  nextPaymentId++;

  // Mock successful payment for demo
  payment.status = 'succeeded';
  
  // Update order status
  order.isPaid = true;
  order.paidAt = new Date().toISOString();
  order.paymentResult = {
    id: paymentIntentId,
    status: 'succeeded',
    update_time: new Date().toISOString(),
    email_address: 'user@example.com',
  };

  res.json({
    clientSecret: `${paymentIntentId}_secret`,
    status: 'succeeded',
    paymentIntentId: paymentIntentId,
  });
});

// @desc    Get payment status
// @route   GET /api/payments/:paymentIntentId/status
// @access  Private
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.params;

  const payment = findPaymentByIntentId(paymentIntentId);
  
  if (payment) {
    res.json({
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      metadata: payment.metadata,
    });
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

// @desc    Handle Stripe webhook (mock)
// @route   POST /api/payments/webhook
// @access  Public (Stripe webhook)
export const handleWebhook = asyncHandler(async (req, res) => {
  // In a real app, this would verify the webhook signature
  // For mock purposes, we'll just acknowledge receipt
  
  const event = req.body;
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Refund payment
// @route   POST /api/payments/:paymentId/refund
// @access  Private/Admin
export const refundPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { amount } = req.body;

  const payment = findPaymentById(paymentId);
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  if (payment.status !== 'succeeded') {
    res.status(400);
    throw new Error('Cannot refund a payment that is not succeeded');
  }

  // Mock refund
  const refundAmount = amount || payment.amount;
  
  payment.status = 'refunded';
  payment.refundedAmount = refundAmount;

  // Find and update the order
  const order = orders.find(o => o._id === payment.order);
  if (order) {
    order.isPaid = false;
    order.paidAt = undefined;
    order.paymentResult = undefined;
  }

  res.json({
    message: 'Refund processed successfully',
    refundId: `ref_${Math.random().toString(36).substr(2, 9)}`,
    refundAmount: refundAmount,
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private/Admin
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = findPaymentById(req.params.id);
  
  if (payment) {
    res.json(payment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
export const getPayments = asyncHandler(async (req, res) => {
  res.json(payments);
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
export const deletePayment = asyncHandler(async (req, res) => {
  const paymentId = req.params.id;
  const paymentIndex = payments.findIndex(p => p._id === paymentId);

  if (paymentIndex !== -1) {
    payments.splice(paymentIndex, 1);
    res.json({ message: 'Payment removed' });
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

// Helper function to handle successful payments
const handlePaymentSucceeded = async (paymentIntent) => {
  try {
    const payment = findPaymentByIntentId(paymentIntent.id);
    if (payment) {
      payment.status = 'succeeded';
      
      const order = orders.find(o => o._id === payment.order);
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date().toISOString();
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: 'user@example.com',
        };
      }
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
};

// Helper function to handle failed payments
const handlePaymentFailed = async (paymentIntent) => {
  try {
    const payment = findPaymentByIntentId(paymentIntent.id);
    if (payment) {
      payment.status = 'failed';
      payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};