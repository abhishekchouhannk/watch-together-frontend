"use client";

import React, { useEffect, useMemo } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBackground } from "@/components/landingPage/BackgroundProvider";
import { TIME_THEMES } from "@/components/landingPage/ThemeConstants";
import axios from "axios";

const AuthPage: React.FC = () => {

  const router = useRouter();
  

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/loggedIn`,
          { withCredentials: true }
        );

        if (res.data.loggedIn) {
          // user is already logged in, send to /room
          router.replace("/room");
        }
      } catch (err) {
        // user not logged in or error - stay here
        console.log("Not logged in");
      }
    };

    checkLoginStatus();
  }, [router]);


  const handleAuthSubmit = async (data: {
    email: string;
    password: string;
    username?: string;
  }) => {
    // Handle successful authentication here
    // For example: save token to localStorage, redirect to dashboard
    console.log("Authentication data:", data);

    // Example redirect after successful auth:
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // window.location.href = '/dashboard';
  };

  const searchParams = useSearchParams();
  const fromLandingPage = searchParams.get("from") === "landing";

  const { selectedTheme } = useBackground();
  const currentTextColor = TIME_THEMES[selectedTheme].textColor;

  const modeParam = searchParams.get("mode") as "login" | "register" | "forgotPassword" | null;

  // ✅ useMemo prevents unnecessary re-renders
  const initialMode = useMemo(() => modeParam || "login", [modeParam]);

  return (
    <>
      {fromLandingPage && (
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="fixed top-0 w-full text-center text-white py-4"
        >
          <h1
          className={`text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl ${currentTextColor}`}
        >
          Watch Together
        </h1>
        </motion.nav>
      )}
      <div className={`relative w-full min-h-screen flex items-center justify-center p-4`}>
        <AuthForm onSubmit={handleAuthSubmit} themeTextColor={currentTextColor} initialMode={initialMode} />
      </div>
    </>
  );
};

export default AuthPage;
