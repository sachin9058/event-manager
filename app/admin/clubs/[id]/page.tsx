// app/admin/clubs/[id]/page.tsx
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";
import connectDB from "@/lib/db";
import Club from "@/models/Club";
import Link from "next/link";
import AdminClubActions from "@/app/admin/clubs/[id]/AdminClubActions";
import AdminMemberActions from "./AdminMemberActions";

async function getClub(id: string) {
  await connectDB();
  
  const club = await Club.findById(id)
    .populate('createdBy', 'clerkId firstName lastName email')
    .populate('members', 'clerkId firstName lastName email')
    .lean();

  if (!club) {
    return null;
  }

  return JSON.parse(JSON.stringify(club));
}

export default async function AdminClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const admin = await isAdmin();
  
  if (!admin) {
    redirect('/');
  }

  const club = await getClub(id);

  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-burgundy-50 to-gold-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Club Not Found</h1>
            <Link href="/admin/clubs" className="text-burgundy-600 hover:text-burgundy-700">
              Back to All Clubs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 to-gold-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <Link href="/admin/clubs" className="text-burgundy-600 hover:text-burgundy-700 flex items-center mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Clubs
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-burgundy-800">
                {club.name}
              </h1>
              <p className="text-gray-600 mt-2">
                {club.category || 'Uncategorized'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              club.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {club.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {/* Club Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Club Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <p className="text-gray-600">
                {club.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-gray-600">
                  {new Date(club.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-600">
                  {new Date(club.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Creator
              </label>
              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-800">
                  {club.createdBy?.firstName} {club.createdBy?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {club.createdBy?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Members ({club.members?.length || 0})
          </h2>

          {!club.members || club.members.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No members in this club yet.
            </p>
          ) : (
            <div className="space-y-3">
              {club.members.map((member: { _id: string; firstName: string; lastName: string; email: string; clerkId: string }) => (
                <div key={member._id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {member.clerkId === club.createdBy?.clerkId && (
                      <span className="bg-burgundy-100 text-burgundy-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Creator
                      </span>
                    )}
                    <AdminMemberActions 
                      clubId={club._id} 
                      memberId={member._id}
                      isCreator={member.clerkId === club.createdBy?.clerkId}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Actions */}
        <AdminClubActions clubId={club._id} isActive={club.isActive} />
      </div>
    </div>
  );
}
