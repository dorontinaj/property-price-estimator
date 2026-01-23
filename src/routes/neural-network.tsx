import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from "react"
import { AppNavbar } from "@/components/layout/AppNavbar"
import { PropertyForm } from "@/components/features/estimator/PropertyForm"
import { PredictionResults } from "@/components/features/estimator/PredictionResults"
import { getPrediction } from "@/lib/ml-helpers"
import { usePredictionStore } from "@/stores/prediction-store"
import type { Property, Prediction, PropertyTypeId } from "@/lib/types"
import { PROPERTY_TYPES } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Layers, 
  Zap, 
  Activity,
  Network,
  Cpu,
  Building2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Simulated neural network architecture info
const networkArchitecture = {
  inputLayer: 12,
  hiddenLayers: [64, 32, 16],
  outputLayer: 1,
  activation: "ReLU",
  optimizer: "Adam",
  epochs: 500,
  batchSize: 32,
}

export const Route = createFileRoute('/neural-network')({
  component: NeuralNetworkPage,
})

function NeuralNetworkPage() {
  const { toast } = useToast()
  const {
    isLoading,
    setPrediction,
    setLoading,
    setError,
  } = usePredictionStore()

  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null)
  const [processingStage, setProcessingStage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [propertyType, setPropertyType] = useState<PropertyTypeId>("house")

  const handleSubmit = useCallback(async (values: Property) => {
    setLoading(true)
    setError(null)
    setProcessingStage("Preprocessing features...")
    setProgress(0)

    try {
      // Simulate neural network processing stages
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(25)
      setProcessingStage("Forward propagation...")
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(50)
      setProcessingStage("Computing confidence intervals...")
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(75)
      setProcessingStage("Generating prediction...")

      const prediction = await getPrediction(values, "neural-network")
      
      setProgress(100)
      setProcessingStage(null)
      
      setPrediction(prediction, values)
      setCurrentPrediction(prediction)
      setCurrentProperty(values)
      
      toast({
        title: "Neural Network Prediction Complete",
        description: `Estimated value: ${new Intl.NumberFormat("en-BE", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
        }).format(prediction.estimatedPrice)}`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get prediction"
      setError(message)
      setProcessingStage(null)
      toast({
        title: "Prediction Failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }, [setPrediction, setLoading, setError, toast])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />
      
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Neural Network Estimator
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Deep learning model for complex pattern recognition in property pricing. 
              This model excels at capturing non-linear relationships between features.
            </p>
          </div>

          {/* Neural Network Architecture Info - Full Width */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Network className="w-5 h-5 text-primary" />
                Network Architecture
              </CardTitle>
              <CardDescription>
                Multi-layer perceptron trained on Belgian property data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Input Layer */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-chart-1" />
                    <span className="text-sm font-medium text-foreground">Input Layer</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{networkArchitecture.inputLayer}</p>
                  <p className="text-xs text-muted-foreground">feature neurons</p>
                </div>

                {/* Hidden Layers */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-chart-2" />
                    <span className="text-sm font-medium text-foreground">Hidden Layers</span>
                  </div>
                  <div className="flex gap-2">
                    {networkArchitecture.hiddenLayers.map((neurons, i) => (
                      <Badge key={i} variant="secondary">{neurons}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">neurons per layer</p>
                </div>

                {/* Activation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-chart-3" />
                    <span className="text-sm font-medium text-foreground">Activation</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{networkArchitecture.activation}</p>
                  <p className="text-xs text-muted-foreground">function type</p>
                </div>

                {/* Training Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-chart-4" />
                    <span className="text-sm font-medium text-foreground">Training</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{networkArchitecture.epochs}</p>
                  <p className="text-xs text-muted-foreground">epochs with {networkArchitecture.optimizer}</p>
                </div>
              </div>

              {/* Processing Progress */}
              {processingStage && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{processingStage}</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Type Selection - Full Width */}
          <Card className="mb-8">
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

            {/* Right Column - Results */}
            <div>
              {currentPrediction && currentProperty ? (
                <PredictionResults
                  prediction={currentPrediction}
                  property={currentProperty}
                />
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Brain className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">
                      Neural Network Ready
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Enter property details to run the deep learning model and see prediction results.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  )
}
