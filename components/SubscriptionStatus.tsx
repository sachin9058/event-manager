'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const primaryColor = '#70001A';
const secondaryColor = '#C89446';

interface Subscription {
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  endDate?: string;
}

export default function SubscriptionStatus() {
  const { isSignedIn } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      fetchSubscription();
    }
  }, [isSignedIn]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/razorpay/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      const response = await fetch('/api/razorpay/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (response.ok) {
        alert('Subscription cancelled successfully');
        fetchSubscription();
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error: any) {
      alert(error.message || 'Error cancelling subscription');
    }
  };

  if (!isSignedIn || loading) return null;

  if (!subscription) return null;

  const planColors = {
    free: 'bg-gray-100 text-gray-800',
    basic: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
        Your Subscription
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Current Plan:</span>
          <span
            className={`px-4 py-1 rounded-full font-semibold uppercase text-sm ${
              planColors[subscription.plan]
            }`}
          >
            {subscription.plan}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.status === 'active'
                ? 'bg-green-100 text-green-800'
                : subscription.status === 'cancelled'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>

        {subscription.endDate && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {subscription.status === 'cancelled' ? 'Active Until:' : 'Renews On:'}
            </span>
            <span className="font-medium">
              {new Date(subscription.endDate).toLocaleDateString('en-GB')}
            </span>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          {subscription.plan !== 'premium' && (
            <Link href="/pricing">
              <button
                className="w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: secondaryColor }}
              >
                Upgrade Plan
              </button>
            </Link>
          )}

          {subscription.plan !== 'free' && subscription.status === 'active' && (
            <button
              onClick={handleCancelSubscription}
              className="w-full py-2 px-4 rounded-lg border border-red-500 text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
