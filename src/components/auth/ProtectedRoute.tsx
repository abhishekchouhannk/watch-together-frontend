// src/components/auth/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call the Express `/auth/status` endpoint
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/loggedIn`,
          { withCredentials: true }
        );

        if (response.data.loggedIn) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/auth");
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.replace("/auth");
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return <>{isAuthenticated && children}</>;
};

export default ProtectedRoute;