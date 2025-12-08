import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserRole, updateUserRole, UserRole } from '@/lib/roles';

// GET - Get current user's role
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = await getUserRole(user.id);
    
    return NextResponse.json({ role });
  } catch (error: any) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// POST - Request role change
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestedRole } = await req.json();

    if (!requestedRole || !['student', 'club-owner'].includes(requestedRole)) {
      return NextResponse.json(
        { error: 'Invalid role. Choose: student or club-owner' },
        { status: 400 }
      );
    }

    await connectDB();

    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Students can upgrade to club-owner
    // Club-owners can downgrade to student
    // Admin role can only be set via ADMIN_EMAILS
    const currentRole = await getUserRole(user.id);
    
    if (currentRole === 'admin') {
      return NextResponse.json(
        { error: 'Admin role cannot be changed via API' },
        { status: 403 }
      );
    }

    const success = await updateUserRole(user.id, requestedRole as UserRole);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update role' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Role updated to ${requestedRole}`,
      role: requestedRole,
    });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update role' },
      { status: 500 }
    );
  }
}
