import Hero       from "@/components/layout/Hero";
import AboutStrip  from "@/components/layout/AboutStrip";
import Work        from "@/components/layout/Work";
import Stack       from "@/components/layout/Stack";
import Contact     from "@/components/layout/Contact";
import Footer      from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutStrip />
      <Work />
      <Stack />
      <Contact />
      <Footer />
    </>
  );
}
