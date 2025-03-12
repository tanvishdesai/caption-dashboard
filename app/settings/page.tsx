import { DashboardHeader } from "@/components/dashboard-header"
import { CustomFieldsManager } from "@/components/custom-fields-manager"
import { getCustomFields } from "@/lib/api"

export default async function SettingsPage() {
  const customFields = await getCustomFields()

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6 pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage custom fields and application settings.</p>
        </div>

        <CustomFieldsManager initialFields={customFields} />
      </main>
    </div>
  )
}

