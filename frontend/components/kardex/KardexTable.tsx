'use client';

import { useMemo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { api } from '@/lib/api';
import type { KardexMovimiento, TipoMovimientoKardex } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const toneByTipo: Record<TipoMovimientoKardex, 'success' | 'critical' | 'warning' | 'info'> = {
  ENTRADA: 'success',
  SALIDA: 'critical',
  AJUSTE_FINO: 'warning',
  MERMA: 'critical',
  REAPROVECHAMIENTO: 'info',
};

/**
 * Tabla de Kardex Inmutable: registro histórico append-only. No expone
 * acciones de edición/borrado — cada fila es un movimiento sellado en el
 * tiempo, generado por el backend dentro de una transacción ACID.
 */
export function KardexTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['kardex-movimientos'],
    queryFn: () => api.get<KardexMovimiento[]>('/kardex/movimientos'),
    refetchInterval: 15000,
  });

  const columns = useMemo<ColumnDef<KardexMovimiento>[]>(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        id: 'createdAt',
        header: 'Fecha / Hora',
        cell: (info) => (
          <span className="font-mono text-xs text-slate-500">
            {new Date(info.getValue<string>()).toLocaleString('es-PE')}
          </span>
        ),
      },
      {
        accessorFn: (row) => `${row.insumo.codigo} — ${row.insumo.nombre}`,
        id: 'insumo',
        header: 'Insumo',
      },
      {
        accessorKey: 'tipoMovimiento',
        header: 'Movimiento',
        cell: (info) => {
          const tipo = info.getValue<TipoMovimientoKardex>();
          return <Badge tone={toneByTipo[tipo]}>{tipo.replace('_', ' ')}</Badge>;
        },
      },
      {
        accessorKey: 'cantidad',
        header: 'Cantidad',
        cell: (info) => <span className="font-mono text-sm">{Number(info.getValue<string>()).toFixed(4)}</span>,
      },
      {
        id: 'stock',
        header: 'Stock Ant. → Nuevo',
        cell: (info) => {
          const row = info.row.original;
          return (
            <span className="font-mono text-xs text-slate-500">
              {Number(row.stockAnterior).toFixed(2)} → {Number(row.stockNuevo).toFixed(2)}
            </span>
          );
        },
      },
      {
        accessorKey: 'documentoReferencia',
        header: 'Referencia',
        cell: (info) => (
          <span className="font-mono text-xs text-slate-400">{info.getValue<string>() ?? '—'}</span>
        ),
      },
      {
        accessorFn: (row) => `${row.usuario.nombres} ${row.usuario.apellidos}`,
        id: 'usuario',
        header: 'Usuario',
      },
    ],
    [],
  );

  const table = useReactTable({ data: data ?? [], columns, getCoreRowModel: getCoreRowModel() });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Lock className="h-4 w-4 text-slate-400" />
        <CardTitle>Kardex Inmutable</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-400">
                  Cargando movimientos...
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
