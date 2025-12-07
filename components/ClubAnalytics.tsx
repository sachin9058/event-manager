// components/ClubAnalytics.tsx
'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalMembers: number;
  memberGrowth: number;
  activeMembers: number;
  totalEvents: number;
  certificatesIssued: number;
  joinRate: number;
  retentionRate: number;
  membershipTrend: Array<{ month: string; count: number }>;
  categoryDistribution: Array<{ category: string; percentage: number }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

interface ClubAnalyticsProps {
  clubId: string;
  members: any[];
  createdAt: string;
}

const primaryColor = '#70001A';
const secondaryColor = '#C89446';

export default function ClubAnalytics({ clubId, members, createdAt }: ClubAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateAnalytics();
  }, [members]);

  const calculateAnalytics = async () => {
    try {
      // Calculate member growth
      const createdDate = new Date(createdAt);
      const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      const monthsSinceCreation = Math.max(daysSinceCreation / 30, 0.1); // Minimum 0.1 to avoid division by zero
      const memberGrowth = members.length / monthsSinceCreation;

      // Calculate join rate (members per month)
      const joinRate = members.length / monthsSinceCreation;

      // Calculate active members (all current members are considered active)
      const activeMembers = members.length;

      // Calculate retention rate (100% for current members)
      const retentionRate = members.length > 0 ? 100 : 0;

      // Fetch certificates data
      const certificatesData = await fetchCertificatesCount();

      setAnalytics({
        totalMembers: members.length,
        memberGrowth: Math.round(memberGrowth * 10) / 10,
        activeMembers: activeMembers,
        totalEvents: certificatesData.totalEvents || 0,
        certificatesIssued: certificatesData.total || 0,
        joinRate: Math.round(joinRate * 10) / 10,
        retentionRate: Math.round(retentionRate),
        membershipTrend: [],
        categoryDistribution: [],
        recentActivity: generateRecentActivity(),
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificatesCount = async () => {
    try {
      const response = await fetch(`/api/clubs/${clubId}/certificates?stats=true`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
    return { total: 0, totalEvents: 0 };
  };

  const generateRecentActivity = () => {
    const activities = [];
    
    if (members.length > 0) {
      activities.push({
        type: 'member_count',
        description: `Club has ${members.length} member${members.length !== 1 ? 's' : ''}`,
        timestamp: new Date().toISOString(),
      });
    }

    return activities;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderColor: primaryColor }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Members</p>
              <p className="text-3xl font-bold mt-2" style={{ color: primaryColor }}>
                {analytics.totalMembers}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
              <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-semibold">+{analytics.memberGrowth}/mo</span>
            <span className="text-gray-500 ml-2">growth rate</span>
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderColor: secondaryColor }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Members</p>
              <p className="text-3xl font-bold mt-2" style={{ color: secondaryColor }}>
                {analytics.activeMembers}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${secondaryColor}15` }}>
              <svg className="w-6 h-6" style={{ color: secondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600 font-semibold">{analytics.retentionRate}%</span>
            <span className="text-gray-500 ml-2">retention rate</span>
          </div>
        </div>

        {/* Total Events */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Events Hosted</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {analytics.totalEvents}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600 font-semibold">{analytics.certificatesIssued}</span>
            <span className="text-gray-500 ml-2">certificates issued</span>
          </div>
        </div>

        {/* Join Rate */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Join Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {analytics.joinRate}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600 font-semibold">members/month</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engagement Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6" style={{ color: primaryColor }}>
            Engagement Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Member Retention</span>
              <span className="font-bold" style={{ color: primaryColor }}>{analytics.retentionRate}%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Active Members</span>
              <span className="font-bold text-green-600">
                {Math.round((analytics.activeMembers / analytics.totalMembers) * 100) || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Total Events</span>
              <span className="font-bold text-purple-600">
                {analytics.totalEvents}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Certificates Issued</span>
              <span className="font-bold" style={{ color: secondaryColor }}>
                {analytics.certificatesIssued}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6" style={{ color: primaryColor }}>
            Recent Activity
          </h3>
          {analytics.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: secondaryColor }}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
        <h3 className="text-xl font-bold mb-4 text-purple-900">
          📊 Performance Insights
        </h3>
        <div className="space-y-3">
          {analytics.totalMembers >= 20 && (
            <div className="flex items-start space-x-3">
              <span className="text-green-600">✓</span>
              <p className="text-gray-700">Strong membership base - Your club has excellent member participation!</p>
            </div>
          )}
          {analytics.joinRate >= 2 && (
            <div className="flex items-start space-x-3">
              <span className="text-green-600">✓</span>
              <p className="text-gray-700">Healthy growth rate - Keep up the momentum with regular events and engagement.</p>
            </div>
          )}
          {analytics.certificatesIssued >= 10 && (
            <div className="flex items-start space-x-3">
              <span className="text-green-600">✓</span>
              <p className="text-gray-700">Active event management - Great job recognizing member achievements!</p>
            </div>
          )}
          {analytics.totalMembers < 10 && (
            <div className="flex items-start space-x-3">
              <span className="text-blue-600">💡</span>
              <p className="text-gray-700">Tip: Share your invite link to grow your member base faster.</p>
            </div>
          )}
          {analytics.totalEvents === 0 && (
            <div className="flex items-start space-x-3">
              <span className="text-blue-600">💡</span>
              <p className="text-gray-700">Tip: Host your first event and issue certificates to boost engagement.</p>
            </div>
          )}
          {analytics.totalMembers === 0 && (
            <div className="flex items-start space-x-3">
              <span className="text-blue-600">💡</span>
              <p className="text-gray-700">Get started by inviting members to join your club!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
