import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update user subscription
    await connectDB();

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    await User.findOneAndUpdate(
      { clerkId: user.id },
      {
        subscription: {
          plan: planId,
          status: 'active',
          razorpaySubscriptionId: razorpay_payment_id,
          startDate: now,
          endDate: endDate,
          autoRenew: true,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
