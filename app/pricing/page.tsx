import Navbar from '@/components/Navbar';
import PricingPlans from '@/components/PricingPlans';
import Script from 'next/script';

const primaryColor = '#70001A';
const secondaryColor = '#C89446';

export default function PricingPage() {
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />

        <main className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1
              className="text-5xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your event management needs. Upgrade or downgrade anytime.
            </p>
          </div>

          {/* Pricing Plans */}
          <PricingPlans />

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-10"
              style={{ color: primaryColor }}
            >
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                  Can I upgrade my plan later?
                </h3>
                <p className="text-gray-600">
                  Yes! You can upgrade to a higher plan at any time. The new plan will be activated immediately, and you'll be charged a prorated amount.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit/debit cards, UPI, net banking, and digital wallets through Razorpay's secure payment gateway.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                  Can I cancel my subscription?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time from your dashboard. Your plan will remain active until the end of your billing period.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Our Free plan is available forever with no credit card required. You can upgrade to a paid plan whenever you need more features.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                  What happens if I exceed my plan limits?
                </h3>
                <p className="text-gray-600">
                  You'll be notified when approaching your limits. To continue using premium features, you can upgrade to a higher plan that fits your needs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div
              className="inline-block rounded-2xl shadow-2xl p-12"
              style={{ backgroundColor: primaryColor }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-gray-200 mb-8 max-w-2xl">
                Join thousands of event organizers managing their clubs efficiently with our platform.
              </p>
              <a
                href="/sign-up"
                className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: secondaryColor,
                  color: 'white',
                }}
              >
                Start Free Today
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
