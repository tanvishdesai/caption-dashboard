import { DashboardHeader } from "@/components/dashboard-header"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { getLanguageModels } from "@/lib/api"

export default async function AnalyticsPage() {
  const models = await getLanguageModels()

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6 pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Compare performance metrics across different languages and model versions.
          </p>
        </div>

        <AnalyticsDashboard models={models} />
      </main>
    </div>
  )
}

