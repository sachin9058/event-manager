import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface CertificateData {
  memberName: string;
  collegeName: string;
  clubName: string;
  eventName: string;
  eventDate: string;
  position?: string; // Optional: e.g., "Participant", "Winner", "Organizer"
}

export async function generateCertificate(data: CertificateData): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page (A4 landscape: 842 x 595 points)
  const page = pdfDoc.addPage([842, 595]);
  
  // Load fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  
  const { width, height } = page.getSize();
  
  // Define colors
  const burgundy = rgb(0.44, 0, 0.10); // #70001A
  const gold = rgb(0.78, 0.58, 0.27); // #C89446
  const darkGray = rgb(0.2, 0.2, 0.2);
  
  // Draw border
  const borderMargin = 30;
  page.drawRectangle({
    x: borderMargin,
    y: borderMargin,
    width: width - (borderMargin * 2),
    height: height - (borderMargin * 2),
    borderColor: gold,
    borderWidth: 3,
  });
  
  // Inner border
  page.drawRectangle({
    x: borderMargin + 10,
    y: borderMargin + 10,
    width: width - (borderMargin * 2) - 20,
    height: height - (borderMargin * 2) - 20,
    borderColor: burgundy,
    borderWidth: 1,
  });
  
  // Title: "CERTIFICATE OF APPRECIATION"
  const titleText = 'CERTIFICATE OF APPRECIATION';
  const titleSize = 32;
  page.drawText(titleText, {
    x: width / 2 - (timesRomanBold.widthOfTextAtSize(titleText, titleSize) / 2),
    y: height - 100,
    size: titleSize,
    font: timesRomanBold,
    color: burgundy,
  });
  
  // Decorative line under title
  page.drawLine({
    start: { x: width / 2 - 150, y: height - 110 },
    end: { x: width / 2 + 150, y: height - 110 },
    thickness: 2,
    color: gold,
  });
  
  // "This is to certify that"
  const certifyText = 'This is to certify that';
  const certifySize = 16;
  page.drawText(certifyText, {
    x: width / 2 - (timesRomanFont.widthOfTextAtSize(certifyText, certifySize) / 2),
    y: height - 160,
    size: certifySize,
    font: timesRomanFont,
    color: darkGray,
  });
  
  // Member Name (prominent)
  const nameSize = 36;
  page.drawText(data.memberName, {
    x: width / 2 - (timesRomanBold.widthOfTextAtSize(data.memberName, nameSize) / 2),
    y: height - 210,
    size: nameSize,
    font: timesRomanBold,
    color: burgundy,
  });
  
  // Underline for name
  const nameWidth = timesRomanBold.widthOfTextAtSize(data.memberName, nameSize);
  page.drawLine({
    start: { x: width / 2 - nameWidth / 2, y: height - 218 },
    end: { x: width / 2 + nameWidth / 2, y: height - 218 },
    thickness: 1,
    color: gold,
  });
  
  // Main body text
  const bodySize = 14;
  const position = data.position || 'Participant';
  
  const bodyLine1 = `has successfully participated as a ${position}`;
  page.drawText(bodyLine1, {
    x: width / 2 - (timesRomanFont.widthOfTextAtSize(bodyLine1, bodySize) / 2),
    y: height - 260,
    size: bodySize,
    font: timesRomanFont,
    color: darkGray,
  });
  
  const bodyLine2 = `in the event`;
  page.drawText(bodyLine2, {
    x: width / 2 - (timesRomanFont.widthOfTextAtSize(bodyLine2, bodySize) / 2),
    y: height - 285,
    size: bodySize,
    font: timesRomanFont,
    color: darkGray,
  });
  
  // Event Name (bold)
  const eventSize = 20;
  page.drawText(data.eventName, {
    x: width / 2 - (timesRomanBold.widthOfTextAtSize(data.eventName, eventSize) / 2),
    y: height - 315,
    size: eventSize,
    font: timesRomanBold,
    color: burgundy,
  });
  
  // Organized by
  const bodyLine3 = `organized by ${data.clubName}`;
  page.drawText(bodyLine3, {
    x: width / 2 - (timesRomanBold.widthOfTextAtSize(bodyLine3, bodySize) / 2),
    y: height - 350,
    size: bodySize,
    font: timesRomanFont,
    color: darkGray,
  });
  
  // College name
  const bodyLine4 = `at ${data.collegeName}`;
  page.drawText(bodyLine4, {
    x: width / 2 - (timesRomanFont.widthOfTextAtSize(bodyLine4, bodySize) / 2),
    y: height - 375,
    size: bodySize,
    font: timesRomanBold,
    color: darkGray,
    
  });
  
  // Date
  const dateText = `Date: ${data.eventDate}`;
  const dateSize = 12;
  page.drawText(dateText, {
    x: 80,
    y: 100,
    size: dateSize,
    font: timesRomanFont,
    color: darkGray,
  });
  
  // Signature line and label
  const signatureY = 120;
  page.drawLine({
    start: { x: width - 250, y: signatureY },
    end: { x: width - 80, y: signatureY },
    thickness: 1,
    color: darkGray,
  });
  
  const signatureLabel = 'Authorized Signature';
  page.drawText(signatureLabel, {
    x: width - 230,
    y: signatureY - 20,
    size: 10,
    font: timesRomanItalic,
    color: darkGray,
  });
  
  // Club name at bottom
  const clubLabel = data.clubName;
  page.drawText(clubLabel, {
    x: width - 230,
    y: signatureY - 40,
    size: 10,
    font: timesRomanFont,
    color: darkGray,
  });
  
  // Save the PDF as bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
