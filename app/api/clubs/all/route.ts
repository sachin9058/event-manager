import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Club from '@/models/Club';

// GET /api/clubs/all - Fetch all active clubs (public)
export async function GET() {
  try {
    await connectDB();

    const clubs = await Club.find({ isActive: true })
      .populate('createdBy', 'firstName lastName email imageUrl')
      .populate('members', 'firstName lastName email imageUrl')
      .sort({ createdAt: -1 });

    return NextResponse.json({ clubs }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching all clubs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch clubs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
