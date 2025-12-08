import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  const headerPayload = req.headers;
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType = evt.type;

  try {
    await connectDB();

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const userData = {
        clerkId: id,
        email: email_addresses[0]?.email_address || '',
        firstName: first_name || '',
        lastName: last_name || '',
        imageUrl: image_url || '',
        role: 'student', // Default role for new users
      };

      await User.findOneAndUpdate(
        { clerkId: id },
        userData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`User ${eventType}:`, id);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      await User.findOneAndDelete({ clerkId: id });
      console.log(`User deleted:`, id);
    }

    return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
