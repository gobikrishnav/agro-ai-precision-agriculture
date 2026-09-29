'use client';

import React, { useState } from 'react';
import { ShieldCheck, Sparkles, AlertCircle, Clock, Droplets, CheckCircle2 } from 'lucide-react';
import { calculateBioPesticide } from '../lib/agronomyEngine';

export default function BioPesticideCalculator() {
  const [recipeType, setRecipeType] = useState<'nske' | 'dashaparni' | 'jeevamrit'>('nske');
  const [tankVolume, setTankVolume] = useState<number>(15);

  const recipe = calculateBioPesticide(recipeType, tankVolume);

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-50 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Bio-Pesticide & Organic Formulation Calculator
          </span>
          <h3 className="text-xl font-bold text-emerald-950 mt-0.5">Farm-Made Natural Pest Controls</h3>
        </div>

        {/* Recipe Switcher */}
        <div className="inline-flex p-1 bg-emerald-50 rounded-xl border border-emerald-200">
          <button
            onClick={() => { setRecipeType('nske'); if (tankVolume > 50) setTankVolume(15); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              recipeType === 'nske'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-900/80 hover:text-emerald-950'
            }`}
          >
            NSKE 5%
          </button>
          <button
            onClick={() => { setRecipeType('dashaparni'); setTankVolume(50); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              recipeType === 'dashaparni'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-900/80 hover:text-emerald-950'
            }`}
          >
            Dashaparni Ark
          </button>
          <button
            onClick={() => { setRecipeType('jeevamrit'); setTankVolume(200); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              recipeType === 'jeevamrit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-900/80 hover:text-emerald-950'
            }`}
          >
            Jeevamrit
          </button>
        </div>
      </div>

      {/* Tank Size Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
        <div>
          <label className="text-xs font-bold text-emerald-950 block">Batch / Sprayer Tank Volume</label>
          <span className="text-[11px] text-emerald-700">Adjust to match your knapsack sprayer or barrel capacity</span>
        </div>

        <div className="flex items-center gap-2">
          {[15, 25, 50, 100, 200].map(vol => (
            <button
              key={vol}
              onClick={() => setTankVolume(vol)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tankVolume === vol
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100/50'
              }`}
            >
              {vol} L
            </button>
          ))}
        </div>
      </div>

      {/* Formulation Details Card */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-lg font-extrabold text-emerald-950">{recipe.name}</h4>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Clock className="w-3.5 h-3.5" />
            {recipe.shelfLife}
          </span>
        </div>

        <p className="text-xs text-emerald-800/90 font-medium">
          <strong>Target Spectrum:</strong> {recipe.targetPests}
        </p>

        {/* Calculated Ingredients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-emerald-100 rounded-xl overflow-hidden">
            <thead className="bg-emerald-100/60 text-emerald-950 font-bold uppercase">
              <tr>
                <th className="p-2.5">Ingredient</th>
                <th className="p-2.5">Required Quantity</th>
                <th className="p-2.5">Preparation Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {recipe.calculatedIngredients.map((item, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/40">
                  <td className="p-2.5 font-bold text-emerald-950">{item.item}</td>
                  <td className="p-2.5 font-extrabold text-emerald-700 whitespace-nowrap">{item.amount}</td>
                  <td className="p-2.5 text-emerald-800/80">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Step-by-Step Brewing Protocol */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preparation Instructions for {tankVolume} Liters</span>
          </h5>
          <ol className="text-xs space-y-1.5 text-stone-700 list-decimal list-inside leading-relaxed">
            {recipe.preparationSteps.map((step, idx) => (
              <li key={idx} className="font-medium">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
