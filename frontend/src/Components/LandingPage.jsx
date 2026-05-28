import React from "react";
import { Link } from "react-router";
import Footer from "./Footer";

function LandingPage() {
  return (
    <div className="w-full overflow-hidden bg-linear-to-br from-blue-50 via-white to-cyan-50">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        
        {/* BACKGROUND BLURS */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div className="py-10"> 
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              👥 Community Powered Medicine Locator
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900">
              Find Rare
              <span className="text-blue-600"> Medicines </span>
              Nearby Before It's Too Late
            </h1>

            <p className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
              PharmaAtlas helps patients discover life-saving medicines
              available at nearby pharmacies in real-time through a
              crowdsourced community verification system.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                to="/signup"
                className="px-8 py-4 rounded-2xl bg-blue-600 text-white text-lg font-semibold shadow-xl hover:scale-105 hover:bg-blue-700 transition duration-300"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-800 text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition duration-300"
              >
                Login
              </Link>
            </div>

            {/* STATS */}
            <div className="mt-14 flex flex-wrap gap-10">
              <div>
                <h2 className="text-3xl font-bold text-blue-600">10K+</h2>
                <p className="text-gray-600">Medicine Reports</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-blue-600">500+</h2>
                <p className="text-gray-600">Pharmacies Mapped</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-blue-600">24/7</h2>
                <p className="text-gray-600">Community Updates</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE VISUAL */}
          <div className="relative flex justify-center">
            
            {/* MAIN CARD */}
            <div className="relative w-full max-w-lg">
              
              <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-4xl p-8">
                
                {/* SEARCH MOCKUP */}
                <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🔍</span>
                  <span className="text-gray-500">
                    Search for Insulin, Remdesivir...
                  </span>
                </div>

                {/* MAP MOCKUP */}
                <div className="mt-6 h-72 rounded-3xl bg-linear-to-br from-blue-100 to-cyan-100 relative overflow-hidden">
                  
                  {/* Fake Map Pins */}
                  <div className="absolute top-10 left-16 w-5 h-5 bg-red-500 rounded-full shadow-lg animate-bounce"></div>
                  <div className="absolute top-28 right-20 w-5 h-5 bg-blue-600 rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute bottom-16 left-28 w-5 h-5 bg-green-500 rounded-full shadow-lg animate-bounce"></div>

                  {/* Floating Card */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Apollo Pharmacy
                        </h3>
                        <p className="text-sm text-gray-500">
                          Insulin Available
                        </p>
                      </div>

                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING BADGES */}
              <div className="absolute -top-6 -right-6 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-xl font-semibold">
                ✓ Verified Data
              </div>

              <div className="absolute -bottom-5 -left-5 bg-white shadow-xl px-5 py-3 rounded-2xl font-semibold text-gray-700">
                📍 Real-Time Updates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900">
              How It Works
            </h2>

            <p className="mt-5 text-xl text-gray-600">
              Find medicines in just a few clicks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            
            {/* STEP 1 */}
            <div className="group bg-white rounded-[28px] p-10 shadow-lg hover:shadow-2xl transition duration-500 hover:-translate-y-3 border border-gray-100">
              
              <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition">
                🔍
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                Search Medicines
              </h3>

              <p className="mt-5 text-gray-600 leading-relaxed">
                Search for rare medicines and instantly discover nearby
                pharmacies where they may be available.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="group bg-white rounded-[28px] p-10 shadow-lg hover:shadow-2xl transition duration-500 hover:-translate-y-3 border border-gray-100">
              
              <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition">
                📍
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                View Nearby Stores
              </h3>

              <p className="mt-5 text-gray-600 leading-relaxed">
                Explore an interactive map with live pharmacy availability
                reports shared by the community.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="group bg-white rounded-[28px] p-10 shadow-lg hover:shadow-2xl transition duration-500 hover:-translate-y-3 border border-gray-100">
              
              <div className="w-20 h-20 rounded-3xl bg-cyan-100 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition">
                ✅
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                Verify & Help Others
              </h3>

              <p className="mt-5 text-gray-600 leading-relaxed">
                Confirm medicine availability and help patients in urgent need
                through crowdsourced verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-28 px-6">
        <div className="max-w-5xl mx-auto bg-linear-to-r from-blue-600 to-cyan-500 rounded-[40px] p-14 text-center text-white shadow-2xl">
          
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            Join The Community Saving Lives
          </h2>

          <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto">
            Every report can help someone find a critical medicine faster.
            Become part of PharmaAtlas today.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-2xl bg-white text-blue-600 font-bold text-lg hover:scale-105 transition"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-blue-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>

  );
}

export default LandingPage;