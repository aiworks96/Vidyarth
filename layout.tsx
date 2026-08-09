import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vidyarth — Study Smarter, Prepare Better",
  description: "Exam-focused digital notes, PYQs and question banks for CBSE, NEET and UPSC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
