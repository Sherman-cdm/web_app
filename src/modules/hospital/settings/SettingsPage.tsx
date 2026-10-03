import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { PageTitle } from '../../../shared/components/PageTitle';
import { useHospital } from '../context/HospitalContext';

export function Settings() {
  const { state, hospitalId } = useHospital();
  const [auto, setAuto] = useState(
    state.settings.find((s) => s.hospitalId === hospitalId)?.autoApprove ?? false,
  );
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageTitle
        title="Configuración del hospital"
        description="Definí cómo se procesan las nuevas solicitudes de pacientes."
      />
      <div className="card max-w-2xl">
        <AsyncForm
          showCancel={false}
          save={() => hospitalApi.saveSettings(hospitalId, auto)}
          onClose={() => setSaved(true)}
        >
          <h2 className="text-lg font-bold">Aprobación de turnos</h2>
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              className="mt-1"
              checked={auto}
              onChange={(e) => {
                setAuto(e.target.checked);
                setSaved(false);
              }}
            />
            <span>
              <span className="block text-sm font-semibold">
                Aprobar automáticamente las solicitudes nuevas
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-500">
                Cuando está desactivado, recepción debe aprobar cada solicitud. Los turnos creados
                desde el hospital se confirman directamente. Este cambio no modifica solicitudes
                anteriores.
              </span>
            </span>
          </label>
        </AsyncForm>
        {saved && (
          <p role="status" className="mt-3 text-sm text-brand-700">
            Configuración guardada.
          </p>
        )}
      </div>
      <aside className="mt-6 flex max-w-2xl gap-3 rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        <ShieldCheck className="shrink-0" size={22} />
        <p>
          Entorno de demostración local. Los portales tienen interfaces separadas y comparten los
          datos de este navegador. Los accesos utilizan cuentas de ejemplo; la autenticación y los
          permisos de usuarios reales requieren conectar un servidor.
        </p>
      </aside>
    </>
  );
}
