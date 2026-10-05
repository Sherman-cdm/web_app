import { useEffect, useRef, useState } from 'react';
import { api } from '../../services/api';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { Loading } from '../../shared/components/Loading';
import { errorText } from '../../shared/errors/errorText';
import type { Hospital, Specialty, View } from '../../types';
import MyAppointments from './appointments/MyAppointments';
import BookingWizard from './booking/BookingWizard';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Home from './home/Home';
import SpecialtiesBoard from './specialties/SpecialtiesBoard';
import MyStudies from './studies/MyStudies';

export const views: View[] = ['home', 'booking', 'appointments', 'studies', 'specialties'];

export function locationView(): View {
  const hash = window.location.hash.slice(1);
  return views.includes(hash as View) ? (hash as View) : 'home';
}

export function PatientPortal() {
  const [view, setView] = useState<View>(locationView);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [hospitalId, setHospitalId] = useState('central');
  const [specialtyId, setSpecialtyId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([api.getHospitals(), api.getSpecialties()])
      .then(([h, s]) => {
        if (active) {
          setHospitals(h);
          setSpecialties(s);
        }
      })
      .catch((err) => {
        if (active) setError(errorText(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  useEffect(() => {
    const change = () => setView(locationView());
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    main.current?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);
  function navigate(next: View) {
    setView(next);
    window.location.hash = next;
  }
  function bookSpecialty(hospitalId: string, specialtyId: string) {
    setHospitalId(hospitalId);
    setSpecialtyId(specialtyId);
    navigate('booking');
  }
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:bg-white focus:p-3"
      >
        Saltar al contenido
      </a>
      <Header />
      <main
        id="contenido"
        tabIndex={-1}
        ref={main}
        className="mx-auto min-h-[80vh] max-w-6xl px-4 pb-8 pt-6 focus:ring-0 sm:px-8 sm:pt-8"
      >
        {loading ? (
          <Loading />
        ) : error ? (
          <>
            <ErrorMessage message={error} />
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setAttempt((a) => a + 1)}
            >
              Reintentar
            </button>
          </>
        ) : (
          <>
            {view === 'home' && (
              <Home
                hospitals={hospitals}
                specialties={specialties}
                selectedHospital={hospitalId}
                onHospital={(id) => {
                  setHospitalId(id);
                  setSpecialtyId(undefined);
                }}
                onNavigate={navigate}
                onBook={bookSpecialty}
              />
            )}{' '}
            {view === 'booking' && (
              <BookingWizard
                hospitals={hospitals}
                specialties={specialties}
                initialHospital={hospitalId}
                initialSpecialty={specialtyId}
                onDone={() => navigate('appointments')}
              />
            )}{' '}
            {view === 'specialties' && (
              <SpecialtiesBoard
                hospitals={hospitals}
                specialties={specialties}
                onBook={bookSpecialty}
              />
            )}{' '}
            {view === 'appointments' && (
              <MyAppointments hospitals={hospitals} specialties={specialties} />
            )}{' '}
            {view === 'studies' && <MyStudies hospitals={hospitals} />}
          </>
        )}
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-28 text-center text-xs leading-5 text-slate-400">
        Mi salud · Hospitales de Pilar
        <br />
        Prototipo con datos ficticios · Sin conexión a servicios hospitalarios
      </footer>
      <BottomNav active={view} onNavigate={navigate} />
    </>
  );
}
