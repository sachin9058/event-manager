// app/admin/clubs/[id]/AdminMemberActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminMemberActionsProps {
  clubId: string;
  memberId: string;
  isCreator: boolean;
}

export default function AdminMemberActions({ clubId, memberId, isCreator }: AdminMemberActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemoveMember = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/clubs/${clubId}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
        setShowConfirm(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('An error occurred while removing member');
    } finally {
      setLoading(false);
    }
  };

  // Don't show remove button for club creator
  if (isCreator) {
    return null;
  }

  return (
    <>
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="text-red-600 hover:text-red-700 text-sm font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Remove
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleRemoveMember}
            disabled={loading}
            className="text-red-600 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Removing...' : 'Confirm'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="text-gray-600 hover:text-gray-700 text-xs font-semibold px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
