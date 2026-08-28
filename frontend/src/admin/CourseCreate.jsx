import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // File input reference
  const fileInputRef = useRef(null);

  // ============================
  // CHECK ADMIN LOGIN
  // ============================
  useEffect(() => {
    const admin = JSON.parse(
      localStorage.getItem("admin")
    );

    const token = admin?.token;

    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [navigate]);

  // ============================
  // IMAGE HANDLER
  // ============================
  const changePhotoHandler = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    // Save file
    setImage(file);

    // Create preview
    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // ============================
  // CHOOSE IMAGE
  // ============================
  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  // ============================
  // REMOVE IMAGE
  // ============================
  const removeImage = () => {
    setImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================
  // CREATE COURSE
  // ============================
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter course title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter course description");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid course price");
      return;
    }

    if (!image) {
      toast.error("Please select a course image");
      return;
    }

    const admin = JSON.parse(
      localStorage.getItem("admin")
    );

    const token = admin?.token;

    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append(
      "description",
      description.trim()
    );
    formData.append("price", price);
    formData.append("image", image);

    try {
      setLoading(true);

      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log(
        "Course created:",
        response.data
      );

      toast.success(
        response.data.message ||
          "Course created successfully"
      );

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Navigate
      navigate("/admin/our-courses");

    } catch (error) {
      console.log(
        "Error creating course:",
        error
      );

      toast.error(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          "Error creating course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==============================
          HEADER
      =============================== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-[75px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">

            <div>
              <p className="text-xs sm:text-sm text-orange-500 font-bold tracking-wider">
                ADMIN PANEL
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Create Course
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Add a new course to CourseHaven
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-3">

              <Link
                to="/admin/dashboard"
                className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium transition text-sm sm:text-base"
              >
                ← Dashboard
              </Link>

              <Link
                to="/admin/our-courses"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition text-sm sm:text-base"
              >
                📚 Courses
              </Link>

            </div>

          </div>

        </div>

      </header>


      {/* ==============================
          MAIN
      =============================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ==============================
              FORM
          =============================== */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 lg:p-8">

              <div className="mb-7">

                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Course Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details below to create
                  your course.
                </p>

              </div>


              <form
                onSubmit={handleCreateCourse}
                className="space-y-6"
              >

                {/* TITLE */}
                <div>

                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Course Title
                  </label>

                  <input
                    id="title"
                    type="text"
                    placeholder="Enter your course title"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    required
                  />

                </div>


                {/* DESCRIPTION */}
                <div>

                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Course Description
                  </label>

                  <textarea
                    id="description"
                    placeholder="Enter your course description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition resize-none"
                    required
                  />

                  <div className="flex justify-end mt-1">

                    <span className="text-xs text-gray-400">
                      {description.length} characters
                    </span>

                  </div>

                </div>


                {/* PRICE */}
                <div>

                  <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Course Price
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      ₹
                    </span>

                    <input
                      id="price"
                      type="number"
                      min="1"
                      placeholder="Enter course price"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                      required
                    />

                  </div>

                </div>


                {/* ==============================
                    COURSE IMAGE
                =============================== */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Image
                  </label>


                  {/* IMAGE PREVIEW */}
                  <div className="relative w-full max-w-xl mx-auto">

                    <div className="aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center">

                      {imagePreview ? (

                        <img
                          src={imagePreview}
                          alt="Course Preview"
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="text-center px-4">

                          <div className="text-5xl mb-3">
                            🖼️
                          </div>

                          <p className="font-medium text-gray-600">
                            Course Image Preview
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Recommended: 16:9 image
                          </p>

                        </div>

                      )}

                    </div>


                    {/* REMOVE BUTTON */}
                    {imagePreview && (

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition"
                      >
                        ✕
                      </button>

                    )}

                  </div>


                  {/* ==============================
                      HIDDEN FILE INPUT
                  =============================== */}
                  <div className="mt-4">

                    <input
                      ref={fileInputRef}
                      id="courseImage"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={changePhotoHandler}
                      className="hidden"
                    />


                    {/* CUSTOM BUTTON */}
                    <button
                      type="button"
                      onClick={handleChooseImage}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl cursor-pointer transition duration-300"
                    >
                      📁 Choose Image
                    </button>


                    {/* SELECTED FILE */}
                    {image && (

                      <div className="mt-3 flex items-center gap-2">

                        <span className="text-green-600 font-medium text-sm">
                          ✓ Image selected
                        </span>

                        <span className="text-gray-500 text-sm truncate max-w-[250px]">
                          {image.name}
                        </span>

                      </div>

                    )}


                    <p className="text-xs text-gray-400 mt-2">
                      JPG, JPEG, PNG or WEBP. Maximum
                      file size: 5MB.
                    </p>

                  </div>

                </div>


                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >

                  {loading ? (

                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                      Creating Course...
                    </>

                  ) : (

                    <>
                      ➕ Create Course
                    </>

                  )}

                </button>

              </form>

            </div>

          </div>


          {/* ==============================
              RIGHT SIDE
          =============================== */}
          <div className="lg:col-span-1">

            <div className="bg-gradient-to-br from-gray-900 to-blue-950 rounded-2xl p-5 sm:p-6 text-white shadow-lg lg:sticky lg:top-28">

              <p className="text-orange-400 text-sm font-semibold">
                COURSE CREATION
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mt-2">
                Create an Amazing Course 🚀
              </h2>

              <p className="text-gray-300 text-sm leading-6 mt-3">
                Make sure your course information is
                clear and attractive for students.
              </p>

              <div className="mt-6 space-y-4">

                <div className="flex gap-3">
                  <div className="w-9 h-9 shrink-0 bg-white/10 rounded-lg flex items-center justify-center">
                    📝
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Clear Title
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Use a short and descriptive course
                      title.
                    </p>
                  </div>
                </div>


                <div className="flex gap-3">
                  <div className="w-9 h-9 shrink-0 bg-white/10 rounded-lg flex items-center justify-center">
                    📖
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Good Description
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Explain what students will learn.
                    </p>
                  </div>
                </div>


                <div className="flex gap-3">
                  <div className="w-9 h-9 shrink-0 bg-white/10 rounded-lg flex items-center justify-center">
                    💰
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Set the Price
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Choose a competitive price.
                    </p>
                  </div>
                </div>


                <div className="flex gap-3">
                  <div className="w-9 h-9 shrink-0 bg-white/10 rounded-lg flex items-center justify-center">
                    🖼️
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Quality Image
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Use a clear 16:9 thumbnail.
                    </p>
                  </div>
                </div>

              </div>


              <div className="mt-7 bg-white/10 rounded-xl p-4">

                <p className="text-sm font-medium">
                  💡 Tip
                </p>

                <p className="text-xs text-gray-400 mt-1 leading-5">
                  A good thumbnail and clear course
                  description can make your course more
                  attractive to students.
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default CourseCreate;