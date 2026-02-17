import type { Property, Prediction } from "@/lib/types"

// Prediction function that simulates different ML models
export async function getPrediction(
  property: Property,
  modelId: string
): Promise<Prediction> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Base price calculation (simplified model for other algorithms)
  let basePrice = 150000

  // Location factors (simplified)
  const locationMultipliers: Record<string, number> = {
    brussels: 1.8,
    antwerp: 1.4,
    ghent: 1.3,
    bruges: 1.35,
    liege: 1.1,
    leuven: 1.5,
    namur: 1.15,
    mons: 0.95,
    mechelen: 1.25,
    aalst: 1.1,
    hasselt: 1.15,
    charleroi: 0.85,
    kortrijk: 1.1,
    ostend: 1.2,
    tournai: 0.9,
  }

  const locationMultiplier = locationMultipliers[property.municipality] || 1.0
  basePrice *= locationMultiplier

  // Living area impact (price per m2 varies by location)
  const pricePerM2 = 2500 * locationMultiplier
  basePrice = property.livingArea * pricePerM2

  // Lot area bonus
  if (property.lotArea) {
    basePrice += property.lotArea * 150
  }

  // Room adjustments
  if (property.bedrooms) {
    basePrice += property.bedrooms * 15000
  }
  if (property.bathrooms) {
    basePrice += property.bathrooms * 10000
  }

  // Age depreciation/appreciation
  if (property.yearBuilt) {
    const age = new Date().getFullYear() - property.yearBuilt
    if (age < 5) {
      basePrice *= 1.1 // New construction premium
    } else if (age > 50) {
      basePrice *= 0.9 // Older property discount
    }
  }

  // Energy label impact
  const energyMultipliers: Record<string, number> = {
    A: 1.1,
    B: 1.05,
    C: 1.0,
    D: 0.97,
    E: 0.94,
    F: 0.91,
    G: 0.88,
    Unknown: 0.95,
  }
  if (property.energyLabel) {
    basePrice *= energyMultipliers[property.energyLabel] || 1.0
  }

  // Amenities
  if (property.hasGarden) basePrice += 25000
  if (property.hasTerrace) basePrice += 15000
  if (property.hasGarage) basePrice += 20000

  // Model-specific adjustments (simulating different model behaviors)
  const modelAdjustments: Record<string, { factor: number; uncertainty: number }> = {
    "linear-regression": { factor: 1.0, uncertainty: 0.15 },
    "knn": { factor: 1.01, uncertainty: 0.13 },
    "decision-tree": { factor: 0.99, uncertainty: 0.16 },
    "random-forest": { factor: 1.02, uncertainty: 0.12 },
  }

  const adjustment = modelAdjustments[modelId] || { factor: 1.0, uncertainty: 0.12 }
  const estimatedPrice = Math.round(basePrice * adjustment.factor)
  const uncertaintyRange = estimatedPrice * adjustment.uncertainty

  const modelNames: Record<string, string> = {
    "linear-regression": "Linear Regression",
    "knn": "k-Nearest Neighbors",
    "decision-tree": "Decision Trees",
    "random-forest": "Random Forest",
  }

  const modelTypes: Record<string, "linear" | "tree" | "neural"> = {
    "linear-regression": "linear",
    "knn": "linear",
    "decision-tree": "tree",
    "random-forest": "tree",
  }

  return {
    id: `pred_${Date.now()}`,
    estimatedPrice,
    currency: "EUR",
    lowerBound: Math.round(estimatedPrice - uncertaintyRange),
    upperBound: Math.round(estimatedPrice + uncertaintyRange),
    modelId,
    modelName: modelNames[modelId] || "Unknown Model",
    modelType: modelTypes[modelId] || "tree",
    metrics: {
      rmse: Math.round(uncertaintyRange * 0.7),
      mae: Math.round(uncertaintyRange * 0.5),
      r2: 0.85 + Math.random() * 0.1,
    },
    featuresUsed: [
      "livingArea",
      "municipality",
      "postalCode",
      ...(property.lotArea ? ["lotArea"] : []),
      ...(property.bedrooms ? ["bedrooms"] : []),
      ...(property.bathrooms ? ["bathrooms"] : []),
      ...(property.yearBuilt ? ["yearBuilt"] : []),
      ...(property.energyLabel ? ["energyLabel"] : []),
      ...(property.hasGarden ? ["hasGarden"] : []),
      ...(property.hasTerrace ? ["hasTerrace"] : []),
      ...(property.hasGarage ? ["hasGarage"] : []),
    ],
    timestamp: new Date().toISOString(),
  }
}

// Format currency for display
export function formatCurrency(value: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}
