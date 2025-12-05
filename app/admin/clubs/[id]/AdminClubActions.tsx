// app/admin/clubs/[id]/AdminClubActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminClubActionsProps {
  clubId: string;
  isActive: boolean;
}

export default function AdminClubActions({ clubId, isActive }: AdminClubActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/clubs/${clubId}/toggle-status`, {
        method: 'PATCH',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to toggle club status');
      }
    } catch (error) {
      console.error('Error toggling club status:', error);
      alert('An error occurred while toggling club status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/clubs/${clubId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/clubs');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete club');
      }
    } catch (error) {
      console.error('Error deleting club:', error);
      alert('An error occurred while deleting club');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Actions</h2>
      
      <div className="space-y-3">
        {/* Toggle Active Status */}
        <button
          onClick={handleToggleStatus}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isActive
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Processing...' : isActive ? 'Deactivate Club' : 'Activate Club'}
        </button>

        {/* Delete Club */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Club Permanently
          </button>
        ) : (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-3">
              ⚠️ Are you sure you want to delete this club permanently?
            </p>
            <p className="text-red-700 text-sm mb-4">
              This action cannot be undone. All club data and member associations will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
