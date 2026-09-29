'use client';

import React from 'react';
import { Layers, Database, Cpu, Calculator, Droplet, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const steps = [
    {
      number: '01',
      title: 'Enter Soil & Climate Profile',
      desc: 'Input your soil testing lab values (N, P, K in mg/kg, pH) along with seasonal rainfall and temperature, or click one of our 6 realistic field presets.',
      icon: Database,
      badge: 'Input Phase'
    },
    {
      number: '02',
      title: 'Multi-Vector ML Matching',
      desc: 'Our engine scans across 2,200 verified agricultural data points and 22 crop varieties to identify the crop with the highest biological yield affinity.',
      icon: Cpu,
      badge: 'AI Inference'
    },
    {
      number: '03',
      title: 'Stoichiometric Fertilizer Recipe',
      desc: 'Instead of generic blanket advice, our formula calculates precise chemical deficits and translates them into exact 45kg/50kg commercial bags with split timings.',
      icon: Calculator,
      badge: 'Chemical Math'
    },
    {
      number: '04',
      title: 'Dynamic Irrigation & Plant Health',
      desc: 'Calculates Penman-Monteith crop water demand (ETc), credits recent rainfall, and gives exact pump runtimes in hours and minutes.',
      icon: Droplet,
      badge: 'Execution & Care'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            <Layers className="w-3.5 h-3.5" />
            Decision Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            How AgroAI Transforms Raw Soil Data Into Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-emerald-800/80">
            A transparent, 4-step scientific workflow designed to save farmers money, preserve soil health, 
            and maximize agricultural harvest.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="glass-card p-6 sm:p-7 rounded-3xl border border-emerald-100/90 relative flex flex-col justify-between hover:translate-y--1 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-emerald-600/30 font-mono">{step.number}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-emerald-950 mb-2.5">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-50 flex items-center text-xs font-semibold text-emerald-700">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Action Call to try the tools */}
        <div className="mt-14 text-center">
          <button
            onClick={() => scrollTo('decision-workspace')}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <span>Launch Interactive Tools Below</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
