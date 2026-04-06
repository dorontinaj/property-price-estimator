# Property Price Estimator 🏠

A web application for estimating real estate prices in the Belgian market. Users input property details and receive instant valuations powered by multiple machine learning models running entirely in the browser.

## Features

- **Instant Price Estimation** — Get a predicted property value based on location, size, construction year, number of bedrooms, and more
- **Multiple ML Algorithms** — Compare estimates from Linear Regression, K-Nearest Neighbors, Decision Tree, and Random Forest models side by side
- **Neural Network Mode** — A dedicated TensorFlow.js-powered neural network trained specifically on Belgian municipal property data
- **Prediction History** — Session-scoped history of previous estimates with key property details
- **Methodology & Algorithm Pages** — Explanations of the data science and modeling techniques used under the hood

## Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | React 18 + Vite                   |
| Routing          | TanStack Router (type-safe)       |
| State Management | Zustand                           |
| ML Engine        | TensorFlow.js (browser inference) |
| UI Components    | shadcn/ui + Radix UI              |
| Styling          | Tailwind CSS                      |
| Language         | TypeScript                        |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd property-price-estimator
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
├── components/
│   ├── features/estimator/   # PropertyForm, PredictionResults, HelpSheet
│   ├── layout/               # AppNavbar, AppFooter
│   └── ui/                   # shadcn/ui component library
├── lib/
│   ├── ml-helpers.ts         # Simulated ML algorithm implementations
│   ├── types.ts              # Core data types and Belgian municipality constants
│   └── utils.ts
├── ml/
│   └── belgiumPriceModel.ts  # TensorFlow.js model loader with fallback estimator
├── routes/
│   ├── index.tsx             # Main estimator page
│   ├── neural-network.tsx    # TensorFlow.js model page
│   ├── algorithms.tsx        # Algorithm comparison page
│   └── methodology.tsx       # Data methodology page
└── stores/
    └── prediction-store.ts   # Zustand store for prediction history
public/
└── models/
    └── belgium-price/        # Serialized TensorFlow.js graph model
```

## Machine Learning

### Neural Network

The TensorFlow.js model (`public/models/belgium-price/model.json`) uses a feedforward architecture:

- **Input:** 12 features (living area, lot size, bedrooms, construction year, postal code, energy label, etc.)
- **Hidden layers:** 64 → 32 → 16 units
- **Output:** Log-transformed price (converted back to EUR)

If the model cannot be loaded (e.g., browser compatibility), the app falls back to a formula-based estimator using city-specific multipliers and feature weights.

### Simulated Algorithms

`src/lib/ml-helpers.ts` simulates the behavior of classic ML algorithms to give users a comparative perspective across modelling approaches.

## Available Scripts

| Script            | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start development server  |
| `npm run build`   | Build for production      |
| `npm run preview` | Preview production build  |
| `npm run lint`    | Run ESLint                |
| `npm run format`  | Format code with Prettier |

## Notes

- All ML inference runs client-side — no data is sent to a server
- Property price estimates are for illustrative/educational purposes and should not be used as formal valuations
- The model was trained on Belgian real estate data; results outside Belgium will be inaccurate
