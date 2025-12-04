import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';

export async function POST() {
  try {
    await connectDB();

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingUser = await User.findOne({ clerkId: user.id });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'User already exists',
        user: existingUser 
      }, { status: 200 });
    }

    const newUser = await User.create({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || '',
    });

    return NextResponse.json({ 
      message: 'User created successfully',
      user: newUser 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    return NextResponse.json({ 
      error: 'Failed to create user',
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

    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: dbUser }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
