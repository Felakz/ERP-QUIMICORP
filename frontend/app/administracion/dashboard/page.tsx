'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import {
  CommercialDocument,
  CommercialOrder,
  CompactMetric,
  CurrencyType,
  DateRangeType,
  InvoiceAnalyticsTerm,
  KpiItem,
  PaymentCategoryPoint,
  SalesAnalyticsPoint,
  TopCustomer,
} from '@/types/dashboard';

import { useDashboardData } from '@/hooks/useDashboardData';

// Modular Dashboard Components
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KpiCardsGrid } from '@/components/dashboard/KpiCardsGrid';
import { SalesAnalyticsChart } from '@/components/dashboard/SalesAnalyticsChart';
import { InvoiceAnalyticsChart } from '@/components/dashboard/InvoiceAnalyticsChart';
import { TopCustomersList } from '@/components/dashboard/TopCustomersList';
import { CompactMetricsCards } from '@/components/dashboard/CompactMetricsCards';
import { PaymentCategoriesChart } from '@/components/dashboard/PaymentCategoriesChart';
import { RecentDocumentsTable } from '@/components/dashboard/RecentDocumentsTable';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';

import { MOCK_KPIS } from './dashboardMockData';

export default function AdministracionDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // --- ESTADOS GLOBALES DE LA VISTA GERENCIAL ---
  const [includeIgv, setIncludeIgv] = useState<boolean>(false); // false = Neto, true = Con IGV (18%)
  const [currency, setCurrency] = useState<CurrencyType>('PEN'); // 'PEN' (S/) vs 'USD' ($)
  const [dateRange, setDateRange] = useState<DateRangeType>('MES_ACTUAL');
  const [exchangeRateUsd] = useState<number>(3.75); // Tipo de cambio PEN por USD

  // Live API Custom Hook (100% PostgreSQL sin hardcodeo)
  const {
    kpis: liveKpis,
    topCustomers: liveTopCustomers,
    compactMetrics: liveCompactMetrics,
    salesAnalytics: liveSalesAnalytics,
    invoiceTerms: liveInvoiceTerms,
    paymentCategories: livePaymentCategories,
    recentDocs: liveRecentDocs,
    recentOrders: liveRecentOrders,
    refresh: refreshApi,
  } = useDashboardData(dateRange);

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* 1. CABECERA & CONTROLES GLOBALES */}
      <DashboardHeader
        includeIgv={includeIgv}
        onToggleIgv={setIncludeIgv}
        currency={currency}
        onChangeCurrency={setCurrency}
        dateRange={dateRange}
        onChangeDateRange={setDateRange}
        onRefresh={refreshApi}
      />

      {/* 2. TARJETAS SUPERIORES (KPIs GERENCIALES) */}
      <KpiCardsGrid
        kpis={liveKpis}
        includeIgv={includeIgv}
        currency={currency}
        exchangeRateUsd={exchangeRateUsd}
      />

      {/* 3. FILA DE ANALÍTICA SUPERIOR (GRÁFICOS RECHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda (60% - 7 Cols) */}
        <div className="lg:col-span-7">
          <SalesAnalyticsChart
            data={liveSalesAnalytics}
            includeIgv={includeIgv}
            currency={currency}
            exchangeRateUsd={exchangeRateUsd}
          />
        </div>

        {/* Columna Derecha (40% - 5 Cols) */}
        <div className="lg:col-span-5">
          <InvoiceAnalyticsChart
            terms={liveInvoiceTerms}
            includeIgv={includeIgv}
            currency={currency}
            exchangeRateUsd={exchangeRateUsd}
          />
        </div>
      </div>

      {/* 4. FILA MEDIA (INTELIGENCIA COMERCIAL Y FLUJO DE COBRANZAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Top 10 Clientes (4 Cols - ~33%) */}
        <div className="lg:col-span-4 h-full flex flex-col">
          <TopCustomersList
            customers={liveTopCustomers}
            includeIgv={includeIgv}
            currency={currency}
            exchangeRateUsd={exchangeRateUsd}
          />
        </div>

        {/* Resumen Compacto Cuentas por Cobrar (4 Cols - ~33%) */}
        <div className="lg:col-span-4 h-full flex flex-col">
          <CompactMetricsCards
            metrics={liveCompactMetrics}
            includeIgv={includeIgv}
            currency={currency}
            exchangeRateUsd={exchangeRateUsd}
          />
        </div>

        {/* Métodos de Pago & Cobranza Radar Chart (4 Cols - ~33%) */}
        <div className="lg:col-span-4 h-full flex flex-col">
          <PaymentCategoriesChart
            categories={livePaymentCategories}
            includeIgv={includeIgv}
            currency={currency}
            exchangeRateUsd={exchangeRateUsd}
          />
        </div>
      </div>

      {/* 5. TABLAS INFERIORES CON FILTRADO RÁPIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabla 1: Documentos Comerciales Recientes (7 Cols) */}
        <div className="lg:col-span-7">
          <RecentDocumentsTable
            documents={liveRecentDocs}
            includeIgv={includeIgv}
            currency={currency}
            exchangeRateUsd={exchangeRateUsd}
          />
        </div>

        {/* Tabla 2: Órdenes y Cotizaciones Emitidas (5 Cols) */}
        <div className="lg:col-span-5">
          <RecentOrdersTable
            orders={liveRecentOrders}
            includeIgv={includeIgv}
            currency={currency}
            exchangeRateUsd={exchangeRateUsd}
          />
        </div>
      </div>
    </div>
  );
}
