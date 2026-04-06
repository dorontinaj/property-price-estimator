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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Property Price Estimator
                </h1>
                <p className="text-base text-muted-foreground mt-2 max-w-2xl">
                  AI-powered price estimation using machine learning algorithms
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

          {/* Configuration Card */}
          <Card className="mb-8 border-0">
          
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Model Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    Model Selection
                  </Label>
                  <Select
                    value={selectedModelId}
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger>
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
                </div>

                {/* Property Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Property Type
                  </Label>
                  <Select
                    value={propertyType}
                    onValueChange={(value) => setPropertyType(value as PropertyTypeId)}
                  >
                    <SelectTrigger>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout - Form and Results */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column - Property Form */}
            <div>
              <PropertyForm
                onSubmit={handleSubmit}
                disabled={isLoading}
                propertyType={propertyType}
              />
            </div>

            {/* Right Column - Prediction Results */}
            <div>
              {isLoading ? (
                <Card className="border-0 bg-gradient-to-br from-primary/5 to-background">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                      <Cpu className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Processing Prediction
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Analyzing property features with {AVAILABLE_MODELS.find(m => m.id === selectedModelId)?.name}...
                    </p>
                  </CardContent>
                </Card>
              ) : currentPrediction && currentProperty ? (
                <PredictionResults
                  prediction={currentPrediction}
                  property={currentProperty}
                />
              ) : (
                <Card className="border-0">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Cpu className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Prediction Yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Fill in the property details and click "Get Price Estimate" to see results here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Prediction History - Full Width Below */}
          {predictionHistory.length > 0 && (
            <Card className="mt-8 border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
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
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {predictionHistory.slice(0, 6).map((item, index) => (
                    <button
                      key={item.prediction.id}
                      onClick={() => loadFromHistory(index)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
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
      </main>

      <HelpSheet open={showHelp} onOpenChange={setShowHelp} />
      <Toaster />
    </div>
  )
}
