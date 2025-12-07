import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Club from '@/models/Club';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { checkUserPlanLimits } from '@/lib/subscriptionHelper';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Check plan limits before creating club
    try {
      await checkUserPlanLimits(user.id, 'createClub');
    } catch (error: any) {
      return NextResponse.json({ 
        error: error.message,
        upgrade: true,
      }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, category, logo } = body;

    if (!name || !description || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, description, category' 
      }, { status: 400 });
    }

    const newClub = await Club.create({
      name,
      description,
      category,
      logo: logo || '',
      createdBy: dbUser._id,
      members: [dbUser._id],
    });

    const populatedClub = await Club.findById(newClub._id)
      .populate('createdBy', 'firstName lastName email imageUrl')
      .populate('members', 'firstName lastName email imageUrl');

    return NextResponse.json({ 
      message: 'Club created successfully',
      club: populatedClub 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating club:', error);
    return NextResponse.json({ 
      error: 'Failed to create club',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to find the user in database
    const dbUser = await User.findOne({ clerkId: user.id });

    // If user doesn't exist in DB yet, create them first
    if (!dbUser) {
      const newUser = await User.create({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
      });

      // Return empty clubs array for new user
      return NextResponse.json({ clubs: [] }, { status: 200 });
    }

    const clubs = await Club.find({ 
      $or: [
        { createdBy: dbUser._id },
        { members: dbUser._id }
      ]
    })
    .populate('createdBy', 'firstName lastName email imageUrl')
    .populate('members', 'firstName lastName email imageUrl')
    .sort({ createdAt: -1 });

    return NextResponse.json({ clubs }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch clubs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
