import { LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';

export function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      className="btn-secondary shrink-0 px-3"
      onClick={logout}
      aria-label="Cerrar sesión"
    >
      <LogOut size={17} aria-hidden="true" />
      <span className="hidden md:inline">Cerrar sesión</span>
    </button>
  );
}
