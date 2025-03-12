"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { CustomField, LanguageModel, PredefinedImage, CreateModelPayload, UpdateModelPayload } from "@/lib/types"
import { createLanguageModel, updateLanguageModel } from "@/lib/api"

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

interface ModelFormProps {
  customFields: CustomField[]
  model?: LanguageModel
  onSuccess?: () => void
}

export function ModelForm({ customFields, model, onSuccess }: ModelFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<LanguageModel>>(
    model || {
      modelVersion: "V1",
      language: "",
      bleuScore: 0,
      captions: ["", "", "", "", ""],
      remarks: "",
     
    },
  )
  const [trainingImage, setTrainingImage] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBleuScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    setFormData((prev) => ({ ...prev, bleuScore: isNaN(value) ? 0 : value }))
  }

  const handleModelVersionChange = (value: "V1" | "V2") => {
    setFormData((prev) => ({ ...prev, modelVersion: value }))
  }

  const handleCaptionChange = (index: number, value: string) => {
    const newCaptions = [...(formData.captions || ["", "", "", "", ""])]
    newCaptions[index] = value
    setFormData((prev) => ({ ...prev, captions: newCaptions }))
  }

  const handleCustomFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [key]: value,
      },
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTrainingImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      if (model) {
        // Updating an existing model
        const updatePayload: UpdateModelPayload = {
          modelVersion: formData.modelVersion!,
          language: formData.language!,
          bleuScore: formData.bleuScore!,
          captions: formData.captions!,
          remarks: formData.remarks,
          customFields: formData.customFields,
        };
  
        if (trainingImage) {
          // New image selected
          updatePayload.trainingImageFile = trainingImage;
        } else {
          // Keep existing image
          updatePayload.trainingImage = model.trainingImage;
        }
  
        await updateLanguageModel(model.id, updatePayload);
      } else {
        // Creating a new model
        const createPayload: CreateModelPayload = {
          modelVersion: formData.modelVersion!,
          language: formData.language!,
          bleuScore: formData.bleuScore!,
          captions: formData.captions!,
          remarks: formData.remarks,
          customFields: formData.customFields,
        };
  
        if (trainingImage) {
          createPayload.trainingImageFile = trainingImage;
        }
  
        await createLanguageModel(createPayload);
      }
  
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error saving model:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base">Model Version</Label>
              <RadioGroup
                value={formData.modelVersion}
                onValueChange={(value) => handleModelVersionChange(value as "V1" | "V2")}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="V1" id="v1" />
                  <Label htmlFor="v1" className="font-normal">
                    Version 1
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="V2" id="v2" />
                  <Label htmlFor="v2" className="font-normal">
                    Version 2
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g., English, Spanish, French"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bleuScore">BLEU Score</Label>
                <Input
                  id="bleuScore"
                  name="bleuScore"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.bleuScore}
                  onChange={handleBleuScoreChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={3}
                placeholder="Add any notes or observations about this language training"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trainingImage">Training Loss & Curves Image</Label>
              <Input
                id="trainingImage"
                name="trainingImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {model?.trainingImage && !trainingImage && (
                <p className="text-sm text-muted-foreground mt-1">
                  Current image will be kept if no new image is uploaded.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Generated Captions</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the captions generated by the model for each of the predefined test images.
        </p>

        <div className="space-y-8">
          {PREDEFINED_IMAGES.map((image, index) => (
            <Card key={image.id}>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Test Image {index + 1}</Label>
                    <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border">
                      <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.description}
                        fill
                        className="object-contain bg-gray-50"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index < 2}
                        onError={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.src = "/placeholder.svg";
                          console.error(`Failed to load image: ${image.url}`);
                        }}
                        onLoad={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          const loadingEl = imgElement.parentElement?.querySelector('.animate-pulse');
                          if (loadingEl) loadingEl.remove();
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{image.description}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`caption-${index}`}>Generated Caption</Label>
                    <Textarea
                      id={`caption-${index}`}
                      value={formData.captions?.[index] || ""}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      placeholder="Enter the caption generated by the model for this image"
                      rows={6}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {customFields.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-4">Custom Fields</h3>
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={`custom-${field.id}`}>{field.name}</Label>
                      <Input
                        id={`custom-${field.id}`}
                        value={formData.customFields?.[field.name] || ""}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ""}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onSuccess) {
              onSuccess()
            } else {
              router.push("/")
            }
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {model ? "Update Language" : "Add Language"}
        </Button>
      </div>
    </form>
  )
}

