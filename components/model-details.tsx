"use client"

import Image from "next/image"
import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ModelForm } from "@/components/model-form"
import type { CustomField, LanguageModel, PredefinedImage } from "@/lib/types"
import { deleteLanguageModel, getCustomFields, getFilePreview } from "@/lib/api" // Added getFilePreview
import { useRouter } from "next/navigation"

// These would typically come from your database or a constant file
const PREDEFINED_IMAGES: PredefinedImage[] = [
  {
    id: "img1",
    url: "/images/17273391_55cfc7d3d4.jpg",
    description: "custom field image",
  },
  {
    id: "img2",
    url: "/images/1032460886_4a598ed535.jpg",
    description: "A city skyline with tall buildings",
  },
  {
    id: "img3",
    url: "/images/DSCF3732.jpg",
    description: "A mountain landscape with snow",
  },
  {
    id: "img4",
    url: "/images/DSCF3772.jpg",
    description: "A group of people in a meeting room",
  },
  {
    id: "img5",
    url: "/images/DSCF3999.jpg",
    description: "A close-up of a flower in bloom",
  },
  {
    id: "img6",
    url: "/images/DSCF4140.jpg",
    description: "A close-up of a flower in bloom",
  },
  {
    id: "img7",
    url: "/images/WIN_20250221_10_11_35_Pro.jpg",
    description: "A close-up of a flower in bloom",
  },
]

interface ModelDetailsProps {
  model: LanguageModel
}

export function ModelDetails({ model }: ModelDetailsProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])

  const handleDelete = async () => {
    await deleteLanguageModel(model.$id)
    router.push("/")
  }

  const loadCustomFields = async () => {
    if (isEditing && customFields.length === 0) {
      const fields = await getCustomFields()
      setCustomFields(fields)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{model.modelVersion}</Badge>
          <Badge variant={getBadgeVariant(model.bleuScore)} className="text-sm">
            BLEU Score: {model.bleuScore.toFixed(2)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={loadCustomFields}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Language Model</DialogTitle>
                <DialogDescription>Make changes to the language model details.</DialogDescription>
              </DialogHeader>
              {customFields.length > 0 && (
                <ModelForm customFields={customFields} model={model} onSuccess={() => setIsEditing(false)} />
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Language Model</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this language model? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleting(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="captions">Generated Captions</TabsTrigger>
          <TabsTrigger value="training">Training Data</TabsTrigger>
          {model.customFields && Object.keys(model.customFields).length > 0 && (
            <TabsTrigger value="custom">Custom Fields</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Model Version</h3>
                  <p className="mt-1">{model.modelVersion}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
                  <p className="mt-1">{model.language}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">BLEU Score</h3>
                  <p className="mt-1">{model.bleuScore.toFixed(2)}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                  <p className="mt-1 whitespace-pre-line">{model.remarks || "No remarks provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="captions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Captions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {PREDEFINED_IMAGES.map((image, index) => (
                  <div key={image.id} className="grid gap-6 md:grid-cols-2 border-b pb-8 last:border-0 last:pb-0">
                    <div className="space-y-2">
                      <h3 className="font-medium">Test Image {index + 1}</h3>
                      <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.description}
                          fill
                          className="object-contain bg-gray-50"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{image.description}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Generated Caption</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {model.captions?.[index] || "No caption provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Data</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              {model.trainingImage ? (
                <div className="relative h-auto w-full">
                  <Image
                    src={getFilePreview(model.trainingImage) || "/placeholder.svg"}
                    alt="Training loss and curves"
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain bg-muted/20 rounded-lg"
                    onError={() => console.error("Failed to load training image")}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No training data image available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {model.customFields && Object.keys(model.customFields).length > 0 && (
          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(model.customFields).map(([key, value]) => (
                    <div key={key}>
                      <h3 className="text-sm font-medium text-muted-foreground">{key}</h3>
                      <p className="mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function getBadgeVariant(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score >= 8) return "default"
  if (score >= 6) return "secondary"
  if (score >= 4) return "outline"
  return "destructive"
}