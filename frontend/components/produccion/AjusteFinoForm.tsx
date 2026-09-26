'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Gauge } from 'lucide-react';
import { api } from '@/lib/api';
import type { Insumo, OrdenProduccion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ajusteSchema = z.object({
  ordenProduccionId: z.string().uuid('Seleccione una orden de producción'),
  insumoId: z.string().uuid('Seleccione un insumo'),
  cantidadAgregada: z.coerce.number().refine((v) => v !== 0, 'La cantidad no puede ser 0'),
  registradoPorId: z.string().uuid('Usuario inválido'),
});

type AjusteFormValues = z.infer<typeof ajusteSchema>;

// TODO: reemplazar por el usuario autenticado (sesión) una vez integrado auth
const USUARIO_ACTUAL_ID = '00000000-0000-0000-0000-000000000000';

/**
 * Interfaz para Ajuste Fino en Planta: el operario registra la cantidad
 * agregada/retirada manualmente y el sistema recalcula la merma esperada
 * (diferencia entre lo planificado por fórmula y lo realmente dosificado)
 * de forma instantánea en el cliente, antes de enviar al backend, que
 * confirma el cálculo final vía Kardex.
 */
export function AjusteFinoForm() {
  const queryClient = useQueryClient();
  const [mermaEstimativa, setMermaEstimativa] = useState<number | null>(null);

  const { data: ordenes } = useQuery({
    queryKey: ['ordenes-en-proceso'],
    queryFn: () => api.get<OrdenProduccion[]>('/produccion/ordenes'),
  });

  const { data: insumos } = useQuery({
    queryKey: ['insumos-para-ajuste'],
    queryFn: () => api.get<Insumo[]>('/inventario/insumos'),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AjusteFormValues>({
    resolver: zodResolver(ajusteSchema),
    defaultValues: { registradoPorId: USUARIO_ACTUAL_ID },
  });

  const ordenId = watch('ordenProduccionId');
  const cantidad = watch('cantidadAgregada');

  const ordenSeleccionada = ordenes?.find((o) => o.id === ordenId);

  // Recalculo instantáneo: compara lo planificado por fórmula vs lo ajustado
  const recalcularMerma = () => {
    if (!ordenSeleccionada) return;
    const planificado = Number(ordenSeleccionada.cantidadPlanificadaKg ?? ordenSeleccionada.cantidadPlanificada);
    const ajuste = Number(cantidad) || 0;
    const nuevaMerma = planificado > 0 ? (ajuste / 1000 / planificado) * 100 : 0;
    setMermaEstimativa(nuevaMerma);
  };

  const registrarAjuste = useMutation({
    mutationFn: (values: AjusteFormValues) => api.post('/produccion/ajustes-finos', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kardex-movimientos'] });
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      reset({ registradoPorId: USUARIO_ACTUAL_ID });
      setMermaEstimativa(null);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-4 w-4" /> Ajuste Fino en Planta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => registrarAjuste.mutate(v))}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Orden de producción
            </label>
            <select
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              {...register('ordenProduccionId')}
            >
              <option value="">Seleccione un lote...</option>
              {ordenes
                ?.filter((o) => o.estado === 'EN_PROCESO')
                .map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.codigoLote} — {o.formula.nombreProducto}
                  </option>
                ))}
            </select>
            {errors.ordenProduccionId && (
              <p className="mt-1 text-xs text-red-600">{errors.ordenProduccionId.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Insumo</label>
            <select
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              {...register('insumoId')}
            >
              <option value="">Seleccione un insumo...</option>
              {insumos?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.codigo} — {i.nombre}
                </option>
              ))}
            </select>
            {errors.insumoId && <p className="mt-1 text-xs text-red-600">{errors.insumoId.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Cantidad en GR: agregada al lote (+) / devuelta al almacén (-)
            </label>
            <Input
              type="number"
              step="0.0001"
              {...register('cantidadAgregada')}
              onBlur={recalcularMerma}
            />
            {errors.cantidadAgregada && (
              <p className="mt-1 text-xs text-red-600">{errors.cantidadAgregada.message}</p>
            )}
          </div>

          {mermaEstimativa !== null && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Impacto estimado sobre el lote: <strong>{mermaEstimativa.toFixed(3)}%</strong> respecto a
              lo planificado.
            </div>
          )}

          {registrarAjuste.isError && (
            <p className="text-sm text-red-600">{(registrarAjuste.error as Error).message}</p>
          )}
          {registrarAjuste.isSuccess && (
            <p className="text-sm text-emerald-600">
              Ajuste registrado y sincronizado con el Kardex Inmutable.
            </p>
          )}

          <Button type="submit" disabled={registrarAjuste.isPending}>
            {registrarAjuste.isPending ? 'Registrando...' : 'Registrar ajuste fino'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
