'use client';

import React from 'react';
import { Sprout, ExternalLink, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-emerald-950 text-emerald-200/80 py-14 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-emerald-950 font-bold shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Agro<span className="text-emerald-400">AI</span></span>
            </div>
            <p className="text-sm text-emerald-300/80 max-w-sm leading-relaxed">
              Open-source precision agriculture decision platform. Combining authentic multi-variate machine learning 
              with stoichiometric chemical fertilizer dosing and FAO-56 evapotranspiration water budgeting.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://github.com/gobikrishnav/agro-ai-precision-agriculture" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Precision Suite</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">Overview</a>
              </li>
              <li>
                <a href="#explainable-science" className="hover:text-white transition-colors">Soil Science (N-P-K & pH)</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#decision-workspace" className="hover:text-white transition-colors">Crop & Fertilizer Tools</a>
              </li>
              <li>
                <a href="#soil-faq" className="hover:text-white transition-colors">Soil Sampling & FAQ</a>
              </li>
            </ul>
          </div>

          {/* Standards & Agronomy References */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">Agronomic Standards</h4>
            <ul className="space-y-2 text-xs text-emerald-300/70">
              <li>• ICAR Soil Nutrient Standards</li>
              <li>• FAO-56 Penman-Monteith ETc</li>
              <li>• 2,200 Verified Field Samples</li>
              <li>• 22 Multi-Category Crop Classes</li>
              <li>• Commercial Fertilizer Stoichiometry</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-emerald-900/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <div>
            © {new Date().getFullYear()} AgroAI • Developed for farmers, agronomists, and researchers.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
