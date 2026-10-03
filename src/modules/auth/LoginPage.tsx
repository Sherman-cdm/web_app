import {
  CalendarDays,
  Check,
  FileHeart,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import type { UserRole } from '../../types/auth';
import { useAuth } from './AuthContext';
import { LoginForm } from './components/LoginForm';

export function LoginPage({ role }: { role: UserRole }) {
  const patient = role === 'patient';
  const { session } = useAuth();
  const benefits = patient
    ? [
        'Reservá tu próxima consulta',
        'Seguí el estado de tus turnos',
        'Consultá tus estudios en un lugar',
      ]
    : [
        'Organizá la atención del hospital',
        'Gestioná profesionales y agendas',
        'Aprobá turnos y publicá resultados',
      ];
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      <section
        className={`relative overflow-hidden px-6 py-8 text-white sm:px-12 lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:p-14 ${patient ? 'patient-hero' : 'medical-hero'}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-24 h-96 w-96 rounded-full border-[60px] border-white/10"
        />
        <a href="#login/patient" className="relative flex w-fit items-center gap-3">
          <span className="rounded-2xl bg-white/10 p-3">
            <HeartPulse size={27} />
          </span>
          <span>
            <span className="block text-2xl font-bold">Mi salud.</span>
            <span className="text-xs text-white/65">Hospitales de Pilar</span>
          </span>
        </a>
        <div className="relative mx-auto mt-9 w-full max-w-lg lg:my-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
            {patient ? 'Tu bienestar, más cerca' : 'Un equipo conectado'}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {patient ? (
              <>
                Un espacio para
                <br />
                cuidar de vos.
              </>
            ) : (
              <>
                Más tiempo para
                <br />
                cuidar a otros.
              </>
            )}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base">
            {patient
              ? 'Tus consultas, tus estudios y el seguimiento de tu salud, con un acceso simple.'
              : 'Ingresá al espacio del equipo médico y coordiná la atención desde un mismo lugar.'}
          </p>
          <ul className="mt-8 hidden space-y-4 lg:block">
            {benefits.map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                <Check size={16} className="text-emerald-200" />
                {text}
              </li>
            ))}
          </ul>
          <div
            aria-hidden="true"
            className="mt-12 hidden max-w-xs items-center justify-around rounded-3xl border border-white/10 bg-white/5 p-7 lg:flex"
          >
            <CalendarDays size={30} className="text-emerald-200" />
            <HeartPulse size={45} className="text-white" />
            {patient ? (
              <FileHeart size={30} className="text-emerald-200" />
            ) : (
              <Stethoscope size={30} className="text-emerald-200" />
            )}
          </div>
        </div>
        <p className="relative mt-8 hidden text-xs text-white/50 lg:block">
          Una experiencia de salud para la comunidad de Pilar.
        </p>
      </section>
      <section
        aria-label={patient ? 'Acceso de pacientes' : 'Acceso del equipo médico'}
        className="flex items-center justify-center px-5 py-9 sm:px-10 lg:py-12"
      >
        <div className="w-full max-w-md">
          <nav
            className="mb-8 grid grid-cols-2 gap-1 rounded-2xl border border-indigo-100 bg-white/80 p-1"
            aria-label="Tipo de acceso"
          >
            {(
              [
                { id: 'patient', label: 'Pacientes', icon: UserRound },
                { id: 'medical', label: 'Médicos', icon: Stethoscope },
              ] as const
            ).map((item) => (
              <a
                href={`#login/${item.id}`}
                aria-current={role === item.id ? 'page' : undefined}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${role === item.id ? `${patient ? 'patient-hero' : 'medical-hero'} text-white shadow-sm` : 'text-slate-600 hover:bg-indigo-50'}`}
                key={item.id}
              >
                <item.icon size={18} />
                {item.label}
              </a>
            ))}
          </nav>
          <p className="eyebrow">{patient ? 'Portal del paciente' : 'Portal médico'}</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {patient ? 'Bienvenido a Mi salud' : 'Acceso del equipo médico'}
          </h2>
          <p className="mb-7 mt-3 text-sm leading-6 text-slate-500">
            {patient
              ? 'Ingresá con tu DNI y contraseña para continuar.'
              : 'Ingresá con tu correo institucional y contraseña.'}
          </p>
          <LoginForm key={role} role={role} />
          {session && session.user.role !== role && (
            <a
              className="mt-5 block min-h-11 text-center text-sm font-semibold text-brand-700"
              href={session.user.role === 'patient' ? '#home' : '#hospital/dashboard'}
            >
              Volver a la sesión de {session.user.name}
            </a>
          )}
          <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            <span>
              Acceso de demostración. Usá las cuentas de ejemplo. La autenticación con un servidor
              todavía no está conectada.
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}
