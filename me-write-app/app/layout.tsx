import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HaqiZ — Writings",
  description: "A personal writing website by HaqiZ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
