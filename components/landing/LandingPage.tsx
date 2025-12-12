'use client';

import { Header } from './Header';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { Features } from './Features';
import { SecondaryFeature } from './SecondaryFeature';
import { Integrations } from './Integrations';
import { Automation } from './Automation';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { Footer } from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <SocialProof />
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