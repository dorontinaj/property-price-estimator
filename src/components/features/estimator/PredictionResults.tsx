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
    <div className="space-y-4">
      {/* Main Estimate Card */}
      <Card className="overflow-hidden">
        <div className="bg-primary/5 border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Estimate Complete</span>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </Badge>
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-2">Estimated Property Value</p>
            <p className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              {formatCurrency(prediction.estimatedPrice, prediction.currency)}
            </p>
            
            {prediction.lowerBound && prediction.upperBound && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ArrowDownRight className="w-4 h-4 text-chart-5" />
                <span>{formatCurrency(prediction.lowerBound)}</span>
                <span className="text-border">-</span>
                <span>{formatCurrency(prediction.upperBound)}</span>
                <ArrowUpRight className="w-4 h-4 text-chart-2" />
              </div>
            )}
          </div>

          {/* Property Summary */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-foreground mb-1">{property.address}</p>
            <p className="text-sm text-muted-foreground">
              {property.postalCode} - {property.livingArea} m2
              {property.bedrooms && ` - ${property.bedrooms} bed`}
              {property.bathrooms && ` - ${property.bathrooms} bath`}
            </p>
          </div>

          {/* Confidence & Model Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Uncertainty Range */}
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Uncertainty Range</span>
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
              <div className="flex items-center gap-2">
                {uncertaintyPercent < 20 ? (
                  <TrendingDown className="w-5 h-5 text-chart-2" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-chart-5" />
                )}
                <span className="text-2xl font-semibold text-foreground">
                  {uncertaintyPercent.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {uncertaintyPercent < 15 
                  ? "High confidence" 
                  : uncertaintyPercent < 25 
                    ? "Moderate confidence"
                    : "Lower confidence"}
              </p>
            </div>

            {/* Model Info */}
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Model Used</span>
                <Badge variant="outline" className="text-xs">
                  {prediction.modelType}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  {prediction.modelName}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {prediction.featuresUsed?.length || 0} features analyzed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Metrics Card */}
      {prediction.metrics && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Model Performance Metrics</CardTitle>
            <CardDescription>
              Quality indicators for the prediction model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-3">
              {prediction.metrics.r2 !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">
                    {formatPercentage(prediction.metrics.r2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">R-squared</p>
                </div>
              )}
              {prediction.metrics.rmse !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">
                    {formatCurrency(prediction.metrics.rmse)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">RMSE</p>
                </div>
              )}
              {prediction.metrics.mae !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">
                    {formatCurrency(prediction.metrics.mae)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">MAE</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Used */}
      {prediction.featuresUsed && prediction.featuresUsed.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Features Analyzed</CardTitle>
            <CardDescription>
              Property attributes used in the prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {prediction.featuresUsed.map((feature) => (
                <Badge key={feature} variant="secondary" className="capitalize">
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
