"use client";

import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may be invalid or expired.");
        }
      } catch {
        setStatus("error");
        setMessage("An unexpected error occurred during verification.");
      }
    };

    verifyEmail();
  }, []);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendStatus("Sending...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setResendStatus(data.message || "A new verification link has been sent!");
      } else {
        setResendStatus(data.message || "Failed to send verification link.");
      }
    } catch {
      setResendStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl max-w-md w-full">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-white">{message}</h1>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-400 mb-2">✅ Verified!</h1>
            <p className="text-white mb-6">{message}</p>
            <a
              href="/auth"
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
            >
              Go to Login
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-400 mb-2">❌ Verification Failed</h1>
            <p className="text-white mb-6">{message}</p>

            <form onSubmit={handleResend} className="flex flex-col gap-3 mt-4">
              <input
                type="email"
                required
                placeholder="Enter your email to resend"
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
              >
                Resend Verification Email
              </button>
              {resendStatus && <p className="text-sm text-white mt-2">{resendStatus}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
