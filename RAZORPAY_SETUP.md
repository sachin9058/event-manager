# Razorpay Payment Integration - Setup Guide

## Overview
The Event Manager platform now supports subscription-based access with three tiers:
- **Free Plan**: Basic features, 1 club, 20 members per club
- **Basic Plan**: ₹299/month - 3 clubs, 100 members per club, advanced features
- **Premium Plan**: ₹599/month - Unlimited clubs and members, all features

## Razorpay Setup

### 1. Create Razorpay Account
1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Sign up for a business account
3. Complete KYC verification

### 2. Get API Keys
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate Test/Live mode keys
4. Copy the **Key ID** and **Key Secret**

### 3. Configure Environment Variables
Add the following to your `.env.local` file:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

**Note:** Use `rzp_test_` for testing and `rzp_live_` for production.

### 4. Enable Payment Methods
In your Razorpay Dashboard:
1. Go to Settings → Payment Methods
2. Enable: Cards, UPI, Net Banking, Wallets
3. Save configuration

## Features Implemented

### 1. Subscription Plans (`/pricing`)
- Three-tier pricing page with feature comparison
- Integrated Razorpay checkout
- Automatic plan activation after payment

### 2. Plan Limits Enforcement
- Free: 1 club, 20 members, 5 certificates/month
- Basic: 3 clubs, 100 members, 50 certificates/month
- Premium: Unlimited everything

### 3. Subscription Management
- View current plan and status in dashboard
- Cancel subscriptions
- Upgrade/downgrade plans
- Auto-renewal handling

### 4. API Endpoints
- `POST /api/razorpay/create-order` - Initialize payment
- `POST /api/razorpay/verify-payment` - Verify and activate subscription
- `GET /api/razorpay/subscription` - Get user's subscription details
- `POST /api/razorpay/subscription` - Cancel subscription

### 5. Payment Flow
1. User selects plan on `/pricing` page
2. Razorpay checkout modal opens
3. User completes payment (UPI/Card/Net Banking)
4. Payment verified via signature
5. Subscription activated in database
6. User redirected to dashboard

## Testing

### Test Mode
1. Use test API keys (starting with `rzp_test_`)
2. **Test Cards (Indian Cards Only in Test Mode):**
   - Success: `5104 0600 0000 0008` (Mastercard)
   - Success: `4111 1111 1111 1111` (Visa - may show international card error)
   - CVV: Any 3 digits (e.g., 123)
   - Expiry: Any future date (e.g., 12/25)
   
3. **Test UPI (Recommended for Testing):**
   - UPI ID: `success@razorpay`
   - Status: Will auto-succeed
   - UPI ID: `failure@razorpay`
   - Status: Will auto-fail

4. **Test Net Banking:**
   - Select any bank
   - Click Success/Failure on test page

### Common Test Issues

**"International cards are not supported" Error:**
- This occurs with some Visa test cards in test mode
- **Solution 1:** Use UPI test mode (`success@razorpay`)
- **Solution 2:** Use Indian test cards (5104 0600 0000 0008)
- **Solution 3:** Enable international cards in Razorpay Dashboard:
  1. Go to Settings → Configuration → International Payments
  2. Enable international cards
  3. Select countries (if in test mode, this may still restrict)

**Best Practice:** Test with UPI in development, as it's widely used in India and works reliably in test mode.

### Test Payment Flow
1. Navigate to `/pricing`
2. Click "Subscribe Now" on any paid plan
3. **Recommended:** Choose UPI and use `success@razorpay`
4. **Alternative:** Use Indian test card `5104 0600 0000 0008`
5. Verify subscription activated in `/dashboard`

## Database Schema

### User Model Updates
```typescript
subscription: {
  plan: 'free' | 'basic' | 'premium',
  status: 'active' | 'cancelled' | 'expired',
  razorpaySubscriptionId: string,
  razorpayCustomerId: string,
  startDate: Date,
  endDate: Date,
  autoRenew: boolean
}
```

## Plan Limits Configuration

Edit `lib/razorpay.ts` to modify plan limits:

```typescript
export const PLANS = {
  free: {
    limits: {
      maxClubsOwned: 1,
      maxMembersPerClub: 20,
      certificatesPerMonth: 5,
      eventsPerMonth: 2,
    },
  },
  // ... other plans
};
```

## Going Live

### 1. Switch to Live Mode
1. Complete Razorpay KYC verification
2. Get Live API keys from Dashboard
3. Update `.env.local` with live keys
4. Test in production environment

### 2. Security Checklist
- ✅ API keys stored in environment variables
- ✅ Signature verification enabled
- ✅ HTTPS enforced in production
- ✅ Webhook signature validation (if using webhooks)

### 3. Compliance
- Add Terms of Service for subscriptions
- Add Refund Policy
- Display pricing clearly
- Handle failed payments gracefully

## Troubleshooting

### Payment fails with "Invalid signature"
- Verify `RAZORPAY_KEY_SECRET` is correct
- Check webhook signature verification logic

### "Payment system not configured" error
- Ensure both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- Restart Next.js server after adding env variables

### Subscription not activating
- Check browser console for errors
- Verify `/api/razorpay/verify-payment` endpoint
- Ensure MongoDB connection is working

## Support

For Razorpay support:
- Documentation: https://razorpay.com/docs/
- Support: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com/

## Next Steps

1. Add webhook handling for automatic subscription renewals
2. Implement prorated upgrades/downgrades
3. Add invoice generation
4. Send email notifications for payment events
5. Add usage analytics per plan
