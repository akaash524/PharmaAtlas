import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router";

import {
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

import { useAuth }
from "../store/authStore";

function Header() {

  const navigate = useNavigate();

  const dropdownRef =
    useRef();

  const [showDropdown,
    setShowDropdown] =
      useState(false);

  const {
    isAuthenticated,
    currentUser,
    logout,
    loading,
  } = useAuth();


  // ─────────────────────────────
  // LOGOUT
  // ─────────────────────────────

  const handleLogout =
    async () => {

      await logout();

      navigate("/");
    };


  // ─────────────────────────────
  // PROFILE NAVIGATION
  // ─────────────────────────────

  const navigateToProfile =
    () => {

      setShowDropdown(false);

      if (
        currentUser?.role === "user"
      ) {
        navigate("/user-profile");
      }

      if (
        currentUser?.role === "admin"
      ) {
        navigate("/admin-profile");
      }
    };


  // ─────────────────────────────
  // OUTSIDE CLICK
  // ─────────────────────────────

  useEffect(() => {

    const handleOutsideClick =
      (e) => {

        if (
          !dropdownRef.current?.contains(
            e.target
          )
        ) {

          setShowDropdown(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };

  }, []);


  return (

    <header
        className="
        w-full sticky top-0 z-5000

        bg-white/20 backdrop-blur-xl

        border border-gray-200
        border-t-0

        rounded-b-[5px]

        shadow-sm
        "
      >

      <div
        className="
        max-w-7xl mx-auto
        px-6 py-1
        flex items-center
        justify-between
        "
      >

        {/* LOGO */}
        <Link
          to="/"
          className="
          flex items-center
          gap-2
          text-2xl font-black
          text-blue-600
          "
        >

          <span className="text-3xl">
            💊
          </span>

          <span>
            PharmaAtlas
          </span>

        </Link>


        {/* RIGHT SIDE */}
        <div
          className="
          flex items-center
          gap-4
          "
        >

          {!isAuthenticated ? (

            <>
              <Link
                to="/login"
                className="
                px-5 py-2.5 rounded-xl
                border border-blue-500
                text-blue-600
                font-medium
                hover:bg-blue-50
                transition
                "
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="
                px-5 py-2.5 rounded-xl
                bg-blue-600 text-white
                font-medium
                shadow-lg
                hover:bg-blue-700
                transition
                "
              >
                Create Account
              </Link>
            </>

          ) : (

            <div
              ref={dropdownRef}
              className="relative"
            >

              {/* PROFILE BUTTON */}
              <button
                onClick={() =>
                  setShowDropdown(
                    !showDropdown
                  )
                }
                className="
                flex items-center
                gap-3
                px-3 py-2
                rounded-2xl
                hover:bg-gray-100
                transition
                "
              >

                {/* AVATAR */}
                <div
                  className="
                  w-11 h-11 rounded-full
                  bg-blue-600 text-white
                  flex items-center
                  justify-center
                  font-bold text-lg
                  uppercase
                  shadow-md
                  "
                >
                  {
                    currentUser?.name
                      ?.charAt(0) || "U"
                  }
                </div>


                {/* NAME */}
                <div
                  className="
                  hidden sm:flex
                  flex-col items-start
                  "
                >

                  <span
                    className="
                    font-semibold
                    text-gray-800
                    "
                  >
                    {currentUser?.name}
                  </span>

                  <span
                    className="
                    text-xs
                    text-gray-500
                    capitalize
                    "
                  >
                    {currentUser?.role}
                  </span>

                </div>

                <ChevronDown
                  size={18}
                  className={`
                    text-gray-500
                    transition-transform
                    duration-300

                    ${
                      showDropdown
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>


              {/* DROPDOWN */}
              {showDropdown && (

                <div
                  className="
                  absolute right-0 mt-3
                  w-72

                  bg-[#111827]
                  border border-white/10

                  rounded-3xl
                  shadow-2xl

                  overflow-hidden
                  "
                >

                  {/* TOP USER INFO */}
                  <div
                    className="
                    p-5
                    border-b border-white/10
                    "
                  >

                    <div
                      className="
                      flex items-center
                      gap-4
                      "
                    >

                      {/* PROFILE IMAGE */}
                      <div
                        className="
                        w-14 h-14 rounded-full
                        bg-blue-600 text-white
                        flex items-center
                        justify-center
                        text-xl font-bold
                        uppercase
                        "
                      >
                        {
                          currentUser?.name
                            ?.charAt(0)
                        }
                      </div>


                      {/* USER INFO */}
                      <div>

                        <h3
                          className="
                          font-semibold
                          text-white
                          "
                        >
                          {currentUser?.name}
                        </h3>

                        <p
                          className="
                          text-sm text-zinc-400
                          break-all
                          "
                        >
                          {
                            currentUser?.email
                          }
                        </p>

                        <span
                          className="
                          inline-block mt-2
                          text-xs

                          bg-green-500/15
                          text-green-400

                          px-2 py-1
                          rounded-full
                          capitalize
                          "
                        >
                          {
                            currentUser?.role
                          }
                        </span>

                      </div>
                    </div>
                  </div>


                  {/* MENU */}
                  <div className="p-2">

                    {/* PROFILE */}
                    <button
                      onClick={
                        navigateToProfile
                      }
                      className="
                      w-full

                      flex items-center
                      gap-3

                      px-4 py-3
                      rounded-2xl

                      text-white

                      hover:bg-white/5
                      transition
                      "
                    >

                      <User size={18} />

                      Profile

                    </button>


                    {/* LOGOUT */}
                    <button
                      onClick={
                        handleLogout
                      }

                      disabled={loading}

                      className="
                      w-full

                      flex items-center
                      gap-3

                      px-4 py-3
                      rounded-2xl

                      text-red-400

                      hover:bg-red-500/10
                      transition

                      disabled:opacity-50
                      "
                    >

                      <LogOut size={18} />

                      Logout

                    </button>

                  </div>

                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;