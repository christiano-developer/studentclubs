# Deployment Guide

This guide covers deploying your organization website to production using Firebase Hosting and other platforms.

## Table of Contents

1. [Firebase Hosting (Recommended)](#firebase-hosting-recommended)
2. [Static Mode Deployment](#static-mode-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [Environment Variables](#environment-variables)
6. [Custom Domain Setup](#custom-domain-setup)
7. [SSL Certificate](#ssl-certificate)
8. [Performance Optimization](#performance-optimization)
9. [Monitoring and Analytics](#monitoring-and-analytics)

## Firebase Hosting (Recommended)

Firebase Hosting is recommended since the template is built for Firebase backend services.

### Prerequisites

- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project created and configured
- Environment variables configured in `.env.local`

### Initial Setup

1. **Initialize Firebase Hosting** (if not already done):
   ```bash
   firebase login
   firebase init hosting
   ```

2. **Configure `firebase.json`** (already configured in template):
   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

### Manual Deployment

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

### Automated Deployment

The template includes GitHub Actions for automatic deployment. Configure these secrets in your GitHub repository:

#### Required Secrets

1. **Firebase Configuration**:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_PROJECT_ID`

2. **Organization Configuration**:
   - `NEXT_PUBLIC_ORG_NAME`
   - `NEXT_PUBLIC_ORG_SHORT_NAME`
   - `NEXT_PUBLIC_ORG_DESCRIPTION`
   - `NEXT_PUBLIC_ORG_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SITE_TITLE`
   - `NEXT_PUBLIC_SITE_DESCRIPTION`

3. **Firebase Service Account**:
   - `FIREBASE_SERVICE_ACCOUNT` (JSON key from Firebase Console)

#### Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each required secret

#### Firebase Service Account Setup

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the entire JSON content to `FIREBASE_SERVICE_ACCOUNT` secret

### Deployment Process

The GitHub Action automatically:
1. Installs dependencies
2. Runs linting
3. Builds the project
4. Deploys to Firebase Hosting (on main branch pushes)

## Static Mode Deployment

Static mode allows you to deploy your organization website without Firebase backend services. This is ideal for static hosting platforms like GitHub Pages, Netlify, or any CDN.

### When to Use Static Mode

- **Static hosting platforms**: GitHub Pages, Netlify, Vercel static hosting
- **Development environments**: Testing without Firebase setup
- **Showcase websites**: Displaying organization info without backend
- **CDN deployment**: Fast global content delivery
- **Budget-conscious deployments**: No Firebase hosting costs

### Static Mode Features

#### Available in Static Mode
- ✅ **Home Page**: Complete homepage with hero section
- ✅ **About Section**: Organization information and mission
- ✅ **Team Section**: Team member profiles and photos
- ✅ **Contact Page**: Contact information display
- ✅ **Navigation**: Clean navigation without auth links
- ✅ **Responsive Design**: Full mobile and desktop support
- ✅ **SEO Optimization**: Meta tags and structured data
- ✅ **Performance**: Fast loading with static optimization

#### Disabled in Static Mode
- ❌ **User Authentication**: No Google sign-in
- ❌ **User Registration**: Registration forms disabled
- ❌ **Admin Dashboard**: Admin panel inaccessible
- ❌ **Dynamic Forms**: Form builder unavailable
- ❌ **Contact Form**: Form submission disabled
- ❌ **Database Operations**: All Firebase operations disabled

### Static Mode Setup

#### 1. Enable Static Mode

Set the environment variable:

```bash
# In .env.local or environment settings
NEXT_PUBLIC_ENABLE_STATIC_MODE=true
```

#### 2. Configure Organization Details

Ensure all organization details are properly configured:

```env
# Required for static mode
NEXT_PUBLIC_ORG_NAME=Your Organization Name
NEXT_PUBLIC_ORG_SHORT_NAME=ORG
NEXT_PUBLIC_ORG_DESCRIPTION=Your organization description
NEXT_PUBLIC_ORG_EMAIL=contact@yourorg.com
NEXT_PUBLIC_ORG_PHONE=+1234567890
NEXT_PUBLIC_ORG_ADDRESS=Your Organization Address

# Site configuration
NEXT_PUBLIC_SITE_URL=https://yourorg.github.io
NEXT_PUBLIC_SITE_TITLE=Your Organization
NEXT_PUBLIC_SITE_DESCRIPTION=Official website of Your Organization

# Feature toggles for static mode
NEXT_PUBLIC_ENABLE_TEAM_SECTION=true
NEXT_PUBLIC_ENABLE_STATIC_MODE=true
```

#### 3. Build for Static Deployment

```bash
# Install dependencies
npm install

# Build with static mode
npm run build

# Optional: Test locally
npx serve out
```

### Platform-Specific Deployment Guides

#### GitHub Pages Deployment

**Manual Deployment**:

```bash
# Build for GitHub Pages
NEXT_PUBLIC_ENABLE_STATIC_MODE=true npm run build

# Deploy to gh-pages branch
npx gh-pages -d out
```

**Repository Configuration**:
- Go to Settings > Pages
- Source: Deploy from a branch
- Branch: `gh-pages`
- Root directory: `/ (root)`

#### Netlify Deployment

##### Method 1: Git Integration (Recommended)

1. **Connect repository to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `out`

3. **Set environment variables**:
   ```
   NEXT_PUBLIC_ENABLE_STATIC_MODE=true
   NEXT_PUBLIC_ORG_NAME=Your Organization Name
   NEXT_PUBLIC_SITE_URL=https://yoursite.netlify.app
   ```

4. **Create `netlify.toml`**:
   ```toml
   [build]
     command = "npm run build"
     publish = "out"
   
   [build.environment]
     NEXT_PUBLIC_ENABLE_STATIC_MODE = "true"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

##### Method 2: Manual Deployment

```bash
# Build for Netlify
NEXT_PUBLIC_ENABLE_STATIC_MODE=true npm run build

# Deploy using Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

#### Vercel Static Deployment

1. **Import project to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository

2. **Configure environment variables**:
   - Add `NEXT_PUBLIC_ENABLE_STATIC_MODE=true`
   - Add other required environment variables

3. **Configure build settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `out`

4. **Create `vercel.json`**:
   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "outputDirectory": "out",
     "installCommand": "npm install"
   }
   ```

#### Surge.sh Deployment

Quick deployment for static sites:

```bash
# Install Surge
npm install -g surge

# Build for static deployment
NEXT_PUBLIC_ENABLE_STATIC_MODE=true npm run build

# Deploy to Surge
cd out
surge . yourorg.surge.sh
```

### Static Mode Configuration Examples

#### Development Configuration

```env
# .env.local
NEXT_PUBLIC_ENABLE_STATIC_MODE=true
NEXT_PUBLIC_ORG_NAME=Your Organization
NEXT_PUBLIC_ORG_DESCRIPTION=Development static site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Production Configuration

```env
# .env.production
NEXT_PUBLIC_ENABLE_STATIC_MODE=true
NEXT_PUBLIC_SITE_URL=https://yourorg.github.io
NEXT_PUBLIC_ORG_NAME=Your Organization Name
NEXT_PUBLIC_ORG_EMAIL=contact@yourorg.com
NEXT_PUBLIC_ORG_PHONE=+1234567890
NEXT_PUBLIC_ENABLE_TEAM_SECTION=true
```

### Static Mode Optimization

#### 1. Image Optimization

```bash
# Optimize images before deployment
npm install -g imagemin-cli
imagemin public/team/*.jpg --out-dir=public/team/optimized
```

#### 2. Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --analyze
```

#### 3. Performance Optimization

- **Image formats**: Use WebP when possible
- **Compression**: Enable gzip compression on hosting platform
- **Caching**: Configure proper cache headers
- **CDN**: Use CDN for global content delivery

### Static Mode Troubleshooting

#### Common Issues

1. **Routing Issues**
   - **Problem**: 404 errors on page refresh
   - **Solution**: Configure SPA routing on hosting platform
   - **Example**: Add `_redirects` file for Netlify

2. **Asset Loading Issues**
   - **Problem**: Images or assets not loading
   - **Solution**: Check asset paths are relative
   - **Fix**: Use Next.js Image component

3. **Environment Variables Not Loading**
   - **Problem**: Configuration not applied
   - **Solution**: Verify `NEXT_PUBLIC_` prefix
   - **Check**: Ensure variables are set in hosting platform

4. **Build Failures**
   - **Problem**: Build fails with Firebase errors
   - **Solution**: Ensure static mode is enabled
   - **Debug**: Check build logs for specific errors

#### Performance Issues

1. **Large Bundle Size**
   - **Check**: Ensure Firebase libraries are tree-shaken
   - **Solution**: Verify static mode is properly configured
   - **Optimize**: Remove unused dependencies

2. **Slow Loading**
   - **Check**: Image optimization
   - **Solution**: Use appropriate image formats and sizes
   - **Optimize**: Enable compression on hosting platform

### Static Mode Best Practices

1. **Pre-deployment Testing**
   - Test locally with `npx serve out`
   - Verify all pages load correctly
   - Check navigation functionality
   - Test responsive design

2. **Content Management**
   - Keep team information updated
   - Optimize images for web
   - Ensure all links work correctly
   - Update contact information

3. **SEO Optimization**
   - Configure proper meta tags
   - Add structured data
   - Create sitemap
   - Optimize for search engines

4. **Security**
   - No sensitive data in client code
   - Use HTTPS for production
   - Configure security headers
   - Regular security updates

5. **Monitoring**
   - Set up analytics
   - Monitor site performance
   - Track user engagement
   - Monitor uptime

This comprehensive guide ensures successful static mode deployment across various platforms while maintaining optimal performance and user experience.

## Vercel Deployment

Alternative deployment platform with excellent Next.js integration.

### Steps

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Import your project

2. **Configure Environment Variables**:
   - Add all environment variables from `.env.example`
   - Set `NEXT_PUBLIC_*` variables

3. **Deploy**:
   - Vercel automatically deploys on git pushes
   - Production deploys from main branch
   - Preview deploys from feature branches

### Vercel Configuration

Create `vercel.json` (optional):
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

## Netlify Deployment

Another popular deployment option.

### Steps

1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`

3. **Environment Variables**:
   - Add all variables from `.env.example`

### Netlify Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Environment Variables

### Production Environment Setup

1. **Copy production template**:
   ```bash
   cp .env.example .env.production
   ```

2. **Update values** for production:
   ```env
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-prod-project
   # ... other production values
   ```

### Environment Variable Checklist

Ensure all required variables are set:

- [ ] Firebase configuration variables
- [ ] Organization information
- [ ] Site URL and metadata
- [ ] Feature toggles
- [ ] Social media links (if applicable)
- [ ] Analytics tracking ID (if applicable)

## Custom Domain Setup

### Firebase Hosting Custom Domain

1. **Add Custom Domain**:
   ```bash
   firebase hosting:channel:deploy live --only hosting
   ```

2. **In Firebase Console**:
   - Go to Hosting section
   - Click "Add custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

3. **DNS Configuration**:
   - Add provided TXT record for verification
   - Add A or CNAME records as instructed

### Domain Verification

DNS propagation can take 24-48 hours. Verify with:
```bash
dig your-domain.com
nslookup your-domain.com
```

## SSL Certificate

Firebase Hosting automatically provides SSL certificates for custom domains.

### Verification

- Check certificate status in Firebase Console
- Verify HTTPS redirect is working
- Test with SSL Labs: [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)

## Performance Optimization

### Build Optimization

1. **Analyze Bundle Size**:
   ```bash
   npm run build -- --analyze
   ```

2. **Image Optimization**:
   - Use Next.js Image component
   - Optimize images before uploading
   - Use appropriate formats (WebP when possible)

3. **Code Splitting**:
   - Use dynamic imports for large components
   - Implement lazy loading

### Caching Strategy

Firebase Hosting automatically configures caching:
- Static assets: Long-term caching
- HTML: Short-term caching
- API responses: Configure as needed

### Performance Monitoring

1. **Core Web Vitals**:
   - Monitor with Google PageSpeed Insights
   - Use Chrome DevTools
   - Set up Google Analytics

2. **Firebase Performance Monitoring**:
   ```bash
   npm install firebase
   ```
   
   Enable in Firebase Console.

## Monitoring and Analytics

### Google Analytics Setup

1. **Get Tracking ID**:
   - Create Google Analytics property
   - Get GA4 measurement ID

2. **Add to Environment**:
   ```env
   NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

3. **Implement Tracking**:
   Already configured in the template.

### Error Monitoring

Consider adding error monitoring:

1. **Sentry** (recommended):
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure in Next.js**:
   ```javascript
   // next.config.js
   const { withSentryConfig } = require('@sentry/nextjs');
   ```

### Uptime Monitoring

Set up monitoring with:
- UptimeRobot
- Firebase App Check
- Custom health check endpoints

## Deployment Checklist

Before going live:

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Firebase project configured properly
- [ ] Custom domain DNS configured
- [ ] SSL certificate verified
- [ ] Performance optimized
- [ ] SEO metadata updated

### Post-Deployment
- [ ] Test all functionality
- [ ] Verify user registration works
- [ ] Test admin dashboard
- [ ] Check all forms
- [ ] Verify email functionality
- [ ] Test on multiple devices
- [ ] Check analytics setup

### Security Checklist
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] No sensitive data in client code
- [ ] Admin access properly restricted
- [ ] Authentication working correctly

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check TypeScript errors
   - Verify all dependencies installed
   - Check environment variables

2. **Deployment Failures**:
   - Verify Firebase CLI authentication
   - Check project permissions
   - Verify service account permissions

3. **Runtime Errors**:
   - Check browser console
   - Verify Firebase configuration
   - Check network requests

### Getting Help

- Check Firebase Hosting documentation
- Review GitHub Actions logs
- Check platform-specific deployment guides
- Open issue in template repository

## Production Maintenance

### Regular Tasks

1. **Dependency Updates**:
   ```bash
   npm audit
   npm update
   ```

2. **Security Updates**:
   - Monitor for security advisories
   - Update dependencies regularly
   - Review Firebase security rules

3. **Backup**:
   - Export Firestore data regularly
   - Backup configuration files
   - Document deployment procedures

4. **Performance Monitoring**:
   - Review analytics monthly
   - Monitor Core Web Vitals
   - Check error rates

### Scaling Considerations

As your organization grows:
- Monitor Firebase usage and billing
- Consider upgrading Firebase plan
- Implement database optimization
- Add CDN for global users
- Consider server-side rendering optimizations