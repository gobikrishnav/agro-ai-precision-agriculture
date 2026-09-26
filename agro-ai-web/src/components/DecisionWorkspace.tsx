'use client';

import React, { useState } from 'react';
import { 
  Sprout, 
  FlaskConical, 
  Droplets, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Layers, 
  Info, 
  Zap,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { 
  predictCrop, 
  calculateFertilizerPrescription, 
  calculateIrrigation, 
  SOIL_PRESETS, 
  agronomyData,
  CropPredictionResult,
  FertilizerPrescriptionResult,
  IrrigationResult
} from '../lib/agronomyEngine';

export default function DecisionWorkspace() {
  const [activeTab, setActiveTab] = useState<'crop' | 'fertilizer' | 'irrigation' | 'doctor' | 'budget'>('crop');

  // Soil & Climate Input State
  const [soilInputs, setSoilInputs] = useState({
    n: 90,
    p: 42,
    k: 43,
    temperature: 24,
    humidity: 80,
    ph: 6.5,
    rainfall: 210,
    soilTexture: 'Alluvial Loam (Balanced texture)'
  });

  // Fertilizer Inputs State
  const [fertilizerInputs, setFertilizerInputs] = useState({
    cropKey: 'rice',
    fieldAcres: 1.0,
    targetYield: 'Standard Commercial Yield',
    soilTexture: 'Alluvial Loam (Balanced texture)',
    n: 90,
    p: 42,
    k: 43,
    ph: 6.5
  });

  // Irrigation Inputs State
  const [irrigationInputs, setIrrigationInputs] = useState({
    cropKey: 'rice',
    growthStage: 'flowering' as 'initial' | 'vegetative' | 'flowering' | 'maturity',
    temperature: 28,
    humidity: 65,
    recentRainfallMm: 5,
    pumpHp: 5,
    irrigationMethod: 'drip' as 'drip' | 'sprinkler' | 'surface',
    fieldAcres: 1.0
  });

  // Crop Doctor State
  const [selectedDoctorCrop, setSelectedDoctorCrop] = useState('rice');

  // Results State
  const [cropResult, setCropResult] = useState<CropPredictionResult | null>(() => predictCrop(soilInputs));
  const [fertilizerResult, setFertilizerResult] = useState<FertilizerPrescriptionResult | null>(() => 
    calculateFertilizerPrescription({
      cropKey: 'rice',
      currentN: 90,
      currentP: 42,
      currentK: 43,
      currentPh: 6.5,
      soilTexture: 'Alluvial Loam (Balanced texture)',
      targetYield: 'Standard Commercial Yield',
      fieldAcres: 1.0
    })
  );
  const [irrigationResult, setIrrigationResult] = useState<IrrigationResult | null>(() => 
    calculateIrrigation({
      cropKey: 'rice',
      growthStage: 'flowering',
      temperature: 28,
      humidity: 65,
      recentRainfallMm: 5,
      pumpHp: 5,
      irrigationMethod: 'drip',
      fieldAcres: 1.0
    })
  );

  // Subsidy state for Budget tab
  const [subsidyEnabled, setSubsidyEnabled] = useState(true);

  // Handlers
  const handlePresetSelect = (presetIndex: number) => {
    const preset = SOIL_PRESETS[presetIndex];
    if (!preset) return;
    setSoilInputs(preset.values);
    const result = predictCrop(preset.values);
    setCropResult(result);
  };

  const handlePredictCrop = () => {
    const res = predictCrop(soilInputs);
    setCropResult(res);
  };

  const handleHandoffToFertilizer = (cropKey: string) => {
    setFertilizerInputs(prev => ({
      ...prev,
      cropKey,
      n: soilInputs.n,
      p: soilInputs.p,
      k: soilInputs.k,
      ph: soilInputs.ph,
      soilTexture: soilInputs.soilTexture
    }));
    const res = calculateFertilizerPrescription({
      cropKey,
      currentN: soilInputs.n,
      currentP: soilInputs.p,
      currentK: soilInputs.k,
      currentPh: soilInputs.ph,
      soilTexture: soilInputs.soilTexture,
      targetYield: fertilizerInputs.targetYield,
      fieldAcres: fertilizerInputs.fieldAcres
    });
    setFertilizerResult(res);
    setActiveTab('fertilizer');
    
    // Also sync irrigation crop
    setIrrigationInputs(prev => ({ ...prev, cropKey }));
    setIrrigationResult(calculateIrrigation({
      ...irrigationInputs,
      cropKey
    }));
  };

  const handleRecalculateFertilizer = () => {
    const res = calculateFertilizerPrescription({
      cropKey: fertilizerInputs.cropKey,
      currentN: fertilizerInputs.n,
      currentP: fertilizerInputs.p,
      currentK: fertilizerInputs.k,
      currentPh: fertilizerInputs.ph,
      soilTexture: fertilizerInputs.soilTexture,
      targetYield: fertilizerInputs.targetYield,
      fieldAcres: fertilizerInputs.fieldAcres
    });
    setFertilizerResult(res);
  };

  const handleRecalculateIrrigation = () => {
    const res = calculateIrrigation(irrigationInputs);
    setIrrigationResult(res);
  };

  const cropsList = Object.entries(agronomyData.crops);

  return (
    <section id="decision-workspace" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          Interactive Agricultural Workspace
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
          Precision Field Decision Suite
        </h2>
        <p className="mt-3 text-sm sm:text-base text-emerald-800/80">
          Actionable recommendations with zero confusing charts. Input your laboratory values or test with verified realistic field presets.
        </p>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 mb-8 gap-2 no-scrollbar">
        <button
          onClick={() => setActiveTab('crop')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'crop'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-emerald-900/80 hover:bg-emerald-50 border border-emerald-100'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>1. Crop Recommender</span>
        </button>

        <button
          onClick={() => setActiveTab('fertilizer')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'fertilizer'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-emerald-900/80 hover:bg-emerald-50 border border-emerald-100'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>2. Fertilizer Prescription</span>
        </button>

        <button
          onClick={() => setActiveTab('irrigation')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'irrigation'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-emerald-900/80 hover:bg-emerald-50 border border-emerald-100'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>3. Smart Irrigation (FAO-56)</span>
        </button>

        <button
          onClick={() => setActiveTab('doctor')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'doctor'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-emerald-900/80 hover:bg-emerald-50 border border-emerald-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>4. Plant Doctor & IPM</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white text-emerald-900/80 hover:bg-emerald-50 border border-emerald-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>5. Fertilizer Cost & Subsidy</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CROP RECOMMENDATION */}
      {/* ========================================================================= */}
      {activeTab === 'crop' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Quick 1-Click Presets */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Quick Test with Realistic Field Presets
              </span>
              <span className="text-xs text-emerald-700/80 hidden sm:inline">Click to prefill verified field test conditions</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {SOIL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(idx)}
                  className="p-3 text-left rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/60 transition-colors cursor-pointer group"
                >
                  <p className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800 line-clamp-1">{preset.name}</p>
                  <p className="text-[10px] text-emerald-800/80 mt-1 line-clamp-1">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Controls (Left Column) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
                <h3 className="font-bold text-emerald-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Soil & Climate Parameters</span>
                </h3>
                <button
                  onClick={() => handlePresetSelect(0)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* NPK Inputs */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Nitrogen (N)
                    <span className="text-[10px] font-normal text-emerald-700 block">mg/kg (0-140)</span>
                  </label>
                  <input
                    type="number"
                    value={soilInputs.n}
                    onChange={e => setSoilInputs({ ...soilInputs, n: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    min={0}
                    max={140}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Phosphorus (P)
                    <span className="text-[10px] font-normal text-emerald-700 block">mg/kg (5-145)</span>
                  </label>
                  <input
                    type="number"
                    value={soilInputs.p}
                    onChange={e => setSoilInputs({ ...soilInputs, p: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    min={5}
                    max={145}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Potassium (K)
                    <span className="text-[10px] font-normal text-emerald-700 block">mg/kg (5-205)</span>
                  </label>
                  <input
                    type="number"
                    value={soilInputs.k}
                    onChange={e => setSoilInputs({ ...soilInputs, k: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    min={5}
                    max={205}
                  />
                </div>
              </div>

              {/* pH & Temperature */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Soil pH Level
                    <span className="text-[10px] font-normal text-emerald-700 block">3.5 - 9.5 (Ideal: 6.5)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={soilInputs.ph}
                    onChange={e => setSoilInputs({ ...soilInputs, ph: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    min={3.5}
                    max={9.5}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Ambient Temp (°C)
                    <span className="text-[10px] font-normal text-emerald-700 block">10 - 45 °C</span>
                  </label>
                  <input
                    type="number"
                    value={soilInputs.temperature}
                    onChange={e => setSoilInputs({ ...soilInputs, temperature: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    min={10}
                    max={45}
                  />
                </div>
              </div>

              {/* Humidity & Rainfall */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Relative Humidity (%)
                    <span className="text-[10px] font-normal text-emerald-700 block">15 - 100%</span>
                  </label>
                  <input
                    type="number"
                    value={soilInputs.humidity}
                    onChange={e => setSoilInputs({ ...soilInputs, humidity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    min={15}
                    max={100}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Precipitation / Rain
                    <span className="text-[10px] font-normal text-emerald-700 block">20 - 300 mm</span>
                  </label>
                  <input
                    type="number"
                    value={soilInputs.rainfall}
                    onChange={e => setSoilInputs({ ...soilInputs, rainfall: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    min={20}
                    max={300}
                  />
                </div>
              </div>

              {/* Soil Texture Selection */}
              <div>
                <label className="text-xs font-bold text-emerald-950 block mb-1">
                  Soil Texture Type
                </label>
                <select
                  value={soilInputs.soilTexture}
                  onChange={e => setSoilInputs({ ...soilInputs, soilTexture: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                >
                  <option value="Alluvial Loam (Balanced texture)">Alluvial Loam (Balanced texture)</option>
                  <option value="Clayey Loam (High nutrient retention)">Clayey Loam (High nutrient retention)</option>
                  <option value="Sandy Loam (High leaching, needs more N/K splits)">Sandy Loam (High leaching, needs more N/K splits)</option>
                  <option value="Black Cotton Soil (Heavy clay, high P fixation)">Black Cotton Soil (Heavy clay, high P fixation)</option>
                </select>
              </div>

              <button
                onClick={handlePredictCrop}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sprout className="w-4 h-4" />
                <span>Evaluate & Recommend Crop</span>
              </button>
            </div>

            {/* Prediction Output Results (Right Column) */}
            <div className="lg:col-span-7 space-y-6">
              {cropResult && (
                <>
                  {/* Top Recommended Crop Card */}
                  <div className="bg-white p-7 rounded-3xl border-2 border-emerald-300 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-green-500 text-white px-5 py-1.5 rounded-bl-2xl font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{cropResult.topCrop.matchGrade} Match ({cropResult.topCrop.confidence}%)</span>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Top Recommended Crop</span>
                    <h3 className="text-3xl font-extrabold text-emerald-950 mt-1 mb-2">
                      {cropResult.topCrop.info.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800/80 mb-4 inline-block px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                      Category: {cropResult.topCrop.info.category} • Season: {cropResult.topCrop.info.growing_season}
                    </p>

                    <p className="text-sm text-emerald-900/85 leading-relaxed mb-6">
                      {cropResult.topCrop.info.desc}
                    </p>

                    {/* Crop Key Agronomic Profile Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold block">Growing Cycle</span>
                        <span className="text-base font-bold text-emerald-950">{cropResult.topCrop.info.growing_days} Days</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold block">Ideal Soil pH</span>
                        <span className="text-base font-bold text-emerald-950">{cropResult.topCrop.info.ideal_ph} pH</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold block">Ideal N-P-K</span>
                        <span className="text-base font-bold text-emerald-950">{cropResult.topCrop.info.ideal_n}-{cropResult.topCrop.info.ideal_p}-{cropResult.topCrop.info.ideal_k}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold block">Water Demand</span>
                        <span className="text-xs font-bold text-emerald-950 line-clamp-1">{cropResult.topCrop.info.water_req.split('(')[0]}</span>
                      </div>
                    </div>

                    {/* Scientific Insights */}
                    <div className="border-t border-emerald-100 pt-5 space-y-2 mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Agronomic Match Insights</h4>
                      <div className="text-xs space-y-1.5 text-emerald-900/80">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cropResult.insights.nStatus.text}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cropResult.insights.pStatus.text}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cropResult.insights.kStatus.text}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cropResult.insights.phStatus.text}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Handoff to Fertilizer Calculator */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        onClick={() => handleHandoffToFertilizer(cropResult.topCrop.key)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FlaskConical className="w-4 h-4" />
                        <span>Prescribe Fertilizer for {cropResult.topCrop.info.name.split(' ')[0]}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Top 3 Alternative Crops */}
                  <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                      Alternative Crop Matches (Suitability Comparison)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {cropResult.alternatives.map((alt, idx) => (
                        <div 
                          key={idx}
                          className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-emerald-950">{alt.info.name.split(' ')[0]}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                {alt.confidence}%
                              </span>
                            </div>
                            <p className="text-[11px] text-emerald-700/80 mb-2">{alt.info.category}</p>
                            <p className="text-[10px] text-emerald-800/80 line-clamp-2">{alt.info.desc}</p>
                          </div>
                          <button
                            onClick={() => handleHandoffToFertilizer(alt.key)}
                            className="mt-3 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Calculate Fertilizer</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRECISION FERTILIZER PRESCRIPTION */}
      {/* ========================================================================= */}
      {activeTab === 'fertilizer' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Controls (Left Column) */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-xs space-y-5">
              <h3 className="font-bold text-emerald-950 flex items-center gap-2 border-b border-emerald-50 pb-3">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>Fertilizer Field Inputs</span>
              </h3>

              {/* Crop Selector */}
              <div>
                <label className="text-xs font-bold text-emerald-950 block mb-1">
                  Target Crop
                </label>
                <select
                  value={fertilizerInputs.cropKey}
                  onChange={e => setFertilizerInputs({ ...fertilizerInputs, cropKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                >
                  {cropsList.map(([key, data]) => (
                    <option key={key} value={key}>{data.name}</option>
                  ))}
                </select>
              </div>

              {/* Farm Size & Target Yield */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Farm Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={fertilizerInputs.fieldAcres}
                    onChange={e => setFertilizerInputs({ ...fertilizerInputs, fieldAcres: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    min={0.1}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Target Yield
                  </label>
                  <select
                    value={fertilizerInputs.targetYield}
                    onChange={e => setFertilizerInputs({ ...fertilizerInputs, targetYield: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  >
                    <option value="Standard Commercial Yield">Standard Commercial</option>
                    <option value="High Yield (Intensive Farming)">High-Yield Intensive</option>
                    <option value="Organic / Low Input">Organic Low-Input</option>
                  </select>
                </div>
              </div>

              {/* Soil Texture */}
              <div>
                <label className="text-xs font-bold text-emerald-950 block mb-1">
                  Soil Texture Classification
                </label>
                <select
                  value={fertilizerInputs.soilTexture}
                  onChange={e => setFertilizerInputs({ ...fertilizerInputs, soilTexture: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                >
                  <option value="Alluvial Loam (Balanced texture)">Alluvial Loam (Balanced texture)</option>
                  <option value="Clayey Loam (High nutrient retention)">Clayey Loam (High nutrient retention)</option>
                  <option value="Sandy Loam (High leaching, needs more N/K splits)">Sandy Loam (High leaching, needs more N/K splits)</option>
                  <option value="Black Cotton Soil (Heavy clay, high P fixation)">Black Cotton Soil (Heavy clay, high P fixation)</option>
                </select>
              </div>

              {/* Soil Test N-P-K & pH */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-emerald-950 block mb-1">N (mg/kg)</label>
                  <input
                    type="number"
                    value={fertilizerInputs.n}
                    onChange={e => setFertilizerInputs({ ...fertilizerInputs, n: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-950 block mb-1">P (mg/kg)</label>
                  <input
                    type="number"
                    value={fertilizerInputs.p}
                    onChange={e => setFertilizerInputs({ ...fertilizerInputs, p: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-950 block mb-1">K (mg/kg)</label>
                  <input
                    type="number"
                    value={fertilizerInputs.k}
                    onChange={e => setFertilizerInputs({ ...fertilizerInputs, k: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-950 block mb-1">Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fertilizerInputs.ph}
                    onChange={e => setFertilizerInputs({ ...fertilizerInputs, ph: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>
              </div>

              <button
                onClick={handleRecalculateFertilizer}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Calculate Precise Prescription</span>
              </button>
            </div>

            {/* Results (Right Column) */}
            <div className="lg:col-span-8 space-y-6">
              {fertilizerResult && (
                <>
                  {/* Deficit Summary Banner */}
                  <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Prescription for {fertilizerResult.fieldAcres} Acre(s)</span>
                        <h4 className="text-2xl font-bold text-emerald-950">{fertilizerResult.cropName}</h4>
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase block">Estimated Fertilizer Cost</span>
                        <span className="text-xl font-extrabold text-emerald-950">₹ {fertilizerResult.totalCost.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Deficit badges */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-xs text-emerald-700 font-semibold block">Nitrogen Deficit</span>
                        <span className="text-base font-extrabold text-emerald-950">{fertilizerResult.nutrientDeficits.nDeficit} kg/ha</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-xs text-emerald-700 font-semibold block">Phosphorus Deficit</span>
                        <span className="text-base font-extrabold text-emerald-950">{fertilizerResult.nutrientDeficits.pDeficit} kg/ha</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-xs text-emerald-700 font-semibold block">Potassium Deficit</span>
                        <span className="text-base font-extrabold text-emerald-950">{fertilizerResult.nutrientDeficits.kDeficit} kg/ha</span>
                      </div>
                    </div>
                  </div>

                  {/* Commercial Bag Prescription Table */}
                  <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs overflow-hidden">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 mb-4 flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-emerald-600" />
                      <span>Commercial Bag Doses & Kilogram Quantities</span>
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-emerald-100 text-xs font-bold text-emerald-900/70 uppercase">
                            <th className="pb-3 px-3">Fertilizer</th>
                            <th className="pb-3 px-3">Quantity</th>
                            <th className="pb-3 px-3">Commercial Bags</th>
                            <th className="pb-3 px-3">Application Timing</th>
                            <th className="pb-3 px-3 text-right">Est. Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50 text-sm">
                          {fertilizerResult.prescriptions.map((item, idx) => (
                            <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                              <td className="py-3.5 px-3 font-bold text-emerald-950">
                                <div>{item.name}</div>
                                <div className="text-xs font-normal text-emerald-700/80 mt-0.5">{item.purpose}</div>
                              </td>
                              <td className="py-3.5 px-3 font-semibold text-emerald-900 whitespace-nowrap">
                                {item.quantityKg} kg
                              </td>
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900">
                                  {item.bags} bag{item.bags > 1 ? 's' : ''} ({item.bagSizeKg}kg)
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-xs text-emerald-800/90 max-w-xs">
                                {item.timing}
                              </td>
                              <td className="py-3.5 px-3 text-right font-bold text-emerald-950 whitespace-nowrap">
                                ₹ {Math.round(item.estimatedCost).toLocaleString()}
                              </td>
                            </tr>
                          ))}

                          {/* Soil Amendments if any */}
                          {fertilizerResult.soilAmendments.map((item, idx) => (
                            <tr key={`amend-${idx}`} className="bg-amber-50/50 hover:bg-amber-50">
                              <td className="py-3.5 px-3 font-bold text-amber-950">
                                <div>{item.name}</div>
                                <div className="text-xs font-normal text-amber-800 mt-0.5">{item.purpose}</div>
                              </td>
                              <td className="py-3.5 px-3 font-semibold text-amber-950 whitespace-nowrap">
                                {item.quantityKg} kg
                              </td>
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-200 text-amber-900">
                                  {item.bags} bag{item.bags > 1 ? 's' : ''} ({item.bagSizeKg}kg)
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-xs text-amber-900 max-w-xs">
                                {item.timing}
                              </td>
                              <td className="py-3.5 px-3 text-right font-bold text-amber-950 whitespace-nowrap">
                                ₹ {Math.round(item.estimatedCost).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Split Application Schedule Timeline */}
                  <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>3-Stage Split Application Schedule</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {fertilizerResult.applicationSchedule.map((stage, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-emerald-700">Stage {idx + 1}</span>
                            <span className="text-[11px] font-semibold text-emerald-800/80">{stage.timing}</span>
                          </div>
                          <h5 className="font-bold text-emerald-950 text-sm mb-2">{stage.stage}</h5>
                          <p className="text-xs text-emerald-900/80 mb-3">{stage.instructions}</p>
                          <div className="space-y-1">
                            {stage.items.map((it, i) => (
                              <div key={i} className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>{it}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SMART IRRIGATION (FAO-56) */}
      {/* ========================================================================= */}
      {activeTab === 'irrigation' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Controls (Left Column) */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-xs space-y-5">
              <h3 className="font-bold text-emerald-950 flex items-center gap-2 border-b border-emerald-50 pb-3">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>Irrigation Inputs</span>
              </h3>

              {/* Crop Selector */}
              <div>
                <label className="text-xs font-bold text-emerald-950 block mb-1">
                  Crop Type
                </label>
                <select
                  value={irrigationInputs.cropKey}
                  onChange={e => setIrrigationInputs({ ...irrigationInputs, cropKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                >
                  {cropsList.map(([key, data]) => (
                    <option key={key} value={key}>{data.name}</option>
                  ))}
                </select>
              </div>

              {/* Growth Stage */}
              <div>
                <label className="text-xs font-bold text-emerald-950 block mb-1">
                  Crop Growth Stage
                </label>
                <select
                  value={irrigationInputs.growthStage}
                  onChange={e => setIrrigationInputs({ ...irrigationInputs, growthStage: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                >
                  <option value="initial">Initial / Seedling (Kc ~ 0.45)</option>
                  <option value="vegetative">Vegetative Canopy Development (Kc ~ 0.85)</option>
                  <option value="flowering">Flowering / Fruit Set (Peak Kc ~ 1.15)</option>
                  <option value="maturity">Ripening & Maturity (Kc ~ 0.65)</option>
                </select>
              </div>

              {/* Weather & Pump */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Ambient Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={irrigationInputs.temperature}
                    onChange={e => setIrrigationInputs({ ...irrigationInputs, temperature: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Recent Rain (mm)
                  </label>
                  <input
                    type="number"
                    value={irrigationInputs.recentRainfallMm}
                    onChange={e => setIrrigationInputs({ ...irrigationInputs, recentRainfallMm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>
              </div>

              {/* Irrigation System & Pump HP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Irrigation Method
                  </label>
                  <select
                    value={irrigationInputs.irrigationMethod}
                    onChange={e => setIrrigationInputs({ ...irrigationInputs, irrigationMethod: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  >
                    <option value="drip">Drip Irrigation (90% Eff.)</option>
                    <option value="sprinkler">Sprinkler (75% Eff.)</option>
                    <option value="surface">Flood/Surface (55% Eff.)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Pump Power (HP)
                  </label>
                  <select
                    value={irrigationInputs.pumpHp}
                    onChange={e => setIrrigationInputs({ ...irrigationInputs, pumpHp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  >
                    <option value={3}>3.0 HP Pump</option>
                    <option value={5}>5.0 HP Pump</option>
                    <option value={7.5}>7.5 HP Pump</option>
                    <option value={10}>10.0 HP Pump</option>
                  </select>
                </div>
              </div>

              {/* Field Acres */}
              <div>
                <label className="text-xs font-bold text-emerald-950 block mb-1">
                  Field Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={irrigationInputs.fieldAcres}
                  onChange={e => setIrrigationInputs({ ...irrigationInputs, fieldAcres: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  min={0.1}
                />
              </div>

              <button
                onClick={handleRecalculateIrrigation}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Droplets className="w-4 h-4" />
                <span>Calculate Water & Pump Runtime</span>
              </button>
            </div>

            {/* Results (Right Column) */}
            <div className="lg:col-span-8 space-y-6">
              {irrigationResult && (
                <>
                  {/* Hero Runtime Card */}
                  <div className="bg-gradient-to-br from-blue-600 via-teal-700 to-emerald-700 text-white p-7 rounded-3xl shadow-lg relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <span className="text-xs uppercase tracking-wider font-bold text-blue-200">
                          Daily Irrigation Schedule ({irrigationInputs.fieldAcres} Acre)
                        </span>
                        <h4 className="text-3xl font-extrabold mt-1">{irrigationResult.cropName}</h4>
                        <p className="text-sm text-teal-100 mt-1">Growth Stage: {irrigationResult.growthStage} (Kc: {irrigationResult.kc})</p>
                      </div>

                      <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[160px]">
                        <span className="text-xs text-blue-100 font-semibold uppercase block">Recommended Pump Runtime</span>
                        <span className="text-2xl font-black tracking-tight">{irrigationResult.pumpRuntimeFormatted}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/20">
                      <div>
                        <span className="text-xs text-blue-200 block">Net Daily Depth</span>
                        <span className="text-lg font-bold">{irrigationResult.netWaterDepthMm} mm/day</span>
                      </div>
                      <div>
                        <span className="text-xs text-blue-200 block">Daily Water Volume</span>
                        <span className="text-lg font-bold">{irrigationResult.dailyVolumeLiters.toLocaleString()} L</span>
                      </div>
                      <div>
                        <span className="text-xs text-blue-200 block">Rainfall Deducted</span>
                        <span className="text-lg font-bold">{irrigationResult.effectiveRainfall} mm</span>
                      </div>
                      <div>
                        <span className="text-xs text-blue-200 block">System Efficiency</span>
                        <span className="text-lg font-bold">{irrigationResult.systemEfficiency}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Water Management Recommendations */}
                  <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800 mb-4 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <span>Agronomic Water Management Guidelines</span>
                    </h4>

                    <div className="space-y-3">
                      {irrigationResult.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-blue-950 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PLANT DOCTOR & CROP ALMANAC */}
      {/* ========================================================================= */}
      {activeTab === 'doctor' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Integrated Pest Management</span>
                <h3 className="text-2xl font-bold text-emerald-950">Crop Doctor & Biological Almanac</h3>
              </div>

              {/* Selector */}
              <div className="min-w-[260px]">
                <label className="text-xs font-bold text-emerald-950 block mb-1">Select Crop to Inspect</label>
                <select
                  value={selectedDoctorCrop}
                  onChange={e => setSelectedDoctorCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                >
                  {cropsList.map(([key, data]) => (
                    <option key={key} value={key}>{data.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Crop Health Card */}
            {agronomyData.crops[selectedDoctorCrop as keyof typeof agronomyData.crops] && (() => {
              const c = agronomyData.crops[selectedDoctorCrop as keyof typeof agronomyData.crops];
              return (
                <div className="space-y-6">
                  
                  {/* Overview banner */}
                  <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-emerald-950">{c.name}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">{c.category}</span>
                    </div>
                    <p className="text-sm text-emerald-900/80 leading-relaxed">{c.desc}</p>
                  </div>

                  {/* Pest, Diseases & Remedies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-red-50/70 border border-red-200">
                      <h4 className="text-sm font-bold text-red-950 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>Common Diseases & Pests</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-red-900/90 leading-relaxed font-medium">
                        {c.common_diseases}
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <h4 className="text-sm font-bold text-emerald-950 mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Prescribed Biological & Chemical Remedies</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed font-medium">
                        {c.disease_remedy}
                      </p>
                    </div>
                  </div>

                  {/* Organic boosters & Fertilizer recipes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <h4 className="text-sm font-bold text-amber-950 mb-2 flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-amber-600" />
                        <span>Organic Farm-Made Boosters</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                        {c.organic_boost}
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200">
                      <h4 className="text-sm font-bold text-teal-950 mb-2 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-teal-600" />
                        <span>Standard Fertilizer Regimen</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-teal-900/90 leading-relaxed font-medium">
                        {c.fertilizer_recipe}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FERTILIZER COST & SUBSIDY ESTIMATOR */}
      {/* ========================================================================= */}
      {activeTab === 'budget' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Financial Planning</span>
                <h3 className="text-2xl font-bold text-emerald-950">Fertilizer Investment & Bag Budget</h3>
                <p className="text-xs text-emerald-700/80 mt-1">Based on current prescription for {fertilizerInputs.fieldAcres} Acre(s)</p>
              </div>

              {/* Subsidy Toggle */}
              <div className="flex items-center gap-3 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950">Govt. Fertilizer Subsidy:</span>
                <button
                  onClick={() => setSubsidyEnabled(!subsidyEnabled)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    subsidyEnabled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {subsidyEnabled ? 'Subsidized MRP (Enabled)' : 'Unsubsidized Market'}
                </button>
              </div>
            </div>

            {/* Calculations Breakdown */}
            {fertilizerResult && (() => {
              const baseCost = fertilizerResult.totalCost;
              const finalCost = subsidyEnabled ? baseCost : Math.round(baseCost * 2.3);
              const costPerAcre = Math.round(finalCost / fertilizerInputs.fieldAcres);

              return (
                <div className="space-y-6">
                  
                  {/* Hero Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Total Investment</span>
                      <span className="text-3xl font-extrabold text-emerald-950 mt-1 block">₹ {finalCost.toLocaleString()}</span>
                      <span className="text-[11px] text-emerald-700 mt-1 block">For {fertilizerInputs.fieldAcres} Acre(s)</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Cost Per Acre</span>
                      <span className="text-3xl font-extrabold text-emerald-950 mt-1 block">₹ {costPerAcre.toLocaleString()}</span>
                      <span className="text-[11px] text-emerald-700 mt-1 block">Average per acre investment</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Total Commercial Bags</span>
                      <span className="text-3xl font-extrabold text-emerald-950 mt-1 block">
                        {fertilizerResult.prescriptions.reduce((acc, it) => acc + it.bags, 0)} Bags
                      </span>
                      <span className="text-[11px] text-emerald-700 mt-1 block">Standard commercial packaging</span>
                    </div>
                  </div>

                  {/* Transparent Bag Price Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-emerald-100 text-xs font-bold text-emerald-900/70 uppercase">
                          <th className="pb-3 px-3">Fertilizer Item</th>
                          <th className="pb-3 px-3">Standard Bag Size</th>
                          <th className="pb-3 px-3">Bags Needed</th>
                          <th className="pb-3 px-3">Total Weight</th>
                          <th className="pb-3 px-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-50 text-sm">
                        {fertilizerResult.prescriptions.map((it, idx) => {
                          const itemCost = subsidyEnabled ? it.estimatedCost : it.estimatedCost * 2.3;
                          return (
                            <tr key={idx} className="hover:bg-emerald-50/30">
                              <td className="py-3 px-3 font-bold text-emerald-950">{it.name}</td>
                              <td className="py-3 px-3 text-emerald-800">{it.bagSizeKg} kg Bag</td>
                              <td className="py-3 px-3 font-extrabold text-emerald-900">{it.bags}</td>
                              <td className="py-3 px-3 text-emerald-800">{it.quantityKg} kg</td>
                              <td className="py-3 px-3 text-right font-bold text-emerald-950">₹ {Math.round(itemCost).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              );
            })()}

          </div>

        </div>
      )}

    </section>
  );
}
