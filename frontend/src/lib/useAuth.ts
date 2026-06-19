import { useEffect, useState } from 'react';
import { api, ApiError } from './api';

interface Me {
  id: string;
  displayName: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<Me | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    api.get<Me>('/api/auth/me')
      .then(setUser)
      .catch((err) => {
        if (!(err instanceof ApiError && err.status === 401)) console.error(err);
        setUser(null);
      })
      .finally(() => setChecked(true));
  }, []);

  return { user, checked };
}
