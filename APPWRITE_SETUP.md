# Appwrite Setup Guide for Image Caption Dashboard

This guide provides steps to set up Appwrite for use with the Image Caption Dashboard application.

## 1. Create an Appwrite Account

If you don't already have an Appwrite account:
1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up for an account
3. Follow the onboarding process

## 2. Create a New Project

1. From the Appwrite Console, click on "Create Project"
2. Enter a name for your project (e.g., "Image Caption Dashboard")
3. Click "Create"

## 3. Set Up the Project Platform

1. Navigate to your project settings
2. Add a Web platform
3. Enter your application details:
   - Name: "Image Caption Dashboard"
   - Hostname: Your local development URL (e.g., `localhost`, `127.0.0.1`)
4. Click "Register"

## 4. Create a Database

1. Go to Databases in the sidebar
2. Click "Create Database"
3. Name it "CaptionDashboard"
4. Choose a location closest to your users
5. Click "Create"

## 5. Create the Language Models Collection

1. Inside your database, click "Create Collection"
2. Name: "LanguageModels"
3. Set permissions as needed (for testing, you can enable all permissions)
4. Click "Create"
5. Add the following attributes:
   - `modelVersion` (Enum): Add options "V1" and "V2", Required
   - `language` (String): Required, Min length: 1, Max length: 100
   - `bleuScore` (Number): Required, Min: 0, Max: 1
   - `captions` (String Array): Required, Min items: 5, Max items: 5
   - `trainingImage` (String): Optional
   - `remarks` (String): Optional, Max length: 1000
   - `customFields` (Object): Optional
   - `createdAt` (String): Required
   - `updatedAt` (String): Required
6. Create indexes:
   - Create an index on `language` for faster searching
   - Create an index on `modelVersion` for filtering

## 6. Create the Custom Fields Collection

1. Inside your database, click "Create Collection"
2. Name: "CustomFields"
3. Set permissions as needed
4. Click "Create"
5. Add the following attributes:
   - `name` (String): Required, Min length: 1, Max length: 100
   - `placeholder` (String): Optional, Max length: 200
   - `createdAt` (String): Required
6. Create an index on `name` for faster searching

## 7. Create a Storage Bucket

1. Go to Storage in the sidebar
2. Click "Create Bucket"
3. Name: "TrainingImages"
4. Set file extensions allowed (e.g., jpg, jpeg, png, gif)
5. Maximum file size: Set as needed (e.g., 5MB)
6. Set permissions as needed (for testing, you can enable all permissions)
7. Click "Create"

## 8. Configure Environment Variables

1. Copy the values from your Appwrite console to your `.env.local` file:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Usually `https://cloud.appwrite.io/v1`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: Found in Project Settings
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID`: Your database ID (e.g., "CaptionDashboard")
   - `NEXT_PUBLIC_APPWRITE_LANGUAGE_MODELS_COLLECTION_ID`: "LanguageModels"
   - `NEXT_PUBLIC_APPWRITE_CUSTOM_FIELDS_COLLECTION_ID`: "CustomFields"
   - `NEXT_PUBLIC_APPWRITE_STORAGE_ID`: "TrainingImages"

## 9. Start the Application

1. Run `npm run dev` to start your Next.js application
2. Your application should now be connected to Appwrite

## Troubleshooting

- **CORS Errors**: Make sure you've added the correct hostname in your project platform settings
- **Permission Errors**: Check your collection permissions
- **API Errors**: Verify your environment variables are correct

For more information, refer to the [Appwrite Documentation](https://appwrite.io/docs). 