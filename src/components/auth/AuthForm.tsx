"use client";

import React, { useState, useEffect } from "react";
import PixelFace from "./PixelFace";

type AuthMode = "login" | "register";

interface AuthFormProps {
  onSubmit?: (data: {
    email: string;
    password: string;
    username?: string;
  }) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(""); // Used for both error and success messages
  const [isLoading, setIsLoading] = useState(false);

  // Clear error state after 3.5 seconds
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
        setMessage("");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  // Clear success state after 3.5 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

   const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    // Clear form and messages when switching
    setEmail("");
    setUsername("");
    setPassword("");
    setIsError(false);
    setIsSuccess(false);
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setMessage("");

    try {
      const endpoint =
        mode === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const body =
        mode === "login"
          ? { email, password }
          : { email, username, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Success! Display success message from server
      setIsSuccess(true);
      setMessage(data.message || "Authentication successful!");
      console.log("Authentication successful:", data);
      
      // If custom onSubmit handler is provided
      if (onSubmit) {
        await onSubmit(body);
      }

      // You can add redirect logic here (after a delay to show success message)
      // setTimeout(() => {
      //   window.location.href = '/dashboard';
      // }, 2000);
      
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md
                 border border-white/20 transition-all duration-500 transform
                 hover:shadow-3xl"
    >
      {/* Header with Toggle */}
      <div className="mb-6">
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => mode !== "login" && toggleMode()}
            className={`
              px-6 py-2 rounded-full font-semibold transition-all duration-300
              ${
                mode === "login"
                  ? "bg-white text-gray-900 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }
            `}
          >
            Login
          </button>
          <button
            onClick={() => mode !== "register" && toggleMode()}
            className={`
              px-6 py-2 rounded-full font-semibold transition-all duration-300
              ${
                mode === "register"
                  ? "bg-white text-gray-900 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }
            `}
          >
            Register
          </button>
        </div>

        {/* Face and Helper Text Container */}
        <div className="flex items-center justify-between mb-4">
          {/* Helper Text */}
          <div className="flex-1">
            {mode === "login" ? (
              <p className="text-white/90 text-sm">
                New arrival?{" "}
                <button
                  onClick={toggleMode}
                  className="font-bold underline hover:text-white transition-colors"
                >
                  Register here
                </button>{" "}
                to get started!
              </p>
            ) : (
              <p className="text-white/90 text-sm">
                Already have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="font-bold underline hover:text-white transition-colors"
                >
                  Click to login
                </button>
                .
              </p>
            )}
          </div>

           {/* Pixel Face */}
          <div className="ml-4">
            <PixelFace 
              state={isError ? "error" : isSuccess ? "success" : "neutral"} 
            />
          </div>
        </div>

        {/* Error Message */}
        {isError && message && (
          <div
            className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-lg mb-4
                       animate-shake text-sm"
          >
            {message}
          </div>
        )}

        {/* Success Message */}
        {isSuccess && message && (
          <div
            className="bg-green-500/20 border border-green-500/50 text-green-100 px-4 py-2 rounded-lg mb-4
                       animate-slideDown text-sm"
          >
            {message}
          </div>
        )}
        </ div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30
                     text-white placeholder-white/50 focus:outline-none focus:ring-2
                     focus:ring-white/50 focus:border-transparent transition-all"
            placeholder="your@email.com"
            disabled={isLoading}
          />
        </div>

        {/* Username Field (Register only) */}
        {mode === "register" && (
          <div className="animate-slideDown">
            <label
              htmlFor="username"
              className="block text-white/90 text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30
                       text-white placeholder-white/50 focus:outline-none focus:ring-2
                       focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="Choose a username"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-white/90 text-sm font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30
                     text-white placeholder-white/50 focus:outline-none focus:ring-2
                     focus:ring-white/50 focus:border-transparent transition-all"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg
                   hover:bg-gray-100 transition-all transform hover:scale-[1.02]
                   active:scale-[0.98] shadow-lg disabled:opacity-50
                   disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Additional Options */}
      {mode === "login" && (
        <div className="mt-4 text-center">
          <button className="text-white/70 hover:text-white text-sm transition-colors">
            Forgot password?
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthForm;