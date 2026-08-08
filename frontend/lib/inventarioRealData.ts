export interface MaterialItem {
  sku: string;
  nombre: string;
  familia: string;
  stockPercentage: number;
  stockReal: number;
  stockMinimo: number;
  unidad: string;
  ubicacion: string;
  estado: 'OK' | 'LOW STOCK' | 'CRITICAL';
}

export interface SubAlmacenItem {
  id: string;
  codigo: string;
  nombre: string;
  peso: string;
  unidad: string;
  loteOrigen: string;
  fecha: string;
  reutilizable: boolean;
}

export const INVENTARIO_REAL_SEED_DATA: MaterialItem[] = [
  {
    sku: 'QC-001',
    nombre: 'Agua Desionizada & Desmineralizada USP',
    familia: 'Solventes & Agua Purificada',
    stockPercentage: 92,
    stockReal: 4200.0,
    stockMinimo: 500.0,
    unidad: 'L',
    ubicacion: 'Tanque Pulmón T-01',
    estado: 'OK',
  },
  {
    sku: 'QC-002',
    nombre: 'Soda Cáustica Escamas 99% (Hidróxido de Sodio)',
    familia: 'Insumos Químicos Básicos',
    stockPercentage: 85,
    stockReal: 1250.0,
    stockMinimo: 200.0,
    unidad: 'KG',
    ubicacion: 'Almacén Insumos - Rack A1',
    estado: 'OK',
  },
  {
    sku: 'QC-003',
    nombre: 'Lauril Éter Sulfato de Sodio 70% (LESS 70%)',
    familia: 'Tensioactivos Principales',
    stockPercentage: 78,
    stockReal: 3100.0,
    stockMinimo: 500.0,
    unidad: 'KG',
    ubicacion: 'Cilindros C-03 a C-12',
    estado: 'OK',
  },
  {
    sku: 'QC-004',
    nombre: 'Ácido Sulfónico Lineal 96% (LABS)',
    familia: 'Tensioactivos Aniónicos',
    stockPercentage: 80,
    stockReal: 2400.0,
    stockMinimo: 400.0,
    unidad: 'KG',
    ubicacion: 'Almacén Insumos - Rack A2',
    estado: 'OK',
  },
  {
    sku: 'QC-005',
    nombre: 'Alcohol Isopropílico 99.8% Grado Reactivo',
    familia: 'Solventes & Alcoholes USP',
    stockPercentage: 65,
    stockReal: 880.0,
    stockMinimo: 200.0,
    unidad: 'L',
    ubicacion: 'Zona Inflamables Z-01',
    estado: 'OK',
  },
  {
    sku: 'QC-006',
    nombre: 'Glicerina Vegetal Grado USP 99.5%',
    familia: 'Humectantes & Emolientes',
    stockPercentage: 72,
    stockReal: 1450.0,
    stockMinimo: 300.0,
    unidad: 'KG',
    ubicacion: 'Almacén Insumos - Rack B1',
    estado: 'OK',
  },
  {
    sku: 'QC-007',
    nombre: 'Mentol Cristalino USP de Menta Silvestre',
    familia: 'Extractos & Principios Activos',
    stockPercentage: 35,
    stockReal: 142.0,
    stockMinimo: 50.0,
    unidad: 'KG',
    ubicacion: 'Cámara Fría CF-01',
    estado: 'LOW STOCK',
  },
  {
    sku: 'QC-008',
    nombre: 'Aceite Esencial de Eucalipto Globulus 80/85',
    familia: 'Aceites Esenciales',
    stockPercentage: 22,
    stockReal: 18.5,
    stockMinimo: 25.0,
    unidad: 'KG',
    ubicacion: 'Cámara Fría CF-02',
    estado: 'CRITICAL',
  },
  {
    sku: 'QC-009',
    nombre: 'Fragancia Lavanda Francesa Concentrada',
    familia: 'Fragancias & Aromas',
    stockPercentage: 60,
    stockReal: 85.0,
    stockMinimo: 20.0,
    unidad: 'L',
    ubicacion: 'Rack Fragancias RF-01',
    estado: 'OK',
  },
  {
    sku: 'QC-010',
    nombre: 'Colorante Azul Brillante CI 42090 Grado Cosmético',
    familia: 'Colorantes & Pigmentos',
    stockPercentage: 55,
    stockReal: 62.0,
    stockMinimo: 15.0,
    unidad: 'KG',
    ubicacion: 'Zona Pigmentos ZP-01',
    estado: 'OK',
  },
  {
    sku: 'QC-011',
    nombre: 'Conservante DMDM Hidantoína + IPBC',
    familia: 'Preservantes & Biocidas',
    stockPercentage: 45,
    stockReal: 92.0,
    stockMinimo: 30.0,
    unidad: 'KG',
    ubicacion: 'Almacén Insumos - Rack B2',
    estado: 'OK',
  },
  {
    sku: 'QC-012',
    nombre: 'Cloruro de Benzalconio 50% (Amonio Cuaternario)',
    familia: 'Desinfectantes & Sanitizantes',
    stockPercentage: 15,
    stockReal: 45.0,
    stockMinimo: 100.0,
    unidad: 'KG',
    ubicacion: 'Almacén Insumos - Rack C1',
    estado: 'CRITICAL',
  },
];

export const SUBALMACEN_REAL_SEED_DATA: SubAlmacenItem[] = [
  {
    id: 'sub-01',
    codigo: 'SUB-LOT-0841-A',
    nombre: 'Merma de Ajuste Fino - Crema Muscular',
    peso: '4.85',
    unidad: 'KG',
    loteOrigen: 'LOT-2024-0841',
    fecha: '2026-08-01',
    reutilizable: true,
  },
  {
    id: 'sub-02',
    codigo: 'SUB-LOT-0840-B',
    nombre: 'Fondo de Mezclador - Detergente Floral',
    peso: '12.40',
    unidad: 'L',
    loteOrigen: 'LOT-2024-0840',
    fecha: '2026-08-04',
    reutilizable: true,
  },
  {
    id: 'sub-03',
    codigo: 'SUB-LOT-0839-C',
    nombre: 'Cabezal de Envasado - Shampoo Batana',
    peso: '2.10',
    unidad: 'L',
    loteOrigen: 'LOT-2024-0839',
    fecha: '2026-08-03',
    reutilizable: true,
  },
];
