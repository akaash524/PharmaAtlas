// UserProfile.jsx
import {
  User2,
  FileText,
  Shield,
  BadgeCheck,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";

import { BASE_URL } from "../config/api";
import { useAuth } from "../store/authStore";
import MyReports from "../components/MyReports";

function UserProfile() {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] =
    useState("info");

  // INFO FORM
  const [infoData, setInfoData] = useState({
    name: currentUser?.username || "",
    email: currentUser?.email || "",
  });

  // PASSWORD FORM
  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [loading, setLoading] =
    useState(false);

  // UPDATE INFO
  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.patch(
        `${BASE_URL}/user-api/users/me`,
        infoData,
        {
          withCredentials: true,
        }
      );

      alert("✅ Profile updated");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      await axios.put(
        `${BASE_URL}/user-api/change-password`,
        passwordData,
        {
          withCredentials: true,
        }
      );

      alert("✅ Password changed");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Password update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 py-10 px-4">
      
      <div className="max-w-6xl mx-auto">
        
          {/* PROFILE HEADER */}
          <div
            className="
            relative overflow-hidden
            bg-white/75 backdrop-blur-2xl
            rounded-[36px]
            border border-white/60
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            p-8 mb-8
          "
          >

            {/* GRADIENT GLOW */}
            <div
              className="
              absolute inset-0
              bg-linear-to-br
              from-blue-50/80
              via-transparent
              to-cyan-50/70
              pointer-events-none
            "
            />

            <div
              className="
              relative flex flex-col
              md:flex-row items-center
              gap-7
            "
            >

              {/* AVATAR */}
              <div
                className="
                shrink-0
                w-30 h-30 rounded-[30px]
                bg-linear-to-br
                from-blue-600
                to-cyan-500
                flex items-center
                justify-center
                text-white
                shadow-2xl
                ring-8 ring-blue-50
              "
              >
                <span className="text-5xl font-black">
                  {currentUser?.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </span>
              </div>

              {/* USER INFO */}
              <div className="flex-1 text-center md:text-left">

                {/* <div
                  className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-2xl
                  bg-emerald-50
                  border border-emerald-200
                  text-emerald-700
                  text-sm font-semibold
                "
                >
                  <BadgeCheck size={16} />
                  {currentUser?.role}
                </div> */}

                <h1
                  className="
                  mt-5 text-4xl
                  font-black tracking-tight
                  text-slate-900
                "
                >
                  {currentUser?.name}
                </h1>

                <p
                  className="
                  mt-2 text-slate-500
                  text-lg
                "
                >
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          
          {/* SIDEBAR */}
          <div
            className="
            bg-white/75 backdrop-blur-2xl
            rounded-4xl
            border border-white/60
            shadow-[0_10px_40px_rgba(15,23,42,0.08)]
            p-4 h-fit
          "
          >

            <div className="space-y-2">

              <button
                onClick={() =>
                  setActiveTab("info")
                }
                className={`
                  w-full flex items-center
                  gap-3 px-5 py-4
                  rounded-2xl
                  font-semibold
                  transition-all duration-200

                  ${
                    activeTab === "info"

                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"

                      : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >

                <User2 size={18} />

                <span>
                  Profile Information
                </span>
              </button>


              <button
                onClick={() =>
                  setActiveTab("reports")
                }
                className={`
                  w-full flex items-center
                  gap-3 px-5 py-4
                  rounded-2xl
                  font-semibold
                  transition-all duration-200

                  ${
                    activeTab === "reports"

                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"

                      : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >

                <FileText size={18} />

                <span>
                  My Reports
                </span>
              </button>


              <button
                onClick={() =>
                  setActiveTab("security")
                }
                className={`
                  w-full flex items-center
                  gap-3 px-5 py-4
                  rounded-2xl
                  font-semibold
                  transition-all duration-200

                  ${
                    activeTab === "security"

                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"

                      : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >

                <Shield size={18} />

                <span>
                  Security Settings
                </span>
              </button>

            </div>
          </div>

          {/* TAB CONTENT */}
          <div
            className="bg-white/80 backdrop-blur-xl
            rounded-4xl shadow-2xl p-8"
          >
            
            {/* MY INFO */}
            {activeTab === "info" && (
              <div>
                
                <h2 className="text-3xl font-black text-gray-900">
                  Edit Profile
                </h2>

                <p className="text-gray-500 mt-2 mb-8">
                  Update your personal information.
                </p>

                <form
                  onSubmit={handleUpdateInfo}
                  className="space-y-6"
                >
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={infoData.name}
                      onChange={(e) =>
                        setInfoData({
                          ...infoData,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={infoData.email}
                      onChange={(e) =>
                        setInfoData({
                          ...infoData,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 rounded-2xl
                    bg-linear-to-r from-blue-600 to-cyan-500
                    text-white font-bold shadow-xl
                    hover:scale-[1.02] transition"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

{/* REPORTS */}
{activeTab === "reports" && (

  <div className="space-y-8">

    {/* HEADER */}
    <div
      className="
      flex flex-col lg:flex-row
      lg:items-center
      lg:justify-between
      gap-6
      "
    >

      {/* LEFT */}
      <div>

        <p
          className="
          text-xs uppercase
          tracking-[0.25em]
          text-slate-400
          font-bold
          "
        >
          Activity Dashboard
        </p>

        <h2
          className="
          mt-2 text-4xl
          font-black
          tracking-tight
          text-slate-900
          "
        >
          My Reports
        </h2>

        <p
          className="
          mt-3 text-[15px]
          text-slate-500
          leading-relaxed
          max-w-2xl
          "
        >
          Track, manage, and review all medicine availability reports you have submitted to the platform.
        </p>
      </div>


      {/* RIGHT STATS */}
      <div
        className="
        flex items-center gap-4
        "
      >






      </div>
    </div>


    {/* REPORTS CONTAINER */}
    <div
      className="
      rounded-4xl
      border border-slate-200
      bg-white
      shadow-sm
      overflow-hidden
      "
    >

      {/* TOP BAR */}
      <div
        className="
        px-8 py-6
        border-b border-slate-100
        bg-linear-to-r
        from-slate-50
        to-white
        "
      >

        <div
          className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-4
          "
        >

          <div>

            <h3
              className="
              text-lg font-black
              text-slate-900
              "
            >
              Submitted Reports
            </h3>

            <p
              className="
              mt-1 text-sm
              text-slate-500
              "
            >
              Your recently submitted pharmacy and medicine reports.
            </p>
          </div>


          {/* STATUS BADGE */}
          <div
            className="
            inline-flex items-center
            gap-2
            px-4 py-2 rounded-2xl

            bg-emerald-50
            border border-emerald-200

            text-emerald-700
            text-sm font-bold
            "
          >

            <div
              className="
              w-2.5 h-2.5 rounded-full
              bg-emerald-500
              animate-pulse
              "
            />

            Synced
          </div>

        </div>
      </div>


      {/* REPORTS LIST */}
      <div
        className="
        p-6
        bg-slate-50/50
        "
      >
        <MyReports />
      </div>

    </div>
  </div>
)}

            {/* SECURITY */}
            {activeTab === "security" && (
              <div>
                
                <h2 className="text-3xl font-black text-gray-900">
                  Security Settings
                </h2>

                <p className="text-gray-500 mt-2 mb-8">
                  Change your password securely.
                </p>

                <form
                  onSubmit={
                    handlePasswordChange
                  }
                  className="space-y-6"
                >
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Current Password
                    </label>

                    <input
                      type="password"
                      value={
                        passwordData.currentPassword
                      }
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={
                        passwordData.newPassword
                      }
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={
                        passwordData.confirmPassword
                      }
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 rounded-2xl
                    bg-linear-to-r from-red-500 to-pink-500
                    text-white font-bold shadow-xl
                    hover:scale-[1.02] transition"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;