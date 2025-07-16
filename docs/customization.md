# Customization Guide

This guide explains how to customize the Organization Website Template to match your organization's specific needs and branding.

## Table of Contents

1. [Branding & Visual Identity](#branding--visual-identity)
2. [Content Customization](#content-customization)
3. [Layout Modifications](#layout-modifications)
4. [Adding New Features](#adding-new-features)
5. [Styling Customization](#styling-customization)
6. [Static Mode Customization](#static-mode-customization)

## Branding & Visual Identity

### Logo Replacement

1. **Main Logo**: Replace `public/logos/main_logo.png` with your organization's primary logo
2. **Institution Logo**: Replace `public/logos/institution_logo.png` with your college/university logo
3. **Parent Organization Logo**: Replace `public/logos/parent_org_logo.png` (e.g., national organization logo)
4. **Secondary Logo**: Replace `public/logos/secondary_logo.png` for sub-branches

**Logo Guidelines:**
- Format: PNG with transparent background
- Size: Minimum 200x200px, high resolution
- Optimize for web to reduce loading times

### Color Scheme

Update colors in `.env.local`:

```env
NEXT_PUBLIC_PRIMARY_COLOR=#your_primary_color
NEXT_PUBLIC_SECONDARY_COLOR=#your_secondary_color
NEXT_PUBLIC_ACCENT_COLOR=#your_accent_color
```

For advanced color customization, modify `src/app/globals.css`:

```css
:root {
  --primary: your_primary_color;
  --secondary: your_secondary_color;
  --accent: your_accent_color;
}
```

### Typography

The template uses Google Fonts. To change fonts:

1. Update `src/app/layout.tsx`:

```typescript
import { Your_Font_Name } from "next/font/google";

const yourFont = Your_Font_Name({
  weight: ["400", "700"],
  variable: "--font-your-font",
  subsets: ["latin"],
});
```

2. Update Tailwind configuration if needed in `tailwind.config.ts`.

## Content Customization

### Home Page Content

#### Hero Section
Modify `src/app/page.tsx` to customize the hero section:

```typescript
// Customize welcome message words
const words = [
  { text: "Welcome", className: "text-blue-100 text-lg lg:text-7xl" },
  { text: "To", className: "text-blue-100 text-lg lg:text-7xl" },
  // Add your organization's words
];
```

#### About Section
Edit `src/components/About.tsx`:

```typescript
// Update organization description, mission, vision
const aboutContent = {
  title: "About Your Organization",
  description: "Your organization's description...",
  mission: "Your mission statement...",
  vision: "Your vision statement...",
};
```

### Navigation Customization

Modify navigation in `src/components/navBar.tsx`:

```typescript
const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Team", href: "#team" },
  // Add or remove navigation items
];
```

Enable/disable navigation items in `src/config/organization.ts`:

```typescript
navigation: {
  showParentOrgLinks: false,    // Remove parent organization-specific links
  showDashboard: true,
  showForms: true,
  showContact: true,
  showAbout: true,
  showTeam: true,
}
```

### Footer Customization

Update footer content in `src/components/Footer.tsx`:

```typescript
// Modify copyright, links, social media
const footerData = {
  copyright: `© ${new Date().getFullYear()} Your Organization`,
  socialLinks: [...],
  quickLinks: [...],
};
```

## Layout Modifications

### Team Section Customization

#### Team Structure
Modify `src/config/team.ts` to match your organization:

```typescript
export const defaultTeamConfig: TeamSection[] = [
  {
    id: "executive",
    title: "Executive Committee",
    description: "Our leadership team",
    color: "text-blue-500",
    shadowColor: "drop-shadow-blue-700",
    members: [
      {
        id: "president",
        name: "President Name",
        role: "President",
        description: "Leading our organization...",
        image: "/team/leadership/president.jpg",
        email: "president@yourorg.com",
        order: 1,
      },
      // Add more team members
    ],
  },
  // Add more sections as needed
];
```

#### Team Photos
1. Organize photos in `public/team/` directories:
   - `leadership/` - Main executives
   - `otherwings/` - Department heads
   - `advisors/` - Faculty advisors

2. Use consistent naming:
   - `president.jpg`, `vice_president.jpg`, etc.

3. **Photo Guidelines:**
   - Size: 400x400px (1:1 aspect ratio)
   - Format: JPG or PNG
   - Professional appearance
   - Consistent background/lighting

### Form Customization

#### Registration Form
Customize user registration in the registration page by modifying form fields based on your academic configuration.

#### Custom Forms
Admins can create custom forms through the admin dashboard. The form builder supports:
- Text fields
- Number fields
- Dropdown selections
- Required field validation

#### Contact Form
Modify contact form fields in `src/app/contact/page.tsx` if needed.

## Adding New Features

### New Pages

1. Create page in `src/app/`:

```typescript
// src/app/events/page.tsx
export default function EventsPage() {
  return (
    <div>
      <h1>Events</h1>
      {/* Your events content */}
    </div>
  );
}
```

2. Add to navigation in `navBar.tsx`:

```typescript
{ name: "Events", href: "/events" }
```

### New Components

1. Create component in `src/components/`:

```typescript
// src/components/EventCard.tsx
interface Event {
  title: string;
  date: string;
  description: string;
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="border rounded-lg p-4">
      <h3>{event.title}</h3>
      <p>{event.date}</p>
      <p>{event.description}</p>
    </div>
  );
}
```

2. Use in pages:

```typescript
import EventCard from "@/components/EventCard";
```

### Database Collections

Add new Firestore collections:

1. Update security rules in `firestore.rules`
2. Create TypeScript interfaces in `src/types/`
3. Add Firebase functions in `src/lib/firebase.ts`

## Styling Customization

### Tailwind CSS

The template uses Tailwind CSS for styling. Common customizations:

#### Custom Classes
Add to `src/app/globals.css`:

```css
.your-custom-class {
  @apply bg-blue-500 text-white p-4 rounded-lg;
}
```

#### Responsive Design
Use Tailwind's responsive prefixes:

```typescript
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

#### Dark Mode
Add dark mode support:

```typescript
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

### Component Styling

#### Button Variants
Customize button styles in components:

```typescript
const buttonVariants = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};
```

#### Card Components
Create reusable card styles:

```typescript
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);
```

## Advanced Customization

### Custom Hooks

Create reusable logic:

```typescript
// src/hooks/useOrganizationData.ts
export function useOrganizationData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch organization-specific data
  }, []);

  return { data, loading, error };
}
```

### State Management

For complex state, consider adding Zustand or Redux:

```bash
npm install zustand
```

```typescript
// src/store/organizationStore.ts
import { create } from 'zustand';

interface OrganizationState {
  settings: any;
  updateSettings: (settings: any) => void;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  settings: null,
  updateSettings: (settings) => set({ settings }),
}));
```

### Environment-Specific Configuration

Create different configs for different environments:

```typescript
// src/config/environments.ts
const config = {
  development: {
    apiUrl: "http://localhost:3000",
    debugMode: true,
  },
  production: {
    apiUrl: "https://yoursite.com",
    debugMode: false,
  },
};

export const currentConfig = config[process.env.NODE_ENV || 'development'];
```

## Best Practices

1. **Consistency**: Maintain consistent styling across components
2. **Responsiveness**: Test on multiple screen sizes
3. **Accessibility**: Ensure proper color contrast and keyboard navigation
4. **Performance**: Optimize images and lazy load content
5. **SEO**: Update meta tags and structured data
6. **Testing**: Test customizations thoroughly before deployment

## Common Customization Examples

### Professional Society Student Branch
- Enable parent organization-specific navigation links
- Use parent organization brand colors
- Add parent organization logo alongside institutional logo
- Configure engineering college academic structure

### University Student Organization
- Disable parent organization-specific features
- Use university branding
- Configure university academic structure
- Add university-specific pages

### Technical Institute
- Configure 3-year diploma structure
- Focus on technical specializations
- Adjust team structure for institute hierarchy

## Troubleshooting Customization

### Styling Issues
- Clear browser cache
- Check Tailwind class names
- Verify CSS specificity

### Configuration Issues
- Check environment variable syntax
- Validate JSON configuration files
- Review TypeScript type errors

### Image Issues
- Verify file paths and names
- Check image dimensions and formats
- Ensure proper optimization

## Static Mode Customization

Static mode allows you to customize the template for deployment without Firebase backend services. This section covers specific customization considerations for static mode.

### Enabling Static Mode

Enable static mode in your environment configuration:

```env
NEXT_PUBLIC_ENABLE_STATIC_MODE=true
```

### Static Mode Features

#### What's Available in Static Mode
- **Home Page**: Full homepage with hero section, about, and team
- **About Section**: Organization information and mission
- **Team Section**: Team member profiles and photos
- **Contact Page**: Contact information display (no form submission)
- **Navigation**: Clean navigation without authentication links
- **Responsive Design**: Full mobile and desktop support
- **Branding**: Complete customization and branding support

#### What's Disabled in Static Mode
- **User Authentication**: No Google sign-in or user accounts
- **User Registration**: Registration forms are disabled
- **Admin Dashboard**: Admin panel is inaccessible
- **Dynamic Forms**: Form builder and custom forms unavailable
- **Contact Form**: Contact form submission disabled
- **Database Operations**: All Firebase Firestore operations disabled

### Static Mode Content Customization

#### Organization Information
In static mode, all organization information comes from configuration files:

```typescript
// src/config/organization.ts
export const organizationConfig = {
  name: process.env.NEXT_PUBLIC_ORG_NAME || "Your Organization Name",
  shortName: process.env.NEXT_PUBLIC_ORG_SHORT_NAME || "ORG",
  description: process.env.NEXT_PUBLIC_ORG_DESCRIPTION || "Official Organization Website",
  
  contact: {
    email: process.env.NEXT_PUBLIC_ORG_EMAIL || "contact@yourorg.com",
    phone: process.env.NEXT_PUBLIC_ORG_PHONE || "+1234567890",
    address: process.env.NEXT_PUBLIC_ORG_ADDRESS || "Your Organization Address",
  },

  features: {
    enableStaticMode: process.env.NEXT_PUBLIC_ENABLE_STATIC_MODE === "true",
    enableTeamSection: process.env.NEXT_PUBLIC_ENABLE_TEAM_SECTION === "true",
  },
};
```

#### Team Configuration for Static Mode
Team information is crucial in static mode since it's one of the main content sections:

```typescript
// src/config/team.ts
export const defaultTeamConfig: TeamSection[] = [
  {
    id: "leadership",
    title: "Executive Team",
    description: "Our leadership team guiding the organization",
    color: "text-blue-500",
    shadowColor: "drop-shadow-blue-700",
    members: [
      {
        id: "president",
        name: "President Name",
        role: "President",
        description: "Leading our organization forward",
        image: "/team/leadership/president.jpg",
        email: "president@yourorg.com",
        linkedin: "https://linkedin.com/in/president",
        order: 1,
      },
      // Add more team members
    ],
  },
];
```

### Static Mode Navigation Customization

#### Navigation Configuration
Static mode navigation automatically hides authentication-dependent links:

```typescript
// components/navBar.tsx
const isStaticMode = organizationConfig.features.enableStaticMode;

// Static navigation links (always visible)
const NAV_LINKS = [
  { href: "/", label: "Home", icon: <IoHomeOutline /> },
  { href: "/#about", label: "About", icon: <IoInformationCircleOutline /> },
  { href: "/#team", label: "Team", icon: <IoCalendarOutline /> },
  { href: "/contact", label: "Contact", icon: <IoMailOutline /> },
];

// Auth-dependent links (hidden in static mode)
{!loading && !isStaticMode && (
  // Authentication and admin links
)}
```

#### Custom Navigation for Static Mode
You can add custom navigation items for static mode:

```typescript
// Add custom static navigation
const STATIC_NAV_LINKS = [
  { href: "/", label: "Home", icon: <IoHomeOutline /> },
  { href: "/#about", label: "About", icon: <IoInformationCircleOutline /> },
  { href: "/#team", label: "Team", icon: <IoCalendarOutline /> },
  { href: "/contact", label: "Contact", icon: <IoMailOutline /> },
  { href: "/events", label: "Events", icon: <IoCalendarOutline /> }, // Custom page
  { href: "/gallery", label: "Gallery", icon: <IoImagesOutline /> }, // Custom page
];
```

### Static Mode Page Customization

#### Home Page Customization
The home page is fully customizable in static mode:

```typescript
// src/app/page.tsx
export default function HomePage() {
  const config = organizationConfig;
  
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <TypewriterEffect
          words={[
            { text: "Welcome", className: "text-blue-100" },
            { text: "To", className: "text-blue-100" },
            { text: config.name, className: "text-blue-400" },
          ]}
        />
      </section>

      {/* About Section */}
      <About />

      {/* Team Section */}
      {config.features.enableTeamSection && <Team />}
    </div>
  );
}
```

#### About Section Customization
Customize the about section for static mode:

```typescript
// src/components/About.tsx
export default function About() {
  const config = organizationConfig;
  
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          About {config.name}
        </h2>
        
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-6">
            {config.description}
          </p>
          
          {/* Add your custom about content */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p>Your mission statement here...</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p>Your vision statement here...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### Contact Page Customization
In static mode, the contact page shows contact information without form submission:

```typescript
// src/app/contact/page.tsx
export default function ContactPage() {
  const config = organizationConfig;
  const isStaticMode = config.features.enableStaticMode;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      
      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div>
              <strong>Email:</strong> {config.contact.email}
            </div>
            <div>
              <strong>Phone:</strong> {config.contact.phone}
            </div>
            <div>
              <strong>Address:</strong> {config.contact.address}
            </div>
          </div>
        </div>
        
        {/* Contact Form (disabled in static mode) */}
        <div>
          {isStaticMode ? (
            <div className="p-6 bg-gray-100 rounded-lg">
              <p className="text-gray-600">
                Contact form is not available in static mode. 
                Please use the contact information provided to reach us.
              </p>
            </div>
          ) : (
            <ContactForm />
          )}
        </div>
      </div>
    </div>
  );
}
```

### Static Mode Styling Customization

#### Conditional Styling
You can apply different styles based on static mode:

```typescript
// Conditional styling based on static mode
const containerClass = config.features.enableStaticMode 
  ? "static-mode-container" 
  : "full-mode-container";

<div className={`base-container ${containerClass}`}>
  {/* Content */}
</div>
```

#### CSS Custom Properties for Static Mode
```css
/* src/app/globals.css */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
}

/* Static mode specific styles */
.static-mode-container {
  /* Simplified styles for static mode */
  @apply bg-gray-50 min-h-screen;
}

.static-mode-nav {
  /* Navigation styles for static mode */
  @apply bg-white shadow-sm;
}

.static-mode-hero {
  /* Hero section styles for static mode */
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
}
```

### Static Mode Component Customization

#### Creating Static Mode Components
Create components that adapt to static mode:

```typescript
// components/StaticModeWrapper.tsx
interface StaticModeWrapperProps {
  children: React.ReactNode;
  staticFallback?: React.ReactNode;
}

export function StaticModeWrapper({ children, staticFallback }: StaticModeWrapperProps) {
  const isStaticMode = organizationConfig.features.enableStaticMode;
  
  if (isStaticMode && staticFallback) {
    return <>{staticFallback}</>;
  }
  
  if (isStaticMode) {
    return null;
  }
  
  return <>{children}</>;
}

// Usage
<StaticModeWrapper
  staticFallback={<div>Static mode message</div>}
>
  <AuthenticatedContent />
</StaticModeWrapper>
```

#### Conditional Component Rendering
```typescript
// components/ConditionalComponent.tsx
export function ConditionalComponent() {
  const isStaticMode = organizationConfig.features.enableStaticMode;
  
  if (isStaticMode) {
    return (
      <div className="static-mode-component">
        <h2>Welcome to Our Organization</h2>
        <p>This is a static version of our website.</p>
      </div>
    );
  }
  
  return (
    <div className="full-mode-component">
      <AuthenticatedUserDashboard />
    </div>
  );
}
```

### Static Mode SEO Customization

#### Meta Tags for Static Mode
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: organizationConfig.site.title,
  description: organizationConfig.site.description,
  openGraph: {
    title: organizationConfig.site.title,
    description: organizationConfig.site.description,
    url: organizationConfig.site.url,
    siteName: organizationConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: organizationConfig.site.title,
    description: organizationConfig.site.description,
  },
};
```

#### Structured Data for Static Mode
```typescript
// Add structured data for organization
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": organizationConfig.name,
  "description": organizationConfig.description,
  "url": organizationConfig.site.url,
  "email": organizationConfig.contact.email,
  "telephone": organizationConfig.contact.phone,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": organizationConfig.contact.address,
  },
};
```

### Static Mode Best Practices

#### 1. Content Management
- Keep all content in configuration files
- Use environment variables for deployment-specific settings
- Optimize images for web delivery
- Ensure all links work in static mode

#### 2. Performance Optimization
- Remove unused Firebase libraries in static builds
- Optimize images and assets
- Use proper caching strategies
- Minimize JavaScript bundle size

#### 3. Development Workflow
- Test static mode locally before deployment
- Use conditional logic for Firebase-dependent features
- Maintain separate configurations for static and full modes
- Document static mode setup for team members

#### 4. Deployment Considerations
- Use appropriate static hosting platforms
- Configure environment variables correctly
- Set up proper domain and SSL
- Monitor static site performance

### Static Mode Troubleshooting

#### Common Issues and Solutions

1. **Components Breaking in Static Mode**
   - **Issue**: Components trying to use Firebase services
   - **Solution**: Add proper conditional checks for `isFirebaseEnabled`

2. **Navigation Issues**
   - **Issue**: Auth-dependent links still showing
   - **Solution**: Ensure static mode flag is properly checked in navigation

3. **Build Failures**
   - **Issue**: Firebase imports causing build errors
   - **Solution**: Use dynamic imports or conditional initialization

4. **Content Not Loading**
   - **Issue**: Content depending on database calls
   - **Solution**: Move content to configuration files

This comprehensive guide ensures your organization website works perfectly in static mode while maintaining all essential functionality and customization options.
