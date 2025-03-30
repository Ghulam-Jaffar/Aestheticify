# Aestheticify

Aestheticify is an immersive web application that creates visual and audio experiences called "vibes." It allows users to escape into different themed environments, save journal entries with their favorite vibes, and share their experiences with others.

## Features

- **Immersive Environments**: Experience various themed environments like Cozy Rain, Neon Dream, Dreamcore Cloud, and more
- **User Authentication**: Secure login and account management with Firebase
- **Journal Entries**: Save personal thoughts and reflections with your favorite vibes
- **Audio Experiences**: Each vibe comes with its own tailored audio experience
- **Sharing Capabilities**: Share your vibes and journal entries with friends

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Animation**: Framer Motion for smooth transitions and effects
- **Authentication & Database**: Firebase Authentication and Firestore
- **Styling**: Tailwind CSS for responsive design

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Project Structure

- `/src/app`: Next.js App Router pages
- `/src/components`: Reusable UI components
- `/src/layouts`: Layout components for different views
- `/src/utils`: Utility functions
- `/src/lib`: Library configurations (Firebase, etc.)
- `/src/hooks`: Custom React hooks

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## Deployment

The application can be deployed on Vercel or any other platform that supports Next.js applications.

## License

MIT
