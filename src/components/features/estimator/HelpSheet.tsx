"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  HelpCircle, 
  MapPin, 
  Ruler, 
  Zap, 
  Brain, 
  BarChart3,
  AlertCircle
} from "lucide-react"

interface HelpSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpSheet({ open, onOpenChange }: HelpSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="w-5 h-5 text-primary" />
            Help & Tips
          </SheetTitle>
          <SheetDescription className="text-base">
            Learn how to get the most accurate property estimates
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
          <div className="space-y-8 pb-8 px-1">
            {/* Location Tips */}
            <section className="space-y-3 px-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4 text-primary" />
                Location Details
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground pl-6">
                <p>
                  <strong className="text-foreground">Address:</strong> Enter the full street address 
                  including house number. This helps identify the exact neighborhood.
                </p>
                <p>
                  <strong className="text-foreground">Postal Code:</strong> Belgian postal codes 
                  are 4 digits. This is crucial for accurate regional pricing.
                </p>
                <p>
                  <strong className="text-foreground">Municipality:</strong> Select the correct 
                  municipality as prices vary significantly between regions.
                </p>
              </div>
            </section>

            {/* Size & Rooms */}
            <section className="space-y-3 px-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-base">
                <Ruler className="w-4 h-4 text-primary" />
                Size & Rooms
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground pl-6">
                <p>
                  <strong className="text-foreground">Living Area:</strong> Enter the habitable 
                  floor space in square meters. This is the primary price driver.
                </p>
                <p>
                  <strong className="text-foreground">Lot Area:</strong> Total land area for 
                  houses with gardens. Not applicable for apartments.
                </p>
                <p>
                  <strong className="text-foreground">Bedrooms/Bathrooms:</strong> Count only 
                  dedicated rooms, not multi-purpose spaces.
                </p>
              </div>
            </section>

            {/* Energy Label */}
            <section className="space-y-3 px-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-primary" />
                Energy Label
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground pl-6">
                <p>
                  Energy labels range from A (most efficient) to G (least efficient). 
                  Better energy ratings command higher prices due to lower utility costs.
                </p>
                <p>
                  If unknown, select "Unknown" - the model will use regional averages.
                </p>
              </div>
            </section>

            {/* ML Models */}
            <section className="space-y-3 px-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-base">
                <Brain className="w-4 h-4 text-primary" />
                Understanding Models
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground pl-6">
                <p>
                  <strong className="text-foreground">Linear Regression:</strong> Simple, 
                  interpretable model. Best for typical properties.
                </p>
                <p>
                  <strong className="text-foreground">k-NN:</strong> Predicts based on 
                  similar properties. Works well with many comparable examples.
                </p>
                <p>
                  <strong className="text-foreground">Decision Trees:</strong> Highly 
                  interpretable tree-based decisions. Shows feature importance.
                </p>
                <p>
                  <strong className="text-foreground">Random Forest:</strong> Ensemble model 
                  with best overall accuracy. Recommended for most cases.
                </p>
              </div>
            </section>

            {/* Understanding Results */}
            <section className="space-y-3 px-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4 text-primary" />
                Understanding Results
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground pl-6">
                <p>
                  <strong className="text-foreground">Estimated Price:</strong> The model's 
                  best prediction for market value.
                </p>
                <p>
                  <strong className="text-foreground">Uncertainty Range:</strong> Lower/upper 
                  bounds represent 80% confidence interval.
                </p>
                <p>
                  <strong className="text-foreground">R-squared:</strong> How well the model 
                  explains price variation (higher is better).
                </p>
                <p>
                  <strong className="text-foreground">RMSE/MAE:</strong> Average prediction 
                  error in euros (lower is better).
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="bg-muted/50 rounded-lg p-5 space-y-2 mx-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-base">
                <AlertCircle className="w-4 h-4 text-chart-5" />
                Important Notice
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These estimates are for informational purposes only and should not 
                replace professional property appraisals. Actual market values may 
                vary based on factors not captured in the model.
              </p>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
