import { CurrencyType } from '@/types/dashboard';

export const IGV_RATE = 0.18;
export const DEFAULT_USD_EXCHANGE_RATE = 3.75;

/**
 * Aplica el cálculo de IGV inverso (Neto = Bruto / 1.18 vs Bruto = Total con IGV)
 * y la conversión de moneda (PEN vs USD).
 */
export function calculateMonetaryValue(
  valuePenBruto: number,
  includeIgv: boolean,
  currency: CurrencyType,
  exchangeRateUsd: number = DEFAULT_USD_EXCHANGE_RATE
): number {
  const safeGross = Number(valuePenBruto) || 0;
  const monetaryValue = includeIgv ? safeGross : safeGross / (1 + IGV_RATE);
  if (currency === 'USD') {
    return monetaryValue / (exchangeRateUsd || DEFAULT_USD_EXCHANGE_RATE);
  }
  return monetaryValue;
}

/**
 * Formatea un valor numérico como moneda PEN (S/) o USD ($).
 */
export function formatCurrency(
  valuePenBruto: number,
  includeIgv: boolean,
  currency: CurrencyType,
  exchangeRateUsd: number = DEFAULT_USD_EXCHANGE_RATE
): string {
  const calculated = calculateMonetaryValue(
    valuePenBruto,
    includeIgv,
    currency,
    exchangeRateUsd
  );

  const symbol = currency === 'PEN' ? 'S/' : '$';
  const formattedNumber = calculated.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol} ${formattedNumber}`;
}
