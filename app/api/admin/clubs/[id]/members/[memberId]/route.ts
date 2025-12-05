// app/api/admin/clubs/[id]/members/[memberId]/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/isAdmin';
import connectDB from '@/lib/db';
import Club from '@/models/Club';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    // Check admin access
    await requireAdmin();

    const { id, memberId } = await params;
    await connectDB();

    const club = await Club.findById(id);

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      );
    }

    // Check if member exists in club
    const memberExists = club.members.some((m: any) => m.toString() === memberId);
    
    if (!memberExists) {
      return NextResponse.json(
        { error: 'Member not found in club' },
        { status: 404 }
      );
    }

    // Check if trying to remove creator
    if (club.createdBy.toString() === memberId) {
      return NextResponse.json(
        { error: 'Cannot remove club creator' },
        { status: 400 }
      );
    }

    // Remove member from club
    club.members = club.members.filter((m: any) => m.toString() !== memberId);
    await club.save();

    return NextResponse.json({
      message: 'Member removed successfully',
      club
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
