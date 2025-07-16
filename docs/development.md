# Development Guide

This guide is for developers who want to extend, modify, or contribute to the Organization Website Template.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Architecture](#project-architecture)
3. [Code Organization](#code-organization)
4. [Key Technologies](#key-technologies)
5. [Development Workflow](#development-workflow)
6. [Adding New Features](#adding-new-features)
7. [Testing](#testing)
8. [Performance Optimization](#performance-optimization)
9. [Debugging](#debugging)
10. [Contributing](#contributing)

## Development Environment Setup

### Prerequisites

- **Node.js**: Version 18+ (LTS recommended)
- **Package Manager**: npm, yarn, or pnpm
- **Firebase CLI**: For backend services
- **Git**: For version control
- **Code Editor**: VSCode recommended with extensions

### Recommended VSCode Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "firebase.vscode-firebase-explorer",
    "ms-vscode.vscode-json"
  ]
}
```

### Initial Setup

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd studentclub-website-template
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   # Configure Firebase and organization settings
   # For static mode development, set NEXT_PUBLIC_ENABLE_STATIC_MODE=true
   ```

3. **Firebase Setup** (Skip for static mode):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use <your-project-id>
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Static Mode Development

For developing in static mode without Firebase:

1. **Enable Static Mode**:
   ```bash
   echo "NEXT_PUBLIC_ENABLE_STATIC_MODE=true" >> .env.local
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Features Available in Static Mode**:
   - Home page with hero section
   - About section
   - Team section
   - Contact page (display only)
   - Navigation without auth links
   - Responsive design

4. **Static Mode Testing**:
   ```bash
   # Build for static mode
   npm run build

   # Test static build locally
   npx serve out
   ```

## Project Architecture

### Technology Stack

- **Frontend**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS 4+
- **Backend**: Firebase (Firestore, Auth, Storage, Functions) - Optional in static mode
- **Language**: TypeScript
- **State Management**: React Context + Firebase (Context only in static mode)
- **UI Components**: Custom components with Tailwind
- **Animations**: Framer Motion

### Architecture Patterns

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Firebase      │    │   External      │
│   (Next.js)     │────│   Services      │────│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │
├─ React Components   ├─ Firestore DB       ├─ Google Auth
├─ TypeScript Types   ├─ Authentication     ├─ Email Services
├─ Context Providers  ├─ Storage Bucket     └─ Analytics
├─ Custom Hooks       ├─ Cloud Functions
└─ Utility Functions  └─ Security Rules
```

### Data Flow

1. **User Actions** → React Components
2. **State Changes** → Context Providers
3. **Database Operations** → Firebase Services
4. **Real-time Updates** → Component Re-renders

## Code Organization

### Directory Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── auth/               # Authentication pages
│   ├── contact/            # Contact page
│   ├── dashboard/          # User dashboard
│   ├── forms/              # Dynamic forms
│   ├── organization-links/ # Organization resources
│   ├── register/           # User registration
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable React components
│   ├── ui/                 # Base UI components
│   ├── About.tsx           # Organization about section
│   ├── ContactModal.tsx    # Contact form modal
│   ├── FloatingIcons.tsx   # Animated background elements
│   ├── Footer.tsx          # Site footer
│   ├── FormBuilderModal.tsx # Dynamic form builder
│   ├── navBar.tsx          # Main navigation
│   └── Team.tsx            # Team member display
├── config/                 # Configuration files
│   ├── academic.ts         # Academic structure config
│   ├── organization.ts     # Organization settings
│   └── team.ts             # Team configuration
├── contexts/               # React Context providers
│   └── AuthContext.tsx     # Authentication state
├── hooks/                  # Custom React hooks
│   └── useAppSettings.ts   # App settings hook
├── lib/                    # Utility libraries
│   ├── firebase.ts         # Firebase configuration
│   └── utils.ts            # General utilities
└── types/                  # TypeScript type definitions
    └── auth.ts             # Authentication types
```

### Configuration Architecture

#### Environment-based Configuration
- `.env.local` → Environment variables
- `src/config/organization.ts` → Organization settings
- `src/config/academic.ts` → Academic structure
- `src/config/team.ts` → Team configuration

#### Configuration Hierarchy
```
Environment Variables
        ↓
Organization Config
        ↓
Component Props
        ↓
Default Values
```

## Key Technologies

### Next.js App Router

**File-based Routing**:
```
app/
├── page.tsx           # / route
├── about/page.tsx     # /about route
└── admin/
    ├── page.tsx       # /admin route
    └── layout.tsx     # /admin layout
```

**Key Features Used**:
- Server and Client Components
- Route Groups and Layouts
- Dynamic routing
- Metadata API
- Loading and Error boundaries

### Firebase Integration

#### Authentication
```typescript
// lib/firebase.ts
import { auth } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
```

#### Static Mode Firebase Patterns
```typescript
// lib/firebase.ts - Static mode implementation
import { organizationConfig } from '@/config/organization';

const isStaticMode = organizationConfig.features.enableStaticMode;

// Conditional Firebase initialization
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (!isStaticMode && isFirebaseConfigComplete) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const isFirebaseEnabled = !isStaticMode && isFirebaseConfigComplete;
```

#### Firestore Operations
```typescript
// Example: User management
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const updateUserStatus = async (userId: string, status: string) => {
  if (!isFirebaseEnabled || !db) {
    throw new Error("User management is not available in static mode");
  }

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { validationStatus: status });
};
```

#### Real-time Data
```typescript
// Example: Real-time updates
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(users);
    }
  );
  return unsubscribe;
}, []);
```

### TypeScript Integration

#### Type Definitions
```typescript
// types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  orgId: string;
  validationStatus: 'pending' | 'approved' | 'rejected';
  isAdmin: boolean;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number';
  required: boolean;
}
```

#### Component Type Safety
```typescript
interface TeamMemberProps {
  member: {
    id: string;
    name: string;
    role: string;
    image: string;
  };
  className?: string;
}

export function TeamMember({ member, className }: TeamMemberProps) {
  // Component implementation
}
```

### Tailwind CSS Architecture

#### Configuration
```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      }
    }
  }
}
```

#### Component Patterns
```typescript
// Reusable component classes
const buttonVariants = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  outline: "border border-blue-500 text-blue-500 hover:bg-blue-50"
};
```

## Development Workflow

### Git Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/new-feature
   # Develop feature
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Pull Request Process**:
   - Create PR from feature branch
   - Automated checks (linting, building)
   - Code review by maintainers
   - Merge after approval

### Code Quality

#### Linting and Formatting
```bash
# Linting
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix ESLint issues

# Type checking
npx tsc --noEmit       # TypeScript check
```

#### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### Development Commands

```bash
# Development
npm run dev            # Start dev server
npm run build          # Production build
npm run start          # Start production server

# Quality checks
npm run lint           # Run ESLint
npm run type-check     # TypeScript checking

# Firebase
firebase serve         # Local Firebase hosting
firebase deploy        # Deploy to Firebase
firebase emulators:start # Start Firebase emulators
```

## Adding New Features

### 1. Planning New Features

#### Feature Analysis
- Define user requirements
- Identify affected components
- Plan database schema changes
- Consider security implications
- Design API interfaces

#### Architecture Decisions
- Choose appropriate Next.js patterns
- Plan state management approach
- Design component hierarchy
- Consider performance impact

### 2. Database Schema Changes

#### Firestore Collections
```typescript
// Example: Adding events collection
interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  organizer: string;
  attendees: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

#### Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                   resource.data.organizer == request.auth.uid;
    }
  }
}
```

### 3. Component Development

#### Component Structure
```typescript
// components/EventCard.tsx
interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  className?: string;
}

export function EventCard({
  event,
  onEdit,
  onDelete,
  className
}: EventCardProps) {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-gray-600">{event.description}</p>
      <div className="flex justify-between mt-4">
        <span className="text-sm text-gray-500">
          {event.date.toLocaleDateString()}
        </span>
        <div className="space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(event)}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 4. Page Development

#### Page Structure
```typescript
// app/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EventCard } from '@/components/EventCard';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'events'),
      (snapshot) => {
        const eventList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        setEvents(eventList);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
```

### 5. State Management

#### Context Providers
```typescript
// contexts/EventContext.tsx
interface EventContextType {
  events: Event[];
  loading: boolean;
  createEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  // Implementation
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return context;
}
```

### 6. Custom Hooks

```typescript
// hooks/useEvents.ts
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      setEvents(eventsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
```

## Testing

### Testing Strategy

#### Unit Testing
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

#### Component Testing
```typescript
// __tests__/components/EventCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from '@/components/EventCard';

const mockEvent = {
  id: '1',
  title: 'Test Event',
  description: 'Test Description',
  date: new Date(),
  location: 'Test Location',
  organizer: 'test@example.com'
};

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<EventCard event={mockEvent} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
  });
});
```

#### Integration Testing
```typescript
// __tests__/pages/events.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import EventsPage from '@/app/events/page';

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {},
}));

describe('Events Page', () => {
  it('displays loading state initially', () => {
    render(<EventsPage />);
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });
});
```

### Firebase Testing

#### Emulator Setup
```bash
firebase init emulators
firebase emulators:start
```

#### Test Configuration
```typescript
// setupTests.ts
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

if (process.env.NODE_ENV === 'test') {
  const auth = getAuth();
  const db = getFirestore();

  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### Static Mode Testing

#### Test Configuration for Static Mode
```typescript
// setupTests.ts
import { organizationConfig } from '@/config/organization';

// Mock Firebase for static mode tests
if (organizationConfig.features.enableStaticMode) {
  jest.mock('@/lib/firebase', () => ({
    auth: null,
    db: null,
    isFirebaseEnabled: false,
    submitContactMessage: jest.fn().mockRejectedValue(new Error("Firebase not available in static mode")),
  }));
}
```

#### Static Mode Component Testing
```typescript
// __tests__/components/NavBar.test.tsx
import { render, screen } from '@testing-library/react';
import { NavBar } from '@/components/navBar';

// Mock organization config for static mode
jest.mock('@/config/organization', () => ({
  organizationConfig: {
    features: {
      enableStaticMode: true,
    },
  },
}));

describe('NavBar in Static Mode', () => {
  it('should not render auth-dependent links', () => {
    render(<NavBar />);

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('should render static navigation links', () => {
    render(<NavBar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
```

#### Static Mode Integration Testing
```typescript
// __tests__/integration/staticMode.test.tsx
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Static Mode Integration', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENABLE_STATIC_MODE = 'true';
  });

  it('should render homepage without Firebase dependencies', () => {
    render(<HomePage />);

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Code Splitting

#### Dynamic Imports
```typescript
// Lazy load heavy components
const AdminDashboard = dynamic(() => import('@/components/AdminDashboard'), {
  loading: () => <div>Loading dashboard...</div>
});

// Lazy load features
const EventManager = dynamic(() => import('@/components/EventManager'), {
  ssr: false
});
```

#### Route-based Splitting
```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin-specific layout with lazy loading
  return (
    <Suspense fallback={<AdminLoading />}>
      {children}
    </Suspense>
  );
}
```

### Image Optimization

```typescript
// Using Next.js Image component
import Image from 'next/image';

<Image
  src="/team/member.jpg"
  alt="Team member"
  width={400}
  height={400}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Database Optimization

#### Efficient Queries
```typescript
// Optimized Firestore queries
const getRecentEvents = () => {
  return query(
    collection(db, 'events'),
    where('date', '>=', new Date()),
    orderBy('date', 'asc'),
    limit(10)
  );
};
```

#### Pagination
```typescript
// Implement pagination for large datasets
const [lastVisible, setLastVisible] = useState(null);

const loadMoreEvents = async () => {
  const q = query(
    collection(db, 'events'),
    orderBy('date'),
    startAfter(lastVisible),
    limit(25)
  );

  const snapshot = await getDocs(q);
  setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
};
```

## Debugging

### Development Tools

#### Firebase Debug
```typescript
// Enable Firebase debug mode
if (process.env.NODE_ENV === 'development') {
  // Enable Firestore debug logging
  enableNetwork(db);
}
```

#### Static Mode Debug
```typescript
// Debug static mode configuration
if (process.env.NODE_ENV === 'development') {
  console.log('Static mode enabled:', organizationConfig.features.enableStaticMode);
  console.log('Firebase enabled:', isFirebaseEnabled);
  console.log('Organization config:', organizationConfig);
}
```

#### React DevTools
- Install React Developer Tools browser extension
- Use Profiler for performance analysis
- Component tree inspection

#### Next.js Debug
```bash
# Enable debug mode
NODE_OPTIONS='--inspect' npm run dev

# Analyze bundle
npm run build -- --analyze
```

### Common Debugging Scenarios

#### Authentication Issues
```typescript
// Debug auth state
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user);
    setUser(user);
  });
  return unsubscribe;
}, []);
```

#### Database Connection Issues
```typescript
// Test Firestore connection
const testConnection = async () => {
  try {
    await getDocs(collection(db, 'test'));
    console.log('Firestore connected successfully');
  } catch (error) {
    console.error('Firestore connection failed:', error);
  }
};
```

#### Performance Debugging
```typescript
// Performance monitoring
import { Profiler } from 'react';

<Profiler
  id="AdminDashboard"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} ${phase}: ${actualDuration}ms`);
  }}
>
  <AdminDashboard />
</Profiler>
```

## Contributing

### Code Style Guidelines

#### TypeScript Standards
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper type assertions
- Avoid `any` type usage

#### React Patterns
- Prefer functional components with hooks
- Use TypeScript for prop definitions
- Implement proper error boundaries
- Follow React best practices

#### Component Guidelines
```typescript
// Good component structure
interface ComponentProps {
  /** Required prop with description */
  title: string;
  /** Optional prop with default */
  variant?: 'primary' | 'secondary';
  /** Event handler */
  onClick?: () => void;
}

/**
 * Component description
 * @param props - Component props
 * @returns JSX element
 */
export function Component({
  title,
  variant = 'primary',
  onClick
}: ComponentProps) {
  // Component implementation
}
```

### Documentation Standards

#### Code Comments
```typescript
/**
 * Validates user registration data
 * @param userData - User registration form data
 * @returns Validation result with errors
 */
export function validateUserData(userData: UserRegistrationData): ValidationResult {
  // Implementation
}
```

#### README Updates
- Document new features
- Update configuration examples
- Add troubleshooting information
- Include usage examples

### Testing Requirements

#### Test Coverage
- Unit tests for utilities and hooks
- Component tests for UI components
- Integration tests for page flows
- End-to-end tests for critical paths

#### Test Standards
```typescript
// Test file naming: Component.test.tsx
// Test structure:
describe('Component Name', () => {
  describe('when condition', () => {
    it('should do something', () => {
      // Test implementation
    });
  });
});
```

## Advanced Development Topics

### Custom Hooks Development

```typescript
// hooks/useFirestoreCollection.ts
export function useFirestoreCollection<T>(
  collectionName: string,
  queryConstraints?: QueryConstraint[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = queryConstraints
      ? query(collection(db, collectionName), ...queryConstraints)
      : collection(db, collectionName);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, queryConstraints]);

  return { data, loading, error };
}
```

### Context Pattern Implementation

```typescript
// contexts/AppContext.tsx
interface AppContextType {
  user: User | null;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Context implementation
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

### Error Boundary Implementation

```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

This development guide provides the foundation for extending and maintaining the organization website template. Follow these patterns and best practices to ensure consistent, maintainable, and high-quality code.
