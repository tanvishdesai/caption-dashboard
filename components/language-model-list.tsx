"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { LanguageModel } from "@/lib/types"

interface LanguageModelListProps {
  models: LanguageModel[]
}

export function LanguageModelList({ models }: LanguageModelListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredModels = models.filter((model) => model.language.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search languages..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredModels.map((model, index) => (
          <Card key={model.$id || `model-${index}`} className="flex flex-col">
            <CardContent className="flex-1 p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{model.modelVersion}</Badge>
                {model.bleuScore !== null && model.bleuScore !== undefined ? (
                  <Badge variant={getBadgeVariant(Number(model.bleuScore))}>
                    BLEU: {Number(model.bleuScore).toFixed(2)}
                  </Badge>
                ) : (
                  <Badge variant="outline">BLEU: N/A</Badge>
                )}
              </div>
              <h3 className="font-semibold text-xl mb-2">{model.language}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{model.remarks || "No remarks provided"}</p>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Link
                href={`/models/${model.$id}`}
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No language models found matching your search.</p>
        </div>
      )}
    </div>
  )
}

function getBadgeVariant(score: number) {
  if (score >= 8) return "default"
  if (score >= 6) return "secondary"
  if (score >= 4) return "outline"
  return "destructive"
}