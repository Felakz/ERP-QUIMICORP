'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { Insumo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const detalleSchema = z.object({
  insumoId: z.string().uuid({ message: 'Seleccione un insumo válido' }),
  porcentaje: z.coerce.number().min(0.001, 'Debe ser mayor a 0').max(100),
});

const formulaSchema = z.object({
  codigoFormula: z.string().min(3, 'Mínimo 3 caracteres'),
  nombreProducto: z.string().min(3, 'Mínimo 3 caracteres'),
  densidadTeorica: z.coerce.number().positive('Debe ser mayor a 0'),
  detalles: z.array(detalleSchema).min(1, 'Agregue al menos un insumo'),
});

type FormulaFormValues = z.infer<typeof formulaSchema>;

/**
 * Formulario reactivo para creación y prueba (validación en vivo) de una
 * Fórmula Máster. Valida que la suma de porcentajes tienda a 100% antes de
 * permitir el envío, mostrando la desviación en tiempo real.
 */
export function FormulaMasterForm() {
  const queryClient = useQueryClient();

  const { data: insumos } = useQuery({
    queryKey: ['insumos-para-formula'],
    queryFn: () => api.get<Insumo[]>('/inventario/insumos'),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormulaFormValues>({
    resolver: zodResolver(formulaSchema),
    defaultValues: {
      codigoFormula: '',
      nombreProducto: '',
      densidadTeorica: undefined,
      detalles: [{ insumoId: '', porcentaje: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' });

  const detalles = watch('detalles');
  const sumaPorcentajes = detalles.reduce((acc, d) => acc + (Number(d.porcentaje) || 0), 0);
  const desviacion = Math.abs(sumaPorcentajes - 100);
  const balanceOk = desviacion <= 0.01;

  const crearFormula = useMutation({
    mutationFn: (values: FormulaFormValues) => api.post('/formulas', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
      reset();
    },
  });

  const onSubmit = (values: FormulaFormValues) => {
    if (!balanceOk) return;
    crearFormula.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Fórmula Máster</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Código de fórmula
              </label>
              <Input {...register('codigoFormula')} placeholder="FRM-0001" />
              {errors.codigoFormula && (
                <p className="mt-1 text-xs text-red-600">{errors.codigoFormula.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Nombre del producto
              </label>
              <Input {...register('nombreProducto')} placeholder="Thinner Acrílico 500" />
              {errors.nombreProducto && (
                <p className="mt-1 text-xs text-red-600">{errors.nombreProducto.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Densidad teórica (g/mL)
              </label>
              <Input type="number" step="0.0001" {...register('densidadTeorica')} placeholder="0.8650" />
              {errors.densidadTeorica && (
                <p className="mt-1 text-xs text-red-600">{errors.densidadTeorica.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">
                Composición (insumo / % en peso)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ insumoId: '', porcentaje: undefined as unknown as number })}
              >
                <Plus className="h-3.5 w-3.5" /> Agregar insumo
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <select
                    className="h-9 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4F6C]"
                    {...register(`detalles.${index}.insumoId` as const)}
                  >
                    <option value="">Seleccione un insumo...</option>
                    {insumos?.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.codigo} — {insumo.nombre}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    step="0.001"
                    className="w-28"
                    placeholder="%"
                    {...register(`detalles.${index}.porcentaje` as const)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.detalles && (
              <p className="mt-1 text-xs text-red-600">{errors.detalles.message as string}</p>
            )}

            <div
              className={`mt-3 flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                balanceOk
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-300 bg-amber-50 text-amber-800'
              }`}
            >
              <span>Suma de porcentajes</span>
              <span className="font-mono font-semibold">{sumaPorcentajes.toFixed(3)}%</span>
            </div>
          </div>

          {crearFormula.isError && (
            <p className="text-sm text-red-600">
              {(crearFormula.error as Error).message}
            </p>
          )}
          {crearFormula.isSuccess && (
            <p className="text-sm text-emerald-600">Fórmula registrada correctamente (EN_REVISION).</p>
          )}

          <Button type="submit" disabled={!balanceOk || isSubmitting || crearFormula.isPending}>
            {crearFormula.isPending ? 'Guardando...' : 'Guardar fórmula máster'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
