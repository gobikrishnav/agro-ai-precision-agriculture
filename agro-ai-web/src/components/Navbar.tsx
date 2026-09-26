'use client';

import React, { useState } from 'react';
import { Sprout, Menu, X, ArrowRight, BookOpen, Layers, Droplets, FlaskConical } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-emerald-950">Agro<span className="text-emerald-600">AI</span></span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Precision</span>
              </div>
              <p className="text-[11px] text-emerald-700/80 hidden sm:block">Smart Crop & Fertilizer Decision System</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-emerald-900/80">
            <button onClick={() => scrollTo('explainable-science')} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Soil Science Explained
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              How It Works
            </button>
            <button onClick={() => scrollTo('decision-workspace')} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              Interactive Tools
            </button>
            <button onClick={() => scrollTo('soil-faq')} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-600" />
              Soil Testing & FAQ
            </button>
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollTo('decision-workspace')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/25 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-900 hover:bg-emerald-50 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => scrollTo('explainable-science')}
            className="w-full text-left py-2 px-3 rounded-lg text-emerald-900 font-medium hover:bg-emerald-50"
          >
            Soil Science Explained
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="w-full text-left py-2 px-3 rounded-lg text-emerald-900 font-medium hover:bg-emerald-50"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('decision-workspace')}
            className="w-full text-left py-2 px-3 rounded-lg text-emerald-900 font-medium hover:bg-emerald-50"
          >
            Interactive Tools (Crop & Fertilizer)
          </button>
          <button
            onClick={() => scrollTo('soil-faq')}
            className="w-full text-left py-2 px-3 rounded-lg text-emerald-900 font-medium hover:bg-emerald-50"
          >
            Soil Testing & FAQ
          </button>
          <div className="pt-2">
            <button
              onClick={() => scrollTo('decision-workspace')}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
