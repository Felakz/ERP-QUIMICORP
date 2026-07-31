'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api';
import type { FormulaMaster, RequerimientoInsumo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ValidacionResponse {
  puedeIniciar: boolean;
  requerimientos: RequerimientoInsumo[];
}

/**
 * Consume el endpoint POST /produccion/ordenes/validar-stock: valida que
 * exista stock suficiente de cada insumo de la fórmula ANTES de permitir
 * crear la Orden de Producción.
 */
export function ValidarStockPanel() {
  const [formulaId, setFormulaId] = useState('');
  const [cantidad, setCantidad] = useState('');

  const { data: formulas } = useQuery({
    queryKey: ['formulas'],
    queryFn: () => api.get<FormulaMaster[]>('/formulas'),
  });

  const validar = useMutation({
    mutationFn: () =>
      api.post<ValidacionResponse>('/produccion/ordenes/validar-stock', {
        formulaId,
        cantidadPlanificada: Number(cantidad),
      }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Validación previa de stock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <select
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm sm:col-span-2"
            value={formulaId}
            onChange={(e) => setFormulaId(e.target.value)}
          >
            <option value="">Seleccione una fórmula...</option>
            {formulas?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.codigoFormula} — {f.nombreProducto}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Cantidad planificada"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <Button
          onClick={() => validar.mutate()}
          disabled={!formulaId || !cantidad || validar.isPending}
        >
          {validar.isPending ? 'Validando...' : 'Validar disponibilidad'}
        </Button>

        {validar.data && (
          <div className="space-y-2">
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                validar.data.puedeIniciar
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-300 bg-red-50 text-red-700'
              }`}
            >
              {validar.data.puedeIniciar ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
              {validar.data.puedeIniciar
                ? 'Stock suficiente. La orden puede iniciarse.'
                : 'Stock insuficiente para uno o más insumos.'}
            </div>
            <div className="divide-y divide-slate-100 rounded-md border border-slate-100">
              {validar.data.requerimientos.map((r) => (
                <div key={r.insumoId} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span>
                    {r.codigo} — {r.nombre}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span>
                      req: {r.cantidadRequerida} / disp: {r.stockDisponible} {r.unidadMedida}
                    </span>
                    <Badge tone={r.suficiente ? 'success' : 'critical'}>
                      {r.suficiente ? 'OK' : `falta ${r.faltante}`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
