import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { Order } from "../models/order.model.js";

import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import Razorpay from "razorpay";
import config from "../config.js";

// ==========================================
// RAZORPAY INSTANCE
// ==========================================

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

// ==========================================
// CREATE COURSE
// ==========================================

export const createCourse = async (req, res) => {
  const adminId = req.adminId;

  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({
        errors: "All fields are required",
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        errors: "Price must be greater than 0",
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        errors: "No file uploaded",
      });
    }

    const { image } = req.files;

    if (!image) {
      return res.status(400).json({
        errors: "Course image is required",
      });
    }

    const allowedFormat = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({
        errors:
          "Invalid file format. Only PNG, JPG, JPEG and WEBP are allowed",
      });
    }

    const cloud_response = await cloudinary.uploader.upload(
      image.tempFilePath
    );

    if (!cloud_response || cloud_response.error) {
      return res.status(400).json({
        errors: "Error uploading file to Cloudinary",
      });
    }

    const courseData = {
      title,
      description,
      price: Number(price),

      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url || cloud_response.url,
      },

      creatorId: adminId,
    };

    const course = await Course.create(courseData);

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log("Error creating course:", error);

    return res.status(500).json({
      errors: "Error creating course",
    });
  }
};

// ==========================================
// UPDATE COURSE
// ==========================================

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  const { title, description, price, image } = req.body;

  try {
    const courseSearch = await Course.findById(courseId);

    if (!courseSearch) {
      return res.status(404).json({
        errors: "Course not found",
      });
    }

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title,
        description,
        price: Number(price),

        ...(image && {
          image: {
            public_id: image.public_id,
            url: image.url,
          },
        }),
      },
      {
        new: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        errors: "Can't update, course created by another admin",
      });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.log("Error updating course:", error);

    return res.status(500).json({
      errors: "Error in course updating",
    });
  }
};

// ==========================================
// DELETE COURSE
// ==========================================

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res.status(404).json({
        errors: "Can't delete, course created by another admin",
      });
    }

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting course:", error);

    return res.status(500).json({
      errors: "Error in course deleting",
    });
  }
};

// ==========================================
// GET ALL COURSES
// ==========================================

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log("Error getting courses:", error);

    return res.status(500).json({
      errors: "Error in getting courses",
    });
  }
};

// ==========================================
// COURSE DETAILS
// ==========================================

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        errors: "Course not found",
      });
    }

    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.log("Error in course details:", error);

    return res.status(500).json({
      errors: "Error in getting course details",
    });
  }
};

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

export const buyCourses = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  try {
    console.log("================================");
    console.log("CREATE RAZORPAY ORDER");
    console.log("User ID:", userId);
    console.log("Course ID:", courseId);
    console.log("================================");

    // Check user
    if (!userId) {
      return res.status(401).json({
        errors: "User not authenticated",
      });
    }

    // Check course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        errors: "Course not found",
      });
    }

    // Check existing purchase
    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
    });

    if (existingPurchase) {
      return res.status(400).json({
        errors: "User has already purchased this course",
      });
    }

    // Course price
    const amount = Math.round(Number(course.price) * 100);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        errors: "Invalid course price",
      });
    }

    // ==========================================
    // IMPORTANT:
    // Razorpay receipt max length = 40/56 depending
    // on validation. Keep it very short.
    // ==========================================

    const receipt = `rcpt_${Date.now()}`;

    const options = {
      amount,
      currency: "INR",
      receipt,
    };

    console.log("Razorpay options:", options);

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    console.log("================================");
    console.log("RAZORPAY ORDER CREATED");
    console.log("Order ID:", order.id);
    console.log("Amount:", order.amount);
    console.log("================================");

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",

      course,

      order,

      razorpayKeyId: config.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("================================");
    console.log("RAZORPAY ORDER ERROR");
    console.log("================================");

    console.log("Error:", error);

    return res.status(500).json({
      success: false,
      errors:
        error?.error?.description ||
        error?.message ||
        "Error in course buying",
    });
  }
};

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    console.log("================================");
    console.log("PAYMENT VERIFICATION");
    console.log("================================");

    console.log("User ID:", userId);
    console.log("Course ID:", courseId);
    console.log("Razorpay Order ID:", razorpay_order_id);
    console.log("Razorpay Payment ID:", razorpay_payment_id);

    // ==========================================
    // CHECK USER
    // ==========================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // ==========================================
    // CHECK PAYMENT DATA
    // ==========================================

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment information is incomplete",
      });
    }

    // ==========================================
    // VERIFY SIGNATURE
    // ==========================================

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Invalid Razorpay signature");

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    console.log("✅ Razorpay signature verified");

    // ==========================================
    // CHECK COURSE
    // ==========================================

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==========================================
    // CHECK PURCHASE
    // ==========================================

    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
    });

    if (existingPurchase) {
      console.log("⚠️ Course already purchased");

      return res.status(400).json({
        success: false,
        message: "Course already purchased",
      });
    }

    // ==========================================
    // CHECK ORDER
    // ==========================================

    const existingOrder = await Order.findOne({
      paymentId: razorpay_payment_id,
    });

    if (existingOrder) {
      console.log("⚠️ Payment already stored");

      return res.status(400).json({
        success: false,
        message: "Payment already processed",
      });
    }

    // ==========================================
    // OPTIONAL:
    // Verify Razorpay order from Razorpay server
    // ==========================================

    const razorpayOrder = await razorpay.orders.fetch(
      razorpay_order_id
    );

    if (!razorpayOrder) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order not found",
      });
    }

    // Check order belongs to this course price
    const expectedAmount = Math.round(Number(course.price) * 100);

    if (Number(razorpayOrder.amount) !== expectedAmount) {
      console.log("❌ Amount mismatch");

      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const order = await Order.create({
      userId,
      courseId,

      razorpayOrderId: razorpay_order_id,

      paymentId: razorpay_payment_id,

      amount: Number(course.price),

      status: "paid",
    });

    console.log("================================");
    console.log("✅ ORDER SAVED");
    console.log("================================");

    // ==========================================
    // CREATE PURCHASE
    // ==========================================

    const purchase = await Purchase.create({
      userId,
      courseId,
      paymentId: razorpay_payment_id,
    });

    console.log("================================");
    console.log("✅ PURCHASE SAVED");
    console.log("================================");

    return res.status(201).json({
      success: true,

      message: "Payment verified and course purchased successfully",

      order,

      purchase,
    });
  } catch (error) {
    console.log("================================");
    console.log("❌ PAYMENT VERIFICATION ERROR");
    console.log("================================");

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.message ||
        "Error verifying payment",
    });
  }
};