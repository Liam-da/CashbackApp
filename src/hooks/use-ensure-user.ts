import { useEffect, useRef } from 'react';
import { useConvexAuth, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useEnsureUser() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const ensureUser = useMutation(api.users.ensureCurrentUser);
  const hasEnsured = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || hasEnsured.current) {
      return;
    }

    hasEnsured.current = true;
    void ensureUser().catch(() => {});
  }, [ensureUser, isAuthenticated, isLoading]);
}
