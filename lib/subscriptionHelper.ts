import connectDB from '@/lib/db';
import User from '@/models/User';
import Club from '@/models/Club';
import { PLANS, PlanType } from '@/lib/razorpay';

export async function checkUserPlanLimits(
  clerkId: string,
  action: 'createClub' | 'addMember' | 'generateCertificate'
) {
  await connectDB();

  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new Error('User not found');
  }

  const userPlan = (user.subscription?.plan || 'free') as PlanType;
  const limits = PLANS[userPlan].limits;

  // Check subscription status
  if (userPlan !== 'free') {
    if (user.subscription?.status !== 'active') {
      throw new Error('Your subscription is not active. Please renew or upgrade your plan.');
    }

    // Check if subscription has expired
    if (user.subscription?.endDate && new Date(user.subscription.endDate) < new Date()) {
      await User.findOneAndUpdate(
        { clerkId },
        { 'subscription.status': 'expired' }
      );
      throw new Error('Your subscription has expired. Please renew your plan.');
    }
  }

  switch (action) {
    case 'createClub': {
      const clubsOwned = await Club.countDocuments({
        'createdBy.clerkId': clerkId,
      });

      if (clubsOwned >= limits.maxClubsOwned) {
        throw new Error(
          `You have reached the maximum number of clubs (${limits.maxClubsOwned}) for your ${userPlan} plan. Please upgrade to create more clubs.`
        );
      }
      break;
    }

    case 'addMember': {
      // This check should be done per club
      // Will be implemented in the club join endpoint
      break;
    }

    case 'generateCertificate': {
      // TODO: Implement certificate tracking per month
      break;
    }
  }

  return {
    allowed: true,
    plan: userPlan,
    limits,
  };
}

export async function getUserSubscription(clerkId: string) {
  await connectDB();

  const user = await User.findOne({ clerkId });
  if (!user) {
    return {
      plan: 'free' as PlanType,
      status: 'active',
    };
  }

  return {
    plan: (user.subscription?.plan || 'free') as PlanType,
    status: user.subscription?.status || 'active',
    endDate: user.subscription?.endDate,
  };
}
