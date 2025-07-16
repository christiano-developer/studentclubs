# IEEE GEC Student Branch Website - Claude Context

## Project Overview
Organization Website Template for IEEE GEC Student Branch - A modern, responsive website built with Next.js, TypeScript, Firebase, and Tailwind CSS.

## Technology Stack
- **Frontend**: Next.js 15.3.5 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.11
- **Backend**: Firebase (Authentication, Firestore, Cloud Storage)
- **UI Components**: Custom components with Lucide React icons
- **Animation**: Framer Motion
- **Deployment**: Firebase Hosting

## Key Features
- Firebase Authentication with Google provider
- User registration system with admin approval workflow
- Dynamic form builder with submission management
- Admin dashboard for managing users, forms, and content
- Contact form management
- Team section with member profiles
- Maintenance mode functionality
- Role-based access control
- Mobile-responsive design

## Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── contact/           # Contact page
│   ├── dashboard/         # User dashboard
│   ├── forms/             # Forms management
│   └── register/          # User registration
├── components/            # React components
├── config/               # Configuration files
│   ├── organization.ts   # Organization settings
│   ├── academic.ts      # Academic structure config
│   └── team.ts          # Team configuration
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
└── types/               # TypeScript type definitions
```

## Configuration Files
- `src/config/organization.ts`: Organization-specific settings, branding, features
- `src/config/academic.ts`: Academic structure (branches, years) for different institution types
- `src/config/team.ts`: Team member configuration
- `.env.local`: Environment variables for Firebase config and organization details

## Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Firebase Configuration
The project uses Firebase for:
- Authentication (Google OAuth)
- Firestore database for user data, forms, submissions
- Cloud Storage for file uploads
- Hosting for deployment

### Static Mode (Firebase Disabled)
The project supports running in **static mode** without Firebase dependencies, useful for:
- Static site deployment (GitHub Pages, Netlify, etc.)
- Development environments without Firebase setup
- Showcasing the organization website without backend functionality

**To enable static mode:**
1. Set `NEXT_PUBLIC_ENABLE_STATIC_MODE=true` in your environment variables
2. Or modify `src/config/organization.ts` to set `enableStaticMode: true`

**Static mode behavior:**
- All authentication features are disabled
- Navigation hides auth-dependent links (Dashboard, Forms, Admin, Sign In/Out)
- Firebase functions return appropriate fallbacks or throw descriptive errors
- Only static pages are accessible: Home, About, Team, Contact
- Contact form and registration features are disabled

**Static mode deployment:**
```bash
# Build for static export
npm run build
npm run export  # if available, or use next export
```

## Admin Features
- User management (approve/reject registrations)
- Form builder and submission management
- Contact form responses
- Settings management
- Statistics dashboard

## Current Branch Status
- Branch: template
- Recent commits focus on admin controls, mobile UI improvements, and drag-and-drop functionality
- Multiple files modified for new registration, form, contact, and maintenance features

## Important Notes
- This is a template for student organizations, specifically IEEE Student Branch
- Uses environment variables for easy customization
- Supports different institution types (engineering college, university, technical institute)
- Built-in maintenance mode capability
- Role-based access control for admin functions