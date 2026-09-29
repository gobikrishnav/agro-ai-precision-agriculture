'use client';

import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Sprout, FlaskConical, Droplets, ShieldCheck, ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/60 via-green-50/40 to-transparent pointer-events-none -z-10 blur-2xl" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 left-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>ICAR & FAO-56 Aligned Precision Platform • 2,200 Verified Field Records</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-950 tracking-tight leading-[1.15]">
            Scientific Crop & Fertilizer Decisions <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
              Powered by Real Soil Intelligence
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-emerald-900/75 max-w-3xl mx-auto leading-relaxed">
            Eliminate agricultural guesswork. AgroAI analyzes your laboratory soil metrics 
            (<span className="font-semibold text-emerald-900">Nitrogen, Phosphorus, Potassium, Soil pH</span>) 
            and climatic weather data to recommend optimal crops, calculate exact commercial fertilizer bags, 
            and compute daily irrigation runtimes.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('decision-workspace')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo('explainable-science')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-semibold text-base shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>How Soil Science Works</span>
              <ChevronDown className="w-4 h-4 text-emerald-600" />
            </button>
          </div>

          {/* Key Value Guarantee Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-emerald-800 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Free & Open-Source</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Exact 45kg & 50kg Bag Counts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Soil Texture & pH Sensitive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No Redundant Clutter / Pure Action</span>
            </div>
          </div>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="glass-card p-6 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 mb-1.5">22 Validated Crops</h3>
            <p className="text-sm text-emerald-800/80 leading-relaxed">
              Trained on 2,200 authentic field samples with multi-variate statistical confidence and runner-up alternative crops.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 mb-1.5">Stoichiometric Fertilizer</h3>
            <p className="text-sm text-emerald-800/80 leading-relaxed">
              Calculates exact kg doses of Urea, DAP, MOP, SSP, and Vermicompost. Prescribes Lime or Gypsum for pH extremes.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 mb-1.5">Smart Irrigation (FAO-56)</h3>
            <p className="text-sm text-emerald-800/80 leading-relaxed">
              Penman-Monteith crop evapotranspiration (ETc) scheduler providing exact pump runtime hours based on pump HP.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 mb-1.5">Plant Doctor & IPM</h3>
            <p className="text-sm text-emerald-800/80 leading-relaxed">
              Integrated pest management, biological remedies, and farm-made bio-pesticides (Neem, Trichoderma) for every crop.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
