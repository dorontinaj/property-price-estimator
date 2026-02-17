import { createFileRoute } from '@tanstack/react-router'
import { AppNavbar } from "@/components/layout/AppNavbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Home,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Mock data for charts
const priceByMunicipality = [
  { name: "Brussels", avgPrice: 425000, count: 1250 },
  { name: "Antwerp", avgPrice: 345000, count: 980 },
  { name: "Leuven", avgPrice: 380000, count: 420 },
  { name: "Ghent", avgPrice: 355000, count: 650 },
  { name: "Bruges", avgPrice: 365000, count: 380 },
  { name: "Liege", avgPrice: 265000, count: 520 },
  { name: "Namur", avgPrice: 285000, count: 310 },
  { name: "Mechelen", avgPrice: 320000, count: 280 },
]

const priceTrends = [
  { month: "Jan", avgPrice: 320000 },
  { month: "Feb", avgPrice: 325000 },
  { month: "Mar", avgPrice: 335000 },
  { month: "Apr", avgPrice: 342000 },
  { month: "May", avgPrice: 348000 },
  { month: "Jun", avgPrice: 355000 },
  { month: "Jul", avgPrice: 362000 },
  { month: "Aug", avgPrice: 358000 },
  { month: "Sep", avgPrice: 365000 },
  { month: "Oct", avgPrice: 372000 },
  { month: "Nov", avgPrice: 378000 },
  { month: "Dec", avgPrice: 385000 },
]

const propertyTypes = [
  { name: "Apartment", value: 45, color: "var(--chart-1)" },
  { name: "House", value: 35, color: "var(--chart-2)" },
  { name: "Villa", value: 12, color: "var(--chart-3)" },
  { name: "Studio", value: 8, color: "var(--chart-4)" },
]

const priceDistribution = [
  { range: "< 200k", count: 120 },
  { range: "200-300k", count: 340 },
  { range: "300-400k", count: 520 },
  { range: "400-500k", count: 380 },
  { range: "500-600k", count: 220 },
  { range: "> 600k", count: 140 },
]

const chartConfig = {
  avgPrice: {
    label: "Avg Price",
    color: "var(--chart-1)",
  },
  count: {
    label: "Listings",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const trendConfig = {
  avgPrice: {
    label: "Average Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const distributionConfig = {
  count: {
    label: "Properties",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const pieConfig = {
  value: {
    label: "Percentage",
  },
  Apartment: {
    label: "Apartment",
    color: "var(--chart-1)",
  },
  House: {
    label: "House",
    color: "var(--chart-2)",
  },
  Villa: {
    label: "Villa",
    color: "var(--chart-3)",
  },
  Studio: {
    label: "Studio",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export const Route = createFileRoute('/insights')({
  component: InsightsPage,
})

function InsightsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("12m")

  // Calculate stats
  const avgPriceAllRegions = Math.round(
    priceByMunicipality.reduce((sum, m) => sum + m.avgPrice, 0) / priceByMunicipality.length
  )
  const totalListings = priceByMunicipality.reduce((sum, m) => sum + m.count, 0)
  const priceChange = ((priceTrends[11].avgPrice - priceTrends[0].avgPrice) / priceTrends[0].avgPrice) * 100

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />

      <main className="flex-1 pt-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Market Insights
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Explore Belgian property market trends, regional price comparisons, 
              and distribution analytics to inform your property decisions.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="space-y-1">
              <Label htmlFor="region" className="text-xs">Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region" className="w-[180px]">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Belgium</SelectItem>
                  <SelectItem value="flanders">Flanders</SelectItem>
                  <SelectItem value="wallonia">Wallonia</SelectItem>
                  <SelectItem value="brussels">Brussels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="period" className="text-xs">Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period" className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                  <SelectItem value="24m">Last 2 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Price</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {new Intl.NumberFormat("en-BE", {
                        style: "currency",
                        currency: "EUR",
                        notation: "compact",
                        maximumFractionDigits: 0,
                      }).format(avgPriceAllRegions)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <Home className="w-5 h-5 text-chart-1" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-chart-2" />
                  <span className="text-sm text-chart-2">+3.2%</span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Listings</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {totalListings.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-chart-2" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-chart-5" />
                  <span className="text-sm text-chart-5">-1.5%</span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">YoY Price Change</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      +{priceChange.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-chart-3" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Badge variant="secondary" className="text-xs">Steady growth</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Most Active</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      Brussels
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-chart-4" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-muted-foreground">1,250 listings</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Price by Municipality */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Price by Municipality</CardTitle>
                <CardDescription>
                  Comparison of property prices across major Belgian cities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={priceByMunicipality} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={80}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) =>
                            new Intl.NumberFormat("en-BE", {
                              style: "currency",
                              currency: "EUR",
                              maximumFractionDigits: 0,
                            }).format(value as number)
                          }
                        />
                      }
                    />
                    <Bar dataKey="avgPrice" fill="var(--chart-1)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Price Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price Trends (12 Months)</CardTitle>
                <CardDescription>
                  Monthly average property prices in Belgium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={trendConfig} className="h-[300px]">
                  <LineChart data={priceTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) =>
                            new Intl.NumberFormat("en-BE", {
                              style: "currency",
                              currency: "EUR",
                              maximumFractionDigits: 0,
                            }).format(value as number)
                          }
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="avgPrice"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Property Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Property Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of listings by property type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <ChartContainer config={pieConfig} className="h-[200px] w-[200px]">
                    <PieChart>
                      <Pie
                        data={propertyTypes}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                      >
                        {propertyTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="space-y-3">
                    {propertyTypes.map((type) => (
                      <div key={type.name} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-sm text-foreground">{type.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {type.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price Distribution</CardTitle>
                <CardDescription>
                  Number of properties in each price range
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={distributionConfig} className="h-[240px]">
                  <BarChart data={priceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="range" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--chart-2)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Data Notice */}
          <Card className="mt-8 border-dashed">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground text-center">
                Data is updated monthly and reflects aggregated trends from available property listings. 
                Individual property values may vary significantly based on specific features and conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}
