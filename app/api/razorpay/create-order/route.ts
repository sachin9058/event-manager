import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { razorpay, PLANS } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId || !['basic', 'premium'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    await connectDB();

    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Create Razorpay order with receipt limited to 40 characters
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;
    
    const order = await razorpay.orders.create({
      amount: plan.price * 100, // Amount in paise
      currency: plan.currency,
      receipt: receiptId,
      notes: {
        userId: user.id,
        planId: planId,
        email: user.emailAddresses[0]?.emailAddress || '',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
