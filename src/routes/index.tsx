import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from "react"
import { AppNavbar } from "@/components/layout/AppNavbar"
import { PropertyForm } from "@/components/features/estimator/PropertyForm"
import { PredictionResults } from "@/components/features/estimator/PredictionResults"
import { HelpSheet } from "@/components/features/estimator/HelpSheet"
import { getPrediction } from "@/lib/ml-helpers"
import { usePredictionStore } from "@/stores/prediction-store"
import type { Property, Prediction, PropertyTypeId } from "@/lib/types"
import { AVAILABLE_MODELS, PROPERTY_TYPES } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, HelpCircle, History, Trash2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export const Route = createFileRoute('/')({ 
  component: EstimatorPage,
})

function EstimatorPage() {
  const { toast } = useToast()
  const {
    predictionHistory,
    isLoading,
    selectedModelId,
    setPrediction,
    setLoading,
    setError,
    setSelectedModel,
    clearHistory,
  } = usePredictionStore()

  const [showHelp, setShowHelp] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null)
  const [propertyType, setPropertyType] = useState<PropertyTypeId>("house")

  const handleSubmit = useCallback(async (values: Property) => {
    setLoading(true)
    setError(null)

    try {
      const prediction = await getPrediction(values, selectedModelId)
      setPrediction(prediction, values)
      setCurrentPrediction(prediction)
      setCurrentProperty(values)
      
      toast({
        title: "Prediction Complete",
        description: `Estimated value: ${new Intl.NumberFormat("en-BE", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
        }).format(prediction.estimatedPrice)}`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get prediction"
      setError(message)
      toast({
        title: "Prediction Failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [selectedModelId, setPrediction, setLoading, setError, toast])

  const loadFromHistory = useCallback((index: number) => {
    const item = predictionHistory[index]
    if (item) {
      setCurrentPrediction(item.prediction)
      setCurrentProperty(item.property)
    }
  }, [predictionHistory])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />
      
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  Property Price Estimator
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Enter property details to receive an ML-powered price estimate with uncertainty bounds and model metadata.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
            </div>
          </div>

          {/* Model & Property Type Selection - Full Width */}
          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            {/* Model Selection Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Model Selection
                </CardTitle>
                <CardDescription>
                  Choose the ML model for your prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="model-select">Prediction Model</Label>
                  <Select
                    value={selectedModelId}
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger id="model-select">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {model.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {AVAILABLE_MODELS.find(m => m.id === selectedModelId)?.description && (
                    <p className="text-xs text-muted-foreground">
                      {AVAILABLE_MODELS.find(m => m.id === selectedModelId)?.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Type Selection Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Property Type
                </CardTitle>
                <CardDescription>
                  Select the type of property to estimate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="property-type-select">Type</Label>
                  <Select
                    value={propertyType}
                    onValueChange={(value) => setPropertyType(value as PropertyTypeId)}
                  >
                    <SelectTrigger id="property-type-select">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {PROPERTY_TYPES.find(t => t.id === propertyType)?.hasGarden
                      ? "Can have garden and lot area"
                      : "Typically no garden or separate lot"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Two Column Layout - Form and Results */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Property Form */}
            <div>
              <PropertyForm
                onSubmit={handleSubmit}
                disabled={isLoading}
                propertyType={propertyType}
              />
            </div>

            {/* Right Column - Results & History */}
            <div className="space-y-6">
              {/* Results */}
              {currentPrediction && currentProperty ? (
                <PredictionResults
                  prediction={currentPrediction}
                  property={currentProperty}
                />
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Cpu className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">
                      No Prediction Yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Fill in the property details and click "Get Price Estimate" to see results here.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Prediction History */}
              {predictionHistory.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <History className="w-4 h-4 text-primary" />
                        Recent Predictions
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearHistory}
                        className="h-8 px-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {predictionHistory.slice(0, 5).map((item, index) => (
                        <button
                          key={item.prediction.id}
                          onClick={() => loadFromHistory(index)}
                          className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                              {item.property.address}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              {new Intl.NumberFormat("en-BE", {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 0,
                                notation: "compact",
                              }).format(item.prediction.estimatedPrice)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.property.livingArea} m2 - {item.prediction.modelName}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <HelpSheet open={showHelp} onOpenChange={setShowHelp} />
      <Toaster />
    </div>
  )
}
