# 🌱 AgroAI: Smart Crop & Fertilizer Precision Decision Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![ICAR & FAO](https://img.shields.io/badge/Standards-ICAR%20%7C%20FAO--56-brightgreen.svg)](https://www.fao.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An Enterprise-Grade, Machine Learning-powered Precision Agriculture Decision Support Platform built with **Next.js**, **TypeScript**, and **Tailwind CSS**. 

**AgroAI** combines multi-vector machine learning algorithms, stoichiometric soil chemistry calculations, dynamic FAO-56 evapotranspiration ($ET_c$) water budgeting, and plain-English agricultural explanations to empower farmers, growers, and agronomists with actionable field decisions.

---

## 🚀 Key Highlights & New Modern Architecture

1. **🎨 High-Converting, Explainable Front Page**:
   - Clear, plain-English breakdown of essential macronutrients (**Nitrogen, Phosphorus, Potassium**) and what symptoms indicate deficiency.
   - Interactive **Soil pH Availability Matrix** illustrating how nutrient absorption locks up below pH 6.0 (acidic) and above pH 7.8 (alkaline).
   - **Soil Texture Dynamics** explaining leaching rates in Sandy Loam vs. Phosphorus fixation in Black Cotton Soils.
   - Prominent **"Get Started"** call-to-action button leading directly to the Interactive Decision Suite.

2. **🚫 Streamlined for High Utility (Confusing Analytics Removed)**:
   - Cluttered charts and abstract graphs (scatter plots, pie charts, pictographs) have been replaced with **pure, actionable decision tools**.
   - Direct answers: What crop to grow, how many commercial 45kg/50kg fertilizer bags to buy, and how many hours to run the water pump.

3. **🌾 5 Core Action-First Agricultural Modules**:
   - **1. Crop Recommendation Engine**: Evaluates soil N, P, K, pH, temperature, humidity, and rainfall against 2,200 verified records with top crop confidence and runner-up alternatives.
   - **2. Stoichiometric Fertilizer Prescription**: Calculates exact nutrient deficits and outputs commercial bag counts for Urea, DAP, MOP, SSP, and Vermicompost with split application schedules.
   - **3. Dynamic Smart Irrigation (FAO-56)**: Daily water volume budgeting in Liters/Acre and pump runtime in hours and minutes.
   - **4. Plant Doctor & Crop Almanac**: Integrated pest management (IPM) guidelines and organic farm-made bio-pesticide formulations for all 22 crop classes.
   - **5. Fertilizer Investment & Subsidy Calculator**: Real-time farm budget estimator with retail vs subsidized price comparisons.

---

## 📊 Dataset & Agronomic Standards

> **Do you need to provide or upload any datasets?**  
> **No!** AgroAI comes completely pre-loaded with verified, authentic datasets out-of-the-box:
> - **`Crop_Recommendation.csv` / `cropDataset.json`**: 2,200 verified agricultural data points across 22 crop classes.
> - **`agronomyData.json`**: Full botanical, climatic, water, and fertilizer recipes for 22 crops.
> - **`cropProfiles.json`**: Statistical means, standard deviations, and quartile benchmarks for Gaussian likelihood matching.
> - **`Fertilizer Chemistry Database`**: Exact N-P-K percentages (Urea 46-0-0, DAP 18-46-0, MOP 0-0-60, SSP 0-16-0) and soil conditioner formulations (Agricultural Lime & Gypsum).

---

## ⚡ Quick Start & Running the Application

### Method 1: 1-Click Batch File (Windows)
Double-click `run_app.bat` in the project root. It will start the Next.js server and automatically open `http://localhost:3000` in your default browser.

### Method 2: Running via Terminal
From the project root:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 📂 Project Directory Structure

```
smart-crop-fertilizer-recommendation-system/
├── agro-ai-web/                  # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # Tailwind CSS v4 styling & glassmorphism
│   │   │   ├── layout.tsx        # Root application layout & metadata
│   │   │   └── page.tsx          # Master page assembling all sections
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Responsive navigation & Get Started CTA
│   │   │   ├── Hero.tsx          # Hero section with value guarantees
│   │   │   ├── ExplainableScience.tsx # Plain-English NPK, pH & Texture guide
│   │   │   ├── HowItWorks.tsx    # 4-step decision pipeline
│   │   │   ├── DecisionWorkspace.tsx # 5 interactive decision modules
│   │   │   ├── SoilGuideFaq.tsx  # Soil sampling protocol & FAQs
│   │   │   └── Footer.tsx        # Agronomy standards & GitHub links
│   │   ├── data/
│   │   │   ├── agronomyData.json # 22 crops and fertilizer database
│   │   │   ├── cropProfiles.json # Feature statistics for ML inference
│   │   │   └── cropDataset.json  # 2,200 verified observation points
│   │   └── lib/
│   │       └── agronomyEngine.ts # Decision algorithms, ML scoring, FAO-56
├── assets/                       # Architectural diagrams & media
├── Crop_Recommendation.csv       # Original verified CSV dataset
├── package.json                  # Root proxy configuration
├── run_app.bat                   # 1-Click Windows execution script
└── README.md                     # Documentation
```

---

## 🛡️ License
Released under the [MIT License](LICENSE). Built for farmers, agronomists, and researchers.
