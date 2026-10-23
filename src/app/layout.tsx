import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Workforce Transformation Planner",
  description: "Map roles into automate, AI-assisted, and human-only",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
<script src="/feature-pack/feature-pack.js" defer />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
