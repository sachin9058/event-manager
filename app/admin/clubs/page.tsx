// app/admin/clubs/page.tsx
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";
import connectDB from "@/lib/db";
import Club from "@/models/Club";
import Link from "next/link";

async function getAllClubs() {
  await connectDB();
  
  const clubs = await Club.find()
    .populate('createdBy', 'clerkId firstName lastName email')
    .populate('members', 'clerkId firstName lastName email')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(clubs));
}

export default async function AdminClubsPage() {
  const admin = await isAdmin();
  
  if (!admin) {
    redirect('/');
  }

  const clubs = await getAllClubs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 to-gold-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-burgundy-600 hover:text-burgundy-700 flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-burgundy-800">
                Manage All Clubs
              </h1>
              <p className="text-gray-600 mt-2">
                {clubs.length} total club{clubs.length !== 1 ? 's' : ''} on the platform
              </p>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        {clubs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No clubs found
            </h3>
            <p className="text-gray-600">
              There are currently no clubs on the platform.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club: {
              _id: string;
              name: string;
              description: string;
              category: string;
              isActive: boolean;
              members: unknown[];
              createdBy: {
                firstName: string;
                lastName: string;
                email: string;
              };
            }) => (
              <div
                key={club._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Club Header */}
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                  <p className="text-sm opacity-90">
                    {club.category || 'Uncategorized'}
                  </p>
                </div>

                {/* Club Details */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {club.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {club.members?.length || 0} members
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      club.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {club.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="border-t pt-4 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Created by</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {club.createdBy?.firstName} {club.createdBy?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {club.createdBy?.email}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/clubs/${club._id}`}
                      className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-semibold"
                    >
                      Manage
                    </Link>
                    <Link
                      href={`/dashboard/clubs/${club._id}`}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 px-4 rounded-lg transition-colors text-sm font-semibold"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
