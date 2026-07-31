'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PackageCheck, Recycle } from 'lucide-react';
import { api } from '@/lib/api';
import type { SubAlmacenSobrante } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Panel del Sub-Almacén de Sobrantes: muestra los remanentes de producción
 * (mermas reaprovechables) disponibles para reingresar a un nuevo lote.
 */
export function SubAlmacenPanel() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['sub-almacen-disponibles'],
    queryFn: () => api.get<SubAlmacenSobrante[]>('/sub-almacen/disponibles'),
  });

  const marcarReusado = useMutation({
    mutationFn: (id: string) => api.patch(`/sub-almacen/${id}/reusar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sub-almacen-disponibles'] }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-4 w-4" /> Sub-Almacén de Sobrantes
        </CardTitle>
        <Badge tone="info">{data?.length ?? 0} disponibles</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading && <p className="text-sm text-slate-400">Cargando sobrantes...</p>}
        {!isLoading && data?.length === 0 && (
          <p className="text-sm text-slate-400">No hay sobrantes disponibles para reúso.</p>
        )}
        {data?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">
                {item.insumoSubproducto.nombre}{' '}
                <span className="font-mono text-xs text-slate-400">
                  ({item.loteOrigen.codigoLote})
                </span>
              </p>
              <p className="text-xs text-slate-500">
                {Number(item.pesoDisponible).toFixed(2)} {item.insumoSubproducto.unidadMedida} · Ubicación:{' '}
                {item.ubicacion}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => marcarReusado.mutate(item.id)}
              disabled={marcarReusado.isPending}
            >
              <PackageCheck className="h-3.5 w-3.5" /> Marcar reusado
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
