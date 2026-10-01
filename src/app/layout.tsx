import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
// Disabled: the spotlight's per-pointermove gsap tick was making low-spec
// laptops stutter. Component and CSS are left in place (Spotlight.tsx,
// .spotlight-layer / .spotlight in globals.css) so it can be re-enabled by
// restoring the import + the <Spotlight /> mount below.
// import Spotlight from "@/components/layout/Spotlight";
import { ThemeProvider } from "@/context/ThemeContext";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Asep Saepudin — Fullstack Developer",
  description:
    "Fullstack web developer from Indonesia. Building scalable web applications — from the database to the pixel.",
  verification: {
    google: "fxT3FGmkpC7Nt-uXtX4zOpPc7CldVLaw8o_uCgsEml0",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Spotlight disabled — see the note on the import above. */}
        {/* <Spotlight /> */}
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
