# Aestheticify Development Guide

This document outlines the development workflow and best practices for the Aestheticify project.

## Git Workflow

We follow a simplified Git Flow workflow:

1. **Main Branches**:
   - `master` - Production-ready code
   - `develop` - Integration branch for ongoing development

2. **Feature Development**:
   - Create feature branches from `develop`: `git checkout -b feature/your-feature-name develop`
   - Make your changes, commit frequently with descriptive messages
   - Push your feature branch to GitHub: `git push -u origin feature/your-feature-name`
   - When ready, create a Pull Request to merge into `develop`

3. **Releasing**:
   - When `develop` is stable and ready for release, create a Pull Request to merge into `master`
   - After thorough testing, approve and merge the PR
   - Tag the release in `master`: `git tag -a v1.0.0 -m "Version 1.0.0"`

## Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use functional components with React hooks
- Keep components small and focused on a single responsibility
- Use Tailwind CSS for styling

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - Reusable UI components
- `/src/layouts` - Layout components for different views
- `/src/utils` - Utility functions
- `/src/lib` - Library configurations (Firebase, etc.)
- `/src/hooks` - Custom React hooks

## Adding New Vibes

When adding a new vibe experience:

1. Create a new component in `/src/components/Vibes`
2. Add the vibe to the VibeSwitcher component
3. Add any necessary audio files to the public directory
4. Update the vibe selection logic in the VibeLayout component

## Firebase Integration

- All Firebase configuration is in `/src/lib/firebase.ts`
- Authentication logic is in `/src/utils/auth.ts` and `/src/hooks/useAuth.ts`
- Firestore operations for saving and retrieving vibes are in `/src/utils/saveVibe.ts` and `/src/utils/getUserVibes.ts`

## Testing

- Write unit tests for utility functions
- Write component tests for UI components
- Run tests before creating Pull Requests

## Deployment

- The application is deployed on Vercel
- Environment variables must be configured in the Vercel dashboard
- Preview deployments are automatically created for Pull Requests

## Common Issues and Solutions

### Hydration Errors
- Ensure server and client rendering match exactly
- Use `useEffect` for client-side only code
- Use dynamic imports with `{ ssr: false }` for components that should only render on the client

### Firebase Authentication
- Check browser console for Firebase errors
- Verify environment variables are correctly set
- Test authentication in an incognito window to avoid cached credentials

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
