import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['PRODUCT_ADDED', 'ORDER_PLACED', 'USER_REGISTERED'], // Types of events you want to log
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Optional: link to the user who performed the action
    },
  },
  {
    timestamps: true, // Automatically adds createdAt
  }
);

const Log = mongoose.model('Log', logSchema);

export default Log;
