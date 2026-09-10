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

const dashboardCache = new Map<string, { data: DashboardApiResponse; timestamp: number }>();
const DASHBOARD_CACHE_TTL = 30_000;

export function useDashboardData(
  dateRange: DateRangeType,
  customDates?: { startDate: string; endDate: string }
) {
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

  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    let url = `/administracion/dashboard/stats?dateRange=${dateRange}`;
    if (dateRange === 'CUSTOM' && customDates?.startDate && customDates?.endDate) {
      url += `&startDate=${encodeURIComponent(customDates.startDate)}&endDate=${encodeURIComponent(customDates.endDate)}`;
    }

    const cached = dashboardCache.get(url);
    if (cached && !forceRefresh) {
      setKpis(cached.data.kpis || []);
      setTopCustomers(cached.data.topCustomers || []);
      setCompactMetrics(cached.data.compactMetrics || []);
      setSalesAnalytics(cached.data.salesAnalytics || []);
      setInvoiceTerms(cached.data.invoiceTerms || []);
      setPaymentCategories(cached.data.paymentCategories || []);
      setRecentDocs(cached.data.recentDocs || []);
      setRecentOrders(cached.data.recentOrders || []);
      setLoading(false);

      if (Date.now() - cached.timestamp < DASHBOARD_CACHE_TTL) {
        return;
      }
    } else if (!cached) {
      setLoading(true);
    }

    setError(null);
    try {
      const { data, ok } = await apiFetch<DashboardApiResponse>(url);

      if (ok && data) {
        dashboardCache.set(url, { data, timestamp: Date.now() });
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
  }, [dateRange, customDates?.startDate, customDates?.endDate]);

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
