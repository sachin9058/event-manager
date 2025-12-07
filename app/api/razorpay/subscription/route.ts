import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscription = dbUser.subscription || {
      plan: 'free',
      status: 'active',
    };

    return NextResponse.json({ subscription });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json();

    await connectDB();

    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'cancel') {
      // Cancel subscription
      await User.findOneAndUpdate(
        { clerkId: user.id },
        {
          'subscription.status': 'cancelled',
          'subscription.autoRenew': false,
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Subscription cancelled successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to manage subscription' },
      { status: 500 }
    );
  }
}
