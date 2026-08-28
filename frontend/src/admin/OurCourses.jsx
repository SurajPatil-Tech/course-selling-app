import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  // Get admin safely
  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  // Check authentication
  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  // Fetch courses
  useEffect(() => {
    if (!token) return;

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          {
            withCredentials: true,
          }
        );

        console.log(response.data.courses);

        setCourses(response.data.courses || []);
      } catch (error) {
        console.log("Error in fetchCourses:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to fetch courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // Delete course
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(
        response.data.message || "Course deleted successfully"
      );

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id)
      );
    } catch (error) {
      console.log("Error in deleting course:", error);

      toast.error(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          "Error in deleting course"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600 font-medium">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[72px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            
            {/* Title */}
            <div>
              <p className="text-sm text-orange-500 font-semibold">
                ADMIN PANEL
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Our Courses
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage all your courses from here
              </p>
            </div>

            {/* Dashboard Button */}
            <Link
              to="/admin/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-orange-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-sm"
            >
              <span>←</span>
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Course Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              All Courses
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"} available
            </p>
          </div>
        </div>

        {/* Empty State */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-3xl">
              📚
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-5">
              No Courses Found
            </h3>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              You haven't added any courses yet. Add your first course
              from the admin dashboard.
            </p>

            <Link
              to="/admin/dashboard"
              className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-video bg-gray-200">
                  <img
                    src={course?.image?.url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow">
                    10% OFF
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  
                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
                    {course.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mt-2 leading-6 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Price */}
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-orange-500">
                      ₹{course.price}
                    </span>

                    <span className="text-sm text-gray-400 line-through mb-1">
                      ₹300
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-4"></div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Link
                      to={`/admin/update-course/${course._id}`}
                      className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-3 rounded-lg font-medium text-sm transition"
                    >
                      ✏️ Update
                    </Link>

                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={deletingId === course._id}
                      className="flex items-center justify-center bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2.5 px-3 rounded-lg font-medium text-sm transition"
                    >
                      {deletingId === course._id ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Deleting
                        </>
                      ) : (
                        <>🗑️ Delete</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default OurCourses;