# Gaby Foster Care - Pet Adoption Web App

A comprehensive pet adoption web application with admin management and public viewing features using React, Firebase, and Cloudinary.

## Features

- Browse available pets with filtering options
- Detailed pet information pages
- Admin panel for managing pet listings
- Image uploading via Cloudinary
- User authentication via Firebase

## Tech Stack

- Frontend: React, TailwindCSS, Shadcn UI
- Backend: Express
- Database: Firebase Firestore
- Image Storage: Cloudinary
- Authentication: Firebase Auth

## Deployment on Vercel

To deploy this application on Vercel, follow these steps:

1. **Connect your GitHub repository to Vercel**
   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "New Project" and select your repository

2. **Configure the project**
   - Framework preset: Select "Vite"
   - Build Command: Keep default (or set to `npm run build`)
   - Output Directory: Keep default (`dist`)
   - Install Command: `npm install`

3. **Environment Variables**
   - Add the following environment variables in the Vercel project settings:
     - `VITE_FIREBASE_API_KEY`: Your Firebase API Key
     - `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID
     - `VITE_FIREBASE_APP_ID`: Your Firebase App ID
     - `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name

4. **Deploy**
   - Click "Deploy" and wait for the build to complete

5. **Update Firebase Configuration**
   - In your Firebase console, add your Vercel domain to the authorized domains list under Authentication > Settings

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the required environment variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## License

MIT