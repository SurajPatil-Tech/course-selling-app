import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
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

    paymentId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate purchase
purchaseSchema.index(
  {
    userId: 1,
    courseId: 1,
  },
  {
    unique: true,
  }
);

export const Purchase = mongoose.model(
  "Purchase",
  purchaseSchema
);