'use client';

import React, { useState } from 'react';
import { BookOpen, AlertCircle, HelpCircle, Check, Flame, Award } from 'lucide-react';

export default function ExplainableScience() {
  const [activeNutrient, setActiveNutrient] = useState<'N' | 'P' | 'K'>('N');

  return (
    <section id="explainable-science" className="py-20 bg-white border-y border-emerald-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Plain-English Agricultural Science
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            Understanding Your Soil: N-P-K, pH & Texture
          </h2>
          <p className="mt-4 text-base sm:text-lg text-emerald-800/80">
            Healthy crops begin with balanced soil chemistry. Here is everything you need to know about 
            your soil test report without confusing laboratory jargon.
          </p>
        </div>

        {/* 1. N-P-K Explainer with Interactive Selector */}
        <div className="bg-emerald-50/50 rounded-3xl p-6 sm:p-10 border border-emerald-200/80 mb-16 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">The Primary Macronutrients</span>
              <h3 className="text-2xl font-bold text-emerald-950">The Big Three: N - P - K Demystified</h3>
            </div>

            {/* Nutrient Switcher */}
            <div className="inline-flex p-1.5 bg-white rounded-2xl border border-emerald-200 shadow-xs self-start md:self-auto">
              <button
                onClick={() => setActiveNutrient('N')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeNutrient === 'N'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-900/70 hover:text-emerald-900'
                }`}
              >
                (N) Nitrogen
              </button>
              <button
                onClick={() => setActiveNutrient('P')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeNutrient === 'P'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-900/70 hover:text-emerald-900'
                }`}
              >
                (P) Phosphorus
              </button>
              <button
                onClick={() => setActiveNutrient('K')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeNutrient === 'K'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-900/70 hover:text-emerald-900'
                }`}
              >
                (K) Potassium
              </button>
            </div>
          </div>

          {/* Active Nutrient Details Card */}
          {activeNutrient === 'N' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-emerald-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-black">N</div>
                  <span>Primary Function</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">Vegetative Growth & Chlorophyll</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Nitrogen is the building block of plant proteins and green chlorophyll. It drives shoot growth, leaf expansion, tillering in grains, and rapid canopy photosynthesis.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-amber-700 font-bold">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Signs of Deficiency</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">Pale Leaves & Stunted Plants</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Old lower leaves turn pale yellow starting from the leaf tips (chlorosis). Plant remains spindly and stunted with few tillers, resulting in severe yield depression.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-teal-700 font-bold">
                  <Award className="w-5 h-5 text-teal-600" />
                  <span>AgroAI Smart Prescription</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">Neem-Coated Urea in Split Doses</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Avoid single heavy dumping. We prescribe split applications (Basal, active tillering, and panicle initiation) to stop leaching losses and prevent fungal pest attraction.
                </p>
              </div>
            </div>
          )}

          {activeNutrient === 'P' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-emerald-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-black">P</div>
                  <span>Primary Function</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">Root Architecture & Energy (ATP)</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Phosphorus captures and transfers solar energy (ATP). It stimulates vigorous root branching, early seedling establishment, timely flowering, and robust seed formation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-amber-700 font-bold">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Signs of Deficiency</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">Purple/Bronze Leaf Margins</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Lower leaves turn dark bluish-green with purple or reddish pigmentation along veins and edges. Root systems remain shallow and flower maturity is severely delayed.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-teal-700 font-bold">
                  <Award className="w-5 h-5 text-teal-600" />
                  <span>AgroAI Smart Prescription</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">Basal DAP or Single Super Phosphate</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Because phosphorus does not move freely in soil, we prescribe deep basal placement (5cm below seed) at sowing so emerging roots directly tap into the nutrient reservoir.
                </p>
              </div>
            </div>
          )}

          {activeNutrient === 'K' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-emerald-700 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-black">K</div>
                  <span>Primary Function</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">Armor, Water Balance & Fruit Sugar</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Potassium regulates stomata opening, prevents excessive drought wilt, thickens cell walls for disease resistance, and boosts grain plumpness and fruit brix sweetness.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-amber-700 font-bold">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Signs of Deficiency</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">Marginal Leaf Scorching & Lodging</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Outer edges of older leaves look scorched, burnt, or curled (marginal necrosis). Crop stems become weak and collapse easily during high winds or rain (lodging).
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-teal-700 font-bold">
                  <Award className="w-5 h-5 text-teal-600" />
                  <span>AgroAI Smart Prescription</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-2">MOP (Muriate of Potash 60% K2O)</h4>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  We calculate precise bag counts of MOP with 50% basal application and 50% during grain-filling to maximize harvest test weight and post-harvest shelf life.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Soil pH Impact & Soil Amendments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8 rounded-3xl border border-emerald-100">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">Chemical Availability</span>
            <h3 className="text-2xl font-bold text-emerald-950 mt-1 mb-4">Why Soil pH Dictates Fertilizer Success</h3>
            <p className="text-sm text-emerald-800/85 leading-relaxed mb-6">
              Even if you apply expensive fertilizers, your crops cannot absorb nutrients if the soil pH is out of balance. 
              pH acts as a chemical gatekeeper:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                  &lt;6.0
                </div>
                <div>
                  <h5 className="text-sm font-bold text-red-950">Acidic Soil (Nutrient Lockup)</h5>
                  <p className="text-xs text-red-900/80 mt-0.5">
                    Phosphorus binds tightly to aluminum and iron, becoming insoluble. 
                    <strong className="text-red-950 font-semibold"> Solution:</strong> Agricultural Dolomite Limestone (CaCO3) prescribed by AgroAI.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  6.0-7.5
                </div>
                <div>
                  <h5 className="text-sm font-bold text-emerald-950">Ideal Bio-Availability Window (Sweet Spot)</h5>
                  <p className="text-xs text-emerald-900/80 mt-0.5">
                    Maximum biological uptake of Nitrogen, Phosphorus, Potassium, Calcium, and beneficial mycorrhizae fungi.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                  &gt;7.8
                </div>
                <div>
                  <h5 className="text-sm font-bold text-amber-950">Alkaline / Sodic Soil (Micronutrient Starvation)</h5>
                  <p className="text-xs text-amber-900/80 mt-0.5">
                    Excess sodium hardens clay colloids, causing crusting and chlorosis. 
                    <strong className="text-amber-950 font-semibold"> Solution:</strong> Agricultural Gypsum (CaSO4) prescribed by AgroAI to leach out sodium.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Soil Texture Dynamics */}
          <div className="glass-card p-8 rounded-3xl border border-emerald-100">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">Physical Soil Properties</span>
            <h3 className="text-2xl font-bold text-emerald-950 mt-1 mb-4">Soil Texture & Water Dynamics</h3>
            <p className="text-sm text-emerald-800/85 leading-relaxed mb-6">
              Different soil textures react differently to fertilizer applications and irrigation intervals:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h5 className="text-sm font-bold text-stone-900">Sandy Loam</h5>
                <p className="text-xs text-stone-700 mt-1">
                  <strong>Traits:</strong> High water drainage, low nutrient buffer.<br />
                  <strong>Rule:</strong> Never apply all fertilizer at once; requires smaller, frequent splits.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h5 className="text-sm font-bold text-stone-900">Clayey Loam</h5>
                <p className="text-xs text-stone-700 mt-1">
                  <strong>Traits:</strong> High water holding, excellent cation exchange.<br />
                  <strong>Rule:</strong> Risk of waterlogging; requires precision irrigation scheduling.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h5 className="text-sm font-bold text-stone-900">Black Cotton Soil</h5>
                <p className="text-xs text-stone-700 mt-1">
                  <strong>Traits:</strong> Deep swelling montmorillonite clay, high P-fixation.<br />
                  <strong>Rule:</strong> Higher basal phosphorus placement required.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h5 className="text-sm font-bold text-stone-900">Alluvial Loam</h5>
                <p className="text-xs text-stone-700 mt-1">
                  <strong>Traits:</strong> Balanced silt, sand, and clay with rich organic matter.<br />
                  <strong>Rule:</strong> High responsiveness to standard fertilizer dosages.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Automatic Calibration:</strong> In our interactive tool below, selecting your soil texture automatically calibrates leaching efficiency multipliers!
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
