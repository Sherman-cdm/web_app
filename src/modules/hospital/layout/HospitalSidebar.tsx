import { ArrowLeft, HeartPulse, X } from 'lucide-react';
import type { HospitalState } from '../../../types';
import { nav } from '../navigation';

interface Props {
  state: HospitalState | null;
  hospitalId: string;
  page: string;
  mobile: boolean;
  open: boolean;
  onClose: () => void;
}

export function HospitalSidebar({ state, hospitalId, page, mobile, open, onClose }: Props) {
  return (
    <aside
      id="hospital-navigation"
      inert={mobile && !open}
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-indigo-100 bg-gradient-to-b from-white to-indigo-50 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between px-6 py-7">
        <a className="flex items-center gap-3" href="#hospital/dashboard">
          <span className="medical-hero rounded-2xl p-2.5 text-white shadow-md shadow-indigo-900/15">
            <HeartPulse size={25} />
          </span>
          <span>
            <span className="block text-xl font-bold text-brand-900">
              Mi salud<span className="text-brand-600">.</span>
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Portal hospitalario
            </span>
          </span>
        </a>
        <button className="lg:hidden" aria-label="Cerrar menú" onClick={() => onClose()}>
          <X size={19} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Navegación hospitalaria">
        <p className="px-4 pb-3 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Espacio de trabajo
        </p>
        {nav.map((n) => (
          <a
            key={n.id}
            href={`#hospital/${n.id}`}
            aria-current={page === n.id ? 'page' : undefined}
            className={`hospital-nav-link ${n.tone} flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm`}
          >
            <span className="accent-icon shrink-0 rounded-lg p-1.5">
              <n.icon size={19} />
            </span>
            {n.label}
            {n.id === 'appointments' &&
              !!state?.appointments.some(
                (a) => a.hospitalId === hospitalId && a.status === 'pending',
              ) && (
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                  {
                    state.appointments.filter(
                      (a) => a.hospitalId === hospitalId && a.status === 'pending',
                    ).length
                  }
                </span>
              )}
          </a>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <a
          href="#home"
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Portal del paciente
        </a>
        <p className="mt-3 px-3 text-[11px] text-slate-400">Demostración · Datos locales</p>
      </div>
    </aside>
  );
}
