"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // important to send cookies
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Logout success:", data);
        // Optionally clear any client-side state (like Redux/AuthContext)
        router.push("/login"); // redirect to login page
      } else {
        console.error("Logout failed:", data.message);
        alert("Failed to logout. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("An error occurred while logging out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
