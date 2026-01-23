"use client"

import React from "react"

import { useState, useCallback } from "react"
import { 
  Home, 
  MapPin, 
  Ruler, 
  BedDouble, 
  Bath, 
  Calendar, 
  Zap, 
  Trees, 
  Car,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  type Property, 
  type PropertyFormErrors,
  type PropertyTypeId,
  BELGIAN_MUNICIPALITIES, 
  ENERGY_LABELS,
  PROPERTY_TYPES
} from "@/lib/types"

interface PropertyFormProps {
  defaultValues?: Partial<Property>
  onSubmit: (values: Property) => Promise<void>
  disabled?: boolean
  propertyType?: PropertyTypeId
}

const currentYear = new Date().getFullYear()

function validateProperty(values: Partial<Property>): PropertyFormErrors {
  const errors: PropertyFormErrors = {}

  if (!values.address?.trim()) {
    errors.address = "Address is required"
  } else if (values.address.length > 256) {
    errors.address = "Address must be 256 characters or less"
  }

  if (!values.postalCode?.trim()) {
    errors.postalCode = "Postal code is required"
  } else if (!/^\d{4}$/.test(values.postalCode)) {
    errors.postalCode = "Must be a valid 4-digit Belgian postal code"
  }

  if (!values.municipality) {
    errors.municipality = "Municipality is required"
  }

  if (!values.livingArea || values.livingArea <= 0) {
    errors.livingArea = "Living area must be greater than 0"
  } else if (values.livingArea > 2000) {
    errors.livingArea = "Living area seems unusually large (max 2000 m\u00B2)"
  }

  if (values.lotArea !== undefined && values.lotArea !== null && values.lotArea < 0) {
    errors.lotArea = "Lot area cannot be negative"
  }

  if (values.bedrooms !== undefined && values.bedrooms !== null) {
    if (values.bedrooms < 0 || values.bedrooms > 20) {
      errors.bedrooms = "Bedrooms must be between 0 and 20"
    }
  }

  if (values.bathrooms !== undefined && values.bathrooms !== null) {
    if (values.bathrooms < 0 || values.bathrooms > 10) {
      errors.bathrooms = "Bathrooms must be between 0 and 10"
    }
  }

  if (values.yearBuilt !== undefined && values.yearBuilt !== null) {
    if (values.yearBuilt < 1800 || values.yearBuilt > currentYear) {
      errors.yearBuilt = `Year must be between 1800 and ${currentYear}`
    }
  }

  return errors
}

export function PropertyForm({ defaultValues, onSubmit, disabled = false, propertyType = "house" }: PropertyFormProps) {
  const [formValues, setFormValues] = useState<Partial<Property>>({
    propertyType: propertyType,
    address: "",
    postalCode: "",
    municipality: "",
    livingArea: 0,
    lotArea: null,
    bedrooms: null,
    bathrooms: null,
    yearBuilt: null,
    energyLabel: null,
    hasGarden: false,
    hasTerrace: false,
    hasGarage: false,
    ...defaultValues,
  })
  
  // Update form values when propertyType prop changes
  React.useEffect(() => {
    setFormValues((prev) => ({ ...prev, propertyType }))
  }, [propertyType])
  
  // Get current property type config for conditional rendering
  const currentPropertyType = PROPERTY_TYPES.find(
    (pt) => pt.id === propertyType
  ) || PROPERTY_TYPES[1] // Default to "house"

  const [errors, setErrors] = useState<PropertyFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((field: keyof Property, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof PropertyFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handleBlur = useCallback((field: keyof Property) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldErrors = validateProperty(formValues)
    if (fieldErrors[field as keyof PropertyFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof PropertyFormErrors] }))
    }
  }, [formValues])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateProperty(formValues)
    setErrors(validationErrors)
    setTouched({
      address: true,
      postalCode: true,
      municipality: true,
      livingArea: true,
    })

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formValues as Property)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDisabled = disabled || isSubmitting

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          Property Details
        </CardTitle>
        <CardDescription>
          Enter the property attributes to get an estimated price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Street name and number"
                  value={formValues.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  disabled={isDisabled}
                  aria-invalid={touched.address && !!errors.address}
                  className={touched.address && errors.address ? "border-destructive" : ""}
                />
                {touched.address && errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  placeholder="1000"
                  maxLength={4}
                  value={formValues.postalCode || ""}
                  onChange={(e) => handleChange("postalCode", e.target.value.replace(/\D/g, ""))}
                  onBlur={() => handleBlur("postalCode")}
                  disabled={isDisabled}
                  aria-invalid={touched.postalCode && !!errors.postalCode}
                  className={touched.postalCode && errors.postalCode ? "border-destructive" : ""}
                />
                {touched.postalCode && errors.postalCode && (
                  <p className="text-sm text-destructive">{errors.postalCode}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipality">Municipality *</Label>
              <Select
                value={formValues.municipality || ""}
                onValueChange={(value) => handleChange("municipality", value)}
                disabled={isDisabled}
              >
                <SelectTrigger 
                  id="municipality"
                  className={touched.municipality && errors.municipality ? "border-destructive" : ""}
                  aria-invalid={touched.municipality && !!errors.municipality}
                >
                  <SelectValue placeholder="Select a municipality" />
                </SelectTrigger>
                <SelectContent>
                  {BELGIAN_MUNICIPALITIES.map((mun) => (
                    <SelectItem key={mun.id} value={mun.id}>
                      {mun.name} ({mun.province})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.municipality && errors.municipality && (
                <p className="text-sm text-destructive">{errors.municipality}</p>
              )}
            </div>
          </div>

          {/* Property Size Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Size & Rooms
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="livingArea">{"Living Area (m\u00B2) *"}</Label>
                <Input
                  id="livingArea"
                  type="number"
                  min="1"
                  max="2000"
                  placeholder="120"
                  value={formValues.livingArea || ""}
                  onChange={(e) => handleChange("livingArea", e.target.value ? Number(e.target.value) : 0)}
                  onBlur={() => handleBlur("livingArea")}
                  disabled={isDisabled}
                  aria-invalid={touched.livingArea && !!errors.livingArea}
                  className={touched.livingArea && errors.livingArea ? "border-destructive" : ""}
                />
                {touched.livingArea && errors.livingArea && (
                  <p className="text-sm text-destructive">{errors.livingArea}</p>
                )}
              </div>

              {currentPropertyType.hasLotArea && (
                <div className="space-y-2">
                  <Label htmlFor="lotArea">{"Lot Area (m\u00B2)"}</Label>
                  <Input
                    id="lotArea"
                    type="number"
                    min="0"
                    placeholder="500"
                    value={formValues.lotArea ?? ""}
                    onChange={(e) => handleChange("lotArea", e.target.value ? Number(e.target.value) : null)}
                    onBlur={() => handleBlur("lotArea")}
                    disabled={isDisabled}
                  />
                  {touched.lotArea && errors.lotArea && (
                    <p className="text-sm text-destructive">{errors.lotArea}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="flex items-center gap-1">
                  <BedDouble className="w-3 h-3" />
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  max="20"
                  placeholder="3"
                  value={formValues.bedrooms ?? ""}
                  onChange={(e) => handleChange("bedrooms", e.target.value ? Number(e.target.value) : null)}
                  onBlur={() => handleBlur("bedrooms")}
                  disabled={isDisabled}
                />
                {touched.bedrooms && errors.bedrooms && (
                  <p className="text-sm text-destructive">{errors.bedrooms}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="flex items-center gap-1">
                  <Bath className="w-3 h-3" />
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  max="10"
                  placeholder="2"
                  value={formValues.bathrooms ?? ""}
                  onChange={(e) => handleChange("bathrooms", e.target.value ? Number(e.target.value) : null)}
                  onBlur={() => handleBlur("bathrooms")}
                  disabled={isDisabled}
                />
                {touched.bathrooms && errors.bathrooms && (
                  <p className="text-sm text-destructive">{errors.bathrooms}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Additional Details
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  min="1800"
                  max={currentYear}
                  placeholder="1990"
                  value={formValues.yearBuilt ?? ""}
                  onChange={(e) => handleChange("yearBuilt", e.target.value ? Number(e.target.value) : null)}
                  onBlur={() => handleBlur("yearBuilt")}
                  disabled={isDisabled}
                />
                {touched.yearBuilt && errors.yearBuilt && (
                  <p className="text-sm text-destructive">{errors.yearBuilt}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="energyLabel" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Energy Label
                </Label>
                <Select
                  value={formValues.energyLabel || ""}
                  onValueChange={(value) => handleChange("energyLabel", value)}
                  disabled={isDisabled}
                >
                  <SelectTrigger id="energyLabel">
                    <SelectValue placeholder="Select energy label" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENERGY_LABELS.map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Amenities
            </h3>
            
            <div className="flex flex-wrap gap-6">
              {currentPropertyType.hasGarden && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasGarden"
                    checked={formValues.hasGarden || false}
                    onCheckedChange={(checked) => handleChange("hasGarden", checked)}
                    disabled={isDisabled}
                  />
                  <Label htmlFor="hasGarden" className="flex items-center gap-1 cursor-pointer">
                    <Trees className="w-4 h-4 text-muted-foreground" />
                    Garden
                  </Label>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  id="hasTerrace"
                  checked={formValues.hasTerrace || false}
                  onCheckedChange={(checked) => handleChange("hasTerrace", checked)}
                  disabled={isDisabled}
                />
                <Label htmlFor="hasTerrace" className="flex items-center gap-1 cursor-pointer">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  Terrace
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="hasGarage"
                  checked={formValues.hasGarage || false}
                  onCheckedChange={(checked) => handleChange("hasGarage", checked)}
                  disabled={isDisabled}
                />
                <Label htmlFor="hasGarage" className="flex items-center gap-1 cursor-pointer">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  Garage
                </Label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isDisabled}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Estimating Price...
              </>
            ) : (
              "Get Price Estimate"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
