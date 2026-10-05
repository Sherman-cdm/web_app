# patientAccounts.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/infrastructure/storage/patientAccounts.ts)

**Ruta:** `src/infrastructure/storage/patientAccounts.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { AuthUser } from '../../types/auth';

export const PATIENT_ACCOUNTS_KEY = 'mi-salud.patient-accounts.v1';

export interface PatientAccount {
  id: string;
  fullName: string;
  dni: string;
  email: string;
  salt: string;
  passwordHash: string;
}

export function readPatientAccounts(): PatientAccount[] {
  try {
    const raw = localStorage.getItem(PATIENT_ACCOUNTS_KEY);
    if (!raw) return [];
    const accounts: unknown = JSON.parse(raw);
    if (
      !Array.isArray(accounts) ||
      accounts.some(
        (account) =>
          !account ||
          typeof account !== 'object' ||
          typeof account.id !== 'string' ||
          !account.id ||
          typeof account.fullName !== 'string' ||
          !account.fullName.trim() ||
          typeof account.dni !== 'string' ||
          !/^\d{7,8}$/.test(account.dni) ||
          typeof account.email !== 'string' ||
          !account.email.includes('@') ||
          typeof account.salt !== 'string' ||
          !/^[a-f0-9]{32}$/.test(account.salt) ||
          typeof account.passwordHash !== 'string' ||
          !/^[a-f0-9]{64}$/.test(account.passwordHash),
      )
    )
      throw new Error('Formato inválido');
    return accounts as PatientAccount[];
  } catch {
    throw new Error(
      'No se pudieron leer las cuentas de este navegador. Revisá que el almacenamiento esté habilitado.',
    );
  }
}

export function savePatientAccounts(accounts: PatientAccount[]) {
  try {
    localStorage.setItem(PATIENT_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    throw new Error(
      'No se pudo guardar la cuenta. Habilitá el almacenamiento del navegador e intentá nuevamente.',
    );
  }
}

export function patientAccountUser(account: PatientAccount): AuthUser {
  return {
    id: account.id,
    role: 'patient',
    name: account.fullName,
    identifier: account.dni,
    patient: { dni: account.dni, fullName: account.fullName, email: account.email, phone: '' },
  };
}
```
