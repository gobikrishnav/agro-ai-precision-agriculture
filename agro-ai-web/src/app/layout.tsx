import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroAI — Smart Crop & Fertilizer Precision Decision Platform",
  description: "AI-powered precision agriculture suite combining 2,200 verified field records, stoichiometric fertilizer prescriptions, and FAO-56 irrigation scheduling.",
  keywords: ["Crop recommendation", "Fertilizer prescription", "NPK calculator", "Precision Agriculture", "Smart Irrigation", "Plant Doctor", "FAO-56"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-[#f7fbf8] text-[#14281d]">
        {children}
      </body>
    </html>
  );
}
