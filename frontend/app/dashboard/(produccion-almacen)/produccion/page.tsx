import { ValidarStockPanel } from '@/components/produccion/ValidarStockPanel';
import { AjusteFinoForm } from '@/components/produccion/AjusteFinoForm';
import { SubAlmacenPanel } from '@/components/produccion/SubAlmacenPanel';

export default function ProduccionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          Control de Producción & Ajustes de Planta
        </h1>
        <p className="text-xs text-slate-400">
          Validación previa de stock, registro de ajuste fino y sub-almacén de sobrantes.
        </p>
      </div>
      <div className="rounded-xl bg-[#111827] p-6 border border-slate-800/80 shadow-md">
        <ValidarStockPanel />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-[#111827] p-6 border border-slate-800/80 shadow-md">
          <AjusteFinoForm />
        </div>
        <div className="rounded-xl bg-[#111827] p-6 border border-slate-800/80 shadow-md">
          <SubAlmacenPanel />
        </div>
      </div>
    </div>
  );
}
