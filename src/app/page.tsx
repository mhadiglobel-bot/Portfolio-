import About from "@/components/About";
import Approach from "@/components/Approach";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Statement from "@/components/Statement";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Work />
        <Marquee />
        <About />
        <Capabilities />
        <Statement />
        <Approach />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
