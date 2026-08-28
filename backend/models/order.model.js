import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);