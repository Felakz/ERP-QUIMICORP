import * as XLSX from 'xlsx';

export interface ExcelColumn<T = any> {
  header: string;
  key: keyof T | string;
  width?: number;
  format?: (value: any, row: T) => any;
}

export interface ExcelExportOptions<T = any> {
  fileName: string;
  sheetName?: string;
  title?: string;
  subtitle?: string;
  columns: ExcelColumn<T>[];
  data: T[];
  summaryRows?: Record<string, any>[];
}

export function exportToExcel<T = any>({
  fileName,
  sheetName = 'Reporte',
  title = 'GRUPO QUIMICORP - ERP INDUSTRIAL',
  subtitle,
  columns,
  data,
  summaryRows,
}: ExcelExportOptions<T>) {
  // 1. Prepare raw table array
  const rows: any[][] = [];

  // Title block
  rows.push([title]);
  if (subtitle) {
    rows.push([subtitle]);
  }
  rows.push([`Generado el: ${new Date().toLocaleString('es-PE')} | Usuario: Gerencia / Administración`]);
  rows.push([]); // Empty row separator

  // Header row
  const headerRow = columns.map((col) => col.header);
  rows.push(headerRow);

  // Data rows
  data.forEach((item) => {
    const row = columns.map((col) => {
      const val = (item as any)[col.key];
      if (col.format) {
        return col.format(val, item);
      }
      return val !== undefined && val !== null ? val : '';
    });
    rows.push(row);
  });

  // Summary rows if provided
  if (summaryRows && summaryRows.length > 0) {
    rows.push([]); // blank separator
    rows.push(['--- RESUMEN CONSOLIDADO ---']);
    summaryRows.forEach((s) => {
      const sRow = columns.map((col) => s[col.key as string] ?? '');
      rows.push(sRow);
    });
  }

  // 2. Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // 3. Set column widths
  ws['!cols'] = columns.map((col) => ({
    wch: col.width || Math.max(col.header.length + 4, 14),
  }));

  // 4. Create workbook and append
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));

  // 5. Download file
  const fullFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  XLSX.writeFile(wb, fullFileName);
}
