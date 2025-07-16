# Team Photos

Replace these placeholder images with your team member photos.

## Photo Guidelines

### Technical Requirements
- **Format**: JPG or PNG
- **Size**: 400x400px (square aspect ratio recommended)
- **Resolution**: High quality, well-lit photos
- **Background**: Professional or consistent background preferred

### Naming Convention
Use descriptive names that match your organization structure:
- `chairperson.jpg` - Main leader/president
- `vice_chairperson.jpg` - Vice president/chair
- `secretary.jpg` - Secretary
- `treasurer.jpg` - Treasurer
- `technical_lead.jpg` - Technical coordinator
- `events_lead.jpg` - Events coordinator
- `webmaster.jpg` - Web development lead
- `advisor.jpg` - Faculty advisor

### Directory Structure

```
team/
├── leadership/           # Main leadership team
│   ├── chairperson.jpg
│   ├── vice_chairperson.jpg
│   ├── secretary.jpg
│   └── treasurer.jpg
├── committees/         # Department committees
│   ├── technical_lead.jpg
│   ├── events_lead.jpg
│   └── webmaster.jpg
├── advisors/            # Faculty advisors
│   └── advisor.jpg
├── placeholders/        # Placeholder images for missing photos
│   └── default_avatar.png
└── README.md           # This file
```

## Usage in Code

Team information is configured in the Team component (`src/components/Team.tsx`). You can:

1. Update the team data structure to match your organization
2. Add/remove team positions as needed
3. Customize the team section layout
4. Enable/disable the team section via environment variables

## Placeholder Images

If you don't have photos for some team members, you can:
- Use the default placeholder avatar
- Create custom placeholders with initials
- Temporarily hide those team member cards
