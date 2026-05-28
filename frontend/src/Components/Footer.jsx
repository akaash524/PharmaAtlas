// Footer.jsx

import React from "react";
import { Link } from "react-router";

function Footer() {
  return (
    <footer
      className="
      relative overflow-hidden

      bg-[#07111f]

      border-t border-white/10
    "
    >

      {/* BACKGROUND GLOW */}
      <div
        className="
        absolute top-0 left-1/4
        w-96 h-96
        bg-cyan-500/10
        blur-3xl rounded-full
      "
      />

      <div
        className="
        absolute bottom-0 right-1/4
        w-96 h-96
        bg-blue-500/10
        blur-3xl rounded-full
      "
      />


      <div
        className="
        relative z-10

        max-w-7xl mx-auto

        px-6 py-18
      "
      >

        {/* TOP */}
        <div
          className="
          grid
          md:grid-cols-2
          lg:grid-cols-4

          gap-14
        "
        >

          {/* BRAND */}
          <div>

            <div
              className="
              flex items-center gap-3
            "
            >

              <div
                className="
                w-12 h-12 rounded-2xl

                bg-linear-to-br
                from-cyan-500
                to-blue-600

                flex items-center
                justify-center

                text-white
                text-2xl

                shadow-lg
              "
              >
                +
              </div>

              <div>

                <h2
                  className="
                  text-2xl font-black
                  text-white
                "
                >
                  PharmaAtlas
                </h2>

                <p
                  className="
                  text-sm text-cyan-300
                "
                >
                  Community Medicine Intelligence
                </p>

              </div>
            </div>

            <p
              className="
              mt-6

              text-zinc-400
              leading-relaxed
            "
            >
              Helping patients discover rare and
              life-saving medicines nearby through
              community-powered real-time pharmacy
              intelligence.
            </p>

          </div>


          {/* PLATFORM */}
          <div>

            <h3
              className="
              text-white
              font-bold
              text-lg
            "
            >
              Platform
            </h3>

            <div
              className="
              mt-6

              flex flex-col
              gap-4
            "
            >

              <Link
                to="/"
                className="
                text-zinc-400
                hover:text-cyan-400
                transition
              "
              >
                Home
              </Link>

              <Link
                to="/login"
                className="
                text-zinc-400
                hover:text-cyan-400
                transition
              "
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="
                text-zinc-400
                hover:text-cyan-400
                transition
              "
              >
                Create Account
              </Link>

            </div>
          </div>


          {/* FEATURES */}
          <div>

            <h3
              className="
              text-white
              font-bold
              text-lg
            "
            >
              Features
            </h3>

            <div
              className="
              mt-6

              flex flex-col
              gap-4
            "
            >

              <p className="text-zinc-400">
                Real-Time Medicine Search
              </p>

              <p className="text-zinc-400">
                Nearby Pharmacy Discovery
              </p>

              <p className="text-zinc-400">
                Community Verification
              </p>

              <p className="text-zinc-400">
                AI Medicine Suggestions
              </p>

            </div>
          </div>


          {/* CONTACT */}
          <div>

            <h3
              className="
              text-white
              font-bold
              text-lg
            "
            >
              Contact
            </h3>

            <div
              className="
              mt-6

              flex flex-col
              gap-4
            "
            >

              <p className="text-zinc-400">
                Hyderabad, India
              </p>

              <p className="text-zinc-400">
                support@pharmaatlas.com
              </p>

              <p className="text-zinc-400">
                24/7 Community Updates
              </p>

            </div>
          </div>

        </div>


        {/* DIVIDER */}
        <div
          className="
          mt-16

          border-t
          border-white/10
        "
        />


        {/* BOTTOM */}
        <div
          className="
          pt-8

          flex flex-col
          md:flex-row

          items-center
          justify-between

          gap-5
        "
        >

          <p
            className="
            text-zinc-500
            text-sm
          "
          >
            © 2026 PharmaAtlas. All rights reserved.
          </p>

          <div
            className="
            flex items-center gap-6
          "
          >

            <button
              className="
              text-zinc-500
              hover:text-cyan-400
              transition
            "
            >
              Privacy
            </button>

            <button
              className="
              text-zinc-500
              hover:text-cyan-400
              transition
            "
            >
              Terms
            </button>

            <button
              className="
              text-zinc-500
              hover:text-cyan-400
              transition
            "
            >
              Security
            </button>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;