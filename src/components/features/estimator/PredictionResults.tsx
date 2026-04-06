"use client"

import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Prediction, Property } from "@/lib/types"
import { formatCurrency, formatPercentage } from "@/lib/ml-helpers"

interface PredictionResultsProps {
  prediction: Prediction
  property: Property
}

export function PredictionResults({ prediction, property }: PredictionResultsProps) {
  const uncertaintyPercent = prediction.upperBound && prediction.lowerBound
    ? ((prediction.upperBound - prediction.lowerBound) / prediction.estimatedPrice) * 100
    : 0

  const formattedDate = new Date(prediction.timestamp).toLocaleDateString("en-BE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="space-y-6">
      {/* Main Estimate Card - Prominent Design */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Estimate Complete</span>
            </div>
            <Badge variant="secondary" className="gap-1.5 shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              {formattedDate}
            </Badge>
          </div>
        </div>
        
        <CardContent className="pt-8 pb-8">
          {/* Large Price Display */}
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Estimated Property Value</p>
            <p className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-4">
              {formatCurrency(prediction.estimatedPrice, prediction.currency)}
            </p>
            
            {/* Model and Metrics Summary */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{prediction.modelName}</span>
              </div>
              {prediction.metrics?.mae && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">MAE:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(prediction.metrics.mae)}</span>
                </div>
              )}
              {prediction.metrics?.r2 && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">R²:</span>
                  <span className="font-semibold text-foreground">{formatPercentage(prediction.metrics.r2)}</span>
                </div>
              )}
            </div>
            
            {prediction.lowerBound && prediction.upperBound && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-base">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-chart-5/10 border border-chart-5/20">
                  <ArrowDownRight className="w-5 h-5 text-chart-5" />
                  <span className="font-semibold text-foreground">{formatCurrency(prediction.lowerBound)}</span>
                </div>
                <span className="text-muted-foreground font-medium">to</span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-chart-2/10 border border-chart-2/20">
                  <span className="font-semibold text-foreground">{formatCurrency(prediction.upperBound)}</span>
                  <ArrowUpRight className="w-5 h-5 text-chart-2" />
                </div>
              </div>
            )}
          </div>

          {/* Property Summary */}
          <div className="bg-background/80 backdrop-blur-sm rounded-xl p-5 mb-6 border border-border/50 shadow-sm">
            <p className="text-base font-semibold text-foreground mb-1.5">{property.address}</p>
            <p className="text-sm text-muted-foreground">
              {property.postalCode} • {property.livingArea} m²
              {property.bedrooms && ` • ${property.bedrooms} bed`}
              {property.bathrooms && ` • ${property.bathrooms} bath`}
            </p>
          </div>

          {/* Confidence & Model Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Uncertainty Range */}
            <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Uncertainty Range</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The prediction confidence interval. Lower values indicate higher model confidence.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-3">
                {uncertaintyPercent < 20 ? (
                  <TrendingDown className="w-6 h-6 text-chart-2" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-chart-5" />
                )}
                <span className="text-3xl font-bold text-foreground">
                  {uncertaintyPercent.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                {uncertaintyPercent < 15 
                  ? "High confidence" 
                  : uncertaintyPercent < 25 
                    ? "Moderate confidence"
                    : "Lower confidence"}
              </p>
            </div>

            {/* Model Info */}
            <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Algorithm Used</span>
                <Badge variant="outline" className="text-xs font-semibold">
                  {prediction.modelType}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  {prediction.modelName}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                {prediction.featuresUsed?.length || 0} features analyzed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Metrics Card */}
      {prediction.metrics && (
        <Card className="border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Model Performance Metrics</CardTitle>
            <CardDescription className="text-sm">
              Quality indicators for the prediction algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-3">
              {prediction.metrics.r2 !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {formatPercentage(prediction.metrics.r2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">R-squared</p>
                </div>
              )}
              {prediction.metrics.rmse !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(prediction.metrics.rmse)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">RMSE</p>
                </div>
              )}
              {prediction.metrics.mae !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(prediction.metrics.mae)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">MAE</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Used */}
      {prediction.featuresUsed && prediction.featuresUsed.length > 0 && (
        <Card className="border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Features Analyzed</CardTitle>
            <CardDescription className="text-sm">
              Property attributes used in the prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {prediction.featuresUsed.map((feature) => (
                <Badge key={feature} variant="secondary" className="capitalize font-medium">
                  {feature.replace(/([A-Z])/g, " $1").trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
