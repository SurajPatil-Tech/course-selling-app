import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/utils";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/admin/logout`,
        {
          withCredentials: true,
        }
      );

      toast.success(
        response.data.message || "Logged out successfully"
      );

      localStorage.removeItem("admin");

      navigate("/admin/login");
    } catch (error) {
      console.log("Error in logging out:", error);

      toast.error(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          "Error in logging out"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* =====================================
          MOBILE / TOP HEADER
      ====================================== */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30">

        <div className="flex items-center justify-between">

          {/* Logo + Admin */}
          <div className="flex items-center gap-3">

            <img
              src={logo}
              alt="Admin"
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
            />

            <div>
              <p className="text-xs text-gray-500">
                Welcome
              </p>

              <h2 className="font-bold text-gray-800">
                I'm Admin
              </h2>
            </div>

          </div>

          {/* Home */}
          <Link
            to="/"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Home
          </Link>

        </div>

      </div>


      {/* =====================================
          SIDEBAR
      ====================================== */}
      <aside
        className="
          w-full
          md:w-64
          md:min-h-screen
          bg-white
          border-b
          md:border-b-0
          md:border-r
          border-gray-200
          p-4
          sm:p-5
          md:fixed
          md:left-0
          md:top-0
          md:bottom-0
          md:flex
          md:flex-col
        "
      >

        {/* Desktop Profile */}
        <div className="hidden md:flex flex-col items-center mb-10">

          <div className="relative">

            <img
              src={logo}
              alt="Profile"
              className="rounded-full h-20 w-20 object-cover border-4 border-orange-100"
            />

            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>

          </div>

          <h2 className="text-lg font-bold mt-4 text-gray-800">
            I'm Admin
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Administrator
          </p>

        </div>


        {/* Navigation */}
        <nav className="grid grid-cols-2 md:flex md:flex-col gap-3 md:space-y-0">

          {/* Our Courses */}
          <Link
            to="/admin/our-courses"
            className="group"
          >
            <button
              className="
                w-full
                bg-green-600
                hover:bg-green-700
                text-white
                py-3
                px-3
                rounded-xl
                font-medium
                transition-all
                duration-300
                shadow-sm
                hover:shadow-md
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <span className="text-lg">
                📚
              </span>

              <span className="text-sm sm:text-base">
                Our Courses
              </span>
            </button>
          </Link>


          {/* Create Course */}
          <Link
            to="/admin/create-course"
            className="group"
          >
            <button
              className="
                w-full
                bg-orange-500
                hover:bg-orange-600
                text-white
                py-3
                px-3
                rounded-xl
                font-medium
                transition-all
                duration-300
                shadow-sm
                hover:shadow-md
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <span className="text-lg">
                ➕
              </span>

              <span className="text-sm sm:text-base">
                Create Course
              </span>
            </button>
          </Link>


          {/* Home */}
          <Link
            to="/"
            className="group"
          >
            <button
              className="
                w-full
                bg-blue-500
                hover:bg-blue-600
                text-white
                py-3
                px-3
                rounded-xl
                font-medium
                transition-all
                duration-300
                shadow-sm
                hover:shadow-md
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <span className="text-lg">
                🏠
              </span>

              <span className="text-sm sm:text-base">
                Home
              </span>
            </button>
          </Link>


          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              w-full
              bg-red-500
              hover:bg-red-600
              text-white
              py-3
              px-3
              rounded-xl
              font-medium
              transition-all
              duration-300
              shadow-sm
              hover:shadow-md
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <span className="text-lg">
              🚪
            </span>

            <span className="text-sm sm:text-base">
              Logout
            </span>
          </button>

        </nav>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}
      <main
        className="
          flex-1
          md:ml-64
          min-h-screen
          p-4
          sm:p-6
          lg:p-10
        "
      >

        {/* Page Header */}
        <div className="max-w-6xl mx-auto">

          <div className="bg-gradient-to-r from-gray-900 to-blue-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white shadow-xl">

            <div className="max-w-2xl">

              <p className="text-orange-400 font-semibold text-sm sm:text-base mb-2">
                ADMIN DASHBOARD
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Welcome!!! 👋
              </h1>

              <p className="text-gray-300 mt-4 text-sm sm:text-base lg:text-lg leading-7">
                Manage your courses, create new courses,
                update existing courses and control your
                CourseHaven admin panel from one place.
              </p>

            </div>

          </div>


          {/* =====================================
              DASHBOARD CARDS
          ====================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

            {/* Courses Card */}
            <Link
              to="/admin/our-courses"
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                📚
              </div>

              <h2 className="text-lg font-bold text-gray-800 mt-4">
                Our Courses
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                View and manage all your courses.
              </p>

              <div className="text-green-600 font-semibold text-sm mt-4">
                Manage Courses →
              </div>

            </Link>


            {/* Create Course Card */}
            <Link
              to="/admin/create-course"
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                ➕
              </div>

              <h2 className="text-lg font-bold text-gray-800 mt-4">
                Create Course
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Add a new course to your platform.
              </p>

              <div className="text-orange-500 font-semibold text-sm mt-4">
                Create Course →
              </div>

            </Link>


            {/* Website Card */}
            <Link
              to="/"
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                🌐
              </div>

              <h2 className="text-lg font-bold text-gray-800 mt-4">
                Visit Website
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Visit the main CourseHaven website.
              </p>

              <div className="text-blue-500 font-semibold text-sm mt-4">
                Visit Website →
              </div>

            </Link>

          </div>


          {/* =====================================
              QUICK ACTIONS
          ====================================== */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mt-6 shadow-sm">

            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Quickly access the most used admin features.
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

              <Link
                to="/admin/create-course"
                className="flex items-center justify-between border border-gray-200 rounded-xl p-4 hover:bg-orange-50 hover:border-orange-200 transition"
              >

                <div className="flex items-center gap-3">

                  <span className="text-2xl">
                    ➕
                  </span>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Add New Course
                    </h3>

                    <p className="text-xs text-gray-500">
                      Create a new course
                    </p>
                  </div>

                </div>

                <span className="text-gray-400">
                  →
                </span>

              </Link>


              <Link
                to="/admin/our-courses"
                className="flex items-center justify-between border border-gray-200 rounded-xl p-4 hover:bg-green-50 hover:border-green-200 transition"
              >

                <div className="flex items-center gap-3">

                  <span className="text-2xl">
                    📖
                  </span>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Manage Courses
                    </h3>

                    <p className="text-xs text-gray-500">
                      Update or delete courses
                    </p>
                  </div>

                </div>

                <span className="text-gray-400">
                  →
                </span>

              </Link>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;