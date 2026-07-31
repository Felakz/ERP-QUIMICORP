export interface IngredienteFormula {
  sku: string;
  componente: string;
  porcentaje: number;
  pesoTeorico: number;
  tipo: 'BASE' | 'ADICIONAL';
  stockStatus: 'OK' | 'BAJO' | 'CRITICAL';
}

export interface FormulaProducto {
  id: string;
  codigoFM: string;
  nombreProducto: string;
  categoria: string;
  pesoObjetivo: number;
  loteActual: string;
  estadoProceso: string;
  ingredientes: IngredienteFormula[];
}

export const CATEGORIAS_FORMULAS = [
  'Todas',
  'SERUM',
  'GELES',
  'CREMAS',
  'BALSAMOS',
  'ACEITES',
  'LIQUIDOS',
  'CHAMPU',
] as const;

export const FORMULAS_MAESTRAS_REALES: FormulaProducto[] = [
  {
    "id": "1",
    "codigoFM": "FM-0001",
    "nombreProducto": "SERUM DE SALMON",
    "categoria": "SERUM",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1001",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 86.0,
        "pesoTeorico": 860.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Glicerina vegetal",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Niacinamida",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Propilenglicol",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Cafeina",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Procide CG (conservante)",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Colageno Hidrolizado",
        "porcentaje": 0.7,
        "pesoTeorico": 7.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "2",
    "codigoFM": "FM-0002",
    "nombreProducto": "SERUM DE ALOE VERA",
    "categoria": "SERUM",
    "pesoObjetivo": 1003.7,
    "loteActual": "LOT-2026-1002",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 88.57,
        "pesoTeorico": 889.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Glicerina vegetal",
        "porcentaje": 4.98,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Propilenglicol",
        "porcentaje": 2.99,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Pantenol (Vitamina B5)",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Niacinamida",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Cellosize",
        "porcentaje": 1.1,
        "pesoTeorico": 11.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Trietanolamina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Fragancia",
        "porcentaje": 0.02,
        "pesoTeorico": 0.2,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "3",
    "codigoFM": "FM-0003",
    "nombreProducto": "SERUM DE OJERAS",
    "categoria": "SERUM",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1003",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 89.44,
        "pesoTeorico": 894.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Propilenglicol",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Cafeina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Colageno hidrolizado",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Acido Ascorbico",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Mentol en cristales",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "4",
    "codigoFM": "FM-0004",
    "nombreProducto": "SERUM DE HIDRATANTE",
    "categoria": "SERUM",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1004",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 86.3,
        "pesoTeorico": 863.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Glicerina",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Propilenglicol",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Urea",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Niacinamida",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Pantenol",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Alantoina",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-012",
        "componente": "Acido Citrico",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-013",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "5",
    "codigoFM": "FM-0005",
    "nombreProducto": "KOREAN SILK COLLAGEN AMPOULE",
    "categoria": "SERUM",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1005",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 90.25,
        "pesoTeorico": 902.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "D - pantenol",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Colageno Hidrolizado",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.15,
        "pesoTeorico": 1.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Niacinamida",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Alantoina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Carpobol",
        "porcentaje": 0.9,
        "pesoTeorico": 9.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Procide CG",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Fragancia",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-012",
        "componente": "Polisorbato 20",
        "porcentaje": 0.6,
        "pesoTeorico": 6.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "6",
    "codigoFM": "FM-0006",
    "nombreProducto": "SERUM DE ESTRIAS",
    "categoria": "SERUM",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1006",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua desionizada",
        "porcentaje": 91.25,
        "pesoTeorico": 912.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.6,
        "pesoTeorico": 6.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Colageno Hidrolizado",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Extracto de Centella Asiatica",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Niacinamida (Vitamina B3)",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "D- Pantenol",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Cellosize",
        "porcentaje": 0.9,
        "pesoTeorico": 9.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Benzoato de Sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Sorbato de sodio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Fragancia Manzanilla",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "7",
    "codigoFM": "FM-0007",
    "nombreProducto": "SERUM PARA VERRUGAS BLANCO",
    "categoria": "SERUM",
    "pesoObjetivo": 1000.5,
    "loteActual": "LOT-2026-1007",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Acido Salicilico",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Allcohol Extra Neutro",
        "porcentaje": 14.99,
        "pesoTeorico": 150.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Propilenglicol",
        "porcentaje": 14.99,
        "pesoTeorico": 150.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Glicerina",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Agua Desionizada",
        "porcentaje": 62.17,
        "pesoTeorico": 622.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Procide CG",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Cellosize",
        "porcentaje": 0.9,
        "pesoTeorico": 9.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Trietanolamina",
        "porcentaje": 0.9,
        "pesoTeorico": 9.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "8",
    "codigoFM": "FM-0008",
    "nombreProducto": "SERUM ANTIARRUGAS",
    "categoria": "SERUM",
    "pesoObjetivo": 1002.0,
    "loteActual": "LOT-2026-1008",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 92.51,
        "pesoTeorico": 927.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Colageno",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Acido Ascorbico",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Glicerina",
        "porcentaje": 4.99,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Trietanolamina",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Procide CG",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Fragancia",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "9",
    "codigoFM": "FM-0009",
    "nombreProducto": "SERUM DE HEMORROIDES",
    "categoria": "SERUM",
    "pesoObjetivo": 999.92,
    "loteActual": "LOT-2026-1009",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 77.01,
        "pesoTeorico": 770.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Extracto de Hamamelis",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Cellosize",
        "porcentaje": 0.9,
        "pesoTeorico": 9.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Trietanolamina",
        "porcentaje": 0.9,
        "pesoTeorico": 9.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Lidocaina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Extacto de Manzanilla",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Extracto de Calendula",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Extracto de Castaña de Indias",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Cloruro de Benzalconio",
        "porcentaje": 0.01,
        "pesoTeorico": 0.12,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-012",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-013",
        "componente": "Acido Citrico",
        "porcentaje": 0.03,
        "pesoTeorico": 0.3,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "10",
    "codigoFM": "FM-0010",
    "nombreProducto": "SERUM ELIMINADOR DE ACNE ACTIVO",
    "categoria": "SERUM",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1010",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Acido Salicilico",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Niacinamida",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Propilenglicol",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Trietanolamina",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Acido Citrico",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Agua Desionizada",
        "porcentaje": 89.2,
        "pesoTeorico": 892.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "11",
    "codigoFM": "FM-0011",
    "nombreProducto": "SERUM CLAREADOR",
    "categoria": "SERUM",
    "pesoObjetivo": 1002.5,
    "loteActual": "LOT-2026-1011",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Acido Kojico",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Niacinamida (VITAMINA B3)",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Propilenglicol",
        "porcentaje": 2.99,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Glicerina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Pantenol (Pro Vitamina B5)",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Agua destilada",
        "porcentaje": 91.57,
        "pesoTeorico": 918.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "12",
    "codigoFM": "FM-0012",
    "nombreProducto": "SERUM ELIMINADOR DE ACNE ACTIVO",
    "categoria": "SERUM",
    "pesoObjetivo": 1001.0,
    "loteActual": "LOT-2026-1012",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Acido Salicilico",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Acido Lactico",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Alcohol extra neutro",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Glicerina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Propilenglicol",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Cellozise",
        "porcentaje": 0.6,
        "pesoTeorico": 6.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Benzoato  de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Agua destilada",
        "porcentaje": 63.29,
        "pesoTeorico": 633.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Urea",
        "porcentaje": 19.98,
        "pesoTeorico": 200.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Aceite esencial Arbol del te",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "13",
    "codigoFM": "FM-0013",
    "nombreProducto": "SERUM CON VITAMINA C  (4.5 a 5.5 pH)",
    "categoria": "SERUM",
    "pesoObjetivo": 1001.5,
    "loteActual": "LOT-2026-1013",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua desionizada",
        "porcentaje": 92.56,
        "pesoTeorico": 927.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Cellozice",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Acido Ascorbico con poca agua",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Glicerina",
        "porcentaje": 4.99,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Trietanolamina (TEA)",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Conservante Procide CG",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Fragancia",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "14",
    "codigoFM": "FM-0014",
    "nombreProducto": "SERUM  ANTIARRUGAS O REAFIRMANTE",
    "categoria": "SERUM",
    "pesoObjetivo": 1039.5,
    "loteActual": "LOT-2026-1014",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua desionizada",
        "porcentaje": 82.73,
        "pesoTeorico": 860.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Colageno",
        "porcentaje": 4.81,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Vitamina C (acido Ascorbico)",
        "porcentaje": 0.48,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Cafeina",
        "porcentaje": 1.92,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Glicerina",
        "porcentaje": 4.81,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Extracto de aloe vera",
        "porcentaje": 0.48,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Vitamina e",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Conservante Procide CG",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Fragancia Manzanilla",
        "porcentaje": 0.24,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Polisorbato 20",
        "porcentaje": 3.56,
        "pesoTeorico": 37.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Cellosize",
        "porcentaje": 0.77,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "15",
    "codigoFM": "FM-0015",
    "nombreProducto": "SERUM  BLANQUEADOR CON ACIDO KOJICO",
    "categoria": "SERUM",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1015",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Acido Kojico",
        "porcentaje": 0.7,
        "pesoTeorico": 7.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Propilenglicol",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "EDTA",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Vitamina E",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Procide CG",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Fragancia",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Trietanolamina",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Agua Desionizada",
        "porcentaje": 92.85,
        "pesoTeorico": 928.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "16",
    "codigoFM": "FM-0016",
    "nombreProducto": "SERUM DE PESTAÑA",
    "categoria": "SERUM",
    "pesoObjetivo": 1000.5,
    "loteActual": "LOT-2026-1016",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua desionizada",
        "porcentaje": 91.05,
        "pesoTeorico": 911.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Cellozice",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Polyquaternium 7",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Glicerina",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Trietanolamina",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Fragancia",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Alcohol",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "17",
    "codigoFM": "FM-0017",
    "nombreProducto": "SERUM  FACIAL DE COLAGENO",
    "categoria": "SERUM",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1017",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua desionizada",
        "porcentaje": 85.84,
        "pesoTeorico": 858.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Glicerina",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Propilenglicol",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Trietanolamina",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Colageno Hidrolizado",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Pantenol",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Niacinamida",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Polisorbato 20",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-012",
        "componente": "Fragancia",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-013",
        "componente": "Acido Citrico",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "18",
    "codigoFM": "FM-0018",
    "nombreProducto": "SERUM CON VITAMINA C  (4.5 a 5.5 pH)",
    "categoria": "SERUM",
    "pesoObjetivo": 1005.5,
    "loteActual": "LOT-2026-1018",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua desionizada",
        "porcentaje": 92.19,
        "pesoTeorico": 927.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Cellozice",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Acido Ascorbico con poca agua",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Glicerina",
        "porcentaje": 4.97,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Trietanolamina (TEA)",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Conservante Procide CG",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Fragancia",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "19",
    "codigoFM": "FM-0019",
    "nombreProducto": "SERUM DE HIDRATANTE CON CENTELLA ASIATICA",
    "categoria": "SERUM",
    "pesoObjetivo": 1006.5,
    "loteActual": "LOT-2026-1019",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 86.14,
        "pesoTeorico": 867.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Glicerina",
        "porcentaje": 3.97,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Propilenglicol",
        "porcentaje": 2.98,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Urea",
        "porcentaje": 1.99,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Niacinamida",
        "porcentaje": 1.99,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Pantenol",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Alantoina",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Cellosize",
        "porcentaje": 0.79,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-012",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-013",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-014",
        "componente": "Extracto de Centella Asiatica",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "20",
    "codigoFM": "FM-0020",
    "nombreProducto": "SERUM DE MIXSOON",
    "categoria": "SERUM",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1020",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 97.5,
        "pesoTeorico": 975.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Glicerina",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Cellosize",
        "porcentaje": 0.9,
        "pesoTeorico": 9.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Trietanolamina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Acido Lactico",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Extracto de Avena",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Pantenol",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Vitamina E",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "21",
    "codigoFM": "FM-0021",
    "nombreProducto": "SERUM DE SALMON",
    "categoria": "SERUM",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1021",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-SER-001",
        "componente": "Agua Desionizada",
        "porcentaje": 86.0,
        "pesoTeorico": 860.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-002",
        "componente": "Glicerina",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-003",
        "componente": "Nicianimida",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-004",
        "componente": "Propilenglicol",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-005",
        "componente": "Cafeina",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-006",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-007",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-008",
        "componente": "Procide CG",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-SER-009",
        "componente": "Colageno Hidrolizado",
        "porcentaje": 0.7,
        "pesoTeorico": 7.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "22",
    "codigoFM": "FM-0022",
    "nombreProducto": "BREATIFY",
    "categoria": "GELES",
    "pesoObjetivo": 1000.02,
    "loteActual": "LOT-2026-1022",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Agua Desionizada",
        "porcentaje": 26.85,
        "pesoTeorico": 268.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Sacarina Sodica",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Sorbitol",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Alcohol Extra Nuetro",
        "porcentaje": 60.0,
        "pesoTeorico": 600.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Saborizante Canela",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Mentol en Cristal",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Colorante alimenticio",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-010",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-011",
        "componente": "Trietanolamina",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "23",
    "codigoFM": "FM-0023",
    "nombreProducto": "GEL EXFOLIANTE - ALFALION, JOSE PUELLES",
    "categoria": "GELES",
    "pesoObjetivo": 1000.12,
    "loteActual": "LOT-2026-1023",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Agua Desionizada",
        "porcentaje": 80.49,
        "pesoTeorico": 805.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Glicerina",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Cellosize",
        "porcentaje": 1.2,
        "pesoTeorico": 12.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Carbopol",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Trietanolamina",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Extracto de Hamamelis",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Extracto de Té verde",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.01,
        "pesoTeorico": 0.1,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-012",
        "componente": "Acido Citrico",
        "porcentaje": 0.15,
        "pesoTeorico": 1.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-013",
        "componente": "Fragancia",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-014",
        "componente": "Colorante (Opcional)",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "24",
    "codigoFM": "FM-0024",
    "nombreProducto": "GEL EXFOLIANTE - JHON CANTO",
    "categoria": "GELES",
    "pesoObjetivo": 1000.12,
    "loteActual": "LOT-2026-1024",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Agua Desionizada",
        "porcentaje": 80.89,
        "pesoTeorico": 809.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Glicerina",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Cellosize",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Carbopol",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Trietanolamina",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Extracto de Hamamelis",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Extracto de Té verde",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.01,
        "pesoTeorico": 0.1,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-012",
        "componente": "Acido Citrico",
        "porcentaje": 0.15,
        "pesoTeorico": 1.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-013",
        "componente": "Fragancia",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-014",
        "componente": "Colorante (Opcional)",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "25",
    "codigoFM": "FM-0025",
    "nombreProducto": "GEL MUSCULAR",
    "categoria": "GELES",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1025",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Alcanfor",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Mentol en cristal",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Alcohol Extra Neutro",
        "porcentaje": 57.53,
        "pesoTeorico": 575.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Agua Desionizada",
        "porcentaje": 37.62,
        "pesoTeorico": 376.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Carbopol",
        "porcentaje": 1.2,
        "pesoTeorico": 12.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Trietanolamina",
        "porcentaje": 1.2,
        "pesoTeorico": 12.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Aceite esencial Romero",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "26",
    "codigoFM": "FM-0026",
    "nombreProducto": "GEL TENSOR FACIAL",
    "categoria": "GELES",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1026",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Carbopol",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Trietanolamina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Silicato de sodio",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Colageno Hidrolizado",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Cafeina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Procide CG",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Agua desionizada",
        "porcentaje": 86.3,
        "pesoTeorico": 863.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "27",
    "codigoFM": "FM-0027",
    "nombreProducto": "GEL ANTIDOLOR",
    "categoria": "GELES",
    "pesoObjetivo": 1003.02,
    "loteActual": "LOT-2026-1027",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Agua desionizada",
        "porcentaje": 86.74,
        "pesoTeorico": 870.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Carbopol",
        "porcentaje": 1.2,
        "pesoTeorico": 12.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Acido Lactico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "EDTA",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Trietanolamina",
        "porcentaje": 1.2,
        "pesoTeorico": 12.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Colorante",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Glicerina",
        "porcentaje": 4.98,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-010",
        "componente": "Acido Citrico",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-011",
        "componente": "Lidocaina",
        "porcentaje": 1.99,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-012",
        "componente": "Extracto de Arnica",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-013",
        "componente": "Extracto de Jengibre",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-014",
        "componente": "Aceite Esencial Lavanda",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "28",
    "codigoFM": "FM-0028",
    "nombreProducto": "GEL BLANQUEADOR",
    "categoria": "GELES",
    "pesoObjetivo": 1000.5,
    "loteActual": "LOT-2026-1028",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Acido Kojico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Carbopol",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Propilenglicol",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Trietanolamina",
        "porcentaje": 0.8,
        "pesoTeorico": 8.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Procide CG",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Fragancia Coco",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Agua desionizada",
        "porcentaje": 92.75,
        "pesoTeorico": 928.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "29",
    "codigoFM": "FM-0029",
    "nombreProducto": "GEL DE DRAGON",
    "categoria": "GELES",
    "pesoObjetivo": 1010.5,
    "loteActual": "LOT-2026-1029",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Agua desionizada",
        "porcentaje": 90.85,
        "pesoTeorico": 918.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Carbopol",
        "porcentaje": 1.19,
        "pesoTeorico": 12.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Trietanolamina",
        "porcentaje": 1.19,
        "pesoTeorico": 12.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Fragancia",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Glicerina",
        "porcentaje": 4.95,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Procide CG",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Dioxido de Titanio",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "30",
    "codigoFM": "FM-0030",
    "nombreProducto": "RETARDANTE  EN GEL",
    "categoria": "GELES",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1030",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Agua desionizada",
        "porcentaje": 88.0,
        "pesoTeorico": 880.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Cellosize",
        "porcentaje": 1.1,
        "pesoTeorico": 11.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Acido Lactico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "EDTA",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Trietanolamina",
        "porcentaje": 1.1,
        "pesoTeorico": 11.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Colorante negro",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Glicerina",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-010",
        "componente": "Acido Citrico",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-011",
        "componente": "Lidocaina",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "31",
    "codigoFM": "FM-0031",
    "nombreProducto": "BLANQUEADOR DENTAL EN GEL 10 KILOS",
    "categoria": "GELES",
    "pesoObjetivo": 1005.5,
    "loteActual": "LOT-2026-1031",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Agua desionizada",
        "porcentaje": 89.91,
        "pesoTeorico": 904.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Glicerina",
        "porcentaje": 1.99,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Sorbitol",
        "porcentaje": 1.99,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Cellosize",
        "porcentaje": 1.99,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Trietanolamina",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Betaina",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Colorante violeta dispersante",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Saborizante Menta",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "mentol en cristales",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-010",
        "componente": "Sacarina",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-011",
        "componente": "Procide CG",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "32",
    "codigoFM": "FM-0032",
    "nombreProducto": "GEL TENSOR",
    "categoria": "GELES",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1032",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-GEL-001",
        "componente": "Carbopol",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-002",
        "componente": "Trietanolamina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-003",
        "componente": "Silicato de sodio",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-004",
        "componente": "Colageno",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-005",
        "componente": "Cafeina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-006",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-007",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-008",
        "componente": "Procide CG",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-GEL-009",
        "componente": "Agua desionizada",
        "porcentaje": 86.3,
        "pesoTeorico": 863.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "33",
    "codigoFM": "FM-0033",
    "nombreProducto": "CREMA  MICROTGHT - ALFALION",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1033",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua Desionizada",
        "porcentaje": 77.5,
        "pesoTeorico": 775.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Alcohol Cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Dehycuart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Cafeina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Colageno",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Glicerina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Extracto de centella asiatica",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Fragancia",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Procide  cg",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "34",
    "codigoFM": "FM-0034",
    "nombreProducto": "BASE MAQUILLAJE CON DIMETICONA - BLANCO",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.5,
    "loteActual": "LOT-2026-1034",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Emulgade",
        "porcentaje": 6.0,
        "pesoTeorico": 60.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dimeticona (silicona 1501)",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Agua Desionizada",
        "porcentaje": 69.27,
        "pesoTeorico": 693.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Glicerina Vegetal",
        "porcentaje": 12.09,
        "pesoTeorico": 121.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Procide Cg",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Arcilla Blanca",
        "porcentaje": 1.8,
        "pesoTeorico": 18.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Dioxido de titanio",
        "porcentaje": 1.8,
        "pesoTeorico": 18.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Oxido de Zinc",
        "porcentaje": 1.8,
        "pesoTeorico": 18.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Vitamina E",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Talco",
        "porcentaje": 3.85,
        "pesoTeorico": 38.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "35",
    "codigoFM": "FM-0035",
    "nombreProducto": "CREMA FACIAL HIDRATANTE",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1035",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 5.5,
        "pesoTeorico": 55.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 5.5,
        "pesoTeorico": 55.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Aceite de ricino",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Colageno Hidrolizado",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Extracto de Centella Asiatica",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Acido hialuronico",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Glicerina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Procide cg",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Fragancia  Vainilla",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Agua deionizada",
        "porcentaje": 83.04,
        "pesoTeorico": 830.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "36",
    "codigoFM": "FM-0036",
    "nombreProducto": "CREMA DERMA BEE, ESTRIAS Y REAFIRMANTE",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1036",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua desionizada",
        "porcentaje": 80.5,
        "pesoTeorico": 805.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Alcohol cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Dehycuart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Cafeina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Colageno",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Glicerina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Fragancia manzanilla",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "37",
    "codigoFM": "FM-0037",
    "nombreProducto": "CREMA DE CICATRICES",
    "categoria": "CREMAS",
    "pesoObjetivo": 1016.0,
    "loteActual": "LOT-2026-1037",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua desionizada",
        "porcentaje": 73.82,
        "pesoTeorico": 750.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Alcohol cetilico",
        "porcentaje": 6.89,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Dehycuart",
        "porcentaje": 6.89,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Glicerina",
        "porcentaje": 2.95,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Propilenglicol",
        "porcentaje": 1.97,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Niacinamida",
        "porcentaje": 3.94,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "D - Pantenol",
        "porcentaje": 1.48,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Alantoina",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Extracto de Centella Asiatica",
        "porcentaje": 0.98,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Colageno Hidrolizado",
        "porcentaje": 0.49,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-012",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "38",
    "codigoFM": "FM-0038",
    "nombreProducto": "CREMA PARA HEMORROIDES",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.8,
    "loteActual": "LOT-2026-1038",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua desionizada",
        "porcentaje": 66.61,
        "pesoTeorico": 666.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Extracto de hamamelis",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Lidocaina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Extracto de manzanilla",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Extracto de calendula",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "extracto de castaña de indias",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Alcohol cetilico",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Dehycuart",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Cloruro de benzalconio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Procide cg",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-012",
        "componente": "Acido Citrico",
        "porcentaje": 0.03,
        "pesoTeorico": 0.3,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "39",
    "codigoFM": "FM-0039",
    "nombreProducto": "CREMA PARA CALLOS",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.3,
    "loteActual": "LOT-2026-1039",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Urea",
        "porcentaje": 3.33,
        "pesoTeorico": 33.3,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Acido lactico",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Acido Salicilico",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Alcohol Cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Dehycuart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Extracto de aloe vera",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Aceite esenial tea tree",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Glicerina vegetal",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Agua",
        "porcentaje": 73.28,
        "pesoTeorico": 733.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "40",
    "codigoFM": "FM-0040",
    "nombreProducto": "CREMA DE ELIMINADOR DE ACNE ACTIVO",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.5,
    "loteActual": "LOT-2026-1040",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Acido Mandelico",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Niacinamida",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Alcohol Cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Dehycuarth",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Acido Citrico",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Agua destilada",
        "porcentaje": 74.96,
        "pesoTeorico": 750.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "41",
    "codigoFM": "FM-0041",
    "nombreProducto": "CREMA BEE VENOM",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.5,
    "loteActual": "LOT-2026-1041",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua destilada",
        "porcentaje": 81.96,
        "pesoTeorico": 820.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Alcohol Cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Dehycuarth",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Glicerina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Extracto de centellla asiatica",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Extracto de castaña de indias",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Extracto de hamamelis",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Acido Citrico",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Fragancia Miel",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "42",
    "codigoFM": "FM-0042",
    "nombreProducto": "CREMA PARA RIZOS",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.02,
    "loteActual": "LOT-2026-1042",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua destilada",
        "porcentaje": 81.2,
        "pesoTeorico": 812.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Alcohol Cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Dehycuarth",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "PVP K30",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Fragancia",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Silicona a la grasa 1000",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Aceite de ricino",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Colorante",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Acticide",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "43",
    "codigoFM": "FM-0043",
    "nombreProducto": "CREMA PARA PEINAR - KARSELL",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.02,
    "loteActual": "LOT-2026-1043",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua destilada",
        "porcentaje": 82.7,
        "pesoTeorico": 827.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Alcohol Cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Dehycuarth",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Fragancia",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Silicona a la grasa 1000",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Aceite de ricino",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Colorante",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Acticide",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "44",
    "codigoFM": "FM-0044",
    "nombreProducto": "CREMA PARA TATTO CARE",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1044",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua destilada",
        "porcentaje": 71.64,
        "pesoTeorico": 716.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Glicerina",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Propilenglicol",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Pantenol",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Alantoina",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Emulgade 1000",
        "porcentaje": 6.0,
        "pesoTeorico": 60.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Alcohol Cetilico",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Aceite de Almendras",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Vitamina E",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-012",
        "componente": "Fragancia",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-013",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "45",
    "codigoFM": "FM-0045",
    "nombreProducto": "CREMA NEUROPATICA",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1045",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Alcanfor en cristales",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Alcohol cetilico",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Dehyquart",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Mentol en cristales",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Aceite esencial de Romero",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Aceite de calendula",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Vitamina E",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Extraxto de centella asiatica",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "extraxto de arnica",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Extracto de aloe vera",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-012",
        "componente": "Acido lactico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-013",
        "componente": "Agua desionizada",
        "porcentaje": 79.14,
        "pesoTeorico": 791.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "46",
    "codigoFM": "FM-0046",
    "nombreProducto": "CREMA BLANQUEADORA CON ACIDO HIALURONICO",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1046",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Fragancia",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Acido Kojico",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Acido lactico",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Agua desionizada",
        "porcentaje": 84.04,
        "pesoTeorico": 840.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Procide CG",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "47",
    "codigoFM": "FM-0047",
    "nombreProducto": "CREMA PARA DOLOR MUSCULAR - ÑAUPARI",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1047",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Alcanfor",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Mentol en cristales",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Aceite esencial de Romero",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Agua desionizada",
        "porcentaje": 87.04,
        "pesoTeorico": 870.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Colorante verde",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "48",
    "codigoFM": "FM-0048",
    "nombreProducto": "CREMA TENSOR CON ACIDO HIALURONICO",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1048",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Colageno",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Cafeina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Glicerina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Agua desionizada",
        "porcentaje": 77.24,
        "pesoTeorico": 772.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Procide CG",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Fragancia",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "49",
    "codigoFM": "FM-0049",
    "nombreProducto": "CREMA ANTIMICOTICA PARA HONGOS (EFECTO RAPIDO)",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1049",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 6.0,
        "pesoTeorico": 60.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 6.0,
        "pesoTeorico": 60.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Acido Salicilico",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Terbinafina",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Mentol en  cristal",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Glicerina",
        "porcentaje": 3.4,
        "pesoTeorico": 34.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Agua desionizada",
        "porcentaje": 77.14,
        "pesoTeorico": 771.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Aceite Esensial de Arbol del Té",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "50",
    "codigoFM": "FM-0050",
    "nombreProducto": "CREMA ANTICELULITIS, ESTRIAS",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1050",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Cafeina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Colageno",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Extracto de castaña de indias",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Extracto de arnica",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Silicona a la grasa 1000",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Agua desionizada",
        "porcentaje": 75.04,
        "pesoTeorico": 750.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Fragancia",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "51",
    "codigoFM": "FM-0051",
    "nombreProducto": "CREMA PARA VARICES",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1051",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Cafeina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Colageno",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Extracto de castaña de indias",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Extracto de arnica",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Silicona a la grasa 1000",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Agua desionizada",
        "porcentaje": 75.04,
        "pesoTeorico": 750.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Fragancia",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "52",
    "codigoFM": "FM-0052",
    "nombreProducto": "CREMA PARA DOLOR MUSCULAR CON MAGNESIO",
    "categoria": "CREMAS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1052",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Alcanfor",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Mentol en cristales",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Aceite esencial de Romero",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Cloruro de Magnesio",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Agua desionizada",
        "porcentaje": 79.24,
        "pesoTeorico": 792.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "53",
    "codigoFM": "FM-0053",
    "nombreProducto": "CREMA BOTOX VENENO DE ABEJA",
    "categoria": "CREMAS",
    "pesoObjetivo": 942.5,
    "loteActual": "LOT-2026-1053",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua desionizada",
        "porcentaje": 76.07,
        "pesoTeorico": 717.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Glicerina",
        "porcentaje": 3.18,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Colageno",
        "porcentaje": 1.06,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.11,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Vitamina C",
        "porcentaje": 0.32,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Vitamina E",
        "porcentaje": 0.21,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Extraxto de Aloe Vera",
        "porcentaje": 1.06,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Extraxto de Te verde",
        "porcentaje": 0.53,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Aceite de Ricino",
        "porcentaje": 1.06,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Dimeticona",
        "porcentaje": 1.06,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Procide CG",
        "porcentaje": 0.27,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-012",
        "componente": "Fragancia",
        "porcentaje": 0.21,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-013",
        "componente": "Alcohol Cetlico",
        "porcentaje": 7.43,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-014",
        "componente": "Dehycuart",
        "porcentaje": 7.43,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "54",
    "codigoFM": "FM-0054",
    "nombreProducto": "BLOQUEADOR",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1054",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Alcohol cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Dehyquart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Aceite de Ricino",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Dioxido de Titanio",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Oxido de Zinc",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Vitamina E",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-007",
        "componente": "Pantenol",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-008",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-009",
        "componente": "Fragancia",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-010",
        "componente": "Procide CG",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-011",
        "componente": "Agua desionizada",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-012",
        "componente": "Procide CG",
        "porcentaje": 81.2,
        "pesoTeorico": 812.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "55",
    "codigoFM": "FM-0055",
    "nombreProducto": "CREMA CON MINOXIDIL 5%",
    "categoria": "CREMAS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1055",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CRE-001",
        "componente": "Agua desionizada",
        "porcentaje": 85.1,
        "pesoTeorico": 851.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-002",
        "componente": "Alcohol cetilico",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-003",
        "componente": "Dehyquart",
        "porcentaje": 7.0,
        "pesoTeorico": 70.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-004",
        "componente": "Aceite esencial romero",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-005",
        "componente": "Minoxidil",
        "porcentaje": 0.4,
        "pesoTeorico": 4.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CRE-006",
        "componente": "Procide CG",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "56",
    "codigoFM": "FM-0056",
    "nombreProducto": "BALSAMO DE ARRUGAS - ALFALION",
    "categoria": "BALSAMOS",
    "pesoObjetivo": 1014.0,
    "loteActual": "LOT-2026-1056",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-BAL-001",
        "componente": "Vaselina Liquida",
        "porcentaje": 77.91,
        "pesoTeorico": 790.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-002",
        "componente": "Cera de abeja virgen",
        "porcentaje": 11.83,
        "pesoTeorico": 120.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-003",
        "componente": "Cera Carnauba",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-004",
        "componente": "Alcohol Cetilico",
        "porcentaje": 7.89,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-005",
        "componente": "Vitamina E",
        "porcentaje": 0.99,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-006",
        "componente": "Dioxido de Titanio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-007",
        "componente": "Fragancia Rosas",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "57",
    "codigoFM": "FM-0057",
    "nombreProducto": "POMODA DE ARNICA",
    "categoria": "BALSAMOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1057",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-BAL-001",
        "componente": "Vaselina Solida",
        "porcentaje": 97.8,
        "pesoTeorico": 978.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-002",
        "componente": "Aceite esencial Arnica",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-003",
        "componente": "Aceite esencial Lavanda",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-004",
        "componente": "Mentol en cristales",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-BAL-005",
        "componente": "Vitamina E",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "58",
    "codigoFM": "FM-0058",
    "nombreProducto": "ACEITE ANTICELULITICO",
    "categoria": "ACEITES",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1058",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-ACE-001",
        "componente": "Vaselina liquida",
        "porcentaje": 96.1,
        "pesoTeorico": 961.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-002",
        "componente": "Miritato de isopropilo",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-003",
        "componente": "Vitamina E",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-004",
        "componente": "Aceite esencial romero",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-005",
        "componente": "Aceite esencial Menta",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-006",
        "componente": "Aceite esencial Eucalipto",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-007",
        "componente": "Aceite esencial Limon",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "59",
    "codigoFM": "FM-0059",
    "nombreProducto": "ACEITE ANTIVELLO CORPORAL",
    "categoria": "ACEITES",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1059",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-ACE-001",
        "componente": "Vaselina liquida",
        "porcentaje": 88.3,
        "pesoTeorico": 883.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-002",
        "componente": "Aceite de almendras",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-003",
        "componente": "Aceite de Jojoba",
        "porcentaje": 3.5,
        "pesoTeorico": 35.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-004",
        "componente": "Aceite de Rosa Mosqueta",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-005",
        "componente": "Vitamina E",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-006",
        "componente": "Aceite esencial árbol del té",
        "porcentaje": 0.7,
        "pesoTeorico": 7.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "60",
    "codigoFM": "FM-0060",
    "nombreProducto": "SERUM ACEITOSO",
    "categoria": "ACEITES",
    "pesoObjetivo": 1001.0,
    "loteActual": "LOT-2026-1060",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-ACE-001",
        "componente": "Vaselina liquida",
        "porcentaje": 97.6,
        "pesoTeorico": 977.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-002",
        "componente": "Aceite de Jojoba",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-003",
        "componente": "Fragancia Fresa",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-004",
        "componente": "Vitamina E",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-005",
        "componente": "Colorante rojo",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "61",
    "codigoFM": "FM-0061",
    "nombreProducto": "ACEITE PARA CABELLO",
    "categoria": "ACEITES",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1061",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-ACE-001",
        "componente": "Vaselina liquida",
        "porcentaje": 99.0,
        "pesoTeorico": 990.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-002",
        "componente": "Fragancia Tea Tree",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-003",
        "componente": "Aceite Esencial de romero",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "62",
    "codigoFM": "FM-0062",
    "nombreProducto": "EXTRACTO PERFUMADOR DE CABELLO OLEOSO",
    "categoria": "ACEITES",
    "pesoObjetivo": 1005.0,
    "loteActual": "LOT-2026-1062",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-ACE-001",
        "componente": "Vaselina Liquido",
        "porcentaje": 64.68,
        "pesoTeorico": 650.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-002",
        "componente": "Miristato de isopropolico",
        "porcentaje": 24.88,
        "pesoTeorico": 250.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-003",
        "componente": "Fragancia",
        "porcentaje": 9.95,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-004",
        "componente": "Vitamina E",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "63",
    "codigoFM": "FM-0063",
    "nombreProducto": "ACEITE CORPORAL REAFIRMANTE",
    "categoria": "ACEITES",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1063",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-ACE-001",
        "componente": "Vaselina liquida",
        "porcentaje": 97.7,
        "pesoTeorico": 977.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-002",
        "componente": "Aceite de Jojoba",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-003",
        "componente": "Fragancia Vainilla",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-004",
        "componente": "Vitamina E",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-ACE-005",
        "componente": "Colorante a la grasa",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "64",
    "codigoFM": "FM-0064",
    "nombreProducto": "SPRAY ANTIPARASITO PARA PERROS",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1064",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua Destilada",
        "porcentaje": 81.04,
        "pesoTeorico": 810.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Alcohol Cetilico",
        "porcentaje": 10.01,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Vinagre de manzana",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Aceite de Neem",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Aceite esencial de Lavanda",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Aceite esencial de Eucalipto",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Aceite esencial de Romero",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Aceite esencial de Citronella",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Glicerina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-012",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-013",
        "componente": "Polisorbato 20",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "65",
    "codigoFM": "FM-0065",
    "nombreProducto": "RETARDANTE LIQUIDO NORMAL",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1065",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua destilada",
        "porcentaje": 90.3,
        "pesoTeorico": 903.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Acido lactico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Edta tetrasodico",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Glicerina",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Acido Citrico",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Lidocaina",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "66",
    "codigoFM": "FM-0066",
    "nombreProducto": "SPRAY BUCAL MENTA",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1066",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua destilada",
        "porcentaje": 18.81,
        "pesoTeorico": 188.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Sacarina Sodica",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Sorbitol",
        "porcentaje": 10.01,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Alcohol extraneutro",
        "porcentaje": 69.63,
        "pesoTeorico": 696.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Saborizante  Menta",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Mentol en cristales",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Color al gusto sin color",
        "porcentaje": 0.0,
        "pesoTeorico": 0.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "67",
    "codigoFM": "FM-0067",
    "nombreProducto": "TONICO DE MASCOTAS (RENOVAPET)",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1067",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Aceite Esencial Lavanda",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Aceite Esencial Arbol del te",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Polisorbato 20",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Agua Desionizada",
        "porcentaje": 86.9,
        "pesoTeorico": 869.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Clorhexidina 20%",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Extracto de Calendula",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "D- Pantenol",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Propilenglicol",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Benzoato de Sodio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-011",
        "componente": "Sorbato de sodio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "68",
    "codigoFM": "FM-0068",
    "nombreProducto": "ELHOE  4%",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1068",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Minoxidil",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Alcohol extraneutro de 96%",
        "porcentaje": 50.0,
        "pesoTeorico": 500.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Propilenglicol",
        "porcentaje": 45.75,
        "pesoTeorico": 457.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Aceite esencial de romero",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "69",
    "codigoFM": "FM-0069",
    "nombreProducto": "ELHOE  0.03%",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.5,
    "loteActual": "LOT-2026-1069",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Minoxidil",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Alcohol Extra neutro",
        "porcentaje": 84.46,
        "pesoTeorico": 845.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Propilenglicol",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Aceite esencial de romero",
        "porcentaje": 0.25,
        "pesoTeorico": 2.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Agua",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "70",
    "codigoFM": "FM-0070",
    "nombreProducto": "SPRAY EXFOLIANTE",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1030.05,
    "loteActual": "LOT-2026-1070",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua Desionizada",
        "porcentaje": 89.32,
        "pesoTeorico": 920.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Glicerina Vegetal",
        "porcentaje": 3.88,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Niacinamida",
        "porcentaje": 0.97,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Propilenglicol",
        "porcentaje": 2.43,
        "pesoTeorico": 25.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Acido Kojico",
        "porcentaje": 0.49,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Acido Lactico",
        "porcentaje": 1.46,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Acido Salicilico",
        "porcentaje": 0.49,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Alantoina",
        "porcentaje": 0.29,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Trietanolamina",
        "porcentaje": 0.19,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.19,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-012",
        "componente": "Fragancia",
        "porcentaje": 0.19,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-013",
        "componente": "Colorante",
        "porcentaje": 0.0,
        "pesoTeorico": 0.05,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "71",
    "codigoFM": "FM-0071",
    "nombreProducto": "DIAMANTEX",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 999.52,
    "loteActual": "LOT-2026-1071",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Parafina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Cera carnauba",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Cera de abeja",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Emulgador",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Formol",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Fragancia",
        "porcentaje": 0.15,
        "pesoTeorico": 1.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Colorante azul",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Agua desionizada",
        "porcentaje": 94.25,
        "pesoTeorico": 942.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "72",
    "codigoFM": "FM-0072",
    "nombreProducto": "SPRAY TERBINAFINA AL 8%",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1072",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Terbinafina",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Alcohol Extra Neutro",
        "porcentaje": 70.0,
        "pesoTeorico": 700.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Propilenglicol",
        "porcentaje": 20.0,
        "pesoTeorico": 200.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Agua desionizada",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "73",
    "codigoFM": "FM-0073",
    "nombreProducto": "SPRAY ALISADOR, ANTI FRIZZ",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1001.5,
    "loteActual": "LOT-2026-1073",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua desionizada",
        "porcentaje": 95.36,
        "pesoTeorico": 955.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Glicerina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Pantenol",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Proteina hidrolizada de soya",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Sorbato de sodio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Fragancia",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Cellosize",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-011",
        "componente": "Colorante amarillo, marron y naranja",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "74",
    "codigoFM": "FM-0074",
    "nombreProducto": "DESODORANTE DE NIÑOS",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1074",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua desionizada",
        "porcentaje": 83.5,
        "pesoTeorico": 835.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Clorhidrato de Aluminio",
        "porcentaje": 2.5,
        "pesoTeorico": 25.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Propilenglicol",
        "porcentaje": 3.5,
        "pesoTeorico": 35.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Glicerina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 2.5,
        "pesoTeorico": 25.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Pantenol",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Trietil Citrato",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Polisorbato 20 para el trietil citrato",
        "porcentaje": 2.5,
        "pesoTeorico": 25.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Procide CG",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-011",
        "componente": "Fragancia",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-012",
        "componente": "Polisorbato 20 para la fragancia",
        "porcentaje": 0.7,
        "pesoTeorico": 7.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "75",
    "codigoFM": "FM-0075",
    "nombreProducto": "DESODORANTE DE ADULTOS",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1075",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua desionizada",
        "porcentaje": 81.0,
        "pesoTeorico": 810.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Clorhidrato de Aluminio",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Propilenglicol",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Glicerina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Pantenol",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Trietil Citrato",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Polisorbato 20 para el trietil citrato",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Procide CG",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-011",
        "componente": "Fragancia",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-012",
        "componente": "Polisorbato 20 para la fragancia",
        "porcentaje": 0.6,
        "pesoTeorico": 6.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "76",
    "codigoFM": "FM-0076",
    "nombreProducto": "ANTIMICOTICO EN SPRAY PARA HONGOS DE UÑAS",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.02,
    "loteActual": "LOT-2026-1076",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Acido Salicilico",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Agua desionizada",
        "porcentaje": 20.5,
        "pesoTeorico": 205.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Aceite esencial de Arbol de té",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Glicerina",
        "porcentaje": 3.4,
        "pesoTeorico": 34.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Alcohol Extra Neutro",
        "porcentaje": 70.6,
        "pesoTeorico": 706.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Colorante rojo",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "77",
    "codigoFM": "FM-0077",
    "nombreProducto": "SPRAY ALIVIO PARA PSORIASIS",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1001.0,
    "loteActual": "LOT-2026-1077",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua desionizada",
        "porcentaje": 90.01,
        "pesoTeorico": 901.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Glicerina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Extracto de aloe vera",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Extracto de calendula",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Extracto de manzanilla",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Pantenol",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Urea",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Alantoina",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Acido Hialuronico",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-011",
        "componente": "sorbato de sodio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-012",
        "componente": "Fragancia",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-013",
        "componente": "Acido Citrico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "78",
    "codigoFM": "FM-0078",
    "nombreProducto": "SPRAY DE MAGNESIO",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1078",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Cloruro de mangnesio",
        "porcentaje": 50.0,
        "pesoTeorico": 500.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Agua desionixada",
        "porcentaje": 50.0,
        "pesoTeorico": 500.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "79",
    "codigoFM": "FM-0079",
    "nombreProducto": "DESENGRASANTE o QUITA OXIDO",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 923.55,
    "loteActual": "LOT-2026-1079",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua desionizada",
        "porcentaje": 77.96,
        "pesoTeorico": 720.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Nonil Fenol 10 M",
        "porcentaje": 8.66,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Texapon",
        "porcentaje": 2.17,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Butilglicol",
        "porcentaje": 5.41,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Carbonato de sodio",
        "porcentaje": 3.25,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Edta Tetrasodico",
        "porcentaje": 0.22,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Betaina",
        "porcentaje": 2.17,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Fragancia",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Acticide",
        "porcentaje": 0.11,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Colorante Alcalino",
        "porcentaje": 0.01,
        "pesoTeorico": 0.05,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "80",
    "codigoFM": "FM-0080",
    "nombreProducto": "RETARDANTE LIQUIDO OPTIMIZADO",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1001.0,
    "loteActual": "LOT-2026-1080",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua desionizada",
        "porcentaje": 87.31,
        "pesoTeorico": 874.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Tetracaina",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Prilocaina",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Acido Lactico",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Edta Tetrasodico",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Glicerina",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Acido Citrico",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Lidocaina",
        "porcentaje": 4.0,
        "pesoTeorico": 40.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "81",
    "codigoFM": "FM-0081",
    "nombreProducto": "PERFUME PACO RABANNE LUCKY",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1081",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Alcohol Extra Neutro",
        "porcentaje": 62.0,
        "pesoTeorico": 620.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Glicerina",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Galaxolide",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Vainillina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Coumarina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Fragancia Paco Rabanne",
        "porcentaje": 15.0,
        "pesoTeorico": 150.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Agua Desionizada",
        "porcentaje": 14.4,
        "pesoTeorico": 144.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "82",
    "codigoFM": "FM-0082",
    "nombreProducto": "SPRAY DE OIDOS - TRINNIDROP - daniel espinoza, luis marin",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1032.5,
    "loteActual": "LOT-2026-1082",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Peroxido de Hidrogeno",
        "porcentaje": 2.91,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Agua Desionizada",
        "porcentaje": 93.95,
        "pesoTeorico": 970.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Glicerina",
        "porcentaje": 2.91,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Cloruro de benzalconio",
        "porcentaje": 0.19,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Acido Lactico",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "83",
    "codigoFM": "FM-0083",
    "nombreProducto": "SPRAY DE OIDOS - DAVID SARMIENTO",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1083",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Peroxido de Hidrogeno",
        "porcentaje": 6.0,
        "pesoTeorico": 60.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Agua Desionizada",
        "porcentaje": 83.5,
        "pesoTeorico": 835.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Glicerina",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Cloruro de benzalconio",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "84",
    "codigoFM": "FM-0084",
    "nombreProducto": "SELLADOR NANOCERAMICO",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1084",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Silicona a la grasa 1000",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Silicona 3031",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Varsol",
        "porcentaje": 85.0,
        "pesoTeorico": 850.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "85",
    "codigoFM": "FM-0085",
    "nombreProducto": "SPRAY BUCAL",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1001.0,
    "loteActual": "LOT-2026-1085",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua Desionizada",
        "porcentaje": 18.88,
        "pesoTeorico": 189.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Sacarina Sodica",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Sorbitol",
        "porcentaje": 9.99,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Alcohol Extra Neutro",
        "porcentaje": 69.53,
        "pesoTeorico": 696.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Saborizante Menta",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Mentol en cristal",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Color verde",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "86",
    "codigoFM": "FM-0086",
    "nombreProducto": "SPRAY TERBINAFINA 8%",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1086",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Terbinafina",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Alcohol Extra Neutro",
        "porcentaje": 70.0,
        "pesoTeorico": 700.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Propilenglicol",
        "porcentaje": 20.0,
        "pesoTeorico": 200.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Agua Desionizada",
        "porcentaje": 1.5,
        "pesoTeorico": 15.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "87",
    "codigoFM": "FM-0087",
    "nombreProducto": "PET SKIN SOOTHING SPRAY",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.03,
    "loteActual": "LOT-2026-1087",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua Desionizada",
        "porcentaje": 88.3,
        "pesoTeorico": 883.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Propilenglicol",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Pantenol",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Alantoina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Extracto de Aloe Vera",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Extracto de avena",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-008",
        "componente": "Extracto de Calendula",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-009",
        "componente": "Gluconato de Clorhexidina",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-010",
        "componente": "Benzoato de sodio",
        "porcentaje": 0.3,
        "pesoTeorico": 3.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-011",
        "componente": "Sorbato de potasio",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-012",
        "componente": "Acido Citrico",
        "porcentaje": 0.0,
        "pesoTeorico": 0.03,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "88",
    "codigoFM": "FM-0088",
    "nombreProducto": "PERFUME ECONOMICO",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.02,
    "loteActual": "LOT-2026-1088",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Agua Desionizada",
        "porcentaje": 84.5,
        "pesoTeorico": 845.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Alcohol Laurico Etoxilado",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Fragancia Paco Lucky",
        "porcentaje": 2.5,
        "pesoTeorico": 25.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Glicerina",
        "porcentaje": 3.0,
        "pesoTeorico": 30.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Alcohol extra neutro",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Colorante",
        "porcentaje": 0.0,
        "pesoTeorico": 0.02,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "89",
    "codigoFM": "FM-0089",
    "nombreProducto": "PERFUME ESTANDAR ALTO",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1089",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Alcohol extra neutro",
        "porcentaje": 62.0,
        "pesoTeorico": 620.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Glicerina",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Galaxolide",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Vainillina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Coumarina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Fragancia Paco Lucky",
        "porcentaje": 15.0,
        "pesoTeorico": 150.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Agua Desionizada",
        "porcentaje": 14.4,
        "pesoTeorico": 144.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "90",
    "codigoFM": "FM-0090",
    "nombreProducto": "SPRAY DE HEMORROIDES",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1090",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Alcohol extra neutro",
        "porcentaje": 62.0,
        "pesoTeorico": 620.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Glicerina",
        "porcentaje": 8.0,
        "pesoTeorico": 80.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Galaxolide",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Vainillina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Coumarina",
        "porcentaje": 0.2,
        "pesoTeorico": 2.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-006",
        "componente": "Fragancia Paco Lucky",
        "porcentaje": 15.0,
        "pesoTeorico": 150.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-007",
        "componente": "Agua Desionizada",
        "porcentaje": 14.4,
        "pesoTeorico": 144.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "91",
    "codigoFM": "FM-0091",
    "nombreProducto": "SPRAY DOLORES MUSCULARES",
    "categoria": "LIQUIDOS",
    "pesoObjetivo": 1000.0,
    "loteActual": "LOT-2026-1091",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-LIQ-001",
        "componente": "Alcohol extra neutro",
        "porcentaje": 87.5,
        "pesoTeorico": 875.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-002",
        "componente": "Alcanfor",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-003",
        "componente": "Mentol en cristales",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-004",
        "componente": "Aceite esencial Romero",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-LIQ-005",
        "componente": "Agua Desionizada",
        "porcentaje": 10.0,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  },
  {
    "id": "92",
    "codigoFM": "FM-0092",
    "nombreProducto": "CHAMPU DE JENGIBRE, CANELA, CLAVO DE OLOR Y CEBOLLA",
    "categoria": "CHAMPU",
    "pesoObjetivo": 999.5,
    "loteActual": "LOT-2026-1092",
    "estadoProceso": "⚙️ EN PRODUCCIÓN — Elaborando Mezcla Base",
    "ingredientes": [
      {
        "sku": "QC-CHA-001",
        "componente": "Texapon",
        "porcentaje": 10.01,
        "pesoTeorico": 100.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-002",
        "componente": "Edta",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-003",
        "componente": "Coperland",
        "porcentaje": 1.0,
        "pesoTeorico": 10.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-004",
        "componente": "Betaina",
        "porcentaje": 5.0,
        "pesoTeorico": 50.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-005",
        "componente": "Acido Salicilico",
        "porcentaje": 0.05,
        "pesoTeorico": 0.5,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-006",
        "componente": "Sal",
        "porcentaje": 2.0,
        "pesoTeorico": 20.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-007",
        "componente": "Acido Citrico",
        "porcentaje": 0.1,
        "pesoTeorico": 1.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-008",
        "componente": "Pantenol",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-009",
        "componente": "Extracto de Romero",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-010",
        "componente": "Extracto de Ortiga",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-011",
        "componente": "Dehycuart",
        "porcentaje": 0.5,
        "pesoTeorico": 5.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      },
      {
        "sku": "QC-CHA-012",
        "componente": "Agua Desionizada",
        "porcentaje": 79.74,
        "pesoTeorico": 797.0,
        "tipo": "BASE",
        "stockStatus": "OK"
      }
    ]
  }
];
