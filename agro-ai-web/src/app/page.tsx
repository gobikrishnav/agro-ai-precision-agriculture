'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ExplainableScience from '../components/ExplainableScience';
import HowItWorks from '../components/HowItWorks';
import DecisionWorkspace from '../components/DecisionWorkspace';
import SoilGuideFaq from '../components/SoilGuideFaq';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fbf8] text-[#14281d] selection:bg-emerald-200 selection:text-emerald-950">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ExplainableScience />
        <HowItWorks />
        <DecisionWorkspace />
        <SoilGuideFaq />
      </main>
      <Footer />
    </div>
  );
}
