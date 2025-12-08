'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

const primaryColor = '#70001A';
const secondaryColor = '#C89446';

type UserRole = 'student' | 'club-owner' | 'admin';

export default function RoleManager() {
  const { isSignedIn } = useUser();
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchRole();
    }
  }, [isSignedIn]);

  const fetchRole = async () => {
    try {
      const response = await fetch('/api/users/role');
      if (response.ok) {
        const data = await response.json();
        setRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === role || role === 'admin') return;

    setUpdating(true);
    try {
      const response = await fetch('/api/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedRole: newRole }),
      });

      if (response.ok) {
        const data = await response.json();
        setRole(data.role);
        alert(`Successfully changed role to ${data.role}`);
        window.location.reload(); // Refresh to update permissions
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to change role');
      }
    } catch (error: any) {
      alert(error.message || 'Error changing role');
    } finally {
      setUpdating(false);
    }
  };

  if (!isSignedIn || loading) return null;

  const roleInfo: Record<UserRole, { name: string; description: string; color: string; icon: string }> = {
    student: {
      name: 'Student',
      description: 'Join clubs and participate in events',
      color: 'bg-blue-100 text-blue-800',
      icon: '🎓',
    },
    'club-owner': {
      name: 'Club Owner',
      description: 'Create and manage clubs, organize events',
      color: 'bg-purple-100 text-purple-800',
      icon: '👑',
    },
    admin: {
      name: 'Administrator',
      description: 'Full platform access and management',
      color: 'bg-red-100 text-red-800',
      icon: '⚡',
    },
  };

  const currentRoleInfo = roleInfo[role] || roleInfo.student;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
        Your Role
      </h3>

      <div className="space-y-4">
        {/* Current Role Display */}
        <div className="flex items-center justify-between p-4 border-2 rounded-lg" style={{ borderColor: secondaryColor }}>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{currentRoleInfo.icon}</span>
            <div>
              <span className={`px-3 py-1 rounded-full font-semibold text-sm ${currentRoleInfo.color}`}>
                {currentRoleInfo.name}
              </span>
              <p className="text-sm text-gray-600 mt-1">{currentRoleInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Role Change Options */}
        {role !== 'admin' && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">Change your role:</p>
            <div className="grid grid-cols-2 gap-3">
              {role !== 'student' && (
                <button
                  onClick={() => handleRoleChange('student')}
                  disabled={updating}
                  className="p-3 border-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-left"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🎓</span>
                    <div>
                      <p className="font-semibold text-sm">Student</p>
                      <p className="text-xs text-gray-500">Join clubs</p>
                    </div>
                  </div>
                </button>
              )}
              
              {role !== 'club-owner' && (
                <button
                  onClick={() => handleRoleChange('club-owner')}
                  disabled={updating}
                  className="p-3 border-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-left"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">👑</span>
                    <div>
                      <p className="font-semibold text-sm">Club Owner</p>
                      <p className="text-xs text-gray-500">Create clubs</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {role === 'admin' && (
          <p className="text-sm text-gray-500 italic">
            Admin role is permanent and cannot be changed.
          </p>
        )}

        {/* Role Benefits */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Your Permissions:</p>
          <ul className="space-y-1 text-xs text-gray-600">
            {role === 'student' && (
              <>
                <li>✓ Join any club</li>
                <li>✓ Participate in events</li>
                <li>✓ Receive certificates</li>
              </>
            )}
            {role === 'club-owner' && (
              <>
                <li>✓ All student permissions</li>
                <li>✓ Create and manage clubs</li>
                <li>✓ Generate certificates</li>
                <li>✓ Manage club members</li>
              </>
            )}
            {role === 'admin' && (
              <>
                <li>✓ All club owner permissions</li>
                <li>✓ Manage all clubs</li>
                <li>✓ Manage all users</li>
                <li>✓ Access admin panel</li>
                <li>✓ Full platform control</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
