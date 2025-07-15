// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ["PayPal", "Cash"],
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending"
  },
  transactionId: String,
  paidAt: Date
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
