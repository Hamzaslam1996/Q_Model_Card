import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q-Card Generator",
  description: "Generate and validate Quantum Model Cards (A–J)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
