// app/admin/page.tsx
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const admin = await isAdmin();
  
  if (!admin) {
    redirect('/');
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 to-gold-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-burgundy-800">
                Administrator Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.firstName || 'Admin'}
              </p>
            </div>
            <div className="bg-burgundy-100 text-burgundy-800 px-4 py-2 rounded-full font-semibold">
              Admin Access
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* All Clubs Management */}
          <Link href="/admin/clubs">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-burgundy-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-burgundy-800">
                  Manage All Clubs
                </h2>
                <svg className="w-8 h-8 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-600">
                View, edit, and delete any club. Manage members across all organizations.
              </p>
              <div className="mt-4 text-burgundy-600 font-semibold flex items-center">
                Open Club Management
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* All Users Management */}
          <Link href="/admin/users">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-gold-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gold-800">
                  Manage All Users
                </h2>
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-600">
                View all registered users and their club memberships. Monitor user activity.
              </p>
              <div className="mt-4 text-gold-600 font-semibold flex items-center">
                Open User Management
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-transparent">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Platform Statistics
              </h2>
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              View comprehensive platform analytics and insights.
            </p>
            <div className="text-sm text-gray-500">
              Coming soon: Total clubs, active users, certificates issued, and more.
            </div>
          </div>

          {/* System Settings Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-transparent">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                System Settings
              </h2>
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            <p className="text-gray-600 mb-4">
              Configure platform settings and admin preferences.
            </p>
            <div className="text-sm text-gray-500">
              Coming soon: Email templates, security settings, and more.
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/clubs" className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-4 py-2 rounded-lg transition-colors">
              View All Clubs
            </Link>
            <Link href="/dashboard" className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-lg transition-colors">
              My Dashboard
            </Link>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
              Export Data
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
              System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
