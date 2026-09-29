'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return <html lang="es"><body><p>No se pudo abrir esta pantalla.</p><button onClick={reset}>Reintentar</button></body></html>;
}
