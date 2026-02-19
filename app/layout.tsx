import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Icebreakr | AI Cold Email Icebreakers",
  description: "Generate personalized cold email opening lines from a prospect URL in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
