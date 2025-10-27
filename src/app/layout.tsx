import type { Metadata } from "next";
import "./globals.css";
import { BackgroundProvider } from "@/components/landingPage/BackgroundProvider";
import SharedBackground from "@/components/landingPage/SharedBackground";
import ThemeSelectorOverlay from "@/components/ThemeSelectorOverlay";

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
        className={`text-white min-h-[100dvh] overflow-hidden flex flex-col antialiased`}
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