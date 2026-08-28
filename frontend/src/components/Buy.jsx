import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Buy() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ==========================================
  // GET COURSE DETAILS
  // ==========================================

  useEffect(() => {
    if (!token || !courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${BACKEND_URL}/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setCourse(response.data.course);
      } catch (error) {
        console.log("Course details error:", error);

        if (error?.response?.status === 400) {
          toast.error("You have already purchased this course");
          navigate("/purchases");
          return;
        }

        setError(
          error?.response?.data?.errors ||
            error?.response?.data?.message ||
            "Unable to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, token, navigate]);

  // ==========================================
  // HANDLE PURCHASE
  // ==========================================

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!course) {
      toast.error("Course information not available");
      return;
    }

    if (!window.Razorpay) {
      toast.error(
        "Razorpay is not loaded. Please refresh the page."
      );
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // CREATE RAZORPAY ORDER
      // ======================================

      const response = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Create order response:", response.data);

      const { order, razorpayKeyId } = response.data;

      if (!order || !order.id) {
        throw new Error("Razorpay order was not created");
      }

      if (!razorpayKeyId) {
        throw new Error("Razorpay key ID is missing");
      }

      // ======================================
      // RAZORPAY OPTIONS
      // ======================================

      const options = {
        key: razorpayKeyId,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "Course App",

        description: course.title,

        order_id: order.id,

        prefill: {
          name:
            user?.user?.firstName ||
            user?.user?.name ||
            "",

          email:
            user?.user?.email ||
            "",
        },

        notes: {
          courseId: courseId,
        },

        theme: {
          color: "#6366f1",
        },

        // ====================================
        // PAYMENT SUCCESS
        // ====================================

        handler: async function (paymentResponse) {
          try {
            console.log(
              "Razorpay payment response:",
              paymentResponse
            );

            const verifyResponse = await axios.post(
              `${BACKEND_URL}/course/verify-payment`,
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,

                courseId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },

                withCredentials: true,
              }
            );

            console.log(
              "Payment verification response:",
              verifyResponse.data
            );

            if (verifyResponse.data.success) {
              toast.success(
                "Payment Successful! Course purchased."
              );

              navigate("/purchases");
            } else {
              toast.error(
                verifyResponse.data.message ||
                  "Payment verification failed"
              );
            }
          } catch (error) {
            console.log(
              "Payment verification error:",
              error
            );

            toast.error(
              error?.response?.data?.message ||
                error?.response?.data?.errors ||
                "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },

        // ====================================
        // PAYMENT WINDOW CLOSED
        // ====================================

        modal: {
          ondismiss: function () {
            console.log("Razorpay payment window closed");

            setLoading(false);
          },
        },
      };

      // ======================================
      // OPEN RAZORPAY
      // ======================================

      const razorpay = new window.Razorpay(options);

      // ======================================
      // PAYMENT FAILED
      // ======================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.log(
            "Payment failed:",
            response
          );

          toast.error(
            response?.error?.description ||
              "Payment failed"
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.log(
        "Razorpay order creation error:",
        error
      );

      toast.error(
        error?.response?.data?.errors ||
          error?.response?.data?.message ||
          error?.message ||
          "Unable to create payment order"
      );

      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && !course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-red-100 text-red-700 px-6 py-6 rounded-lg w-full max-w-md">
          <p className="text-lg font-semibold">
            {error}
          </p>

          <Link
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-4 flex items-center justify-center"
            to="/courses"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO COURSE
  // ==========================================

  if (!course) {
    return null;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex flex-col md:flex-row gap-10 my-20 px-4 container mx-auto">
      {/* LEFT */}
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl font-bold underline">
          Order Details
        </h1>

        {/* Course Image */}
        {course?.image?.url && (
          <img
            src={course.image.url}
            alt={course.title}
            className="w-full max-w-lg h-64 object-cover rounded-lg mt-6 shadow"
          />
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mt-6">
          <h2 className="text-gray-600 text-lg">
            Total Price:
          </h2>

          <p className="text-red-500 font-bold text-xl">
            ₹{course.price}
          </p>
        </div>

        {/* Course Name */}
        <div className="flex items-start gap-3 mt-3">
          <h2 className="text-gray-600 text-lg">
            Course:
          </h2>

          <p className="text-indigo-600 font-bold text-lg">
            {course.title}
          </p>
        </div>

        {/* Description */}
        {course.description && (
          <p className="text-gray-600 mt-5 leading-relaxed">
            {course.description}
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex justify-center items-start">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            Process your Payment
          </h2>

          <p className="text-gray-600 text-sm mb-5">
            Pay securely using Razorpay.
          </p>

          {/* PAYMENT BUTTON */}
          <form onSubmit={handlePurchase}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : `Pay ₹${course.price}`}
            </button>
          </form>

          <Link
            to="/courses"
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition duration-200 mt-3 flex items-center justify-center"
          >
            Cancel
          </Link>

          <p className="text-xs text-gray-500 text-center mt-5">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}

export default Buy;