import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { ModelForm } from "@/components/model-form"
import { getLanguageModel } from "@/lib/api"

export const dynamic = "force-dynamic"

interface PageProps {
  params: { id: string };
}

export default async function EditModelPage({ params }: PageProps) {
  try {
    const { id } = params;
    const model = await getLanguageModel(id);

    if (!model) {
      notFound();
    }

    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 container mx-auto p-4 md:p-6 pt-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Edit Language Model</h1>
            <p className="text-muted-foreground">
              Update the language model details and performance metrics.
            </p>
          </div>

          <ModelForm model={model} customFields={[]} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching language model:", error);
    notFound();
  }
}