'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowUpDown, Search } from 'lucide-react';
import { api } from '@/lib/api';
import type { FamiliaInsumo, Insumo } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

/**
 * Tabla de Inventario — Sprint 1
 * - Búsqueda por código / nombre (server-side, debounce simple)
 * - Filtro por familia de insumo
 * - Badge de "stock crítico" cuando stockReal < stockMinimo
 */
export function InventoryTable() {
  const [search, setSearch] = useState('');
  const [familiaId, setFamiliaId] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: familias } = useQuery({
    queryKey: ['familias-insumo'],
    queryFn: () => api.get<FamiliaInsumo[]>('/inventario/familias'),
  });

  const { data: insumos, isLoading, isError } = useQuery({
    queryKey: ['insumos', search, familiaId],
    queryFn: () =>
      api.get<Insumo[]>(
        `/inventario/insumos?${new URLSearchParams({
          ...(search ? { search } : {}),
          ...(familiaId ? { familiaId } : {}),
        }).toString()}`,
      ),
  });

  const columns = useMemo<ColumnDef<Insumo>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Código',
        cell: (info) => (
          <span className="font-mono text-xs text-slate-600">{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'nombre',
        header: 'Insumo',
        cell: (info) => <span className="font-medium text-slate-900">{info.getValue<string>()}</span>,
      },
      {
        accessorFn: (row) => row.familia?.nombre,
        id: 'familia',
        header: 'Familia',
        cell: (info) => <span className="text-slate-600">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'stockReal',
        header: 'Stock Real',
        cell: (info) => {
          const row = info.row.original;
          const stockReal = Number(row.stockReal);
          const stockMinimo = Number(row.stockMinimo);
          const critico = stockReal < stockMinimo;
          return (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">
                {stockReal.toFixed(2)} {row.unidadMedida}
              </span>
              {critico && (
                <Badge tone="critical">
                  <AlertTriangle className="h-3 w-3" /> Crítico
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'stockTeorico',
        header: 'Stock Teórico',
        cell: (info) => (
          <span className="font-mono text-sm text-slate-500">
            {Number(info.getValue<string>()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'costoUnitario',
        header: 'Costo Unit.',
        cell: (info) => (
          <span className="font-mono text-sm text-slate-500">
            S/ {Number(info.getValue<string>()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: (info) => (
          <Badge tone={info.getValue<string>() === 'ACTIVO' ? 'success' : 'neutral'}>
            {info.getValue<string>()}
          </Badge>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: insumos ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por código o nombre..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4F6C]"
          value={familiaId}
          onChange={(e) => setFamiliaId(e.target.value)}
        >
          <option value="">Todas las familias</option>
          {familias?.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer select-none px-4 py-3 font-semibold"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <ArrowUpDown className="h-3 w-3 text-slate-400" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-400">
                  Cargando inventario...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-red-500">
                  No se pudo cargar el inventario. Verifique la conexión con el backend.
                </td>
              </tr>
            )}
            {!isLoading && !isError && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-400">
                  No se encontraron insumos con los filtros aplicados.
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
      </div>
    </Card>
  );
}
