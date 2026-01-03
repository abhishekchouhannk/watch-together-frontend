import type { Metadata } from "next";
import "./globals.css";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import SharedBackground from "@/components/sharedBackground/SharedBackground";
import ThemeSelectorOverlay from "@/components/ThemeSelectorOverlay";

import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Watch Together",
  description: "Watch videos together with friends in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`text-white min-h-[100dvh] flex flex-col antialiased`}
      >
        <BackgroundProvider>
          {/* Persistent Background */}
          <SharedBackground />

          {/* main page content sits above background */}
          <div className="relative z-10">
            {children}
          </div>

          {/* dev overlay: client component that reads/writes the same context */}
          <ThemeSelectorOverlay />
        </BackgroundProvider>
      </body>
    </html>
  );
}