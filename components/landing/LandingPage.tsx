'use client';

import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { SecondaryFeature } from './SecondaryFeature';
import { Integrations } from './Integrations';
import { Automation } from './Automation';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';
import { WhoIsItFor } from './WhoIsItFor';

function DevelopmentBanner() {
  return (
    <div className="bg-amber-500 text-black py-2 px-4 text-center text-sm font-medium">
      This app is currently in active development. Features may change or be unavailable.
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <DevelopmentBanner />
      <Header />
      <Hero />
      <WhoIsItFor />
      <Features />
      <SecondaryFeature />
      <Integrations />
      <Automation />
      <Testimonials />
      <Footer />
    </div>
  );
}