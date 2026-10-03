import { CheckCircle2, Clock3, Download, FileHeart, Search } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { api } from '../../../services/api';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { Loading } from '../../../shared/components/Loading';
import { errorText } from '../../../shared/errors/errorText';
import type { Hospital, MedicalStudy } from '../../../types';
import { formatDate, validDni } from '../../../utils/date';
import { useAuth } from '../../auth/AuthContext';

export default function MyStudies({ hospitals }: { hospitals: Hospital[] }) {
  const { session } = useAuth();
  const dni = session?.user.patient?.dni ?? '';
  const [searched, setSearched] = useState('');
  const [studies, setStudies] = useState<MedicalStudy[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(0);
  async function search(event: FormEvent) {
    event.preventDefault();
    if (!validDni(dni)) {
      setError('Ingresá un DNI de 7 u 8 dígitos, sin puntos.');
      return;
    }
    const version = ++request.current;
    setBusy(true);
    setError('');
    setStudies([]);
    setSearched('');
    try {
      const result = await api.getStudies(dni);
      if (version === request.current) {
        setStudies(result);
        setSearched(dni);
      }
    } catch (err) {
      if (version === request.current) setError(errorText(err));
    } finally {
      if (version === request.current) setBusy(false);
    }
  }
  function download(study: MedicalStudy) {
    if (!study.result || study.status !== 'available') return;
    const content = `MI SALUD · COMPROBANTE DE DEMOSTRACIÓN\n\nEstudio: ${study.name}\nDNI: ${study.dni}\nHospital: ${hospitals.find((h) => h.id === study.hospitalId)?.name}\nFecha: ${formatDate(study.date)}\n\n${study.result}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${study.id}-demostracion.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section>
      <p className="eyebrow">Resultados y seguimiento</p>
      <h1 className="mt-2 text-3xl font-bold">Mis Estudios</h1>
      <p className="mt-2 text-slate-500">Consultá los estudios asociados a tu cuenta.</p>
      <form onSubmit={search} className="card my-6">
        <label htmlFor="study-dni" className="text-sm font-semibold">
          Número de DNI
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="study-dni"
            className="field"
            required
            inputMode="numeric"
            pattern="[0-9]{7,8}"
            maxLength={8}
            placeholder="Ingresá tu DNI sin puntos"
            value={dni}
            readOnly
          />
          <button type="submit" className="btn-primary shrink-0" disabled={busy}>
            <Search size={18} aria-hidden="true" />
            {busy ? 'Buscando…' : 'Buscar estudios'}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Se utiliza el DNI de tu sesión. Para cambiar de paciente, cerrá sesión e ingresá con otra
          cuenta de ejemplo.
        </p>
      </form>
      {error && <ErrorMessage message={error} />}
      <div aria-live="polite">
        {busy && <Loading text="Consultando estudios…" />}
        {searched && (
          <p className="mb-4 text-sm text-slate-500">
            {studies.length} estudios para el DNI {searched}
          </p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {studies.map((study) => (
          <article className="card" key={study.id}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <FileHeart size={23} aria-hidden="true" />
              </span>
              <span
                className={`badge ${study.status === 'available' ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-800'}`}
              >
                {study.status === 'available' ? (
                  <CheckCircle2 size={13} aria-hidden="true" />
                ) : (
                  <Clock3 size={13} aria-hidden="true" />
                )}
                {study.status === 'available' ? 'Resultado disponible' : 'Pendiente'}
              </span>
            </div>
            <h2 className="text-lg font-bold">{study.name}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {hospitals.find((h) => h.id === study.hospitalId)?.name}
            </p>
            <p className="mt-1 text-sm text-slate-500">{formatDate(study.date)}</p>
            {study.status === 'available' ? (
              <>
                <p className="mt-4 text-sm text-slate-500">
                  Informe ficticio listo para descargar.
                </p>
                <button
                  type="button"
                  className="btn-secondary mt-4 w-full text-brand-600"
                  onClick={() => download(study)}
                >
                  <Download size={17} aria-hidden="true" />
                  Descargar resultado de ejemplo
                </button>
              </>
            ) : (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                El resultado todavía está en proceso.
              </p>
            )}
          </article>
        ))}
      </div>
      {searched && !studies.length && (
        <div className="card text-center text-slate-500">
          No encontramos estudios para ese DNI. Revisá el número ingresado.
        </div>
      )}
      {!searched && !busy && (
        <p className="py-8 text-center text-sm text-slate-400">
          Tus resultados aparecerán acá después de la búsqueda.
        </p>
      )}
    </section>
  );
}
