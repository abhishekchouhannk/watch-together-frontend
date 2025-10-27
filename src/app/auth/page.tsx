"use client";

import React from "react";
import AuthBackground from "@/components/auth/AuthBackground";
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
    <AuthBackground>
      <div className="w-full max-w-md px-4">
        <AuthForm onSubmit={handleAuthSubmit} />
      </div>
    </AuthBackground>
  );
};

export default AuthPage;