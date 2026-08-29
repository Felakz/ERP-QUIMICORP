'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/lib/apiClient';
import { ClientExtended } from '@/types/clientes';
import { ClientDetailView } from '@/components/clientes/ClientDetailView';

export default function ClienteDetallePage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id as string;

  const [cliente, setCliente] = useState<ClientExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    const fetchClient = async () => {
      setLoading(true);
      try {
        const { data, ok } = await apiFetch<ClientExtended>(`/clientes/${clientId}`);
        if (ok && data) {
          setCliente(data);
        } else {
          setError('No se encontró el cliente solicitado');
        }
      } catch (err: any) {
        setError(err.message || 'Error al obtener datos del cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-mono text-slate-400">
        Cargando expediente 360° del cliente...
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="p-8 text-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-sans space-y-3">
        <p className="text-sm font-bold">{error || 'Cliente no encontrado'}</p>
        <button
          onClick={() => router.push('/administracion/clientes')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
        >
          Volver a Cartera de Clientes
        </button>
      </div>
    );
  }

  return (
    <ClientDetailView
      cliente={cliente}
      onBack={() => router.push('/administracion/clientes')}
    />
  );
}
