import { listProjects } from "@/lib/db";
import Hero       from "@/components/layout/Hero";
import AboutStrip  from "@/components/layout/AboutStrip";
import Work        from "@/components/layout/Work";
import Stack       from "@/components/layout/Stack";
import Contact     from "@/components/layout/Contact";
import Footer      from "@/components/layout/Footer";

// Content comes from SQLite, so the page can't be prerendered — an edit in
// /admin has to show up on the next request, not the next deploy.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutStrip />
      <Work projects={listProjects()} />
      <Stack />
      <Contact />
      <Footer />
    </>
  );
}
