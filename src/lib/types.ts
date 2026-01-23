// Property types
export const PROPERTY_TYPES = [
  { id: "apartment", name: "Apartment", hasGarden: false, hasLotArea: false },
  { id: "house", name: "House", hasGarden: true, hasLotArea: true },
  { id: "villa", name: "Villa", hasGarden: true, hasLotArea: true },
  { id: "studio", name: "Studio", hasGarden: false, hasLotArea: false },
  { id: "townhouse", name: "Townhouse", hasGarden: true, hasLotArea: true },
  { id: "penthouse", name: "Penthouse", hasGarden: false, hasLotArea: false },
] as const

export type PropertyTypeId = (typeof PROPERTY_TYPES)[number]["id"]

// Property input model
export interface Property {
  id?: string
  propertyType: PropertyTypeId
  address: string
  postalCode: string
  municipality: string
  livingArea: number
  lotArea?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  yearBuilt?: number | null
  energyLabel?: string | null
  hasGarden?: boolean
  hasTerrace?: boolean
  hasGarage?: boolean
  coordinates?: { lat: number; lon: number } | null
}

// Prediction response model
export interface Prediction {
  id: string
  estimatedPrice: number
  currency: string
  lowerBound?: number
  upperBound?: number
  modelId: string
  modelName?: string
  modelType?: "linear" | "tree" | "neural"
  metrics?: {
    rmse?: number
    mae?: number
    r2?: number
  }
  featuresUsed?: string[]
  timestamp: string
  rawModelOutput?: object
}

// Model metadata
export interface Model {
  id: string
  name: string
  type: string
  trainedOn?: string
  description?: string
  tags?: string[]
}

// Form validation types
export interface PropertyFormErrors {
  address?: string
  postalCode?: string
  municipality?: string
  livingArea?: string
  lotArea?: string
  bedrooms?: string
  bathrooms?: string
  yearBuilt?: string
  energyLabel?: string
}

// Belgian municipalities (subset for demo)
export const BELGIAN_MUNICIPALITIES = [
  { id: "brussels", name: "Brussels", province: "Brussels-Capital" },
  { id: "antwerp", name: "Antwerp", province: "Antwerp" },
  { id: "ghent", name: "Ghent", province: "East Flanders" },
  { id: "bruges", name: "Bruges", province: "West Flanders" },
  { id: "liege", name: "Liege", province: "Liege" },
  { id: "leuven", name: "Leuven", province: "Flemish Brabant" },
  { id: "namur", name: "Namur", province: "Namur" },
  { id: "mons", name: "Mons", province: "Hainaut" },
  { id: "mechelen", name: "Mechelen", province: "Antwerp" },
  { id: "aalst", name: "Aalst", province: "East Flanders" },
  { id: "hasselt", name: "Hasselt", province: "Limburg" },
  { id: "charleroi", name: "Charleroi", province: "Hainaut" },
  { id: "kortrijk", name: "Kortrijk", province: "West Flanders" },
  { id: "ostend", name: "Ostend", province: "West Flanders" },
  { id: "tournai", name: "Tournai", province: "Hainaut" },
]

export const ENERGY_LABELS = ["A", "B", "C", "D", "E", "F", "G", "Unknown"] as const
export type EnergyLabel = (typeof ENERGY_LABELS)[number]

// Available ML models
export const AVAILABLE_MODELS: Model[] = [
  {
    id: "linear-regression",
    name: "Linear Regression",
    type: "linear",
    description: "Simple linear model with good interpretability",
    tags: ["baseline", "fast", "interpretable"],
  },
  {
    id: "random-forest",
    name: "Random Forest",
    type: "tree",
    description: "Ensemble of decision trees for robust predictions",
    tags: ["ensemble", "robust", "feature-importance"],
  },
  {
    id: "gradient-boosting",
    name: "Gradient Boosting",
    type: "tree",
    description: "Sequential ensemble method with high accuracy",
    tags: ["ensemble", "accurate", "complex"],
  },
  {
    id: "neural-network",
    name: "Neural Network",
    type: "neural",
    description: "Deep learning model for complex pattern recognition",
    tags: ["deep-learning", "flexible", "data-hungry"],
  },
]
