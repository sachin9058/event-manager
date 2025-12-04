# Email Configuration for Certificate Generation

To enable automatic certificate email delivery, you need to configure email credentials in your environment variables.

## Setup Instructions

### 1. Create a `.env.local` file in the root directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM_NAME=Event Manager
```

### 2. Gmail Setup (Recommended)

If using Gmail:

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password and use it as `EMAIL_PASSWORD`

**Note:** Regular Gmail passwords won't work. You MUST use an app-specific password.

### 3. Other Email Providers

For Outlook/Yahoo/other providers:
- Update the `service` field in `lib/emailService.ts`
- Use your provider's SMTP settings
- Get an app-specific password from your provider

### 4. Test the Configuration

1. Go to a club you own
2. Click "📜 Generate Certificates"
3. Fill in event details
4. Select members (or send to all)
5. Click "Generate & Send Certificates"

The system will:
- Generate PDF certificates for each member
- Send them via email with professional HTML templates
- Show success/failure results

## Features

- ✅ Beautiful PDF certificates with club branding
- ✅ Automatic email delivery to all selected members
- ✅ Customizable event details (name, date, college, position)
- ✅ Batch processing with success/failure tracking
- ✅ Preview functionality for club owners
- ✅ Professional email templates with HTML formatting

## Troubleshooting

**Problem:** Emails not sending
- Check your EMAIL_USER and EMAIL_PASSWORD are correct
- Verify you're using an app-specific password (not regular password)
- Check console logs for error messages

**Problem:** Certificates look wrong
- Preview certificates before sending using GET endpoint
- Customize template in `lib/certificateGenerator.ts`

## API Endpoints

- `POST /api/clubs/[id]/certificates` - Generate and send certificates
- `GET /api/clubs/[id]/certificates?eventName=...&eventDate=...` - Preview certificate
