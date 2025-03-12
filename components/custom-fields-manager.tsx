"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { CustomField } from "@/lib/types"
import { createCustomField, deleteCustomField } from "@/lib/api"

interface CustomFieldsManagerProps {
  initialFields: CustomField[]
}

export function CustomFieldsManager({ initialFields }: CustomFieldsManagerProps) {
  const [fields, setFields] = useState<CustomField[]>(initialFields)
  const [newField, setNewField] = useState({ name: "", placeholder: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<CustomField | null>(null)

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newField.name.trim()) return

    setIsSubmitting(true)
    try {
      const field = await createCustomField(newField)
      setFields([...fields, field])
      setNewField({ name: "", placeholder: "" })
    } catch (error) {
      console.error("Error adding field:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteField = async () => {
    if (!fieldToDelete) return

    try {
      await deleteCustomField(fieldToDelete.id)
      setFields(fields.filter((field) => field.id !== fieldToDelete.id))
      setFieldToDelete(null)
    } catch (error) {
      console.error("Error deleting field:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No custom fields added yet. Add your first custom field below.
              </p>
            ) : (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{field.name}</p>
                      {field.placeholder && (
                        <p className="text-sm text-muted-foreground">Placeholder: {field.placeholder}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setFieldToDelete(field)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete {field.name}</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddField} className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Add New Field</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fieldName">Field Name</Label>
                  <Input
                    id="fieldName"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    placeholder="e.g., Training Duration"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldPlaceholder">Placeholder (Optional)</Label>
                  <Input
                    id="fieldPlaceholder"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    placeholder="e.g., Enter training duration in hours"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </>
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!fieldToDelete} onOpenChange={(open) => !open && setFieldToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{fieldToDelete?.name}" field? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteField} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

