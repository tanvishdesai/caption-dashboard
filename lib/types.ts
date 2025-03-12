import { Models } from 'appwrite';

export interface LanguageModel extends Models.Document {
  // Change 'id' to '$id' to match Appwrite's document structure
  $id: string
  modelVersion: "V1" | "V2"
  language: string
  bleuScore: number
  captions: string[]
  trainingImage?: string
  remarks?: string
  customFields: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface PredefinedImage {
  id: string
  url: string
  description: string
}

export interface CustomField extends Models.Document {
  id: string
  name: string
  placeholder: string
  createdAt: string
}

export interface CreateModelPayload {
  modelVersion: "V1" | "V2"
  language: string
  bleuScore: number
  captions: string[]
  remarks?: string
  customFields?: Record<string, string>
  trainingImageFile?: File
}

export interface UpdateModelPayload extends CreateModelPayload {
  trainingImage?: string
}

