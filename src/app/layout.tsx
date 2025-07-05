import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "HeyZack Knowledge Hub",
  description: "AI-Powered Smart Home Documentation & Knowledge Management System",
  keywords: ["HeyZack", "Smart Home", "AI", "Documentation", "Knowledge Hub"],
  authors: [{ name: "HeyZack Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
