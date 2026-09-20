import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Asep Saepudin — Fullstack Developer",
  description:
    "Fullstack web developer from Indonesia. Building scalable web applications — from the database to the pixel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {/* <Cursor /> */}
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
