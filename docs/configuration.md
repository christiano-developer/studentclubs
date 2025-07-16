# Configuration Guide

This guide covers all configuration options available in the Organization Website Template.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Organization Configuration](#organization-configuration)
3. [Academic Configuration](#academic-configuration)
4. [Team Configuration](#team-configuration)
5. [Firebase Configuration](#firebase-configuration)
6. [Feature Toggles](#feature-toggles)

## Environment Variables

All configuration starts with environment variables in your `.env.local` file. Copy `.env.example` and modify the values for your organization.

### Firebase Configuration

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get these values from Firebase Console > Project Settings > General tab.

### Organization Information

```env
NEXT_PUBLIC_ORG_NAME=Your Organization Name
NEXT_PUBLIC_ORG_SHORT_NAME=ORG
NEXT_PUBLIC_ORG_DESCRIPTION=Your organization description
NEXT_PUBLIC_ORG_EMAIL=contact@yourorg.com
NEXT_PUBLIC_ORG_PHONE=+1234567890
NEXT_PUBLIC_ORG_ADDRESS=Your Organization Address
```

### Website Configuration

```env
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_SITE_TITLE=Your Organization
NEXT_PUBLIC_SITE_DESCRIPTION=Official website of Your Organization
```

### Branding

```env
NEXT_PUBLIC_PRIMARY_COLOR=#3b82f6
NEXT_PUBLIC_SECONDARY_COLOR=#1e40af
NEXT_PUBLIC_ACCENT_COLOR=#f59e0b
```

### Feature Toggles

Enable or disable features:

```env
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_CONTACT_FORM=true
NEXT_PUBLIC_ENABLE_CUSTOM_FORMS=true
NEXT_PUBLIC_ENABLE_TEAM_SECTION=true
NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE=false
NEXT_PUBLIC_ENABLE_SECONDARY_BRANCH=true
NEXT_PUBLIC_ENABLE_otherwings_SECTION=false
NEXT_PUBLIC_ENABLE_STATIC_MODE=false
```

### Social Media

```env
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/yourorg
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourorg
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourorg
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/yourorg
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourorg
```

## Organization Configuration

Edit `src/config/organization.ts` to modify organization-specific settings that are computed from environment variables.

### Key Configuration Areas

#### Contact Information
```typescript
contact: {
  email: process.env.NEXT_PUBLIC_ORG_EMAIL || "contact@yourorg.org",
  phone: process.env.NEXT_PUBLIC_ORG_PHONE || "+1234567890",
  address: process.env.NEXT_PUBLIC_ORG_ADDRESS || "Your Institution Address",
}
```

#### Navigation Settings
```typescript
navigation: {
  showParentOrgLinks: true,     // Show parent organization navigation
  showDashboard: true,     // Show dashboard link
  showForms: true,         // Show forms page
  showContact: true,       // Show contact page
  showAbout: true,         // Show about section
  showTeam: true,          // Show team section
}
```

#### Academic Settings
```typescript
academic: {
  institutionType: "engineering_college", // or "university", "technical_institute"
  defaultBranches: [...],
  defaultYears: [...],
}
```

## Academic Configuration

Configure your institution's academic structure in `src/config/academic.ts`.

### Institution Types

The template supports three institution types:

1. **Engineering College** (Default)
   - 4-year program (FE, SE, TE, BE)
   - Engineering branches

2. **University**
   - 4-year program (Freshman, Sophomore, Junior, Senior)
   - General academic programs

3. **Technical Institute**
   - 3-year diploma program
   - Technical specializations

### Customizing Branches

```typescript
export const engineeringCollegeConfig = {
  branches: [
    { value: "COMPUTER_SCIENCE", label: "Computer Science", code: "CS" },
    { value: "ELECTRICAL", label: "Electrical Engineering", code: "EE" },
    // Add your institution's branches
  ],
  // ...
};
```

### Customizing Year Classifications

```typescript
years: [
  { value: "FIRST_YEAR", label: "1st Year (FE)", order: 1 },
  { value: "SECOND_YEAR", label: "2nd Year (SE)", order: 2 },
  // Modify based on your system
],
```

### Switching Institution Types

Set the institution type in environment variables:

```env
NEXT_PUBLIC_INSTITUTION_TYPE=university
```

Or modify the default in `academic.ts`:

```typescript
export const currentAcademicConfig = getAcademicConfig("university");
```

## Team Configuration

Configure your organization's team structure in `src/config/team.ts`.

### Team Sections

The template supports multiple team sections:

```typescript
export const defaultTeamConfig: TeamSection[] = [
  {
    id: "leadership",
    title: "Executive Team",
    color: "text-blue-500",
    shadowColor: "drop-shadow-blue-700",
    members: [...],
  },
  {
    id: "otherwings",
    title: "otherwings Team",
    color: "text-green-500",
    shadowColor: "drop-shadow-green-700",
    members: [...],
  },
  // Add more sections as needed
];
```

### Team Members

Each team member has this structure:

```typescript
{
  id: "unique_id",
  name: "Member Name",
  role: "Position Title",
  description: "Brief description or quote",
  image: "/team/path/to/photo.jpg",
  email: "member@yourorg.com", // optional
  linkedin: "linkedin_url",    // optional
  github: "github_url",        // optional
  order: 1,                    // display order
}
```

### Enabling/Disabling Sections

Control which team sections appear:

```env
NEXT_PUBLIC_ENABLE_SECONDARY_BRANCH=true
NEXT_PUBLIC_ENABLE_otherwings_SECTION=false
```

## Firebase Configuration

### Firestore Security Rules

The template includes comprehensive security rules in `firestore.rules`. Key collections:

- `users` - User registration data
- `contact_messages` - Contact form submissions
- `forms` - Custom forms created by admins
- `form_submissions` - Form submission data
- `app_settings` - Application configuration

### Storage Rules

File upload rules in `storage.rules`:

- Only authenticated users can upload
- File size limits
- Image type restrictions for profile photos

### Firestore Indexes

Required indexes are defined in `firestore.indexes.json`:

- Compound indexes for efficient queries
- Single field indexes for sorting

## Feature Toggles

### Global Features

```env
NEXT_PUBLIC_ENABLE_REGISTRATION=true      # User registration system
NEXT_PUBLIC_ENABLE_CONTACT_FORM=true      # Contact form
NEXT_PUBLIC_ENABLE_CUSTOM_FORMS=true      # Dynamic form builder
NEXT_PUBLIC_ENABLE_TEAM_SECTION=true      # Team member display
NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE=false # Maintenance mode
NEXT_PUBLIC_ENABLE_STATIC_MODE=false      # Static mode deployment
```

### Team Features

```env
NEXT_PUBLIC_ENABLE_SECONDARY_BRANCH=true     # Secondary organization (like Special Committee)
NEXT_PUBLIC_ENABLE_otherwings_SECTION=true # otherwings team section
```

### Advanced Features

Some features are controlled through the organization config:

```typescript
features: {
  enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "true",
  enableContactForm: process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM === "true",
  enableStaticMode: process.env.NEXT_PUBLIC_ENABLE_STATIC_MODE === "true",
  // etc...
}
```

## Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Configuration**: Keep sensitive data in environment variables
3. **Academic Config**: Test with your institution's actual structure
4. **Team Photos**: Use consistent photo dimensions (400x400px recommended)
5. **Colors**: Ensure color contrast meets accessibility standards
6. **Testing**: Test all configurations in development before deploying

## Troubleshooting

### Common Issues

1. **Firebase Config Not Loading**: Check environment variable names and values
2. **Academic Config Errors**: Verify your institution type is supported
3. **Team Photos Not Showing**: Check file paths and permissions
4. **Feature Toggles Not Working**: Ensure environment variables are strings ("true"/"false")

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will show additional console logs for configuration loading.

## Static Mode Configuration

Static mode allows the template to run as a static website without Firebase backend services. This is useful for static site deployment, development environments, or showcasing your organization without full backend functionality.

### Enabling Static Mode

Set the static mode environment variable:

```env
NEXT_PUBLIC_ENABLE_STATIC_MODE=true
```

### Static Mode Features

When static mode is enabled:

#### Available Features
- **Home Page**: Full homepage with hero section, about, and team
- **About Section**: Organization information and mission
- **Team Section**: Team member display with photos and roles
- **Contact Page**: Contact information display (form disabled)
- **Navigation**: Clean navigation without auth-dependent links
- **Responsive Design**: Full mobile and desktop support
- **Branding**: Complete customization and branding support

#### Disabled Features
- **User Authentication**: No Google sign-in or user accounts
- **User Registration**: Registration form is disabled
- **Admin Dashboard**: Admin panel is inaccessible
- **Dynamic Forms**: Form builder and custom forms unavailable
- **Contact Form**: Contact form submission disabled
- **Database Operations**: All Firebase Firestore operations disabled

### Static Mode Implementation

#### Firebase Initialization
Firebase services are conditionally initialized:

```typescript
// lib/firebase.ts
const isStaticMode = organizationConfig.features.enableStaticMode;

if (!isStaticMode && isFirebaseConfigComplete) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}
```

#### Navigation Changes
Auth-dependent navigation items are hidden:

```typescript
// components/navBar.tsx
{!loading && !isStaticMode && (
  // Authentication-dependent links
)}
```

#### Error Handling
Functions gracefully handle static mode:

```typescript
export const submitContactMessage = async (formData: ContactFormData) => {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Contact form is not available in static mode.");
  }
  // ... Firebase operations
};
```

### Static Mode Deployment

#### Build Process
Build the project with static mode enabled:

```bash
# Set static mode
export NEXT_PUBLIC_ENABLE_STATIC_MODE=true

# Build for static deployment
npm run build

# Optional: Export static files
npm run export
```

#### Deployment Targets

##### GitHub Pages
1. Enable static mode in repository settings
2. Set `NEXT_PUBLIC_ENABLE_STATIC_MODE=true` in GitHub Actions
3. Deploy to `gh-pages` branch

##### Netlify
1. Add environment variable in site settings
2. Set build command: `npm run build`
3. Set publish directory: `out` or `.next`

##### Vercel
1. Configure environment variables in project settings
2. Automatic deployment on git push
3. Static optimization handled automatically

##### Any Static Host
1. Build with static mode enabled
2. Upload built files to hosting provider
3. Configure routing for single-page application

### Static Mode Configuration Examples

#### Development Environment
```env
# .env.local
NEXT_PUBLIC_ENABLE_STATIC_MODE=true
NEXT_PUBLIC_ORG_NAME=Your Organization
NEXT_PUBLIC_ORG_DESCRIPTION=Static development site
```

#### Production Static Site
```env
# .env.production
NEXT_PUBLIC_ENABLE_STATIC_MODE=true
NEXT_PUBLIC_SITE_URL=https://yourorg.github.io
NEXT_PUBLIC_ORG_NAME=Your Organization Name
NEXT_PUBLIC_ORG_EMAIL=contact@yourorg.com
```

### Static Mode Troubleshooting

#### Common Issues

1. **Firebase Errors in Console**
   - **Solution**: Check that static mode is properly enabled
   - **Check**: Verify `NEXT_PUBLIC_ENABLE_STATIC_MODE=true`

2. **Auth-dependent Components Breaking**
   - **Solution**: Ensure components check `isFirebaseEnabled` flag
   - **Check**: Review component conditional rendering

3. **Navigation Issues**
   - **Solution**: Verify navigation components respect static mode
   - **Check**: Ensure auth-dependent links are hidden

4. **Build Failures**
   - **Solution**: Check for Firebase imports in static mode
   - **Check**: Verify all Firebase calls are properly wrapped

#### Performance Optimization

1. **Bundle Size**: Firebase libraries are not included in static builds
2. **Loading Speed**: No Firebase initialization reduces startup time
3. **Static Optimization**: Next.js optimizes static pages automatically

#### SEO Considerations

1. **Meta Tags**: Ensure proper SEO tags for static pages
2. **Sitemap**: Generate sitemap for static pages
3. **Structured Data**: Add organization schema markup

### Static Mode Best Practices

1. **Environment Management**:
   - Keep static mode configuration separate from Firebase config
   - Use environment-specific configuration files
   - Document static mode setup for team members

2. **Testing**:
   - Test static mode in development before deployment
   - Verify all pages load correctly without Firebase
   - Check navigation and user experience

3. **Content Management**:
   - Ensure all content is properly configured
   - Update team information and organization details
   - Optimize images for static hosting

4. **Deployment Strategy**:
   - Choose appropriate static hosting platform
   - Configure custom domain if needed
   - Set up SSL/TLS certificates

5. **Monitoring**:
   - Set up analytics for static site
   - Monitor static site performance
   - Track visitor engagement

This configuration allows you to deploy a fully functional static version of your organization website without any backend dependencies.
