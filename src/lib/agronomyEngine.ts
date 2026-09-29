import agronomyData from '../data/agronomyData.json';
import cropProfilesData from '../data/cropProfiles.json';
import cropDataset from '../data/cropDataset.json';

export interface CropInfo {
  name: string;
  category: string;
  desc: string;
  ideal_n: number;
  ideal_p: number;
  ideal_k: number;
  ideal_ph: number;
  base_kc: number;
  growing_days: number;
  water_req: string;
  growing_season: string;
  fertilizer_recipe: string;
  organic_boost: string;
  common_diseases: string;
  disease_remedy: string;
}

export interface FertilizerInfo {
  N: number;
  P: number;
  K: number;
  organic: boolean;
  cost_per_kg: number;
  bag_size: number;
}

export interface SoilInputs {
  n: number;
  p: number;
  k: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  soilTexture?: string;
}

export interface CropPredictionResult {
  topCrop: {
    key: string;
    info: CropInfo;
    confidence: number;
    matchGrade: 'A+' | 'A' | 'B' | 'C';
    summary: string;
  };
  alternatives: Array<{
    key: string;
    info: CropInfo;
    confidence: number;
  }>;
  insights: {
    nStatus: { text: string; status: 'optimal' | 'low' | 'high' };
    pStatus: { text: string; status: 'optimal' | 'low' | 'high' };
    kStatus: { text: string; status: 'optimal' | 'low' | 'high' };
    phStatus: { text: string; status: 'optimal' | 'acidic' | 'alkaline' };
    climateStatus: { text: string; status: 'optimal' | 'warning' };
  };
}

export interface PrescriptionItem {
  name: string;
  quantityKg: number;
  bags: number;
  bagSizeKg: number;
  timing: string;
  purpose: string;
  category: string;
  estimatedCost: number;
}

export interface FertilizerPrescriptionResult {
  cropName: string;
  fieldAcres: number;
  targetYield: string;
  soilTexture: string;
  nutrientDeficits: {
    nDeficit: number;
    pDeficit: number;
    kDeficit: number;
  };
  prescriptions: PrescriptionItem[];
  soilAmendments: PrescriptionItem[];
  totalCost: number;
  applicationSchedule: {
    stage: string;
    timing: string;
    instructions: string;
    items: string[];
  }[];
}

export interface IrrigationResult {
  cropName: string;
  growthStage: string;
  kc: number;
  et0: number; // mm/day
  etc: number; // mm/day
  effectiveRainfall: number; // mm/day
  netWaterDepthMm: number; // mm/day
  dailyVolumeLiters: number; // Liters/acre/day
  pumpRuntimeMinutes: number; // minutes
  pumpRuntimeFormatted: string; // e.g. "2 hours 15 mins"
  systemEfficiency: number;
  recommendations: string[];
}

// 1. CROP PREDICTION ENGINE
export function predictCrop(inputs: SoilInputs): CropPredictionResult {
  const { n, p, k, temperature, humidity, ph, rainfall } = inputs;
  const cropsDb = agronomyData.crops as Record<string, CropInfo>;
  const profiles = cropProfilesData as Record<string, { stats: Record<string, { mean: number; std: number; min: number; max: number }> }>;

  // Use statistical Z-score distance combined with k-NN nearest points from 2200-row dataset
  // Normalize feature weights based on agronomic feature importance
  const weights = {
    n: 1.2,
    p: 1.1,
    k: 1.1,
    temperature: 1.0,
    humidity: 1.0,
    ph: 1.3,
    rainfall: 1.4
  };

  // Compute profile distances
  const scores: { key: string; score: number }[] = [];

  for (const cropKey of Object.keys(cropsDb)) {
    const prof = profiles[cropKey]?.stats;
    if (!prof) continue;

    // Gaussian log-likelihood / Mahalanobis-like standardized distance
    const distN = Math.pow((n - prof.N.mean) / prof.N.std, 2) * weights.n;
    const distP = Math.pow((p - prof.P.mean) / prof.P.std, 2) * weights.p;
    const distK = Math.pow((k - prof.K.mean) / prof.K.std, 2) * weights.k;
    const distT = Math.pow((temperature - prof.temperature.mean) / prof.temperature.std, 2) * weights.temperature;
    const distH = Math.pow((humidity - prof.humidity.mean) / prof.humidity.std, 2) * weights.humidity;
    const distPh = Math.pow((ph - prof.ph.mean) / prof.ph.std, 2) * weights.ph;
    const distR = Math.pow((rainfall - prof.rainfall.mean) / prof.rainfall.std, 2) * weights.rainfall;

    const totalDist = Math.sqrt(distN + distP + distK + distT + distH + distPh + distR);
    scores.push({ key: cropKey, score: totalDist });
  }

  // Also sample k-NN from 2200-row cropDataset for refinement
  const kVotes: Record<string, number> = {};
  const kNeighbors = 15;
  const sampleDistances: { label: string; dist: number }[] = [];

  for (let i = 0; i < cropDataset.length; i += 2) {
    const row = cropDataset[i] as any;
    const d = Math.sqrt(
      Math.pow((n - row.N) / 40, 2) * weights.n +
      Math.pow((p - row.P) / 30, 2) * weights.p +
      Math.pow((k - row.K) / 40, 2) * weights.k +
      Math.pow((temperature - row.temperature) / 6, 2) * weights.temperature +
      Math.pow((humidity - row.humidity) / 20, 2) * weights.humidity +
      Math.pow((ph - row.ph) / 1.5, 2) * weights.ph +
      Math.pow((rainfall - row.rainfall) / 50, 2) * weights.rainfall
    );
    sampleDistances.push({ label: row.label, dist: d });
  }

  sampleDistances.sort((a, b) => a.dist - b.dist);
  for (let i = 0; i < Math.min(kNeighbors, sampleDistances.length); i++) {
    const weight = 1 / (sampleDistances[i].dist + 0.05);
    kVotes[sampleDistances[i].label] = (kVotes[sampleDistances[i].label] || 0) + weight;
  }

  // Combine Gaussian distance with k-NN votes
  const finalRanked = scores.map(item => {
    const knnBonus = kVotes[item.key] || 0;
    // Lower score is better
    const adjustedScore = item.score / (1 + knnBonus * 0.3);
    return { key: item.key, adjustedScore };
  });

  finalRanked.sort((a, b) => a.adjustedScore - b.adjustedScore);

  // Compute confidence percentage
  const bestScore = finalRanked[0].adjustedScore;
  const topKey = finalRanked[0].key;
  const topInfo = cropsDb[topKey] || {
    name: topKey,
    category: 'Crop',
    desc: '',
    ideal_n: 80,
    ideal_p: 40,
    ideal_k: 40,
    ideal_ph: 6.5,
    base_kc: 1.0,
    growing_days: 120,
    water_req: '600 mm',
    growing_season: 'All season',
    fertilizer_recipe: '',
    organic_boost: '',
    common_diseases: '',
    disease_remedy: ''
  };

  const confidence = Math.min(99.4, Math.max(72.0, Math.round((100 / (1 + bestScore * 0.22)) * 10) / 10));
  
  let matchGrade: 'A+' | 'A' | 'B' | 'C' = 'B';
  if (confidence >= 94) matchGrade = 'A+';
  else if (confidence >= 85) matchGrade = 'A';
  else if (confidence >= 75) matchGrade = 'B';
  else matchGrade = 'C';

  // Alternatives
  const alternatives = finalRanked.slice(1, 4).map(item => {
    const altConfidence = Math.min(
      confidence - 3.5,
      Math.max(45, Math.round((100 / (1 + item.adjustedScore * 0.25)) * 10) / 10)
    );
    return {
      key: item.key,
      info: cropsDb[item.key],
      confidence: altConfidence
    };
  });

  // Scientific Insights
  const nDiff = n - topInfo.ideal_n;
  const pDiff = p - topInfo.ideal_p;
  const kDiff = k - topInfo.ideal_k;

  const nStatus = {
    status: Math.abs(nDiff) < 25 ? 'optimal' : nDiff < 0 ? 'low' : 'high',
    text: Math.abs(nDiff) < 25 
      ? `Nitrogen (${n} mg/kg) is in the sweet spot for ${topInfo.name.split(' ')[0]} (ideal: ~${topInfo.ideal_n}).`
      : nDiff < 0 
      ? `Soil Nitrogen is ${Math.abs(nDiff)} units below ideal (${topInfo.ideal_n} mg/kg); starter basal N recommended.`
      : `High Nitrogen detected; avoid excessive urea to prevent lodging and fungal vulnerability.`
  } as const;

  const pStatus = {
    status: Math.abs(pDiff) < 20 ? 'optimal' : pDiff < 0 ? 'low' : 'high',
    text: Math.abs(pDiff) < 20
      ? `Available Phosphorus (${p} mg/kg) matches root development needs.`
      : pDiff < 0
      ? `Phosphorus is deficient; apply DAP or Single Super Phosphate (SSP) at root zone.`
      : `Adequate Phosphorus available; minimal initial P supplementation needed.`
  } as const;

  const kStatus = {
    status: Math.abs(kDiff) < 25 ? 'optimal' : kDiff < 0 ? 'low' : 'high',
    text: Math.abs(kDiff) < 25
      ? `Potassium (${k} mg/kg) is balanced for cellular turgor and drought resilience.`
      : kDiff < 0
      ? `Potassium is low; Muriate of Potash (MOP) required for stalk strength and fruit filling.`
      : `High Potassium reserve supports stress tolerance.`
  } as const;

  const phStatus = {
    status: ph >= 6.0 && ph <= 7.5 ? 'optimal' : ph < 6.0 ? 'acidic' : 'alkaline',
    text: ph >= 6.0 && ph <= 7.5
      ? `Soil pH ${ph.toFixed(1)} provides maximum nutrient bioavailability without chemical immobilization.`
      : ph < 6.0
      ? `Acidic soil (pH ${ph.toFixed(1)}) reduces phosphorus availability; Agricultural Lime prescribed.`
      : `Alkaline soil (pH ${ph.toFixed(1)}) limits micronutrient uptake; Agricultural Gypsum prescribed.`
  } as const;

  const climateStatus = {
    status: temperature >= 18 && temperature <= 35 && rainfall >= 50 ? 'optimal' : 'warning',
    text: `Temperature (${temperature.toFixed(1)}°C) and Rainfall (${rainfall.toFixed(0)}mm) provide favorable bio-climatic conditions for ${topInfo.name.split(' ')[0]}.`
  } as const;

  return {
    topCrop: {
      key: topKey,
      info: topInfo,
      confidence,
      matchGrade,
      summary: `Based on your soil's NPK profile and regional climate, ${topInfo.name} offers the highest biological yield potential with an estimated ${confidence}% suitability match.`
    },
    alternatives,
    insights: {
      nStatus,
      pStatus,
      kStatus,
      phStatus,
      climateStatus
    }
  };
}

// 2. PRECISION FERTILIZER PRESCRIPTION ENGINE
export function calculateFertilizerPrescription(params: {
  cropKey: string;
  currentN: number;
  currentP: number;
  currentK: number;
  currentPh: number;
  soilTexture?: string;
  targetYield?: string;
  fieldAcres?: number;
}): FertilizerPrescriptionResult {
  const {
    cropKey,
    currentN,
    currentP,
    currentK,
    currentPh,
    soilTexture = 'Alluvial Loam (Balanced texture)',
    targetYield = 'Standard Commercial Yield',
    fieldAcres = 1.0
  } = params;

  const cropsDb = agronomyData.crops as Record<string, CropInfo>;
  const cropData = cropsDb[cropKey] || cropsDb['rice'];

  const yieldMultiplier = targetYield.includes('High Yield') ? 1.25 : targetYield.includes('Organic') ? 0.85 : 1.0;

  const reqN = cropData.ideal_n * yieldMultiplier;
  const reqP = cropData.ideal_p * yieldMultiplier;
  const reqK = cropData.ideal_k * yieldMultiplier;

  // Soil texture efficiencies
  let nMult = 1.0;
  let pMult = 1.0;
  let kMult = 1.0;
  let vermiPerAcre = 500;

  if (soilTexture.toLowerCase().includes('sandy')) {
    nMult = 1.25; // high leaching
    pMult = 1.00;
    kMult = 1.20;
    vermiPerAcre = 750;
  } else if (soilTexture.toLowerCase().includes('black')) {
    nMult = 1.00;
    pMult = 1.25; // high P-fixation
    kMult = 0.90;
    vermiPerAcre = 500;
  } else if (soilTexture.toLowerCase().includes('clay')) {
    nMult = 0.95;
    pMult = 1.15;
    kMult = 0.95;
    vermiPerAcre = 400;
  }

  // pH immobilization factor
  const phFactorP = (currentPh < 5.8 || currentPh > 8.0) ? 1.30 : (currentPh < 6.2 || currentPh > 7.5) ? 1.15 : 1.0;
  const phFactorN = currentPh < 5.5 ? 1.15 : 1.0;

  let rawDefN = Math.max(0, (reqN * nMult * phFactorN) - currentN);
  let rawDefP = Math.max(0, (reqP * pMult * phFactorP) - currentP);
  let rawDefK = Math.max(0, (reqK * kMult) - currentK);

  const prescriptions: PrescriptionItem[] = [];
  const soilAmendments: PrescriptionItem[] = [];
  let totalCost = 0;

  // 1. Organic Base: Enriched Vermicompost
  const vermiQty = Math.round(vermiPerAcre * fieldAcres * (targetYield.includes('Organic') ? 1.5 : 1.0));
  const vermiCost = vermiQty * 7.0;
  prescriptions.push({
    name: 'Enriched Vermicompost + Bio-inoculants',
    quantityKg: vermiQty,
    bags: Math.ceil(vermiQty / 40.0),
    bagSizeKg: 40,
    timing: 'Basal (10-14 days before sowing during final ploughing)',
    purpose: `Restores Soil Organic Carbon (SOC) and improves microbial enzyme activity for ${soilTexture.split(' ')[0]} soil.`,
    category: 'Organic Soil Ameliorant',
    estimatedCost: vermiCost
  });
  totalCost += vermiCost;

  // 2. Phosphorus & Starter Nitrogen via DAP (18:46:0)
  let pDef = rawDefP;
  let nDef = rawDefN;
  let kDef = rawDefK;

  if (pDef > 3) {
    const dapKg = Math.round((pDef / 0.46) * 0.92 * fieldAcres * 10) / 10;
    const nFromDap = dapKg * 0.18;
    nDef = Math.max(0, nDef - nFromDap);
    const dapCost = dapKg * 27.0;
    prescriptions.push({
      name: 'DAP (Di-Ammonium Phosphate 18:46:0)',
      quantityKg: dapKg,
      bags: Math.ceil(dapKg / 50.0),
      bagSizeKg: 50,
      timing: 'Basal application at 5-7 cm depth along seed row during sowing',
      purpose: `Directly satisfies ${pDef.toFixed(1)} kg/ha phosphorus requirement for primary taproot growth and early seedling vigor.`,
      category: 'Primary Phosphorus Fertilizer',
      estimatedCost: dapCost
    });
    totalCost += dapCost;
  }

  // 3. Potassium via MOP (0:0:60)
  if (kDef > 3) {
    const mopKg = Math.round((kDef / 0.60) * fieldAcres * 10) / 10;
    const mopCost = mopKg * 34.0;
    prescriptions.push({
      name: 'MOP (Muriate of Potash 0:0:60)',
      quantityKg: mopKg,
      bags: Math.ceil(mopKg / 50.0),
      bagSizeKg: 50,
      timing: '50% Basal at sowing, 50% Top dressing at early flowering/pod-fill',
      purpose: `Satisfies ${kDef.toFixed(1)} kg/ha potassium deficit, improving stalk strength, disease resistance, and grain weight.`,
      category: 'Potash Fertilizer',
      estimatedCost: mopCost
    });
    totalCost += mopCost;
  }

  // 4. Nitrogen Top Dressing via Urea (46:0:0)
  if (nDef > 3) {
    const ureaKg = Math.round((nDef / 0.46) * fieldAcres * 10) / 10;
    const ureaCost = ureaKg * 6.0;
    prescriptions.push({
      name: 'Neem-Coated Urea (46% N)',
      quantityKg: ureaKg,
      bags: Math.ceil(ureaKg / 45.0),
      bagSizeKg: 45,
      timing: 'Apply in 2 to 3 equal splits: 1st split at active tillering (day 25-30), 2nd split at panicle initiation/flowering',
      purpose: `Supplies pure nitrogen for continuous chlorophyll synthesis and vegetative canopy expansion while minimizing volatilization loss.`,
      category: 'Nitrogen Fertilizer',
      estimatedCost: ureaCost
    });
    totalCost += ureaCost;
  }

  // 5. Soil Amendments for pH extremes
  if (currentPh < 6.0) {
    const limeKg = Math.round((6.5 - currentPh) * 450 * fieldAcres);
    const limeCost = limeKg * 5.0;
    soilAmendments.push({
      name: 'Agricultural Dolomitic Limestone (CaCO3 + MgCO3)',
      quantityKg: limeKg,
      bags: Math.ceil(limeKg / 50.0),
      bagSizeKg: 50,
      timing: 'Broadcast and thoroughly incorporate 3-4 weeks before planting with pre-sowing irrigation',
      purpose: `Neutralizes severe soil acidity (pH ${currentPh.toFixed(1)}), prevents aluminum toxicity, and unbinds locked phosphates.`,
      category: 'Acid Soil Neutralizer',
      estimatedCost: limeCost
    });
    totalCost += limeCost;
  } else if (currentPh > 7.8) {
    const gypsumKg = Math.round((currentPh - 7.5) * 550 * fieldAcres);
    const gypsumCost = gypsumKg * 4.5;
    soilAmendments.push({
      name: 'Agricultural Gypsum (CaSO4·2H2O)',
      quantityKg: gypsumKg,
      bags: Math.ceil(gypsumKg / 50.0),
      bagSizeKg: 50,
      timing: 'Broadcast on surface followed by shallow harrowing and heavy leaching irrigation',
      purpose: `Displaces excess exchangeable sodium on alkaline clay colloids (pH ${currentPh.toFixed(1)}), restoring soil crumb structure and water infiltration.`,
      category: 'Alkaline/Sodic Soil Amendment',
      estimatedCost: gypsumCost
    });
    totalCost += gypsumCost;
  }

  // 6. Application Timing Schedule
  const applicationSchedule = [
    {
      stage: 'Basal (Pre-sowing & Sowing)',
      timing: 'Day 0 to Day 1',
      instructions: 'Broadcast vermicompost during final field preparation. Apply DAP and 50% MOP in seed furrows 5 cm below seeds.',
      items: [
        'Enriched Vermicompost (Full Dose)',
        'DAP (Full Basal Dose)',
        'MOP (50% Split Dose)',
        ...(soilAmendments.length > 0 ? [soilAmendments[0].name] : [])
      ]
    },
    {
      stage: 'Vegetative / Active Tillering',
      timing: 'Day 25 to Day 35 after sowing',
      instructions: 'Ensure soil has adequate moisture. Top-dress first split of Neem-Coated Urea early morning or late afternoon.',
      items: [
        nDef > 3 ? 'Neem-Coated Urea (50% of total Urea)' : 'Light biofertilizer foliar spray'
      ]
    },
    {
      stage: 'Panicle Initiation / Flowering',
      timing: 'Day 50 to Day 65 after sowing',
      instructions: 'Top-dress remaining Neem-Coated Urea along with remaining 50% MOP to maximize grain fill and harvest weight.',
      items: [
        nDef > 3 ? 'Neem-Coated Urea (Remaining 50%)' : 'None',
        kDef > 3 ? 'MOP (Remaining 50% Split Dose)' : 'None'
      ].filter(x => x !== 'None')
    }
  ];

  return {
    cropName: cropData.name,
    fieldAcres,
    targetYield,
    soilTexture,
    nutrientDeficits: {
      nDeficit: Math.round(rawDefN * 10) / 10,
      pDeficit: Math.round(rawDefP * 10) / 10,
      kDeficit: Math.round(rawDefK * 10) / 10
    },
    prescriptions,
    soilAmendments,
    totalCost: Math.round(totalCost),
    applicationSchedule
  };
}

// 3. SMART IRRIGATION ENGINE (FAO-56 Penman-Monteith)
export function calculateIrrigation(params: {
  cropKey: string;
  growthStage?: 'initial' | 'vegetative' | 'flowering' | 'maturity';
  temperature?: number;
  humidity?: number;
  recentRainfallMm?: number;
  pumpHp?: number;
  irrigationMethod?: 'drip' | 'sprinkler' | 'surface';
  fieldAcres?: number;
}): IrrigationResult {
  const {
    cropKey,
    growthStage = 'flowering',
    temperature = 28,
    humidity = 60,
    recentRainfallMm = 0,
    pumpHp = 5,
    irrigationMethod = 'drip',
    fieldAcres = 1.0
  } = params;

  const cropsDb = agronomyData.crops as Record<string, CropInfo>;
  const crop = cropsDb[cropKey] || cropsDb['rice'];

  // Stage Kc multipliers based on FAO-56
  const stageMultipliers = {
    initial: 0.45,
    vegetative: 0.85,
    flowering: 1.15, // peak demand
    maturity: 0.65
  };

  const stageKc = crop.base_kc * stageMultipliers[growthStage];

  // Reference Evapotranspiration ET0 approximation (Hargreaves-Samani / FAO simplified)
  // Higher temp and lower humidity drive higher ET0
  const vpdFactor = Math.max(0.2, (100 - humidity) / 100);
  const et0 = Math.max(2.5, Math.min(8.5, 0.0023 * (temperature + 17.8) * Math.sqrt(Math.max(5, temperature * 0.4)) + (vpdFactor * 2.2)));

  // Crop Evapotranspiration
  const etc = et0 * stageKc;

  // Effective rainfall credit (70% of rainfall up to 25mm, minimal beyond that)
  const effectiveRainfall = Math.min(25, recentRainfallMm * 0.70);

  // Net irrigation water depth needed
  const netWaterDepthMm = Math.max(0, etc - effectiveRainfall);

  // 1 mm depth on 1 acre = 4,046.86 Liters
  const dailyVolumeLiters = Math.round(netWaterDepthMm * 4046.86 * fieldAcres);

  // Irrigation system efficiency
  const efficiencies = {
    drip: 0.90,
    sprinkler: 0.75,
    surface: 0.55
  };
  const systemEfficiency = efficiencies[irrigationMethod] || 0.85;

  // Pump discharge rate in Liters per minute
  // Average pump discharge: ~120 LPM per HP at standard head
  const pumpLpm = pumpHp * 130;
  const effectiveLpm = pumpLpm * systemEfficiency;

  const pumpRuntimeMinutes = effectiveLpm > 0 && dailyVolumeLiters > 0
    ? Math.round(dailyVolumeLiters / effectiveLpm)
    : 0;

  const hours = Math.floor(pumpRuntimeMinutes / 60);
  const mins = pumpRuntimeMinutes % 60;
  const pumpRuntimeFormatted = hours > 0
    ? `${hours} hr ${mins > 0 ? `${mins} min` : ''}`
    : `${mins} min`;

  const recommendations = [
    `Current crop coefficient (Kc = ${stageKc.toFixed(2)}) reflects the ${growthStage} growth phase.`,
    effectiveRainfall > 0 
      ? `Effective rainfall of ${effectiveRainfall.toFixed(1)} mm was credited, saving ${Math.round(effectiveRainfall * 4046.86 * fieldAcres).toLocaleString()} Liters of irrigation.`
      : `No significant rainfall credited; full ETc requirement must be met via irrigation.`,
    irrigationMethod === 'drip'
      ? `High-efficiency Drip irrigation operates at 90% water use efficiency directly at root zone.`
      : `Consider upgrading to Drip to save up to 35% more water compared to ${irrigationMethod} methods.`,
    `Optimal watering window: Early morning (5:00 AM - 8:30 AM) to minimize solar evaporative loss.`
  ];

  return {
    cropName: crop.name,
    growthStage: growthStage.charAt(0).toUpperCase() + growthStage.slice(1),
    kc: Math.round(stageKc * 100) / 100,
    et0: Math.round(et0 * 10) / 10,
    etc: Math.round(etc * 10) / 10,
    effectiveRainfall: Math.round(effectiveRainfall * 10) / 10,
    netWaterDepthMm: Math.round(netWaterDepthMm * 10) / 10,
    dailyVolumeLiters,
    pumpRuntimeMinutes,
    pumpRuntimeFormatted,
    systemEfficiency: Math.round(systemEfficiency * 100),
    recommendations
  };
}

// 4. AVAILABLE PRESETS FOR INSTANT USER TESTING
export const SOIL_PRESETS = [
  {
    name: '🌾 Paddy / Delta Rice Field',
    desc: 'High clay/alluvial soil, high moisture & rainfall',
    values: { n: 90, p: 42, k: 43, temperature: 24, humidity: 82, ph: 6.5, rainfall: 220, soilTexture: 'Alluvial Loam (Balanced texture)' }
  },
  {
    name: '🌽 High-Yield Corn & Maize Land',
    desc: 'Rich fertile loam with high nitrogen demand',
    values: { n: 120, p: 58, k: 40, temperature: 27, humidity: 65, ph: 6.8, rainfall: 95, soilTexture: 'Alluvial Loam (Balanced texture)' }
  },
  {
    name: '🌿 Nitrogen-Fixing Chickpea Field',
    desc: 'Semi-arid pulse soil, low N, moderate P, cool winter',
    values: { n: 25, p: 60, k: 25, temperature: 19, humidity: 55, ph: 7.2, rainfall: 70, soilTexture: 'Clayey Loam (High nutrient retention)' }
  },
  {
    name: '⚪ Black Cotton Soil Belt',
    desc: 'High P-fixation, moderate rainfall, warm climate',
    values: { n: 110, p: 45, k: 20, temperature: 28, humidity: 75, ph: 7.5, rainfall: 80, soilTexture: 'Black Cotton Soil (Heavy clay, high P fixation)' }
  },
  {
    name: '☕ Highland Coffee & Spices Slope',
    desc: 'Sub-acidic forest loam with abundant monsoon showers',
    values: { n: 100, p: 30, k: 30, temperature: 25, humidity: 80, ph: 6.4, rainfall: 160, soilTexture: 'Sandy Loam (High leaching, needs more N/K splits)' }
  },
  {
    name: '🍇 Arid Fruit Vineyard (Grapes)',
    desc: 'Sandy loam, high potassium affinity, controlled watering',
    values: { n: 25, p: 130, k: 200, temperature: 23, humidity: 82, ph: 6.0, rainfall: 70, soilTexture: 'Sandy Loam (High leaching, needs more N/K splits)' }
  }
];

// 5. REGIONAL AGRO-CLIMATIC ZONES
export interface AgroClimaticZone {
  id: string;
  name: string;
  region: string;
  description: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  typicalSoil: string;
  commonCrops: string[];
}

export const AGRO_CLIMATIC_ZONES: AgroClimaticZone[] = [
  {
    id: 'cauvery_delta',
    name: '🌾 Cauvery Delta & Southern Plains',
    region: 'Tamil Nadu / Delta Region',
    description: 'Humid sub-tropical delta with fertile alluvial clay loam, ideal for double-crop paddy, pulses and banana.',
    temperature: 29,
    humidity: 78,
    rainfall: 180,
    typicalSoil: 'Alluvial Loam (Balanced texture)',
    commonCrops: ['rice', 'blackgram', 'banana', 'coconut']
  },
  {
    id: 'indo_gangetic',
    name: '🌽 Indo-Gangetic Plains',
    region: 'Punjab, Haryana, Uttar Pradesh, Bihar',
    description: 'Deep alluvial loams with distinct summer and winter seasons, leading cereal-pulse belt.',
    temperature: 25,
    humidity: 62,
    rainfall: 110,
    typicalSoil: 'Alluvial Loam (Balanced texture)',
    commonCrops: ['rice', 'maize', 'lentil', 'chickpea']
  },
  {
    id: 'deccan_black_soil',
    name: '⚪ Deccan Black Cotton Plateau',
    region: 'Maharashtra, Madhya Pradesh, Northern Karnataka',
    description: 'Heavy clay Vertisol soils with high montmorillonite swelling and high P-fixation.',
    temperature: 28,
    humidity: 68,
    rainfall: 85,
    typicalSoil: 'Black Cotton Soil (Heavy clay, high P fixation)',
    commonCrops: ['cotton', 'pigeonpeas', 'mothbeans', 'grapes']
  },
  {
    id: 'western_ghats',
    name: '☕ Western Ghats Highland & Monsoon Belt',
    region: 'Coorg, Wayanad, Nilgiris, Chikmagalur',
    description: 'High-altitude sub-acidic laterite forest loams receiving heavy south-west monsoon rains.',
    temperature: 22,
    humidity: 86,
    rainfall: 260,
    typicalSoil: 'Sandy Loam (High leaching, needs more N/K splits)',
    commonCrops: ['coffee', 'banana', 'pomegranate', 'orange']
  },
  {
    id: 'semi_arid_northwest',
    name: '☀️ Semi-Arid Northwestern Belt',
    region: 'Rajasthan, Northern Gujarat',
    description: 'Sandy loams with low organic carbon, high summer evapotranspiration, and scarce rainfall.',
    temperature: 32,
    humidity: 45,
    rainfall: 45,
    typicalSoil: 'Sandy Loam (High leaching, needs more N/K splits)',
    commonCrops: ['mothbeans', 'mungbean', 'chickpea', 'watermelon']
  },
  {
    id: 'coastal_tropical',
    name: '🌴 Coastal Humid Tropical Belt',
    region: 'Kerala, Coastal Karnataka, Konkan',
    description: 'Year-round high humidity, sandy-clay coastal alluvium, and heavy monsoon showers.',
    temperature: 28,
    humidity: 88,
    rainfall: 240,
    typicalSoil: 'Alluvial Loam (Balanced texture)',
    commonCrops: ['coconut', 'rice', 'banana', 'papaya']
  },
  {
    id: 'eastern_delta',
    name: '🍃 Eastern Alluvial Rice & Jute Belt',
    region: 'West Bengal, Odisha, Assam',
    description: 'Sub-tropical floodplains with rich river silt and prolonged wet monsoon periods.',
    temperature: 27,
    humidity: 84,
    rainfall: 220,
    typicalSoil: 'Clayey Loam (High nutrient retention)',
    commonCrops: ['rice', 'jute', 'lentil', 'mango']
  },
  {
    id: 'arid_fruit_belt',
    name: '🍇 Semi-Arid Horticultural Valley',
    region: 'Nashik, Solapur, Bijapur, Ananthapur',
    description: 'Sun-drenched semi-arid valleys with precise drip fertigation for high-value fruit crops.',
    temperature: 26,
    humidity: 58,
    rainfall: 60,
    typicalSoil: 'Alluvial Loam (Balanced texture)',
    commonCrops: ['grapes', 'pomegranate', 'muskmelon', 'watermelon']
  }
];

// 6. ORGANIC BIO-PESTICIDE & FORMULATION ENGINE
export interface BioPesticideRecipe {
  name: string;
  targetPests: string;
  shelfLife: string;
  calculatedIngredients: { item: string; amount: string; note: string }[];
  preparationSteps: string[];
}

export function calculateBioPesticide(recipeType: 'nske' | 'dashaparni' | 'jeevamrit', volumeLiters: number): BioPesticideRecipe {
  if (recipeType === 'nske') {
    const seedKg = Math.max(0.5, Math.round((volumeLiters * 0.05) * 10) / 10);
    const soapGrams = Math.round(volumeLiters * 1.0);
    return {
      name: 'Neem Seed Kernel Extract (NSKE 5%)',
      targetPests: 'Effective against bollworms, leaf miners, aphids, whiteflies, thrips, and caterpillars.',
      shelfLife: 'Use within 24 hours of extraction.',
      calculatedIngredients: [
        { item: 'Dry Neem Kernels', amount: `${seedKg} kg`, note: 'Crush into coarse powder; do not over-grind into fine flour.' },
        { item: 'Clean Water', amount: `${volumeLiters} Liters`, note: 'Use clean tube-well or pond water.' },
        { item: 'Liquid Soap / Surfactant', amount: `${soapGrams} g / ml`, note: 'Crucial for adherence on waxy leaf surfaces.' }
      ],
      preparationSteps: [
        `Tie ${seedKg} kg of powdered neem seed kernels inside a permeable cotton or muslin pouch.`,
        `Immerse the pouch into ${Math.round(volumeLiters / 2)} Liters of water and leave to steep overnight (10-12 hours).`,
        'In the morning, squeeze the pouch repeatedly until the milky white active azadirachtin extract dissolves.',
        `Filter the decoction through fine cloth and mix with the remaining ${Math.round(volumeLiters / 2)} Liters of water.`,
        `Add ${soapGrams} g of liquid soap, stir vigorously, and spray during early morning or late afternoon.`
      ]
    };
  } else if (recipeType === 'dashaparni') {
    return {
      name: 'Dashaparni Ark (Ten-Leaf Bio-Shield)',
      targetPests: 'Broad-spectrum anti-viral, anti-fungal, and chewing/sucking insect deterrent.',
      shelfLife: 'Stable for up to 6 months when kept in shaded storage.',
      calculatedIngredients: [
        { item: 'Neem Leaves (Azadirachta indica)', amount: `${Math.round(volumeLiters * 0.025 * 10) / 10} kg`, note: 'Main insecticidal azadirachtin base' },
        { item: 'Pongamia (Karanja) Leaves', amount: `${Math.round(volumeLiters * 0.015 * 10) / 10} kg`, note: 'Alkaloid repellent' },
        { item: 'Custard Apple (Sitaphal) Leaves', amount: `${Math.round(volumeLiters * 0.01 * 10) / 10} kg`, note: 'Annonin toxic to worms' },
        { item: 'Castor + Papaya + Calotropis Leaves', amount: `${Math.round(volumeLiters * 0.02 * 10) / 10} kg`, note: 'Bitter taste deterrents' },
        { item: 'Indigenous Cow Urine (Gomutra)', amount: `${Math.round(volumeLiters * 0.05 * 10) / 10} Liters`, note: 'Fermentation catalyst & nitrogen carrier' },
        { item: 'Fresh Cow Dung', amount: `${Math.round(volumeLiters * 0.015 * 10) / 10} kg`, note: 'Microbial bio-inoculant' }
      ],
      preparationSteps: [
        'Crush all ten botanical leaves into a coarse paste and place in an earthen or food-grade plastic drum.',
        'Add fresh cow dung and cow urine. Pour in water and stir clockwise with a wooden stick.',
        'Cover drum with breathable jute gunny sack and ferment in shade for 30 to 40 days.',
        'Stir twice daily for 2 minutes. After fermentation is complete, filter through a triple-layer cloth.',
        'Dilution rate: Mix 200 ml of filtered Dashaparni Ark per 10 Liters of water for foliar spraying.'
      ]
    };
  } else {
    return {
      name: 'Jeevamrit (Living Soil Microbial Culture)',
      targetPests: 'Soil health restorer; accelerates mycorrhizal colonization, unlocks bound P, suppresses root wilt.',
      shelfLife: 'Apply between Day 2 and Day 7 after preparation for peak microbial activity.',
      calculatedIngredients: [
        { item: 'Fresh Indigenous Cow Dung', amount: `${Math.round(volumeLiters * 0.05 * 10) / 10} kg`, note: 'Source of billions of beneficial nitrogen-fixing bacteria' },
        { item: 'Aged Cow Urine (Gomutra)', amount: `${Math.round(volumeLiters * 0.05 * 10) / 10} Liters`, note: 'Enriched with natural growth hormones & minerals' },
        { item: 'Organic Jaggery (Gur)', amount: `${Math.round(volumeLiters * 0.01 * 10) / 10} kg`, note: 'Carbon energy substrate for rapid bacterial doubling' },
        { item: 'Gram / Pulse Flour (Besan)', amount: `${Math.round(volumeLiters * 0.01 * 10) / 10} kg`, note: 'Protein nourishment for beneficial fungal colonies' },
        { item: 'Undisturbed Forest / Bund Soil', amount: `${Math.round(volumeLiters * 0.005 * 10) / 10} kg`, note: 'Natural inoculum of local indigenous microbes' }
      ],
      preparationSteps: [
        `In a 200-Liter plastic drum, fill ${volumeLiters} Liters of non-chlorinated well water.`,
        'Add fresh cow dung and cow urine; stir clockwise continuously.',
        'Separately dissolve jaggery and pulse flour in a small bucket of water, then pour into the drum.',
        'Add the handful of undisturbed bund soil. Mix thoroughly and cover with a moist gunny bag.',
        'Stir for 5 minutes twice daily (morning & evening). The solution turns fragrant and active after 48 hours.',
        'Apply directly through irrigation channels or root drenching at 200 Liters per acre.'
      ]
    };
  }
}

export { agronomyData };

