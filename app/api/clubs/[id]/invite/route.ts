import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Club from "@/models/Club";
import User from "@/models/User";
import { randomBytes } from "crypto";
import { getUserRole } from "@/lib/roles";

// POST /api/clubs/[id]/invite - Generate a new invite token
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

    await connectDB();

    const club = await Club.findById(id).populate("createdBy");
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
        { error: "Only club owner or admin can generate invite links" },
        { status: 403 }
      );
    }

    // Generate a unique invite token
    const inviteToken = randomBytes(16).toString("hex");
    club.inviteToken = inviteToken;
    await club.save();

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/join/${inviteToken}`;

    return NextResponse.json({ inviteToken, inviteLink }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating invite token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate invite link" },
      { status: 500 }
    );
  }
}

// GET /api/clubs/[id]/invite - Get current invite link
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

    await connectDB();

    const club = await Club.findById(id).populate("createdBy");
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // check if the user is creater
    if ((club.createdBy as any).clerkId !== userId) {
      return NextResponse.json(
        { error: "Only club creator can view invite links" },
        { status: 403 }
      );
    }

    if (!club.inviteToken) {
      return NextResponse.json({ inviteToken: null, inviteLink: null }, { status: 200 });
    }

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/join/${club.inviteToken}`;

    return NextResponse.json({ inviteToken: club.inviteToken, inviteLink }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching invite token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch invite link" },
      { status: 500 }
    );
  }
}

// DELETE /api/clubs/[id]/invite - Revoke invite token
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const club = await Club.findById(id).populate("createdBy");
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // Check if user is the creator
    if ((club.createdBy as any).clerkId !== userId) {
      return NextResponse.json(
        { error: "Only club creator can revoke invite links" },
        { status: 403 }
      );
    }

    club.inviteToken = undefined;
    await club.save();

    return NextResponse.json({ message: "Invite link revoked" }, { status: 200 });
  } catch (error: any) {
    console.error("Error revoking invite token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to revoke invite link" },
      { status: 500 }
    );
  }
}
