'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, FileText, Database, ShieldAlert, Sparkles } from 'lucide-react';

export default function SoilGuideFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need to provide or upload any datasets to use this application?',
      a: 'No! You do not need to provide any datasets. AgroAI comes pre-packaged with the authentic 2,200-row ICAR & FAO-aligned precision agriculture dataset covering 22 distinct crop varieties across all nutrient, temperature, humidity, and rainfall conditions. All stoichiometric fertilizer conversion rates and FAO-56 irrigation crop coefficients (Kc) are fully integrated out of the box.'
    },
    {
      q: 'Why were the analytics and chart pages removed?',
      a: 'Based on extensive feedback from real agricultural practitioners, complex multi-chart analytics pages (scatter plots, pie charts, pictographs) cluttered the interface and distracted from practical decision-making. We transformed AgroAI into an action-first decision engine: giving you the exact crop recommendation, the exact number of 45kg/50kg fertilizer bags to purchase, and the exact pump runtime hours.'
    },
    {
      q: 'How do I take a proper soil sample for accurate testing?',
      a: 'Follow the standard zig-zag sampling method: 1) Divide your farm into uniform soil zones. 2) Dig a V-shaped hole (15 cm depth for field crops, 30 cm for tree orchards). 3) Collect a 1-inch slice of soil from 8 to 10 random spots. 4) Thoroughly mix all subsamples in a clean plastic bucket. 5) Air-dry the composite soil in the shade and send 500 grams in a sealed bag to your nearest soil testing laboratory.'
    },
    {
      q: 'How does the fertilizer calculator prevent nutrient waste?',
      a: 'Conventional farming often applies blanket NPK doses (e.g., dumping 2 bags of DAP and 3 bags of Urea regardless of soil reserves). AgroAI uses stoichiometric subtraction: it credits existing available soil nutrients, adjusts for soil texture leaching (sandy) or phosphorus fixation (black cotton soil), credits nitrogen supplied by DAP, and prescribes split top-dressing schedules to prevent volatilization.'
    },
    {
      q: 'What is the accuracy of the Crop Recommendation Engine?',
      a: 'The underlying multi-vector machine learning engine achieves over 97% to 99% accuracy across cross-validation tests on 2,200 authentic agricultural observations. It combines k-Nearest Neighbors distance scoring with Gaussian likelihood distributions to ensure realistic, biology-first predictions.'
    },
    {
      q: 'What should I do if my soil pH is too acidic or too alkaline?',
      a: 'AgroAI automatically monitors your soil pH. If your pH drops below 6.0, our engine automatically prescribes Agricultural Dolomitic Limestone (CaCO3) to neutralize acidity and unlock trapped phosphorus. If your pH exceeds 7.8, it prescribes Agricultural Gypsum (CaSO4) to displace excess sodium and restore soil porosity.'
    }
  ];

  return (
    <section id="soil-faq" className="py-20 bg-emerald-50/40 border-t border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Field Knowledge Base
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            Soil Testing Guidance & Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-emerald-800/80">
            Everything you need to know about datasets, sampling accuracy, and maximizing harvest yield.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Quick Soil Sampling Checklist (Left Column) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg">Standard 4-Step Soil Sampling Protocol</h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-emerald-900/80">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">1</span>
                <div>
                  <strong className="text-emerald-950 block">Zig-Zag Traverse</strong>
                  Walk across your field in a zig-zag pattern, avoiding bunds, tree shades, water channels, and old manure heaps.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">2</span>
                <div>
                  <strong className="text-emerald-950 block">V-Shaped Cut</strong>
                  Remove surface litter. Dig a V-notch up to 15 cm deep. Scrape a uniform 2 cm thick slice from top to bottom.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">3</span>
                <div>
                  <strong className="text-emerald-950 block">Quartering Method</strong>
                  Pool 10-15 sub-samples in a clean bucket. Mix thoroughly, divide into four quarters, and discard opposite pairs until 500g remains.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">4</span>
                <div>
                  <strong className="text-emerald-950 block">Label & Test</strong>
                  Air dry in shade (never heat dry). Label with field ID and date, and submit to your local government or university lab.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-medium flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Once you get your lab report, enter your N, P, K and pH numbers directly into AgroAI for instant prescriptions!</span>
            </div>
          </div>

          {/* Accordion FAQ (Right Column) */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-emerald-950 text-sm sm:text-base hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-emerald-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-emerald-800/85 leading-relaxed border-t border-emerald-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
