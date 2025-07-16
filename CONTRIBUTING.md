# Contributing to Organization Website Template

Thank you for your interest in contributing to the Organization Website Template! This document provides guidelines for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Guidelines](#development-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project follows a Code of Conduct to ensure a welcoming environment for all contributors. By participating, you agree to uphold this code.

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome people of all backgrounds and identities
- **Be collaborative**: Work together constructively
- **Be professional**: Maintain professionalism in all interactions

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase account for testing
- Git knowledge
- Basic understanding of React/Next.js
- TypeScript familiarity (helpful but not required)

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Fill in your Firebase configuration
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

1. **Bug Fixes**: Fix issues in the existing code
2. **Feature Enhancements**: Improve existing features
3. **New Features**: Add new functionality
4. **Documentation**: Improve or add documentation
5. **Configuration Templates**: Add support for new institution types
6. **Translations**: Add internationalization support
7. **Performance Improvements**: Optimize code and assets

### Areas Where Help is Needed

- **Institution Support**: Adding more academic structures
- **Accessibility**: Improving accessibility features
- **Mobile Optimization**: Enhancing mobile experience
- **SEO Improvements**: Better search engine optimization
- **Testing**: Adding comprehensive tests
- **Documentation**: Expanding guides and examples

## Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the ESLint configuration
- **Formatting**: Use Prettier for code formatting
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic

### File Structure

```
src/
├── app/                 # Next.js pages
├── components/          # Reusable React components
├── config/             # Configuration files
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

### Configuration Guidelines

- Keep configuration flexible and extensible
- Use environment variables for sensitive data
- Provide clear defaults for all configuration options
- Document all configuration options

### Component Guidelines

- Create reusable, composable components
- Use TypeScript interfaces for props
- Follow React best practices
- Ensure components are accessible
- Write clear prop documentation

### Example Component:

```typescript
interface ButtonProps {
  /** Button text */
  children: React.ReactNode;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
}

/**
 * Reusable button component with variants
 */
export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false 
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded font-medium";
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

## Pull Request Process

### Before Submitting

1. **Test your changes**: Ensure everything works correctly
2. **Update documentation**: Update relevant documentation
3. **Check code style**: Run linter and formatter
4. **Write good commit messages**: Use descriptive commit messages
5. **Update changelog**: Add entry if significant change

### PR Requirements

- **Clear description**: Explain what the PR does and why
- **Test instructions**: Provide steps to test the changes
- **Screenshots**: Include screenshots for UI changes
- **Documentation**: Update documentation if needed
- **No breaking changes**: Avoid breaking existing functionality

### PR Review Process

1. **Automated checks**: All CI checks must pass
2. **Code review**: At least one maintainer review required
3. **Testing**: Changes will be tested on different configurations
4. **Documentation review**: Documentation updates will be reviewed
5. **Merge**: PR will be merged after approval

## Issue Guidelines

### Reporting Bugs

Use the bug report template and include:

- **Clear description**: What is the bug?
- **Steps to reproduce**: How can we reproduce it?
- **Expected behavior**: What should happen?
- **Environment details**: OS, browser, Node.js version
- **Configuration**: Institution type, enabled features
- **Error logs**: Any relevant error messages

### Requesting Features

Use the feature request template and include:

- **Problem description**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Use cases**: Who would benefit from this?
- **Implementation ideas**: Any technical suggestions

### Asking for Help

Use the setup help template for:

- Configuration questions
- Setup assistance
- Customization guidance
- Deployment help

## Development Best Practices

### Testing

- Test with different institution types
- Test all feature toggles
- Test on multiple browsers and devices
- Test with different Firebase configurations
- Test deployment process

### Security

- Never commit sensitive data (API keys, passwords)
- Validate all user inputs
- Follow Firebase security best practices
- Use environment variables for configuration

### Performance

- Optimize images and assets
- Use lazy loading where appropriate
- Minimize bundle size
- Test performance on slower devices

### Accessibility

- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Test with multiple configurations
- [ ] Update documentation
- [ ] Create release notes
- [ ] Tag release

## Community

### Getting Help

- **Documentation**: Check the docs/ directory
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord (if available)

### Staying Updated

- **Watch the repository**: Get notified of updates
- **Follow releases**: Subscribe to release notifications
- **Join discussions**: Participate in community discussions

## Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **Release notes**: Major contributions mentioned
- **Documentation**: Author credits where appropriate

## Questions?

If you have questions about contributing:

1. Check the documentation
2. Search existing issues
3. Create a new issue with the "question" label
4. Join community discussions

Thank you for contributing to make this template better for organizations worldwide! 🎉