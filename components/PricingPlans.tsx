'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

const primaryColor = '#70001A';
const secondaryColor = '#C89446';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    interval: 'lifetime',
    features: [
      'Join unlimited clubs',
      'Create 1 club',
      'Up to 20 members per club',
      '5 certificates per month',
      '2 events per month',
      'Basic analytics',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    currency: 'INR',
    interval: 'month',
    popular: true,
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
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    currency: 'INR',
    interval: 'month',
    features: [
      'All Basic features',
      'Unlimited clubs',
      'Unlimited members',
      'Unlimited certificates',
      'Unlimited events',
      'Advanced insights',
      'Dedicated support',
      'API access',
      'White-label options',
    ],
  },
];

export default function PricingPlans() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (planId === 'free') {
      router.push('/dashboard');
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Initialize Razorpay checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Event Manager',
        description: `${plans.find(p => p.id === planId)?.name} Plan`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            }),
          });

          if (verifyResponse.ok) {
            router.push('/dashboard?payment=success');
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: data.userEmail,
          name: data.userName,
          contact: '', // Optional: Add phone number if available
        },
        notes: {
          plan: planId,
        },
        theme: {
          color: primaryColor,
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay via UPI/Cards',
                instruments: [
                  {
                    method: 'upi'
                  },
                  {
                    method: 'card'
                  },
                  {
                    method: 'netbanking'
                  },
                ],
              },
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative bg-white rounded-2xl shadow-xl p-8 ${
            plan.popular ? 'ring-4 ring-offset-2' : 'ring-1 ring-gray-200'
          }`}
          style={plan.popular ? { borderColor: secondaryColor } : {}}
        >
          {plan.popular && (
            <div
              className="absolute top-0 right-6 transform -translate-y-1/2 px-4 py-1 rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: secondaryColor }}
            >
              POPULAR
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
              {plan.name}
            </h3>
            <div className="flex items-baseline">
              <span className="text-4xl font-extrabold" style={{ color: primaryColor }}>
                ₹{plan.price}
              </span>
              {plan.interval !== 'lifetime' && (
                <span className="text-gray-500 ml-2">/{plan.interval}</span>
              )}
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 mt-0.5 shrink-0"
                  style={{ color: secondaryColor }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan.id)}
            disabled={loading === plan.id}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading === plan.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
            style={
              plan.popular
                ? { backgroundColor: secondaryColor }
                : { backgroundColor: primaryColor }
            }
          >
            {loading === plan.id
              ? 'Processing...'
              : plan.id === 'free'
              ? 'Get Started'
              : 'Subscribe Now'}
          </button>
        </div>
      ))}
    </div>
  );
}
