"use client";

import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageLoader } from "@/components/ux/PageLoader";
import { CustomCursor } from "@/components/ux/CustomCursor";
import { ScrollProgress } from "@/components/ux/ScrollProgress";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Writing } from "@/components/sections/Writing";
import { Podcast } from "@/components/sections/Podcast";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />
      <Navigation />

      <main className="relative">
        <Hero />
        <Services />
        <SelectedWork />
        <Experience />
        <About />
        <Testimonials />
        <Writing />
        <Podcast />
        <Contact />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
