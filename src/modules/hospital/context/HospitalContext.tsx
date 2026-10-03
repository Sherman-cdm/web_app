import { createContext, useContext } from 'react';
import type { HospitalState } from '../../../types';

interface HospitalContextValue {
  state: HospitalState;
  hospitalId: string;
}

export const HospitalContext = createContext<HospitalContextValue | null>(null);

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) throw new Error('useHospital debe utilizarse dentro del portal hospitalario.');
  return context;
}
