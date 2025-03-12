import { Client, Databases, Storage, ID, Query, Models, type ImageGravity } from "appwrite";
import type { LanguageModel, CustomField } from "./types";


// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67cf23aa002c6067a6ca");

const databases = new Databases(client);
const storage = new Storage(client);

// Appwrite constants
const DATABASE_ID = "67cf2429001979780226";
const LANGUAGE_MODELS_COLLECTION_ID = "67d11376000c15a03f8a";
const CUSTOM_FIELDS_COLLECTION_ID = "67d114c00033128310f9";
const TRAINING_IMAGES_BUCKET_ID = "67cf26a1001740299a29";

// Language Models API
export async function getLanguageModels(): Promise<LanguageModel[]> {
  try {
    const response = await databases.listDocuments<LanguageModel>(
      DATABASE_ID,
      LANGUAGE_MODELS_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching language models:", error);
    return [];
  }
}

export async function getLanguageModel(id: string): Promise<LanguageModel | null> {
  if (!id) {
    console.error("Error: id is missing");
    throw new Error('Missing required parameter: "id"');
  }
  try {
    const model = await databases.getDocument<LanguageModel>(
      DATABASE_ID,
      LANGUAGE_MODELS_COLLECTION_ID,
      id
    );
    return model;
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 404) {
      console.log(`Model with ID ${id} not found`);
      return null;
    }
    console.error("Error fetching language model:", error);
    throw error;
  }
}

interface CreateModelPayload {
  modelVersion: "V1" | "V2";
  language: string;
  bleuScore: number;
  captions: string[];
  trainingImageFile?: File;
  remarks?: string;
  customFields?: Record<string, string>;
}

export async function createLanguageModel(
  model: CreateModelPayload
): Promise<LanguageModel> {
  try {
    // If there's a training image file, upload it first
    let trainingImageId: string | null = null;
    if (model.trainingImageFile) {
      const uploadResponse = await storage.createFile(
        TRAINING_IMAGES_BUCKET_ID,
        ID.unique(),
        model.trainingImageFile
      );
      trainingImageId = uploadResponse.$id;
    }

    // Create the document
    const response = await databases.createDocument<LanguageModel>(
      DATABASE_ID,
      LANGUAGE_MODELS_COLLECTION_ID,
      ID.unique(),
      {
        modelVersion: model.modelVersion,
        language: model.language,
        bleuScore: model.bleuScore,
        captions: model.captions,
        trainingImage: trainingImageId,
        remarks: model.remarks,
        // customFields: model.customFields || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return response;
  } catch (error) {
    console.error("Error creating language model:", error);
    throw error;
  }
}

interface UpdateModelPayload {
  modelVersion: "V1" | "V2";
  language: string;
  bleuScore: number;
  captions: string[];
  trainingImage?: string;
  trainingImageFile?: File;
  remarks?: string;
  customFields?: Record<string, string>;
}

export async function updateLanguageModel(
  id: string,
  model: UpdateModelPayload
): Promise<LanguageModel> {
  try {
    // Handle image upload if there's a new image
    let trainingImageId: string | undefined = model.trainingImage;
    if (model.trainingImageFile) {
      const uploadResponse = await storage.createFile(
        TRAINING_IMAGES_BUCKET_ID,
        ID.unique(),
        model.trainingImageFile
      );
      trainingImageId = uploadResponse.$id;
    }

    return await databases.updateDocument<LanguageModel>(
      DATABASE_ID,
      LANGUAGE_MODELS_COLLECTION_ID,
      id,
      {
        modelVersion: model.modelVersion,
        language: model.language,
        bleuScore: model.bleuScore,
        captions: model.captions,
        trainingImage: trainingImageId,
        remarks: model.remarks,
        // customFields: model.customFields || {},
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error updating language model:", error);
    throw error;
  }
}

export async function deleteLanguageModel(id: string): Promise<void> {
  try {
    // Get the model to check if it has an image to delete
    const model = await getLanguageModel(id);

    // Delete the document
    await databases.deleteDocument(
      DATABASE_ID,
      LANGUAGE_MODELS_COLLECTION_ID,
      id
    );

    // Delete associated image if it exists
    if (model && model.trainingImage) {
      await storage.deleteFile(TRAINING_IMAGES_BUCKET_ID, model.trainingImage);
    }
  } catch (error) {
    console.error("Error deleting language model:", error);
    throw error;
  }
}

// Custom Fields API
export async function getCustomFields(): Promise<CustomField[]> {
  try {
    const response = await databases.listDocuments<CustomField>(
      DATABASE_ID,
      CUSTOM_FIELDS_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching custom fields:", error);
    return [];
  }
}

interface CreateCustomFieldPayload {
  name: string;
  placeholder?: string;
}

export async function createCustomField(
  field: CreateCustomFieldPayload
): Promise<CustomField> {
  try {
    return await databases.createDocument<CustomField>(
      DATABASE_ID,
      CUSTOM_FIELDS_COLLECTION_ID,
      ID.unique(),
      {
        name: field.name,
        placeholder: field.placeholder || "",
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error creating custom field:", error);
    throw error;
  }
}

export async function deleteCustomField(id: string): Promise<void> {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      CUSTOM_FIELDS_COLLECTION_ID,
      id
    );
  } catch (error) {
    console.error("Error deleting custom field:", error);
    throw error;
  }
}

// Helper function to get image URL from Appwrite Storage
export function getFilePreview(fileId: string | null): string | null {
  if (!fileId) return null;

  try {
    const previewUrl = storage.getFilePreview(
      TRAINING_IMAGES_BUCKET_ID,
      fileId
    );
    return previewUrl.toString();
  } catch (error) {
    console.error("Error generating file preview:", error);
    return null;
  }
}