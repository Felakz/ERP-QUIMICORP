'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CommercialOrderForm } from '@/components/pedidos/CommercialOrderForm';

export default function CotizadorComercialPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 font-sans min-h-screen">
      <CommercialOrderForm
        mode="COTIZACION"
        onCancel={() => router.push('/administracion/pedidos')}
        onSuccess={() => {
          router.push('/administracion/pedidos');
        }}
      />
    </div>
  );
}
