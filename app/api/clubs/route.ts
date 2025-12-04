import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Club from '@/models/Club';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

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
  } catch (error: any) {
    console.error('Error creating club:', error);
    return NextResponse.json({ 
      error: 'Failed to create club',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
  } catch (error: any) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch clubs',
      details: error.message 
    }, { status: 500 });
  }
}
