import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Club from "@/models/Club";
import User from "@/models/User";
import { generateCertificate, CertificateData } from "@/lib/certificateGenerator";
import { sendEmail, generateCertificateEmailHTML } from "@/lib/emailService";
import { getUserRole } from "@/lib/roles";

// POST /api/clubs/[id]/certificates - Generate and send certificates to all members
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { eventName, eventDate, collegeName, position, memberIds } = body;

    if (!eventName || !eventDate || !collegeName) {
      return NextResponse.json(
        { error: "Event name, date, and college name are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the club and populate members
    const club = await Club.findById(id).populate("createdBy members");
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    const dbUser = await User.findOne({ clerkId: userId });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is the club owner or admin
    const userRole = await getUserRole(userId);
    const isOwner = (club.createdBy as any)._id.equals(dbUser._id);
    
    if (!isOwner && userRole !== 'admin') {
      return NextResponse.json(
        { error: "Only club owner or admin can generate certificates" },
        { status: 403 }
      );
    }

    // Determine which members to send certificates to
    let targetMembers = club.members;
    if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
      targetMembers = club.members.filter((m: any) => 
        memberIds.includes(m._id.toString())
      );
    }

    if (targetMembers.length === 0) {
      return NextResponse.json(
        { error: "No members selected for certificates" },
        { status: 400 }
      );
    }

    // Generate and send certificates
    const results = {
      success: [] as string[],
      failed: [] as string[],
    };

    for (const member of targetMembers) {
      try {
        const memberData = member as any;
        const memberName = `${memberData.firstName || ''} ${memberData.lastName || ''}`.trim() || memberData.email;

        // Generate certificate
        const certificateData: CertificateData = {
          memberName,
          collegeName,
          clubName: club.name,
          eventName,
          eventDate,
          position: position || 'Participant',
          memberEmail: memberData.email,
          memberId: memberData._id.toString(),
        };

        const pdfBytes = await generateCertificate(certificateData);

        // Send email with certificate
        const emailHTML = generateCertificateEmailHTML({
          memberName,
          clubName: club.name,
          eventName,
          collegeName,
        });

        const emailSent = await sendEmail({
          to: memberData.email,
          subject: `Certificate of Appreciation - ${eventName}`,
          text: `Dear ${memberName},\n\nCongratulations! Please find attached your certificate of appreciation for ${eventName}.\n\nBest regards,\n${club.name}`,
          html: emailHTML,
          attachments: [
            {
              filename: `Certificate_${memberName.replace(/\s+/g, '_')}.pdf`,
              content: Buffer.from(pdfBytes),
              contentType: 'application/pdf',
            },
          ],
        });

        if (emailSent) {
          results.success.push(memberData.email);
        } else {
          results.failed.push(memberData.email);
        }
      } catch (error) {
        console.error(`Failed to send certificate to ${(member as any).email}:`, error);
        results.failed.push((member as any).email);
      }
    }

    return NextResponse.json({
      message: "Certificate generation completed",
      results: {
        total: targetMembers.length,
        success: results.success.length,
        failed: results.failed.length,
        successEmails: results.success,
        failedEmails: results.failed,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error generating certificates:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate certificates" },
      { status: 500 }
    );
  }
}

// GET /api/clubs/[id]/certificates/preview - Generate a preview certificate (for testing)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const isStats = searchParams.get('stats') === 'true';

    await connectDB();

    const club = await Club.findById(id).populate("createdBy");
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // If requesting stats, return certificate statistics
    if (isStats) {
      const isMember = club.members.some((m: any) => m.clerkId === userId);
      const isOwner = (club.createdBy as any).clerkId === userId;

      if (!isMember && !isOwner) {
        return NextResponse.json({ error: 'Not authorized to view this data' }, { status: 403 });
      }

      // For now, return mock data since Certificate model doesn't exist yet
      // In the future, you can create the Certificate model and query it here
      return NextResponse.json({
        total: 0,
        totalEvents: 0,
      });
    }

    // Otherwise, generate preview certificate
    const eventName = searchParams.get('eventName') || 'Sample Event';
    const eventDate = searchParams.get('eventDate') || new Date().toLocaleDateString();
    const collegeName = searchParams.get('collegeName') || 'Sample College';
    const memberName = searchParams.get('memberName') || 'John Doe';
    const position = searchParams.get('position') || 'Participant';

    // Check if user is the creator
    if ((club.createdBy as any).clerkId !== userId) {
      return NextResponse.json(
        { error: "Only club creator can preview certificates" },
        { status: 403 }
      );
    }

    // Generate preview certificate
    const certificateData: CertificateData = {
      memberName,
      collegeName,
      clubName: club.name,
      eventName,
      eventDate,
      position,
    };

    const pdfBytes = await generateCertificate(certificateData);

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Certificate_Preview.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Error in GET certificates:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
