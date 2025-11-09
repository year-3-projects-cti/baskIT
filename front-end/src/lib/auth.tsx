import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; email: string; name?: string, role: string } | null;
type Ctx = { user: User; login: (u: User) => void; logout: () => void };

const C = createContext<Ctx>({ user: null, login: () => {}, logout: () => {} });
const STORAGE_KEY = "baskit.auth.v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  return (
    <C.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);
