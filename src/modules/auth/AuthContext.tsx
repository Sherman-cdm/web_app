import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../../services/authService';
import type { AuthSession, LoginCredentials } from '../../types/auth';

interface AuthContextValue {
  session: AuthSession | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => authService.readSession());
  useEffect(() => {
    const checkExpiration = () =>
      setSession((current) => (current && current.expiresAt <= Date.now() ? null : current));
    const timer = window.setInterval(checkExpiration, 30_000);
    window.addEventListener('focus', checkExpiration);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', checkExpiration);
    };
  }, []);
  async function login(credentials: LoginCredentials) {
    setSession(await authService.login(credentials));
  }
  function logout() {
    const role = session?.user.role ?? 'patient';
    authService.logout();
    setSession(null);
    window.location.hash = `login/${role}`;
  }
  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth requiere AuthProvider.');
  return context;
}
