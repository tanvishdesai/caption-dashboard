"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react"
import type { LanguageModel } from "@/lib/types"

interface AnalyticsDashboardProps {
  models: LanguageModel[]
}

export function AnalyticsDashboard({ models }: AnalyticsDashboardProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const [modelVersionFilter, setModelVersionFilter] = useState<"all" | "V1" | "V2">("all")

  // Filter models based on selected version
  const filteredModels =
    modelVersionFilter === "all" ? models : models.filter((model) => model.modelVersion === modelVersionFilter)

  // Sort models by BLEU score in descending order
  const sortedModels = [...filteredModels].sort((a, b) => b.bleuScore - a.bleuScore)

  // Prepare data for charts
  const chartData = sortedModels.map((model) => ({
    name: model.language,
    bleuScore: model.bleuScore,
    modelVersion: model.modelVersion,
    fill: model.modelVersion === "V1" ? "hsl(var(--primary))" : "hsl(var(--secondary))",
  }))

  // Calculate average BLEU score by model version
  const v1Models = models.filter((model) => model.modelVersion === "V1")
  const v2Models = models.filter((model) => model.modelVersion === "V2")

  const v1Average = v1Models.length ? v1Models.reduce((sum, model) => sum + model.bleuScore, 0) / v1Models.length : 0
  const v2Average = v2Models.length ? v2Models.reduce((sum, model) => sum + model.bleuScore, 0) / v2Models.length : 0
  const overallAverage = models.length ? models.reduce((sum, model) => sum + model.bleuScore, 0) / models.length : 0

  // Calculate improvement percentage
  const improvementPercent = v1Average && v2Average ? ((v2Average - v1Average) / v1Average) * 100 : 0

  // Prepare data for version comparison chart
  const versionComparisonData = [
    { name: "V1", average: v1Average, count: v1Models.length, fill: "hsl(var(--primary))" },
    { name: "V2", average: v2Average, count: v2Models.length, fill: "hsl(var(--secondary))" },
  ]

  // Prepare data for pie chart
  const pieData = [
    { name: "V1", value: v1Models.length, fill: "hsl(var(--primary))" },
    { name: "V2", value: v2Models.length, fill: "hsl(var(--secondary))" },
  ];

  // Get top performing language and model version distribution
  const topPerformer = sortedModels.length > 0 ? sortedModels[0] : null
  const v1Percentage = models.length ? (v1Models.length / models.length) * 100 : 0
  const v2Percentage = models.length ? (v2Models.length / models.length) * 100 : 0

  // Calculate performance change indicators
  const isImproved = v2Average > v1Average

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-l-4 border-l-primary">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
            <CardTitle className="flex items-center justify-between">
              Total Languages
              <Badge variant="outline" className="ml-2">Languages</Badge>
            </CardTitle>
            <CardDescription>Trained Models</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold">{models.length}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">{v1Models.length}</span> on V1, 
                <span className="font-medium text-secondary ml-1">{v2Models.length}</span> on V2
              </p>
              <PieChartIcon className="text-muted-foreground h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-secondary">
          <CardHeader className="pb-2 bg-gradient-to-r from-secondary/10 to-transparent">
            <CardTitle className="flex items-center justify-between">
              Average BLEU Score
              <Badge variant="outline" className="ml-2">Metrics</Badge>
            </CardTitle>
            <CardDescription>All Languages</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold">
              {overallAverage ? overallAverage.toFixed(2) : "N/A"}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-sm">V1: {v1Average.toFixed(2)}</span>
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
                <span className="text-sm">V2: {v2Average.toFixed(2)}</span>
              </div>
              {isImproved ? (
                <TrendingUp className="text-green-500 h-5 w-5" />
              ) : (
                <TrendingDown className="text-red-500 h-5 w-5" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-500/10 to-transparent">
            <CardTitle className="flex items-center justify-between">
              Top Performer
              <Badge variant="outline" className="ml-2">Best</Badge>
            </CardTitle>
            <CardDescription>Highest BLEU score</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold truncate">{topPerformer ? topPerformer.language : "N/A"}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                {topPerformer
                  ? <span>BLEU: <span className="font-medium text-green-500">{topPerformer.bleuScore.toFixed(2)}</span></span>
                  : "No data available"}
              </p>
              <Badge variant={topPerformer?.modelVersion === "V1" ? "default" : "secondary"}>
                {topPerformer?.modelVersion || "N/A"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-transparent">
            <CardTitle className="flex items-center justify-between">
              V2 Improvement
              <Badge variant="outline" className="ml-2">Change</Badge>
            </CardTitle>
            <CardDescription>Compared to V1</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold flex items-center">
              {improvementPercent ? 
                <span className={improvementPercent >= 0 ? "text-green-500" : "text-red-500"}>
                  {improvementPercent.toFixed(1)}%
                </span> : 
                "N/A"
              }
              {improvementPercent > 0 ? 
                <TrendingUp className="ml-2 text-green-500 h-6 w-6" /> : 
                improvementPercent < 0 ? 
                <TrendingDown className="ml-2 text-red-500 h-6 w-6" /> : 
                null
              }
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="w-full bg-secondary/20 rounded-full h-2">
                <div
                  className={`${improvementPercent >= 0 ? "bg-green-500" : "bg-red-500"} h-2 rounded-full`}
                  style={{
                    width: `${Math.min(Math.abs(improvementPercent), 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-t-4 border-t-primary">
        <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>BLEU Score Comparison</span>
                <Badge variant="outline">{filteredModels.length} Languages</Badge>
              </CardTitle>
              <CardDescription>Performance across languages and model versions</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={chartType} onValueChange={(value) => setChartType(value as "bar" | "line")}>
                <SelectTrigger className="w-[140px] flex items-center gap-2">
                  {chartType === "bar" ? (
                    <BarChart3 className="h-4 w-4" />
                  ) : (
                    <LineChartIcon className="h-4 w-4" />
                  )}
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={modelVersionFilter}
                onValueChange={(value) => setModelVersionFilter(value as "all" | "V1" | "V2")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Model Version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Versions</SelectItem>
                  <SelectItem value="V1">Version 1</SelectItem>
                  <SelectItem value="V2">Version 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      interval={0} 
                      tick={{ fill: "hsl(var(--foreground))" }}
                    />
                    <YAxis 
                      domain={[0, 1]} 
                      tick={{ fill: "hsl(var(--foreground))" }}
                    />
                    <Tooltip
                      formatter={(value) => [(value as number).toFixed(2), "BLEU Score"]}
                      labelFormatter={(label) => `Language: ${label}`}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem"
                      }}
                    />
                    <Legend 
                      formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
                    />
                    <Bar 
                      dataKey="bleuScore" 
                      name="BLEU Score" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      fillOpacity={0.9}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      interval={0}
                      tick={{ fill: "hsl(var(--foreground))" }}
                    />
                    <YAxis 
                      domain={[0, 1]} 
                      tick={{ fill: "hsl(var(--foreground))" }}
                    />
                    <Tooltip
                      formatter={(value) => [(value as number).toFixed(2), "BLEU Score"]}
                      labelFormatter={(label) => `Language: ${label}`}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem"
                      }}
                    />
                    <Legend 
                      formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
                    />
                    <Line
                      type="monotone"
                      dataKey="bleuScore"
                      name="BLEU Score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 6, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="version-comparison" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="version-comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Version Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="language-distribution" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span>Language Distribution</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="version-comparison">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 overflow-hidden border-t-4 border-t-secondary">
              <CardHeader className="bg-gradient-to-b from-secondary/5 to-transparent">
                <CardTitle>Model Version Comparison</CardTitle>
                <CardDescription>Average BLEU scores by model version</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={versionComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <YAxis 
                        domain={[0, 1]} 
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <Tooltip
                        formatter={(value) => [(value as number).toFixed(2), "Avg. BLEU Score"]}
                        labelFormatter={(label) => `Model Version: ${label}`}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                      />
                      <Legend 
                        formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
                      />
                      <Bar 
                        dataKey="average" 
                        name="Avg. BLEU Score" 
                        radius={[4, 4, 0, 0]}
                        fillOpacity={0.9}
                        fill="hsl(var(--primary))" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-t-4 border-t-primary">
              <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent">
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key version statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        Version 1
                      </h4>
                      <Badge variant="outline">{v1Models.length} languages</Badge>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold">{v1Average.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">avg. BLEU</div>
                    </div>
                    <div className="w-full bg-primary/20 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${v1Average * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-secondary"></div>
                        Version 2
                      </h4>
                      <Badge variant="outline">{v2Models.length} languages</Badge>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold">{v2Average.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">avg. BLEU</div>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${v2Average * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Improvement</span>
                      <span className={`text-sm font-medium ${improvementPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {improvementPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="language-distribution">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 overflow-hidden border-t-4 border-t-secondary">
              <CardHeader className="bg-gradient-to-b from-secondary/5 to-transparent">
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>Number of languages by model version</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={versionComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <YAxis 
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <Tooltip
                        formatter={(value) => [value, "Languages"]}
                        labelFormatter={(label) => `Model Version: ${label}`}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                      />
                      <Legend 
                        formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
                      />
                      <Bar
                        dataKey="count"
                        name="Number of Languages"
                        fill="hsl(var(--secondary))"
                        radius={[4, 4, 0, 0]}
                        fillOpacity={0.9}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-t-4 border-t-primary">
              <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent">
                <CardTitle>Version Distribution</CardTitle>
                <CardDescription>Language coverage by version</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-44 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, "Languages"]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">V1 vs V2 Distribution</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-l-full"
                          style={{
                            width: `${v1Percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>V1: {v1Percentage.toFixed(0)}%</span>
                      <span>V2: {v2Percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Languages</p>
                      <p className="text-2xl font-bold">{models.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Coverage Ratio</p>
                      <p className="text-lg font-medium">
                        <span className="text-primary">{v1Models.length}</span>:<span className="text-secondary">{v2Models.length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}