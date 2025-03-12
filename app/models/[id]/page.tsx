import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { ModelDetails } from "@/components/model-details";
import { getLanguageModel } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModelPage({ params }: PageProps) {
  try {
    const { id } = await params;
    const model = await getLanguageModel(id);

    if (!model) {
      notFound();
    }

    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 container mx-auto p-4 md:p-6 pt-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{model.language}</h1>
            <p className="text-muted-foreground">
              View performance metrics and generated captions for this language.
            </p>
          </div>
          <ModelDetails model={model} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching language model:", error);
    notFound();
  }
}