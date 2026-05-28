import axios from "axios";
import { create } from "zustand";

import { BASE_URL } from "../config/api.js";

export const useAuth = create((set, get) => ({

  currentUser: null,

  loading: false,

  error: null,

  isAuthenticated: false,



  // ─────────────────────────────
  // LOGIN
  // ─────────────────────────────

  login: async (
    userCredWithRole
  ) => {

    const {
      role,
      ...userCredObj
    } = userCredWithRole;

    try {

      set({
        loading: true,
        error: null,
      });

      const res =
        await axios.post(
          `${BASE_URL}/common-api/login`,
          userCredObj,
          {
            withCredentials: true,
          }
        );

      set({
        loading: false,
        isAuthenticated: true,
        currentUser:
          res.data.payload,
      });


      return true;

    } catch (err) {

      console.log(
        "err is ",
        err
      );

      set({
        loading: false,
        error:
          err.response?.data
            ?.error ||
          "login Failed",
        isAuthenticated: false,
      });

      return false;
    }
  },


  // ─────────────────────────────
  // LOGOUT
  // ─────────────────────────────

  logout: async () => {

    try {

      set({
        loading: true,
        error: null,
      });

      await axios.get(
        `${BASE_URL}/common-api/logout`,
        {
          withCredentials: true,
        }
      );


      set({
        loading: false,
        currentUser: null,
        isAuthenticated: false,
      });

    } catch (err) {

      console.log(
        "err is ",
        err
      );


      set({
        loading: false,
        currentUser: null,
        error:
          err.response?.data
            ?.error ||
          "Logout Failed",
        isAuthenticated: false,
      });
    }
  },


  // ─────────────────────────────
  // CHECK AUTH
  // ─────────────────────────────

  checkAuth: async () => {

    console.log(
      "check auth working"
    );

    try {

      set({
        loading: true,
        error: null,
      });

      const res =
        await axios.get(
          `${BASE_URL}/common-api/check-auth`,
          {
            withCredentials: true,
          }
        );

      set({
        loading: false,
        isAuthenticated: true,
        currentUser:
          res.data.payload,
      });


    } catch (err) {

      // USER NOT LOGGED IN
      if (
        err.response?.status ===
        401
      ) {


        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });

        return;
      }

      console.error(
        "Auth check failed:",
        err
      );

      set({
        loading: false,
      });
    }
  },
}));