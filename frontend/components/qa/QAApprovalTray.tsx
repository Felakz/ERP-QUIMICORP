'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ClipboardList, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import type { OrdenProduccion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Bandeja de aprobación de lotes para el Encargado de QA. Solo muestra
 * órdenes en estado QA_PENDIENTE; aprobar/rechazar transiciona el estado
 * (APROBADO / RECHAZADO) vía PATCH idempotente en el backend.
 */
export function QAApprovalTray() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['qa-pendientes'],
    queryFn: () => api.get<OrdenProduccion[]>('/produccion/qa/pendientes'),
    refetchInterval: 10000,
  });

  const invalidar = () => {
    queryClient.invalidateQueries({ queryKey: ['qa-pendientes'] });
    queryClient.invalidateQueries({ queryKey: ['ordenes-en-proceso'] });
  };

  const aprobar = useMutation({
    mutationFn: (ordenProduccionId: string) => api.patch('/produccion/qa/aprobar', { ordenProduccionId }),
    onSuccess: invalidar,
  });

  const rechazar = useMutation({
    mutationFn: (ordenProduccionId: string) => api.patch('/produccion/qa/rechazar', { ordenProduccionId }),
    onSuccess: invalidar,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Bandeja de Aprobación QA
        </CardTitle>
        <Badge tone="warning">{data?.length ?? 0} pendientes</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading && <p className="text-sm text-slate-400">Cargando lotes pendientes...</p>}
        {!isLoading && data?.length === 0 && (
          <p className="text-sm text-slate-400">No hay lotes pendientes de revisión QA.</p>
        )}
        {data?.map((orden) => (
          <div
            key={orden.id}
            className="flex flex-col gap-2 rounded-md border border-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">
                {orden.codigoLote} —{' '}
                <span className="font-normal text-slate-600">{orden.formula.nombreProducto}</span>
              </p>
              <p className="text-xs text-slate-500">
                Planificado: {Number(orden.cantidadPlanificada).toFixed(2)} • Obtenido:{' '}
                {orden.cantidadObtenida ? Number(orden.cantidadObtenida).toFixed(2) : '—'} • Supervisor:{' '}
                {orden.supervisor.nombres} {orden.supervisor.apellidos}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => rechazar.mutate(orden.id)}
                disabled={rechazar.isPending || aprobar.isPending}
              >
                <XCircle className="h-3.5 w-3.5 text-red-500" /> Rechazar
              </Button>
              <Button
                size="sm"
                onClick={() => aprobar.mutate(orden.id)}
                disabled={rechazar.isPending || aprobar.isPending}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
