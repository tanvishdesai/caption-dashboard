import { DashboardHeader } from "@/components/dashboard-header"
import { EmptyState } from "@/components/empty-state"
import { LanguageModelList } from "@/components/language-model-list"
import { getLanguageModels } from "@/lib/api"
import Link from "next/link"

export default async function DashboardPage() {
  const models = await getLanguageModels()

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6 pt-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Language Models</h1>
            <p className="text-muted-foreground">
              Compare performance metrics across different languages and model versions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/models/new"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Add New Language
            </Link>
          </div>
        </div>

        {models.length === 0 ? <EmptyState /> : <LanguageModelList models={models} />}
      </main>
    </div>
  )
}

