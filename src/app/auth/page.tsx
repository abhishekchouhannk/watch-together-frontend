"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const AuthPage: React.FC = () => {
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

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4">
      <AuthForm onSubmit={handleAuthSubmit} />
    </div>
  );
};

export default AuthPage;