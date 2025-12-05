// app/api/admin/clubs/[id]/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/isAdmin';
import connectDB from '@/lib/db';
import Club from '@/models/Club';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    await requireAdmin();

    const { id } = await params;
    await connectDB();

    const club = await Club.findById(id);

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      );
    }

    await Club.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Club deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    console.error('Error deleting club:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
