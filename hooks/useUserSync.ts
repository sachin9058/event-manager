"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/users', {
          method: 'POST',
        });

        if (response.ok) {
          setIsSynced(true);
        }
      } catch (error) {
        console.error('Failed to sync user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return { isSynced, isLoading };
}
