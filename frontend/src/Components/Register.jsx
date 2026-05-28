// Signup.jsx
import authBg from "../assets/register_bg.png";
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";

import { BASE_URL }
from "../config/api";

function Signup() {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });


  // ─────────────────────────────
  // HANDLE INPUT
  // ─────────────────────────────

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };


  // ─────────────────────────────
  // HANDLE SIGNUP
  // ─────────────────────────────

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        setError(null);

        await axios.post(
          `${BASE_URL}/user-api/users`,
          formData
        );

        navigate("/login");

      } catch (err) {

        console.log(err);

        setError(
          err.response?.data?.error ||
          "Signup failed"
        );

      } finally {

        setLoading(false);
      }
    };


  return (

      <div
        className="
        min-h-screen

        relative

        flex items-center
        justify-center

        px-4 py-10

        overflow-hidden
        "
      >
                  {/* BACKGROUND IMAGE */}
        <img
          src={authBg}
          alt="background"
        
          className="
          absolute inset-0
        
          w-full h-full
        
          object-cover
        
          scale-105
        
          blur-[2px]
          "
        />

      {/* BACKGROUND BLUR */}
      <div
        className="
        absolute top-0 left-0
        w-96 h-96
        bg-blue-200/30
        blur-3xl
        rounded-full
        "
      />

      <div
        className="
        absolute bottom-0 right-0
        w-96 h-96
        bg-blue-200/30
        blur-3xl
        rounded-full
        "
      />


      {/* CARD */}
      <div
        className="
        relative z-10

        w-full max-w-md

        bg-white/80
        backdrop-blur-2xl

        border border-white/40

        shadow-[0_20px_60px_rgba(0,0,0,0.08)]

        rounded-4xl

        overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
          px-10 pt-10 pb-6
          "
        >



          {/* TITLE */}
          <div className="">

            <h2
              className="
              text-4xl
              font-black
              text-gray-900
              tracking-tight
              text-center
              "
            >
              Create account
            </h2>

            <p
              className="
              mt-3
              text-gray-500
              leading-relaxed
              text-center
              "
            >
              Join PharmaAtlas and help
              patients discover critical
              medicines faster.
            </p>
          </div>
        </div>


        {/* FORM */}
        <div
          className="
          px-10 pb-10
          "
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* NAME */}
            <div>

              <label
                className="
                block mb-2

                text-sm
                font-semibold

                text-gray-700
                "
              >
                Full Name
              </label>

              <input
                type="text"
                name="name"
                required

                value={formData.name}

                onChange={handleChange}

                placeholder="Enter your full name"

                className="
                w-full

                px-5 py-4

                rounded-2xl

                border border-gray-200

                bg-white/70

                text-gray-800

                outline-none

                transition-all duration-300

                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>


            {/* EMAIL */}
            <div>

              <label
                className="
                block mb-2

                text-sm
                font-semibold

                text-gray-700
                "
              >
                Email Address
              </label>

              <input
                type="email"
                name="email"
                required

                value={formData.email}

                onChange={handleChange}

                placeholder="Enter your email"

                className="
                w-full

                px-5 py-4

                rounded-2xl

                border border-gray-200

                bg-white/70

                text-gray-800

                outline-none

                transition-all duration-300

                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>


            {/* PASSWORD */}
            <div>

              <label
                className="
                block mb-2

                text-sm
                font-semibold

                text-gray-700
                "
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                required

                value={formData.password}

                onChange={handleChange}

                placeholder="Create a secure password"

                className="
                w-full

                px-5 py-4

                rounded-2xl

                border border-gray-200

                bg-white/70

                text-gray-800

                outline-none

                transition-all duration-300

                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>


            {/* ERROR */}
            {error && (

              <div
                className="
                bg-red-50

                border border-red-200

                text-red-600

                px-4 py-3

                rounded-2xl

                text-sm
                font-medium
                "
              >
                {error}
              </div>
            )}


            {/* BUTTON */}
            <button
              type="submit"

              disabled={loading}

              className="
              w-full

              py-4

              rounded-2xl

              bg-blue-600

              text-white

              font-bold
              text-lg

              shadow-lg
              shadow-blue-500/20

              transition-all duration-300

              hover:bg-blue-700
              hover:scale-[1.01]

              disabled:opacity-50
              disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          {/* FOOTER */}
          <div
            className="
            mt-8
            text-center
            "
          >

            <p
              className="
              text-gray-500
              "
            >
              Already have an account?
            </p>

            <Link
              to="/login"

              className="
              inline-block

              mt-3

              text-blue-600
              font-semibold

              hover:text-blue-700
              transition
              "
            >
              Sign In
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;