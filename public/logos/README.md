# Logo Assets

Replace these placeholder logos with your organization's branding assets.

## Required Files

### Main Organization Logo
- `main_logo.png` - Primary organization logo (recommended: 200x200px, transparent background)
- `main_logo_dark.png` - Dark mode version (optional)

### Partner/Affiliate Logos (if applicable)
- `parent_org_logo.png` - Parent organization logo (e.g., national organization logo for local chapters)
- `institution_logo.png` - Your institution/college logo
- `secondary_logo.png` - Any secondary organization logo (e.g., special committee or sub-branch)

## Image Guidelines

- **Format**: PNG with transparent background preferred
- **Size**: Logos should be high resolution (at least 200x200px)
- **Naming**: Use descriptive, lowercase names with underscores
- **Optimization**: Optimize images for web to reduce loading times

## Current Structure

```
logos/
├── main_logo.png              # Your primary organization logo
├── institution_logo.png       # Your college/university logo  
├── parent_org_logo.png        # Parent organization (e.g., national organization)
├── secondary_logo.png         # Secondary branch/chapter logo
└── README.md                  # This file
```

## Usage in Code

Logos are referenced in the organization config file (`src/config/organization.ts`). Update the `branding.logoPath` to point to your main logo file.