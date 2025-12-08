# Quick Setup: Add IIT BHU Logo

## Steps to add your IIT BHU logo to certificates:

### 1. Get the Logo
Download the official IIT BHU logo from:
- IIT BHU official website
- College branding materials
- IT department/admin office

### 2. Prepare the Logo File
- **Format**: PNG (with transparent background preferred)
- **Name**: Rename to exactly `iit-bhu-logo.png`
- **Size**: At least 300x300 pixels (500x500 recommended)
- **Quality**: High resolution for print quality

### 3. Place the Logo
Copy `iit-bhu-logo.png` to:
```
event-manager/
  public/
    iit-bhu-logo.png  <- Place file here
```

### 4. That's It!
The logo will automatically appear on all certificates in the top-left corner.

## Note:
If the logo file is not present, certificates will still generate successfully but without the IIT BHU logo. The QR code and all other features will work normally.

## Troubleshooting:
- **Logo not appearing?** 
  - Check the file name is exactly `iit-bhu-logo.png` (lowercase)
  - Ensure it's in the `public` folder, not a subfolder
  - Try restarting the development server
  
- **Logo looks distorted?**
  - Use a square or nearly-square image (same width/height)
  - Increase the image resolution (500x500px or higher)
  - Use PNG format with transparent background

- **Where is the public folder?**
  - It's at the root of your project: `event-manager/public/`
  - Same folder that contains `hero.jpeg`, `globe.svg`, etc.
