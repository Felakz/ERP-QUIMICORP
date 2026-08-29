'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { DateRangeType, KpiItem, TopCustomer, CompactMetric } from '@/types/dashboard';

interface DashboardApiResponse {
  kpis: KpiItem[];
  topCustomers: TopCustomer[];
  compactMetrics?: CompactMetric[];
  salesAnalytics?: any[];
  invoiceTerms?: any[];
  paymentCategories?: any[];
  recentDocs?: any[];
  recentOrders?: any[];
  timestamp: string;
}

export function useDashboardData(dateRange: DateRangeType) {
  const [kpis, setKpis] = useState<KpiItem[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [compactMetrics, setCompactMetrics] = useState<CompactMetric[]>([]);
  const [salesAnalytics, setSalesAnalytics] = useState<any[]>([]);
  const [invoiceTerms, setInvoiceTerms] = useState<any[]>([]);
  const [paymentCategories, setPaymentCategories] = useState<any[]>([]);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, ok } = await apiFetch<DashboardApiResponse>(
        `/administracion/dashboard/stats?dateRange=${dateRange}`
      );

      if (ok && data) {
        setKpis(data.kpis || []);
        setTopCustomers(data.topCustomers || []);
        setCompactMetrics(data.compactMetrics || []);
        setSalesAnalytics(data.salesAnalytics || []);
        setInvoiceTerms(data.invoiceTerms || []);
        setPaymentCategories(data.paymentCategories || []);
        setRecentDocs(data.recentDocs || []);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con la API de finanzas');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    kpis,
    topCustomers,
    compactMetrics,
    salesAnalytics,
    invoiceTerms,
    paymentCategories,
    recentDocs,
    recentOrders,
    loading,
    error,
    refresh: fetchDashboardData,
  };
}
