'use client';

export interface FormulaIngredientEdit {
  id?: string;
  insumoId?: string;
  componente: string;
  porcentaje: number;
}

export interface IngredientOption { id: string; nombre: string; codigo: string }

export function FormulaIngredientSelect({ value, options, onChange, className }: {
  value: FormulaIngredientEdit;
  options: IngredientOption[];
  onChange: (value: FormulaIngredientEdit) => void;
  className?: string;
}) {
  return <select required aria-label={`Insumo: ${value.componente || 'seleccionar'}`}
    value={value.insumoId || ''} className={className}
    onChange={event => {
      const selected = options.find(item => item.id === event.target.value);
      onChange({ ...value, insumoId: selected?.id, componente: selected?.nombre || value.componente });
    }}>
    <option value="">{value.componente ? `${value.componente} — seleccione su insumo` : 'Seleccione un insumo existente'}</option>
    {value.insumoId && !options.some(item => item.id === value.insumoId) &&
      <option value={value.insumoId}>{value.componente}</option>}
    {options.map(item => <option key={item.id} value={item.id}>{item.codigo} · {item.nombre}</option>)}
  </select>;
}
