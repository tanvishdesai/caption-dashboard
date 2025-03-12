import { Languages } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Languages className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">No language models found</h2>
      <p className="mt-2 text-center text-muted-foreground">
        You haven&apos;t added any language training data yet. Add your first language to get started.
      </p>
      <Link
        href="/models/new"
        className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Add Your First Language
      </Link>
    </div>
  )
}

