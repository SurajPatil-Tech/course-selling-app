import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
      <div className=" md:min-h-screen text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6 ">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt=""
              className="w-7 h-7 md:w-10 md:h-10 rounded-full"
            />
            <h1 className="md:text-2xl text-orange-500 font-bold">
              CourseHaven
            </h1>
          </div>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main section */}
        <section className="text-center py-20">
          <h1 className="text-4xl font-semibold text-orange-500">
            CourseHaven
          </h1>

          <br />
          <p className="text-gray-500">
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className="space-x-4 mt-8">
            <Link
              to={"/courses"}
              className="bg-green-500 text-white p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black"
            >
              Explore courses
            </Link>
            <Link
              to={"https://www.youtube.com"}
              className="bg-white text-black  p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white"
            >
              Courses videos
            </Link>
          </div>
        </section>
        <section className="p-10">
          <Slider className="" {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt=""
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white mb-5">
                        {course.title}
                      </h2>
                      <Link to={`/buy/${course._id}`} className="mt-8 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />
        {/* Footer */}
       <footer className="mt-16 border-t border-white/10 bg-black/30">
  <div className="container mx-auto px-5 sm:px-8 lg:px-12">

    {/* Main Footer */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">

      {/* Brand */}
      <div className="lg:col-span-1">

        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="CourseHaven"
            className="w-11 h-11 rounded-full"
          />

          <h2 className="text-2xl font-bold text-orange-500">
            CourseHaven
          </h2>
        </div>

        <p className="mt-5 text-gray-400 text-sm leading-6 max-w-xs">
          Learn new skills, build your career, and achieve your goals
          with expert-led online courses.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-3 mt-6">

          <a
            href="#"
            aria-label="Facebook"
            className="w-10 h-10 flex items-center justify-center rounded-full
            bg-white/5 border border-white/10
            hover:bg-blue-600 hover:border-blue-600
            transition-all duration-300"
          >
            <FaFacebook className="text-lg" />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="w-10 h-10 flex items-center justify-center rounded-full
            bg-white/5 border border-white/10
            hover:bg-pink-600 hover:border-pink-600
            transition-all duration-300"
          >
            <FaInstagram className="text-lg" />
          </a>

          <a
            href="#"
            aria-label="Twitter"
            className="w-10 h-10 flex items-center justify-center rounded-full
            bg-white/5 border border-white/10
            hover:bg-sky-500 hover:border-sky-500
            transition-all duration-300"
          >
            <FaTwitter className="text-lg" />
          </a>

        </div>

      </div>

      {/* Courses */}
      <div>

        <h3 className="text-white font-semibold text-lg mb-5">
          Explore
        </h3>

        <ul className="space-y-3 text-sm text-gray-400">

          <li>
            <Link
              to="/courses"
              className="hover:text-orange-500 transition"
            >
              All Courses
            </Link>
          </li>

          <li>
            <Link
              to="/courses"
              className="hover:text-orange-500 transition"
            >
              Popular Courses
            </Link>
          </li>

          <li>
            <Link
              to="/courses"
              className="hover:text-orange-500 transition"
            >
              New Courses
            </Link>
          </li>

          <li>
            <Link
              to="/courses"
              className="hover:text-orange-500 transition"
            >
              Free Courses
            </Link>
          </li>

        </ul>

      </div>

      {/* Company */}
      <div>

        <h3 className="text-white font-semibold text-lg mb-5">
          Company
        </h3>

        <ul className="space-y-3 text-sm text-gray-400">

          <li>
            <Link
              to="/about"
              className="hover:text-orange-500 transition"
            >
              About Us
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="hover:text-orange-500 transition"
            >
              Contact Us
            </Link>
          </li>

          <li>
            <Link
              to="/login"
              className="hover:text-orange-500 transition"
            >
              Become a Student
            </Link>
          </li>

          <li>
            <Link
              to="/signup"
              className="hover:text-orange-500 transition"
            >
              Create Account
            </Link>
          </li>

        </ul>

      </div>

      {/* Support */}
      <div>

        <h3 className="text-white font-semibold text-lg mb-5">
          Support
        </h3>

        <ul className="space-y-3 text-sm text-gray-400">

          <li>
            <Link
              to="/terms"
              className="hover:text-orange-500 transition"
            >
              Terms & Conditions
            </Link>
          </li>

          <li>
            <Link
              to="/privacy"
              className="hover:text-orange-500 transition"
            >
              Privacy Policy
            </Link>
          </li>

          <li>
            <Link
              to="/refund"
              className="hover:text-orange-500 transition"
            >
              Refund Policy
            </Link>
          </li>

          <li>
            <Link
              to="/help"
              className="hover:text-orange-500 transition"
            >
              Help Center
            </Link>
          </li>

        </ul>

      </div>

    </div>

    {/* Newsletter */}
    <div className="border-y border-white/10 py-8">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div>
          <h3 className="text-xl font-semibold text-white">
            Stay updated with CourseHaven
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            Get updates about new courses and special offers.
          </p>
        </div>

        <div className="flex w-full md:w-auto">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-72 px-4 py-3 rounded-l-lg
            bg-white/5 border border-white/10
            text-white placeholder-gray-500
            focus:outline-none focus:border-orange-500"
          />

          <button
            className="px-5 py-3 bg-orange-500
            hover:bg-orange-600 text-white font-semibold
            rounded-r-lg transition duration-300"
          >
            Subscribe
          </button>

        </div>

      </div>

    </div>

    {/* Bottom Footer */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">

      <p className="text-sm text-gray-500 text-center md:text-left">
        © 2026 CourseHaven. All rights reserved.
      </p>

      <div className="flex items-center gap-5 text-sm text-gray-500">

        <Link
          to="/privacy"
          className="hover:text-white transition"
        >
          Privacy
        </Link>

        <Link
          to="/terms"
          className="hover:text-white transition"
        >
          Terms
        </Link>

        <Link
          to="/refund"
          className="hover:text-white transition"
        >
          Refunds
        </Link>

      </div>

    </div>

  </div>
</footer>
      </div>
    </div>
  );
}

export default Home;
