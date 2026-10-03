# demoAccounts.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/mocks/demoAccounts.ts)

**Ruta:** `src/mocks/demoAccounts.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { AuthUser, UserRole } from '../types/auth';

interface DemoAccount {
  user: AuthUser;
  password: string;
}

// Credenciales públicas de demostración; no representan usuarios ni secretos reales.
export const demoAccounts: DemoAccount[] = [
  {
    user: {
      id: 'patient-30123456',
      role: 'patient',
      name: 'María Prueba',
      identifier: '30123456',
      patient: {
        dni: '30123456',
        fullName: 'María Prueba',
        email: 'maria@ejemplo.com',
        phone: '11 5555 1234',
      },
    },
    password: 'Paciente123!',
  },
  {
    user: {
      id: 'patient-28987654',
      role: 'patient',
      name: 'Juan Prueba',
      identifier: '28987654',
      patient: {
        dni: '28987654',
        fullName: 'Juan Prueba',
        email: 'juan@ejemplo.com',
        phone: '11 5555 5678',
      },
    },
    password: 'Paciente123!',
  },
  {
    user: {
      id: 'medical-demo',
      role: 'medical',
      name: 'Dra. Lucía Fernández',
      identifier: 'medico@pilar.demo',
    },
    password: 'Medico123!',
  },
];

export function demoAccountFor(role: UserRole) {
  return demoAccounts.find((account) => account.user.role === role)!;
}
```
