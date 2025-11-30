# Meal Planner

A full-stack web application for planning your weekly meals. Search for recipes, view nutrition information, and organize your meals by day and meal type with an intuitive weekly calendar view.

Author: Liam DeMong

## Features

- **Recipe Search**: Search thousands of recipes powered by the Spoonacular API
- **Nutrition Information**: View calories, protein, carbs, and other nutritional details
- **Weekly Meal Planner**: Organize breakfast, lunch, dinner, and snacks across a 7-day calendar
- **User Authentication**: Secure sign-in with Google via Firebase Authentication
- **Personal Meal Plans**: Each user's meal plan is private and synced to their account

## Implementation

**Frontend:**
- React + TypeScript
- Vite for build tooling
- Mantine UI component library
- React Router for navigation
- Firebase Authentication
- Vercel Deployment

**Backend:**
- Node.js + Express
- TypeScript
- Firebase Firestore for data storage
- Firebase Admin SDK for auth verification
- Spoonacular API integration

**Infrastructure:**
- Monorepo managed with Turborepo and pnpm workspaces
- Shared type definitions across frontend and backend
- Docker containerization
- Google Cloud Run deployment
