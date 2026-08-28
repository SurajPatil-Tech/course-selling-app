import { Order } from "../models/order.model.js";

// ==========================================
// GET ORDER DETAILS
// ==========================================

export const getOrderData = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        errors: "User not authenticated",
      });
    }

    const orders = await Order.find({
      userId,
    })
      .populate("courseId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Error getting orders:", error);

    return res.status(500).json({
      errors: "Error getting order details",
    });
  }
};