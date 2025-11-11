import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

export type UserRole = "CUSTOMER" | "ADMIN" | "CONTENT_MANAGER";
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
};

const STORAGE_KEY = "baskit.auth.v2";
const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  initialized: false,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  hasRole: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    try {
      return JSON.parse(raw);
    } catch {
      return { user: null, token: null };
    }
  });
  const [initialized, setInitialized] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  useEffect(() => {
    let cancelled = false;
    async function hydrateSession() {
      if (!state.token || state.user) {
        setInitialized(true);
        return;
      }
      try {
        const profile = await apiRequest<AuthUser>("/auth/me", { method: "GET" }, state.token);
        if (!cancelled) {
          setState((prev) => ({ ...prev, user: profile }));
        }
      } catch {
        if (!cancelled) {
          setState({ user: null, token: null });
        }
      } finally {
        if (!cancelled) setInitialized(true);
      }
    }
    hydrateSession();
    return () => {
      cancelled = true;
    };
  }, [state.token, state.user]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    setActionLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ token: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setState({ token: response.token, user: response.user });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nu am putut autentifica utilizatorul.";
      setError(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setActionLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ token: string; user: AuthUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setState({ token: response.token, user: response.user });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nu am putut crea contul.";
      setError(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    if (!state.token) {
      setState({ user: null, token: null });
      return;
    }
    setActionLoading(true);
    try {
      await apiRequest("/auth/logout", { method: "POST", skipJson: true }, state.token);
    } catch {
      // ignore logout failures
    } finally {
      setState({ user: null, token: null });
      setActionLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(() => ({
    user: state.user,
    token: state.token,
    initialized,
    loading: actionLoading || !initialized,
    error,
    login,
    register,
    logout,
    hasRole: (...roles: UserRole[]) => {
      if (!state.user) return false;
      if (!roles.length) return !!state.user;
      return roles.includes(state.user.role);
    },
  }), [state, initialized, actionLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
