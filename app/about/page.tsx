import Navbar from "@/components/Navbar";

const primaryColor = '#70001A';
const secondaryColor = '#C89446';
const backgroundColor = '#FAF9F8';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: backgroundColor, minHeight: '100vh' }}>
      <Navbar />
      
      <div className="container mx-auto px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-extrabold tracking-wider mb-6" style={{ color: primaryColor }}>
            ABOUT FEST ARCHITECTS
          </h1>
          <div className="w-24 h-1 mx-auto mb-8" style={{ backgroundColor: secondaryColor }}></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your premier platform for managing college clubs, events, and student organizations with elegance and efficiency.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-serif font-bold mb-6" style={{ color: primaryColor }}>
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Fest Architects is dedicated to revolutionizing the way college clubs and student organizations operate. 
              We provide a comprehensive platform that simplifies club management, enhances member engagement, and 
              streamlines event coordination.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our goal is to empower student leaders with the tools they need to create memorable experiences, 
              build lasting communities, and leave a lasting impact on campus life.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: primaryColor }}>
            What We Offer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" 
                   style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-4" style={{ color: primaryColor }}>
                Club Management
              </h3>
              <p className="text-gray-600 text-center">
                Create and manage clubs with ease. Organize members, track activities, and grow your community.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" 
                   style={{ backgroundColor: `${secondaryColor}15` }}>
                <svg className="w-8 h-8" style={{ color: secondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-4" style={{ color: primaryColor }}>
                Certificates
              </h3>
              <p className="text-gray-600 text-center">
                Generate and email professional certificates to members for events and achievements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" 
                   style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-4" style={{ color: primaryColor }}>
                Invite Links
              </h3>
              <p className="text-gray-600 text-center">
                Share secure invite links to grow your club membership effortlessly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" 
                   style={{ backgroundColor: `${secondaryColor}15` }}>
                <svg className="w-8 h-8" style={{ color: secondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-4" style={{ color: primaryColor }}>
                Dashboard
              </h3>
              <p className="text-gray-600 text-center">
                Comprehensive dashboard to manage your clubs, members, and activities in one place.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" 
                   style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-4" style={{ color: primaryColor }}>
                Discovery
              </h3>
              <p className="text-gray-600 text-center">
                Browse and discover clubs across campus with advanced search and filtering.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" 
                   style={{ backgroundColor: `${secondaryColor}15` }}>
                <svg className="w-8 h-8" style={{ color: secondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-4" style={{ color: primaryColor }}>
                Secure & Reliable
              </h3>
              <p className="text-gray-600 text-center">
                Built with security in mind. Your data is safe with industry-standard authentication.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <h2 className="text-3xl font-serif font-bold mb-6" style={{ color: primaryColor }}>
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Join hundreds of clubs already using Fest Architects to manage their organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/clubs" 
                className="px-8 py-3 rounded-lg text-white font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                Browse Clubs
              </a>
              <a 
                href="/dashboard" 
                className="px-8 py-3 rounded-lg text-white font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
                style={{ backgroundColor: secondaryColor }}
              >
                Create Your Club
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
