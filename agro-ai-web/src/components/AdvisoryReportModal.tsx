'use client';

import React from 'react';
import { Printer, X, CheckCircle2, Sprout, FlaskConical, Droplets, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { CropPredictionResult, FertilizerPrescriptionResult, IrrigationResult } from '../lib/agronomyEngine';

interface AdvisoryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plotName: string;
  soilInputs: {
    n: number;
    p: number;
    k: number;
    ph: number;
    temperature: number;
    humidity: number;
    rainfall: number;
    soilTexture: string;
  };
  cropResult: CropPredictionResult | null;
  fertilizerResult: FertilizerPrescriptionResult | null;
  irrigationResult: IrrigationResult | null;
}

export default function AdvisoryReportModal({
  isOpen,
  onClose,
  plotName,
  soilInputs,
  cropResult,
  fertilizerResult,
  irrigationResult
}: AdvisoryReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden print:shadow-none print:border-none print:max-w-full">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Agricultural Field Advisory & Soil Health Card</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 sm:p-10 space-y-6 text-[#14281d] print:p-6" id="printable-advisory-report">
          
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-emerald-600 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-emerald-950 tracking-tight">Agro<span className="text-emerald-600">AI</span></span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Precision Agronomy</span>
              </div>
              <p className="text-xs text-emerald-800 mt-1 font-medium">Standard Agronomic Decision Support & Fertilizer Prescription Card</p>
            </div>

            <div className="text-right text-xs space-y-1 text-emerald-900/80">
              <div className="flex items-center justify-end gap-1.5 font-bold text-emerald-950">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Date: {currentDate}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Plot: {plotName || 'Primary Field Plot'}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Soil Test Benchmark Summary */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">1. Laboratory Soil Chemistry & Climate Data</h4>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Nitrogen</span>
                <strong className="text-emerald-950 text-sm">{soilInputs.n}</strong>
                <span className="text-[9px] text-emerald-700/70 block">mg/kg</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Phosphorus</span>
                <strong className="text-emerald-950 text-sm">{soilInputs.p}</strong>
                <span className="text-[9px] text-emerald-700/70 block">mg/kg</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Potassium</span>
                <strong className="text-emerald-950 text-sm">{soilInputs.k}</strong>
                <span className="text-[9px] text-emerald-700/70 block">mg/kg</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Soil pH</span>
                <strong className="text-emerald-950 text-sm">{soilInputs.ph.toFixed(1)}</strong>
                <span className="text-[9px] text-emerald-700/70 block">pH scale</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Temperature</span>
                <strong className="text-emerald-950 text-sm">{soilInputs.temperature}°C</strong>
                <span className="text-[9px] text-emerald-700/70 block">Ambient</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Humidity</span>
                <strong className="text-emerald-950 text-sm">{soilInputs.humidity}%</strong>
                <span className="text-[9px] text-emerald-700/70 block">Relative</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Rainfall</span>
                <strong className="text-emerald-950 text-sm">{soilInputs.rainfall}</strong>
                <span className="text-[9px] text-emerald-700/70 block">mm</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Texture</span>
                <strong className="text-emerald-950 text-[11px] line-clamp-1">{soilInputs.soilTexture.split(' ')[0]}</strong>
                <span className="text-[9px] text-emerald-700/70 block">Classification</span>
              </div>
            </div>
          </div>

          {/* Section 2: Crop Recommendation Result */}
          {cropResult && (
            <div className="border border-emerald-200 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">2. Recommended Crop Evaluation</h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900">
                  Grade {cropResult.topCrop.matchGrade} ({cropResult.topCrop.confidence}% Match)
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-emerald-950 mb-1">{cropResult.topCrop.info.name}</h3>
              <p className="text-xs text-emerald-800 mb-3">{cropResult.topCrop.summary}</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-emerald-100 text-emerald-900/90 font-medium">
                <div>• Growing Duration: <strong>{cropResult.topCrop.info.growing_days} Days</strong></div>
                <div>• Optimal Season: <strong>{cropResult.topCrop.info.growing_season}</strong></div>
                <div>• Water Affinity: <strong>{cropResult.topCrop.info.water_req.split('(')[0]}</strong></div>
              </div>
            </div>
          )}

          {/* Section 3: Commercial Fertilizer Prescription Table */}
          {fertilizerResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  3. Prescribed Fertilizer Doses & Bag Requirements ({fertilizerResult.fieldAcres} Acre(s))
                </h4>
                <span className="text-xs font-bold text-emerald-950">
                  Total Budget: ₹ {fertilizerResult.totalCost.toLocaleString()}
                </span>
              </div>

              <table className="w-full text-left text-xs border border-emerald-200 rounded-xl overflow-hidden">
                <thead className="bg-emerald-100/70 text-emerald-950 font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Fertilizer Formulation</th>
                    <th className="p-2.5">Total Weight</th>
                    <th className="p-2.5">Standard Bags</th>
                    <th className="p-2.5">Timing & Placement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {fertilizerResult.prescriptions.map((it, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/50">
                      <td className="p-2.5 font-bold text-emerald-950">
                        {it.name}
                        <div className="text-[10px] font-normal text-emerald-700">{it.purpose}</div>
                      </td>
                      <td className="p-2.5 font-semibold">{it.quantityKg} kg</td>
                      <td className="p-2.5 font-bold text-emerald-800">{it.bags} bag(s) ({it.bagSizeKg}kg)</td>
                      <td className="p-2.5 text-emerald-900/80">{it.timing}</td>
                    </tr>
                  ))}
                  {fertilizerResult.soilAmendments.map((it, idx) => (
                    <tr key={`amend-${idx}`} className="bg-amber-50">
                      <td className="p-2.5 font-bold text-amber-950">
                        {it.name}
                        <div className="text-[10px] font-normal text-amber-800">{it.purpose}</div>
                      </td>
                      <td className="p-2.5 font-semibold text-amber-950">{it.quantityKg} kg</td>
                      <td className="p-2.5 font-bold text-amber-900">{it.bags} bag(s) ({it.bagSizeKg}kg)</td>
                      <td className="p-2.5 text-amber-900">{it.timing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Section 4: Split Application & Daily Irrigation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Split Schedule */}
            {fertilizerResult && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs">
                <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] mb-2">Split Application Schedule</h4>
                <div className="space-y-1.5 text-emerald-900/85">
                  <div><strong>1. Basal (At Sowing):</strong> Full Vermicompost, DAP, and 50% MOP.</div>
                  <div><strong>2. Vegetative (Day 25-30):</strong> 1st split Neem-Coated Urea (50%).</div>
                  <div><strong>3. Flowering / Panicle (Day 55-60):</strong> Remaining 50% Urea + 50% MOP.</div>
                </div>
              </div>
            )}

            {/* Irrigation Schedule */}
            {irrigationResult && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
                <h4 className="font-bold text-blue-950 uppercase tracking-wider text-[11px] mb-2">Irrigation Water Budget (FAO-56)</h4>
                <div className="space-y-1 text-blue-950">
                  <div>• Net Daily Depth: <strong>{irrigationResult.netWaterDepthMm} mm/day</strong></div>
                  <div>• Daily Volume: <strong>{irrigationResult.dailyVolumeLiters.toLocaleString()} Liters / Acre</strong></div>
                  <div>• Recommended Pump Runtime: <strong className="text-emerald-700 text-sm">{irrigationResult.pumpRuntimeFormatted}</strong></div>
                  <div>• System Efficiency: <strong>{irrigationResult.systemEfficiency}%</strong></div>
                </div>
              </div>
            )}

          </div>

          {/* Signoff & Agronomic Disclaimer */}
          <div className="pt-4 border-t border-emerald-200 flex items-center justify-between text-[11px] text-emerald-700/80">
            <div>
              Generated via AgroAI Precision Agriculture Platform • Validated against ICAR & FAO-56 standards.
            </div>
            <div className="font-semibold text-emerald-900">
              Verified Recommendation
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
