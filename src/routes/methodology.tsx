import { createFileRoute } from '@tanstack/react-router'
import { AppNavbar } from "@/components/layout/AppNavbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Database,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  GitBranch,
} from "lucide-react"

const sections = [
  {
    id: "data-sources",
    title: "Data Sources",
    icon: Database,
    content: `Our property price estimation models are trained on a comprehensive dataset of Belgian real estate transactions. The data includes:

- **Transaction Records**: Historical property sales data from 2018-2024
- **Property Attributes**: Living area, lot size, number of rooms, construction year
- **Location Data**: Municipality, postal code, regional economic indicators
- **Energy Certificates**: EPC ratings where available
- **Amenities**: Garden, terrace, garage, and other features

Data is sourced from public registries, real estate platforms, and government statistics. All personal information is anonymized to protect privacy.`,
  },
  {
    id: "features",
    title: "Feature Engineering",
    icon: Layers,
    content: `The models use carefully engineered features to capture the factors that influence property prices:

**Core Features:**
- Living area (m2) - primary price driver
- Lot area (m2) - particularly important for houses
- Number of bedrooms and bathrooms
- Property age and renovation status
- Energy efficiency rating

**Location Features:**
- Municipality price index (relative to national average)
- Postal code granularity for neighborhood effects
- Distance to city centers and amenities
- Regional economic indicators

**Derived Features:**
- Price per square meter benchmarks
- Property type classification
- Seasonal adjustment factors`,
  },
  {
    id: "models",
    title: "Model Architecture",
    icon: GitBranch,
    content: `We employ multiple machine learning approaches, each with distinct strengths:

**Linear Regression**
A baseline model that assumes linear relationships. Useful for interpretability and as a benchmark for more complex models.

**Random Forest**
An ensemble of 500 decision trees with bootstrap aggregation. Reduces overfitting and provides robust predictions across diverse property types.

**Gradient Boosting (XGBoost)**
Sequential ensemble that iteratively corrects errors. Achieves high accuracy but requires careful tuning to prevent overfitting.

**Neural Network**
Multi-layer perceptron with architecture [64, 32, 16] neurons. Uses ReLU activation and dropout for regularization. Best for capturing complex non-linear patterns.`,
  },
  {
    id: "training",
    title: "Training & Validation",
    icon: Target,
    content: `Our models undergo rigorous training and validation to ensure reliable predictions:

**Data Split:**
- 70% training data
- 15% validation data
- 15% test data (held out until final evaluation)

**Cross-Validation:**
5-fold cross-validation on training data to tune hyperparameters and prevent overfitting.

**Regularization:**
- L2 regularization for linear models
- Tree depth limits and minimum samples for tree-based models
- Dropout and early stopping for neural networks

**Metrics Tracked:**
- R-squared (explained variance)
- RMSE (root mean squared error)
- MAE (mean absolute error)
- MAPE (mean absolute percentage error)`,
  },
  {
    id: "uncertainty",
    title: "Uncertainty Quantification",
    icon: Shield,
    content: `Every prediction includes uncertainty bounds to communicate confidence:

**Confidence Intervals:**
We provide 80% prediction intervals, meaning the true price falls within the bounds 80% of the time.

**Sources of Uncertainty:**
- Model uncertainty: inherent limitations of the model
- Data uncertainty: noise and missing information in inputs
- Market uncertainty: factors not captured in the data

**Interpretation:**
- Narrow intervals = high confidence (typical property with good data)
- Wide intervals = lower confidence (unusual property or sparse data)

Users should treat estimates as guidance, not guarantees.`,
  },
  {
    id: "limitations",
    title: "Limitations & Disclaimers",
    icon: AlertTriangle,
    content: `Important limitations to understand:

**What the model cannot capture:**
- Interior condition and renovation quality
- View and natural light factors
- Unique architectural features
- Micro-location effects (specific street, neighbors)
- Market timing and negotiation dynamics

**Known biases:**
- Urban properties have more training data than rural
- Luxury segment has higher uncertainty
- Recently constructed properties may be underrepresented

**Not a substitute for:**
- Professional property appraisals
- Due diligence by real estate professionals
- Legal or financial advice

Estimates are for informational purposes only.`,
  },
]

const metrics = [
  { label: "Training Samples", value: "125,000+", description: "Property transactions" },
  { label: "Test R-squared", value: "0.89", description: "Best performing model" },
  { label: "Avg. Error", value: "~8%", description: "Mean absolute percentage error" },
  { label: "Update Frequency", value: "Monthly", description: "Model retraining cycle" },
]

export const Route = createFileRoute('/methodology')({
  component: MethodologyPage,
})

function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />

      <main className="flex-1 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Methodology
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Technical documentation on data sources, model training, validation procedures, 
              and the approach used for Belgian property price estimation.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm font-medium text-foreground mt-1">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table of Contents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{section.title}</span>
                    </a>
                  )
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <section key={section.id} id={section.id}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">
                            Section {index + 1}
                          </Badge>
                          <CardTitle className="text-xl">{section.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        {section.content.split("\n\n").map((paragraph, i) => {
                          if (paragraph.startsWith("**") && paragraph.includes(":**")) {
                            // This is a section with bullet points
                            const lines = paragraph.split("\n")
                            const title = lines[0]
                            const items = lines.slice(1)
                            return (
                              <div key={i} className="mb-4">
                                <p className="font-medium text-foreground mb-2">
                                  {title.replace(/\*\*/g, "")}
                                </p>
                                <ul className="space-y-1">
                                  {items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: item
                                            .replace(/^- /, "")
                                            .replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>"),
                                        }}
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          }
                          return (
                            <p
                              key={i}
                              className="mb-4 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: paragraph.replace(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong class='text-foreground'>$1</strong>"
                                ),
                              }}
                            />
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  {index < sections.length - 1 && <Separator className="my-8" />}
                </section>
              )
            })}
          </div>

          {/* Footer Note */}
          <Card className="mt-8 border-dashed">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                This methodology document was last updated January 2026. 
                For questions or feedback, please contact our data science team.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
