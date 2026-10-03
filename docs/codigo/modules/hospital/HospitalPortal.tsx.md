# HospitalPortal.tsx

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/modules/hospital/HospitalPortal.tsx)

**Ruta:** `src/modules/hospital/HospitalPortal.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { useState } from 'react';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { Loading } from '../../shared/components/Loading';
import { Activity } from './activity/ActivityPage';
import AgendaManager from './agendas/AgendasPage';
import AppointmentManager from './appointments/AppointmentsPage';
import { Areas } from './areas/AreasPage';
import { HospitalContext } from './context/HospitalContext';
import Dashboard from './dashboard/DashboardPage';
import { useHospitalData } from './hooks/useHospitalData';
import { useHospitalNavigation } from './hooks/useHospitalNavigation';
import { HospitalHeader } from './layout/HospitalHeader';
import { HospitalSidebar } from './layout/HospitalSidebar';
import { Patients } from './patients/PatientsPage';
import { Professionals } from './professionals/ProfessionalsPage';
import { Reports } from './reports/ReportsPage';
import { Settings } from './settings/SettingsPage';
import { Studies } from './studies/StudiesPage';

export default function HospitalPortal() {
  const [hospitalId, setHospitalId] = useState('central');
  const { state, error, load } = useHospitalData();
  const { mobile, page, open, setOpen, main } = useHospitalNavigation(hospitalId);
  return (
    <div className="hospital-surface min-h-screen">
      {open && (
        <button
          aria-label="Cerrar navegación"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <HospitalSidebar
        state={state}
        hospitalId={hospitalId}
        page={page}
        mobile={mobile}
        open={open}
        onClose={() => setOpen(false)}
      />
      <div inert={mobile && open} className="min-w-0 lg:pl-64">
        <HospitalHeader
          state={state}
          hospitalId={hospitalId}
          open={open}
          onOpen={() => setOpen(true)}
          onHospitalChange={setHospitalId}
        />
        <main
          ref={main}
          tabIndex={-1}
          className="mx-auto max-w-[1500px] p-4 pb-12 focus:ring-0 sm:p-8"
        >
          {error && (
            <>
              <ErrorMessage message={error} />
              <button className="btn-secondary mb-4" onClick={load}>
                Reintentar
              </button>
            </>
          )}
          {!state && !error && <Loading />}
          {state && (
            <HospitalContext.Provider value={{ state, hospitalId }}>
              <div key={`${hospitalId}-${page}`}>
                {page === 'dashboard' && <Dashboard />}
                {page === 'appointments' && <AppointmentManager />}
                {page === 'professionals' && <Professionals />}
                {page === 'areas' && <Areas />}
                {page === 'agendas' && <AgendaManager />}
                {page === 'patients' && <Patients />}
                {page === 'studies' && <Studies />}
                {page === 'reports' && <Reports />}
                {page === 'activity' && <Activity />}
                {page === 'settings' && <Settings />}
              </div>
            </HospitalContext.Provider>
          )}
        </main>
      </div>
    </div>
  );
}
```
