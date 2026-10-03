import { demoAccounts } from '../mocks/demoAccounts';
import type { AuthSession, LoginCredentials, UserRole } from '../types/auth';
import { wait } from '../utils/delay';

export const SESSION_KEY = 'mi-salud.session.v1';
export const SESSION_DURATION = 8 * 60 * 60 * 1000;

export function canAccess(session: AuthSession | null, role: UserRole) {
  return !!session && session.expiresAt > Date.now() && session.user.role === role;
}

export const authService = {
  readSession(): AuthSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const stored = JSON.parse(raw) as { userId?: string; expiresAt?: number };
      if (
        typeof stored.expiresAt !== 'number' ||
        !Number.isFinite(stored.expiresAt) ||
        stored.expiresAt <= Date.now()
      )
        return null;
      const account = demoAccounts.find((account) => account.user.id === stored.userId);
      return account ? { user: structuredClone(account.user), expiresAt: stored.expiresAt } : null;
    } catch {
      return null;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await wait();
    const identifier = credentials.identifier.trim().toLowerCase();
    const account = demoAccounts.find(
      (account) =>
        account.user.role === credentials.role &&
        account.user.identifier.toLowerCase() === identifier &&
        account.password === credentials.password,
    );
    if (!account)
      throw new Error('Los datos de acceso no son correctos. Revisá el usuario y la contraseña.');
    const session: AuthSession = {
      user: structuredClone(account.user),
      expiresAt: Date.now() + SESSION_DURATION,
    };
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ userId: session.user.id, expiresAt: session.expiresAt }),
      );
    } catch {
      throw new Error(
        'No se pudo iniciar la sesión. Habilitá el almacenamiento de esta pestaña e intentá nuevamente.',
      );
    }
    return session;
  },

  logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* La interfaz igualmente cierra la sesión en memoria. */
    }
  },
};
