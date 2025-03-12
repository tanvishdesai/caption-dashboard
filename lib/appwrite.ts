import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const appwriteConfig = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  languageModelsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_LANGUAGE_MODELS_COLLECTION_ID || '',
  customFieldsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CUSTOM_FIELDS_COLLECTION_ID || '',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || '',
};

// Helper to handle server-side vs client-side
export const isClient = typeof window !== 'undefined';

export { ID }; 