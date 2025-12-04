import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Club from "@/models/Club";
import User from "@/models/User";

// POST /api/clubs/join/[token] - Join a club using invite token
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find the club with this invite token
    const club = await Club.findOne({ inviteToken: token });
    if (!club) {
      return NextResponse.json({ error: "Invalid or expired invite link" }, { status: 404 });
    }

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already a member
    if (club.members.includes(user._id)) {
      return NextResponse.json({ 
        message: "Already a member",
        clubId: club._id,
        clubName: club.name 
      }, { status: 200 });
    }

    // Add user to club members
    club.members.push(user._id);
    await club.save();

    return NextResponse.json({ 
      message: "Successfully joined the club",
      clubId: club._id,
      clubName: club.name 
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error joining club:", error);
    return NextResponse.json(
      { error: error.message || "Failed to join club" },
      { status: 500 }
    );
  }
}

// GET /api/clubs/join/[token] - Verify invite token and get club info
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  
  try {
    await connectDB();

    const club = await Club.findOne({ inviteToken: token })
      .populate("createdBy", "firstName lastName email imageUrl")
      .select("name description category logo members createdAt");
    
    if (!club) {
      return NextResponse.json({ error: "Invalid or expired invite link" }, { status: 404 });
    }

    return NextResponse.json({ 
      club: {
        name: club.name,
        description: club.description,
        category: club.category,
        logo: club.logo,
        memberCount: club.members.length,
        createdBy: club.createdBy,
        createdAt: club.createdAt,
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error verifying invite token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify invite link" },
      { status: 500 }
    );
  }
}
