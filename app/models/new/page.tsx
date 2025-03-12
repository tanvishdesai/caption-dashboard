import { DashboardHeader } from "@/components/dashboard-header"
import { ModelForm } from "@/components/model-form"
import { getCustomFields } from "@/lib/api"

export default async function NewModelPage() {
  const customFields = await getCustomFields()

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6 pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Language</h1>
          <p className="text-muted-foreground">
            Add a new language training with performance metrics and generated captions.
          </p>
        </div>

        <ModelForm customFields={customFields} />
      </main>
    </div>
  )
}

