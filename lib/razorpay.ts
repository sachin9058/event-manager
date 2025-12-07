import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export const razorpay = (() => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('Razorpay keys not configured. Payment features will be disabled.');
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
})();

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    interval: 'lifetime',
    features: [
      'Join unlimited clubs',
      'Basic club management',
      'Member directory',
      'Email notifications',
      'Basic analytics',
    ],
    limits: {
      maxClubsOwned: 1,
      maxMembersPerClub: 20,
      certificatesPerMonth: 5,
      eventsPerMonth: 2,
    },
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 99,
    currency: 'INR',
    interval: 'month',
    features: [
      'All Free features',
      'Create up to 3 clubs',
      'Up to 100 members per club',
      '50 certificates per month',
      '10 events per month',
      'Advanced analytics',
      'Priority support',
      'Custom club branding',
    ],
    limits: {
      maxClubsOwned: 3,
      maxMembersPerClub: 100,
      certificatesPerMonth: 50,
      eventsPerMonth: 10,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 199,
    currency: 'INR',
    interval: 'month',
    features: [
      'All Basic features',
      'Unlimited clubs',
      'Unlimited members per club',
      'Unlimited certificates',
      'Unlimited events',
      'Advanced analytics & insights',
      'Dedicated support',
      'API access',
      'White-label options',
      'Export data',
    ],
    limits: {
      maxClubsOwned: Infinity,
      maxMembersPerClub: Infinity,
      certificatesPerMonth: Infinity,
      eventsPerMonth: Infinity,
    },
  },
};

export type PlanType = keyof typeof PLANS;

export function getPlanLimits(plan: PlanType) {
  return PLANS[plan].limits;
}

export function canPerformAction(
  userPlan: PlanType,
  action: 'createClub' | 'addMember' | 'generateCertificate' | 'createEvent',
  currentUsage: {
    clubsOwned?: number;
    membersInClub?: number;
    certificatesThisMonth?: number;
    eventsThisMonth?: number;
  }
) {
  const limits = PLANS[userPlan].limits;

  switch (action) {
    case 'createClub':
      return (currentUsage.clubsOwned || 0) < limits.maxClubsOwned;
    case 'addMember':
      return (currentUsage.membersInClub || 0) < limits.maxMembersPerClub;
    case 'generateCertificate':
      return (currentUsage.certificatesThisMonth || 0) < limits.certificatesPerMonth;
    case 'createEvent':
      return (currentUsage.eventsThisMonth || 0) < limits.eventsPerMonth;
    default:
      return false;
  }
}
