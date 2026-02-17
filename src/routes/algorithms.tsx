import { createFileRoute } from '@tanstack/react-router'
import { AppNavbar } from "@/components/layout/AppNavbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Cpu,
  TrendingUp,
  GitBranch,
  Layers,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  BarChart3
} from "lucide-react"
import { Link } from "@tanstack/react-router"

// Model comparison data
const models = [
  {
    id: "linear-regression",
    name: "Linear Regression",
    type: "linear",
    icon: TrendingUp,
    description: "Classic statistical method assuming linear relationships between features and price.",
    pros: ["Fast inference", "Highly interpretable", "Works well with limited data"],
    cons: ["Cannot capture non-linear patterns", "Sensitive to outliers"],
    metrics: { r2: 0.78, rmse: 45000, mae: 32000, speed: 95 },
    bestFor: "Simple properties with standard features",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    id: "knn",
    name: "k-Nearest Neighbors (k-NN)",
    type: "instance-based",
    icon: Target,
    description: "Instance-based learning that predicts based on the k most similar properties in the dataset.",
    pros: ["No training phase", "Adapts to local patterns", "Simple to understand"],
    cons: ["Slow for large datasets", "Sensitive to feature scaling", "Memory intensive"],
    metrics: { r2: 0.81, rmse: 42000, mae: 30000, speed: 70 },
    bestFor: "Properties with many similar examples in the dataset",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    id: "decision-tree",
    name: "Decision Trees",
    type: "tree",
    icon: GitBranch,
    description: "Tree-based model that makes decisions by splitting data based on feature values.",
    pros: ["Highly interpretable", "Handles non-linearity", "No feature scaling needed"],
    cons: ["Prone to overfitting", "Unstable to data changes", "Biased with imbalanced data"],
    metrics: { r2: 0.76, rmse: 47000, mae: 34000, speed: 85 },
    bestFor: "Understanding decision logic and feature interactions",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    id: "random-forest",
    name: "Random Forest",
    type: "tree",
    icon: Layers,
    description: "Ensemble of decision trees that reduces overfitting through averaging and randomization.",
    pros: ["High accuracy", "Handles non-linearity", "Feature importance ranking", "Robust to outliers"],
    cons: ["Less interpretable", "Slower inference", "Larger memory footprint"],
    metrics: { r2: 0.86, rmse: 38000, mae: 27000, speed: 75 },
    bestFor: "General-purpose predictions requiring robust accuracy",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

export const Route = createFileRoute('/algorithms')({
  component: AlgorithmsPage,
})

function AlgorithmsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />

      <main className="flex-1 pt-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Algorithm Comparison
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Compare different machine learning models to understand their strengths, 
              weaknesses, and performance characteristics for property price estimation.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Accuracy</p>
                    <p className="text-xl font-bold text-foreground">Random Forest</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fastest Model</p>
                    <p className="text-xl font-bold text-foreground">Linear Regression</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Most Interpretable</p>
                    <p className="text-xl font-bold text-foreground">Decision Trees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Models Available</p>
                    <p className="text-xl font-bold text-foreground">{models.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            {models.map((model) => {
              const Icon = model.icon
              return (
                <Card key={model.id} className="overflow-hidden">
                  <CardHeader className={model.bgColor}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${model.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">{model.type}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <p className="text-sm text-muted-foreground">
                      {model.description}
                    </p>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">
                          {(model.metrics.r2 * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">R-squared</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">
                          {(model.metrics.rmse / 1000).toFixed(0)}k
                        </p>
                        <p className="text-xs text-muted-foreground">RMSE</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">
                          {(model.metrics.mae / 1000).toFixed(0)}k
                        </p>
                        <p className="text-xs text-muted-foreground">MAE</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">
                          {model.metrics.speed}%
                        </p>
                        <p className="text-xs text-muted-foreground">Speed</p>
                      </div>
                    </div>

                    {/* Speed Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Inference Speed</span>
                        <span className="text-foreground">{model.metrics.speed}%</span>
                      </div>
                      <Progress value={model.metrics.speed} className="h-2" />
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Strengths</p>
                        <ul className="space-y-1">
                          {model.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Limitations</p>
                        <ul className="space-y-1">
                          {model.cons.map((con, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="w-4 h-4 flex items-center justify-center shrink-0">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Best For */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Best for: </span>
                        <span className="text-muted-foreground">{model.bestFor}</span>
                      </p>
                    </div>

                    {/* Action */}
                    <Button asChild className="w-full gap-2">
                      <Link to="/" search={{ model: model.id }}>
                        Use This Model
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Methodology Link */}
          <Card className="mt-8">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
              <div>
                <h3 className="font-semibold text-foreground">Want to learn more?</h3>
                <p className="text-sm text-muted-foreground">
                  Read our detailed methodology documentation for technical details on model training and validation.
                </p>
              </div>
              <Button variant="outline" asChild className="gap-2 shrink-0 bg-transparent">
                <Link to="/methodology">
                  View Methodology
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}
