"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Prediction, Property } from "@/lib/types"

/**
 * PredictionStore
 * 
 * Global state container for property prediction data managed with Zustand.
 * 
 * Responsibilities:
 * - Store current property input data and prediction outputs
 * - Maintain prediction history (last 10 predictions)
 * - Track loading state and errors
 * - Manage selected ML model
 * 
 * Best Practices (from architecture):
 * - Keep state minimal and typed
 * - Expose clear actions
 * - Persist relevant state to localStorage
 * - Keep side effects out of store definitions
 */
interface PredictionState {
  lastPrediction: Prediction | null
  lastProperty: Property | null
  predictionHistory: { prediction: Prediction; property: Property }[]
  isLoading: boolean
  error: string | null
  selectedModelId: string
  
  // Actions
  setPrediction: (prediction: Prediction, property: Property) => void
  clearPrediction: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedModel: (modelId: string) => void
  clearHistory: () => void
}

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set) => ({
      lastPrediction: null,
      lastProperty: null,
      predictionHistory: [],
      isLoading: false,
      error: null,
      selectedModelId: "random-forest",

      setPrediction: (prediction, property) =>
        set((state) => ({
          lastPrediction: prediction,
          lastProperty: property,
          predictionHistory: [
            { prediction, property },
            ...state.predictionHistory.slice(0, 9), // Keep last 10
          ],
          error: null,
        })),

      clearPrediction: () =>
        set({
          lastPrediction: null,
          lastProperty: null,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      setSelectedModel: (modelId) =>
        set({
          selectedModelId: modelId,
        }),

      clearHistory: () =>
        set({
          predictionHistory: [],
        }),
    }),
    {
      name: "property-prediction-store",
      partialize: (state) => ({
        predictionHistory: state.predictionHistory,
        selectedModelId: state.selectedModelId,
      }),
    }
  )
)
