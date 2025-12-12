'use client';

import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { SecondaryFeature } from './SecondaryFeature';
import { Integrations } from './Integrations';
import { Automation } from './Automation';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { Footer } from './Footer';
import { WhoIsItFor } from './WhoIsItFor';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <WhoIsItFor />
      <Features />
      <SecondaryFeature />
      <Integrations />
      <Automation />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}