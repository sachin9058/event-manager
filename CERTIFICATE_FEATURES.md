# Certificate Generation Features

## QR Code Integration

Each certificate now includes a QR code in the bottom-left corner that contains encrypted member information for verification purposes.

### QR Code Contents:
The QR code contains the following JSON data:
```json
{
  "name": "Member Name",
  "email": "member@email.com",
  "memberId": "unique-id",
  "event": "Event Name",
  "club": "Club Name",
  "date": "Event Date",
  "position": "Participant/Winner/etc",
  "college": "IIT BHU Varanasi",
  "verified": true
}
```

### Verification:
Anyone can scan the QR code with a standard QR code reader app to verify the certificate's authenticity and view the member details.

## IIT BHU Logo Integration

### Adding Your Logo:
1. Download the official IIT BHU logo (PNG format recommended)
2. Name it `iit-bhu-logo.png`
3. Place it in the `public` folder
4. Recommended specifications:
   - Format: PNG with transparent background
   - Size: 500x500px or higher
   - Aspect ratio: Square or nearly square

### Logo Placement:
- The logo appears in the top-left corner of the certificate
- Size: 60x60 points
- If the logo file is not found, certificates will be generated without it

## Certificate Layout

```
┌─────────────────────────────────────────────────────┐
│  [IIT Logo]        CERTIFICATE OF                   │
│                    APPRECIATION                     │
│                                                      │
│             This is to certify that                 │
│                  [Member Name]                      │
│                                                      │
│        has successfully participated as a           │
│                  [Position]                         │
│                   in the event                      │
│                  [Event Name]                       │
│              organized by [Club Name]               │
│            at [College Name]                        │
│                                                      │
│  [QR Code]                    [Signature]           │
│  Scan to verify     Date: [Date]                   │
└─────────────────────────────────────────────────────┘
```

## Default Settings

- **College Name**: Pre-filled with "Indian Institute of Technology (BHU) Varanasi"
- **Colors**: Burgundy (#70001A) and Gold (#C89446) theme
- **Format**: A4 Landscape (842 x 595 points)
- **QR Code**: Burgundy colored with member verification data
- **Font**: Times Roman (professional serif font)

## Security Features

1. **QR Code Verification**: Each certificate has a unique QR code containing member details
2. **Verified Flag**: QR code includes a "verified: true" field
3. **Member ID**: Unique database ID included in QR code
4. **Email Verification**: Member email included for additional verification

## Usage

When generating certificates from the club dashboard:
1. Click "Generate Certificates" button
2. Fill in event details (name, date, position)
3. College name is pre-filled with IIT BHU
4. Select members to receive certificates
5. Certificates are generated with QR codes and emailed to members

## Technical Details

- QR Code Library: `qrcode` npm package
- PDF Generation: `pdf-lib` library
- Image Format: PNG for QR codes and logo
- Email Delivery: Nodemailer with PDF attachments
