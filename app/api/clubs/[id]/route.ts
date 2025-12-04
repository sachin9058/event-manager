import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Club from '@/models/Club';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const club = await Club.findById(id)
      .populate('createdBy', 'clerkId firstName lastName email imageUrl')
      .populate('members', 'clerkId firstName lastName email imageUrl');

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    return NextResponse.json({ club }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching club:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch club',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { action, memberId, name, description, category, logo } = body;

    const club = await Club.findById(id);

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Handle member actions
    if (action === 'join') {
      if (!club.members.includes(dbUser._id)) {
        club.members.push(dbUser._id);
        await club.save();
      }
      return NextResponse.json({ message: 'Joined club', club }, { status: 200 });
    }

    if (action === 'leave') {
      club.members = club.members.filter(m => !m.equals(dbUser._id));
      await club.save();
      return NextResponse.json({ message: 'Left club', club }, { status: 200 });
    }

    if (action === 'remove' && memberId) {
      // Only owner can remove members
      if (!club.createdBy.equals(dbUser._id)) {
        return NextResponse.json({ error: 'Only owner can remove members' }, { status: 403 });
      }
      const memberToRemove = await User.findOne({ clerkId: memberId });
      if (memberToRemove) {
        club.members = club.members.filter(m => !m.equals(memberToRemove._id));
        await club.save();
      }
      return NextResponse.json({ message: 'Member removed', club }, { status: 200 });
    }

    // Handle club updates (only owner)
    if (!club.createdBy.equals(dbUser._id)) {
      return NextResponse.json({ error: 'Only owner can update club' }, { status: 403 });
    }

    if (name) club.name = name;
    if (description !== undefined) club.description = description;
    if (category) club.category = category;
    if (logo !== undefined) club.logo = logo;

    await club.save();

    const updatedClub = await Club.findById(club._id)
      .populate('createdBy', 'clerkId firstName lastName email imageUrl')
      .populate('members', 'clerkId firstName lastName email imageUrl');

    return NextResponse.json({ message: 'Club updated', club: updatedClub }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating club:', error);
    return NextResponse.json({ 
      error: 'Failed to update club',
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const club = await Club.findById(id);

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Only owner can delete
    if (!club.createdBy.equals(dbUser._id)) {
      return NextResponse.json({ error: 'Only owner can delete club' }, { status: 403 });
    }

    await Club.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Club deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting club:', error);
    return NextResponse.json({ 
      error: 'Failed to delete club',
      details: error.message 
    }, { status: 500 });
  }
}
