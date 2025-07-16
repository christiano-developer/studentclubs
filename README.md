# Organization Website Template

A modern, responsive website template built for student organizations, professional societies, and similar institutions. Built with Next.js, TypeScript, Firebase, and Tailwind CSS.

## ✨ Features

- 🔥 **Firebase Integration**: Authentication, Firestore database, and cloud storage
- 👥 **User Management**: Registration system with admin approval workflow
- 📝 **Dynamic Forms**: Custom form builder with submission management
- 💼 **Admin Dashboard**: Complete admin panel for managing users, forms, and content
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🎨 **Customizable**: Easy branding and configuration for any organization
- 🔐 **Security**: Protected routes, role-based access control
- 🚀 **Performance**: Optimized for speed and SEO
- 🛠️ **Maintenance Mode**: Built-in maintenance mode functionality
- 📧 **Contact Management**: Contact form with admin management interface
- 📄 **Static Mode**: Optional Firebase-free static site deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase account (optional for static mode)
- Git

### 1. Create your project from this template

Click "Use this template" on GitHub or clone this repository:

```bash
git clone https://github.com/christiano-developer/studentclubs.git
cd YOUR_REPO_NAME
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Enable Storage
5. Install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

6. Login and initialize Firebase:

```bash
firebase login
firebase init
```

Select:
- Firestore (database rules and indexes)
- Functions
- Hosting
- Storage

### 4. Environment Configuration

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Fill in your Firebase configuration and organization details in `.env.local`:

```env
# Firebase Configuration (get from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Organization Configuration
NEXT_PUBLIC_ORG_NAME=Your Organization Name
NEXT_PUBLIC_ORG_SHORT_NAME=ORG
NEXT_PUBLIC_ORG_DESCRIPTION=Your organization description
NEXT_PUBLIC_ORG_EMAIL=contact@yourorg.com

# Static Mode (Optional)
NEXT_PUBLIC_ENABLE_STATIC_MODE=false
# ... (see .env.example for all options)
```

### 5. Customize for your organization

1. **Academic Configuration**: Edit `src/config/academic.ts` to match your institution's branches and year structure
2. **Team Configuration**: Update `src/config/team.ts` with your team structure
3. **Branding**: Replace logos in `public/logos/` and team photos in `public/team/`
4. **Organization Settings**: Modify `src/config/organization.ts` for organization-specific settings

### 6. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 7. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your website!

### 8. Deploy to Production

```bash
# Build and deploy
npm run build
firebase deploy
```

## 🌐 Static Mode Deployment

For static site deployment without Firebase backend:

### Quick Static Setup

```bash
# Enable static mode
echo "NEXT_PUBLIC_ENABLE_STATIC_MODE=true" >> .env.local

# Build for static export
npm run build

# Deploy to static hosting (GitHub Pages, Netlify, etc.)
```

### Static Mode Features

- **No Firebase Required**: Complete static site functionality
- **Public Pages Only**: Home, About, Team, Contact pages
- **Auth-Free Navigation**: Clean navigation without login/signup
- **Easy Deployment**: Compatible with GitHub Pages, Netlify, Vercel
- **Fast Loading**: Optimized for static hosting performance

### Static Deployment Platforms

- **GitHub Pages**: Set `NEXT_PUBLIC_ENABLE_STATIC_MODE=true` in repository settings
- **Netlify**: Add environment variable in site settings
- **Vercel**: Configure in project environment variables
- **Any Static Host**: Upload the built files after enabling static mode

```

## 📚 Documentation

- [Configuration Guide](docs/configuration.md) - Detailed configuration options
- [Customization Guide](docs/customization.md) - How to customize the template
- [Deployment Guide](docs/deployment.md) - Production deployment instructions
- [Admin Guide](docs/admin.md) - Admin dashboard features and usage
- [Development Guide](docs/development.md) - For developers extending the template

## 🏗️ Project Structure

```
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── config/             # Configuration files
│   │   ├── organization.ts  # Organization settings
│   │   ├── academic.ts     # Academic structure config
│   │   └── team.ts         # Team configuration
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
│   ├── logos/              # Organization logos
│   └── team/               # Team member photos
├── functions/              # Firebase Cloud Functions
├── docs/                   # Documentation
└── firebase.json           # Firebase configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `firebase serve` - Serve locally with Firebase hosting
- `firebase deploy` - Deploy to Firebase hosting

### Static Mode Scripts

- `NEXT_PUBLIC_ENABLE_STATIC_MODE=true npm run build` - Build in static mode
- `npm run export` - Export static files (if configured)
- `npx serve out` - Serve static build locally

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- [Documentation](docs/)
- [GitHub Issues](../../issues)
- [Discussions](../../discussions)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Firebase](https://firebase.google.com/)
- UI components inspired by modern design patterns

---

**Made with ❤️ for student organizations worldwide**
