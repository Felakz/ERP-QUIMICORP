export interface CuentaBancariaProveedor {
  banco: string;
  moneda: 'SOLES' | 'USD';
  numeroCuenta: string;
  cci?: string;
}

export interface ProveedorRegistroExcel {
  itemNo: string;
  ruc: string;
  razonSocial: string;
  direccion?: string;
  contacto?: string;
  correo?: string;
  telefono?: string;
  banco: string;
  moneda: string;
  numeroCuenta: string;
  cci?: string;
}

export interface ProveedorReal {
  id: string;
  ruc: string;
  razonSocial: string;
  direccion?: string;
  contacto?: string;
  correo?: string;
  telefono?: string;
  insumoPrincipal?: string;
  estado: 'HOMOLOGADO' | 'EN_EVALUACION' | 'OBSERVADO';
  cuentasBancarias: CuentaBancariaProveedor[];
}

export const REGISTROS_EXCEL_PROVEEDORES: ProveedorRegistroExcel[] = [
  {
    "itemNo": "01",
    "ruc": "20604222339",
    "razonSocial": "HIDROPONIKA SAC",
    "direccion": "AV. RAUL FERRERO 126 - LA MOLINA",
    "contacto": "",
    "correo": "",
    "telefono": "993744417",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1932648200094",
    "cci": "219300264820008992"
  },
  {
    "itemNo": "02",
    "ruc": "20100860351",
    "razonSocial": "DROCERSA S.A.",
    "direccion": "AV. LOS EUCALIPTOS, PARECLA 6 SUB LOTE B-2 - LURIN",
    "contacto": "LUIS CABALLERO",
    "correo": "ventas@drocersa.com.pe",
    "telefono": "998112661",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1930844579109",
    "cci": "219300084457910016"
  },
  {
    "itemNo": "03",
    "ruc": "20211040352",
    "razonSocial": "QUIMICOS GOICOCHEA SAC",
    "direccion": "AV. NESTOR GAMBETA 150 - CALLAO",
    "contacto": "BRENDA JARA PEREZ",
    "correo": "qgventas@quimicosgoicochea.com",
    "telefono": "986631240",
    "banco": "INTERBANK",
    "moneda": "USD",
    "numeroCuenta": "0413000302553",
    "cci": "304100300030254976"
  },
  {
    "itemNo": "04",
    "ruc": "20601134226",
    "razonSocial": "LIMACHEM SAC",
    "direccion": "JR PANCHO FIERRO 3583 - LOS OLIVOS",
    "contacto": "",
    "correo": "mayelimv@gmail.com",
    "telefono": "998588457",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1912355614189",
    "cci": "219100235561417984"
  },
  {
    "itemNo": "05",
    "ruc": "20545840597",
    "razonSocial": "SG QUIMICOS DEL PERU SAC",
    "direccion": "AV 2 DE OCTUBRE MZ B LOTE 7 - LOS OLIVOS",
    "contacto": "JEAN CARLO",
    "correo": "ventas@sgquimicos.com",
    "telefono": "979633620",
    "banco": "INTERBANK",
    "moneda": "SOLES",
    "numeroCuenta": "2003006799386",
    "cci": "320000300679937984"
  },
  {
    "itemNo": "06",
    "ruc": "20268214284",
    "razonSocial": "QUIMICA EXPRESS SAC",
    "direccion": "AV SANTA ELVIRA N° 6172 - LOS OLIVOS",
    "contacto": "MILENE RIVERA",
    "correo": "fuerzadeventas@quimicaexpress.com",
    "telefono": "908886509",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1916884656187",
    "cci": "219100688465617984"
  },
  {
    "itemNo": "07",
    "ruc": "20606967145",
    "razonSocial": "QUIMICOS NORPERU E.I.R.L.",
    "direccion": "AV. 2 DE  OCTUBRE MZ B LOTE 6 - LOS OLIVOS",
    "contacto": "CRISTINA CCARI",
    "correo": "quimicos_norperu@hotmail.com",
    "telefono": "923691618",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1919862429092",
    "cci": "219100986242908992"
  },
  {
    "itemNo": "08",
    "ruc": "20606967145",
    "razonSocial": "QUIMICOS NORPERU E.I.R.L.",
    "direccion": "AV. 2 DE  OCTUBRE MZ B LOTE 6 - LOS OLIVOS",
    "contacto": "CRISTINA CCARI",
    "correo": "quimicos_norperu@hotmail.com",
    "telefono": "923691618",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1919846699113",
    "cci": "219100984669911008"
  },
  {
    "itemNo": "09",
    "ruc": "20602435041",
    "razonSocial": "SOLUCIONES QUIMICAS GK E.I.R.L.",
    "direccion": "CALLE C MZ B LOTE 44 URB INDUSTRIAL. INDEPENDENCIA",
    "contacto": "ROCIO",
    "correo": "quimicas.gk@outlook.com",
    "telefono": "934206137",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1919044565040",
    "cci": "219100904456504000"
  },
  {
    "itemNo": "10",
    "ruc": "20602435041",
    "razonSocial": "SOLUCIONES QUIMICAS GK E.I.R.L.",
    "direccion": "CALLE C MZ B LOTE 44 URB INDUSTRIAL. INDEPENDENCIA",
    "contacto": "ROCIO",
    "correo": "quimicas.gk@outlook.com",
    "telefono": "934206137",
    "banco": "INTERBANK",
    "moneda": "SOLES",
    "numeroCuenta": "2003008577704",
    "cci": "320000300857769984"
  },
  {
    "itemNo": "11",
    "ruc": "20101209181",
    "razonSocial": "MARVA SAC",
    "direccion": "CALLE C N° 190 URB INDUSTRIAL. INDEPENDENCIA",
    "contacto": "ROCIO",
    "correo": "ventas@marva.com.pe",
    "telefono": "934206137",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1932329478079",
    "cci": "219300232947807008"
  },
  {
    "itemNo": "12",
    "ruc": "20294249428",
    "razonSocial": "FRAPECO SRL",
    "direccion": "JJR MANUEL GONZALES PRADA N° 400 - INDEPENDENCIA",
    "contacto": "ROCIO",
    "correo": "",
    "telefono": "934206137",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1910076803086",
    "cci": "219100007680308000"
  },
  {
    "itemNo": "13",
    "ruc": "20294249428",
    "razonSocial": "FRAPECO SRL",
    "direccion": "JJR MANUEL GONZALES PRADA N° 400 - INDEPENDENCIA",
    "contacto": "ROCIO",
    "correo": "",
    "telefono": "934206137",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1911800217119",
    "cci": "219100180021711008"
  },
  {
    "itemNo": "14",
    "ruc": "20513315911",
    "razonSocial": "QUIMICA SKR EIRL",
    "direccion": "JR IQUITOS 803 - SAN MARTIN DE PORRES",
    "contacto": "",
    "correo": "ventas@quimicaskr.com",
    "telefono": "998316395",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "",
    "cci": ""
  },
  {
    "itemNo": "15",
    "ruc": "20614797496",
    "razonSocial": "QUIMICOS GOMBAQUI EIRL",
    "direccion": "URB. SAN VALENTIN MZ F LT 29 II ETAPA - SMP",
    "contacto": "",
    "correo": "gonbaquim@gmail.com",
    "telefono": "902848858",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "",
    "cci": ""
  },
  {
    "itemNo": "16",
    "ruc": "20604539383",
    "razonSocial": "OREGOM CHEM GROUP SAC",
    "direccion": "JR DANTE 236 - SURQUILLO",
    "contacto": "",
    "correo": "contacto@quimicaindustrial.pe",
    "telefono": "933 634 055",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "",
    "cci": ""
  },
  {
    "itemNo": "17",
    "ruc": "20461948881",
    "razonSocial": "OMNICHEM SAC",
    "direccion": "AV. SANTA ROSA DE LLANAVILLA MZ M LOTE 3 -",
    "contacto": "FLOR GARAY",
    "correo": "",
    "telefono": "919649202",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1941971566006",
    "cci": "21940019756600600"
  },
  {
    "itemNo": "18",
    "ruc": "20461948881",
    "razonSocial": "OMNICHEM SAC",
    "direccion": "AV. SANTA ROSA DE LLANAVILLA MZ M LOTE 3 -",
    "contacto": "FLOR GARAY",
    "correo": "",
    "telefono": "919649202",
    "banco": "INTERBANK",
    "moneda": "SOLES",
    "numeroCuenta": "2003002113218",
    "cci": "320000300211321024"
  },
  {
    "itemNo": "19",
    "ruc": "20609766116",
    "razonSocial": "CH PLAST SAC",
    "direccion": "AV 29 DE SEPTIEMBRE 208 A.H. VILLA SEÑOR DE LOS MILAGROS - CALLAO",
    "contacto": "JOSE LOZANO",
    "correo": "",
    "telefono": "986307493",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "19272949670032",
    "cci": "21921794967003200"
  },
  {
    "itemNo": "20",
    "ruc": "20566571693",
    "razonSocial": "NOVAQUIMICOS EIRL",
    "direccion": "MZA 109 LOTE 4 A.H. ENRIQUE MILLA OCHOA - LOS OLIVOS",
    "contacto": "",
    "correo": "",
    "telefono": "960453801",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1912193110135",
    "cci": "219100219311012992"
  },
  {
    "itemNo": "21",
    "ruc": "20566571693",
    "razonSocial": "NOVAQUIMICOS EIRL",
    "direccion": "MZA 109 LOTE 4 A.H. ENRIQUE MILLA OCHOA - LOS OLIVOS",
    "contacto": "",
    "correo": "",
    "telefono": "960453801",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1912173613085",
    "cci": "219100217361308000"
  },
  {
    "itemNo": "22",
    "ruc": "22544568834",
    "razonSocial": "MAPRIAL SAC",
    "direccion": "AV. CARLOS IZAGUIRRE 1137 - LOS OLIVOS",
    "contacto": "",
    "correo": "",
    "telefono": "946455916",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1911990860095",
    "cci": "21910019986009500"
  },
  {
    "itemNo": "23",
    "ruc": "22544568834",
    "razonSocial": "MAPRIAL SAC",
    "direccion": "AV. CARLOS IZAGUIRRE 1137 - LOS OLIVOS",
    "contacto": "",
    "correo": "",
    "telefono": "946455916",
    "banco": "INTERBANK",
    "moneda": "INTERBANK",
    "numeroCuenta": "2003005128119",
    "cci": ""
  },
  {
    "itemNo": "24",
    "ruc": "20609678811",
    "razonSocial": "INSUMASTER SAC",
    "direccion": "CALLE LOS ARTESANOS MZ A 1 LOTE 78 - PUENTE PIEDRA",
    "contacto": "EFFRAIN",
    "correo": "",
    "telefono": "997895056",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "",
    "cci": ""
  },
  {
    "itemNo": "25",
    "ruc": "20117949983",
    "razonSocial": "ALKOHLER EIRL",
    "direccion": "PROLONGACION CANGALLO N°1263 - LA VICTORIA.",
    "contacto": "LUCERO CHECMAPOCCO",
    "correo": "",
    "telefono": "992366378",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1911429336036",
    "cci": "219100142933603008"
  },
  {
    "itemNo": "26",
    "ruc": "20117949983",
    "razonSocial": "ALKOHLER EIRL",
    "direccion": "PROLONGACION CANGALLO N°1263 - LA VICTORIA.",
    "contacto": "LUCERO CHECMAPOCCO",
    "correo": "",
    "telefono": "992366378",
    "banco": "INTERBANK",
    "moneda": "SOLES",
    "numeroCuenta": "1293000476374",
    "cci": "312900300047636992"
  },
  {
    "itemNo": "27",
    "ruc": "20609553241",
    "razonSocial": "QUIMICA CABANILLAS JULCA SAC",
    "direccion": "AV. BETANCOURT MZA 96 LOTE 04 A.H. JUAN PABLO II - LOS OLIVOS",
    "contacto": "",
    "correo": "",
    "telefono": "982042823",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "2003006750107",
    "cci": "320000300675009984"
  },
  {
    "itemNo": "28",
    "ruc": "20608014773",
    "razonSocial": "INSUQUIMICA",
    "direccion": "AV. ALFREDO MENDIOLA 6466 - SMP",
    "contacto": "MIRELLA GRAU",
    "correo": "",
    "telefono": "993523033",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1919400248098",
    "cci": "1"
  },
  {
    "itemNo": "29",
    "ruc": "20600765052",
    "razonSocial": "SMART CHEM EIRL",
    "direccion": "AV TAHUANTINSUYO 220 - SAN JUAN DE LURIGANCHO",
    "contacto": "JOSE SANCHEZ",
    "correo": "",
    "telefono": "933341721",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1912294804036",
    "cci": "219100229480403008"
  },
  {
    "itemNo": "30",
    "ruc": "20600765052",
    "razonSocial": "SMART CHEM EIRL",
    "direccion": "AV TAHUANTINSUYO 220 - SAN JUAN DE LURIGANCHO",
    "contacto": "JOSE SANCHEZ",
    "correo": "",
    "telefono": "933341721",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1932315261184",
    "cci": "219300231526118016"
  },
  {
    "itemNo": "31",
    "ruc": "20100704065",
    "razonSocial": "PFLUCKER E HIJOS S.A",
    "direccion": "JR LORETA 630 - BREÑA",
    "contacto": "",
    "correo": "pfluckerehijossa@gmail.com",
    "telefono": "998377301",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1910331329056",
    "cci": "219100033132904992"
  },
  {
    "itemNo": "32",
    "ruc": "20614767881",
    "razonSocial": "NORQUIMICOS DEL PERU",
    "direccion": "AV. 2 DE  OCTUBRE MZ B LOTE 6 - LOS OLIVOS",
    "contacto": "CRISTINA CCARI",
    "correo": "norquimicos@hotmail.com",
    "telefono": "923691618",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1917289368077",
    "cci": "219100728936807008"
  },
  {
    "itemNo": "33",
    "ruc": "20607231452",
    "razonSocial": "COMERCIALIZADORA MARIFE SAC",
    "direccion": "AV LOS VIRREYES MZ. D LOTE 13 FORTALEZA DE ATE VITARTE",
    "contacto": "GLORIA HUAMAN",
    "correo": "ventas@insumosmarife.com",
    "telefono": "988676667",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1938966754180",
    "cci": "00219300896675418012"
  },
  {
    "itemNo": "34",
    "ruc": "20603268505",
    "razonSocial": "ECOMAFER SOLUCIONES SAC",
    "direccion": "AV. ZARAGOZA URB. PUERTA DE PRO MZA 4",
    "contacto": "",
    "correo": "ventas.ecomafer@gmail.com",
    "telefono": "939126936",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1912591815047",
    "cci": "219100259181504000"
  },
  {
    "itemNo": "35",
    "ruc": "10770194348",
    "razonSocial": "EFRAIN ESQUEN CARRERA",
    "direccion": "PANAMERICANA NORTE 33.5 INT H42 MERCADO 3 REGIONES",
    "contacto": "EFRAIN ESQUEN",
    "correo": "efrainesquen1234@gmail.com",
    "telefono": "938436908",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "19103051689013",
    "cci": "219110305168900992"
  },
  {
    "itemNo": "36",
    "ruc": "20549652141",
    "razonSocial": "INVERSIONES AGO SAC",
    "direccion": "AV. METROPOLITANA 711 - COMAS",
    "contacto": "",
    "correo": "",
    "telefono": "940438049",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1912252638017",
    "cci": "219100225263800992"
  },
  {
    "itemNo": "37",
    "ruc": "20609558726",
    "razonSocial": "FLORESINTESI FRAGANCIAS Y AROMAS PERU SAC",
    "direccion": "AV. MANUEL OLGUIN N° 335 INT 505 URB LOS GRANADOS - SURCO",
    "contacto": "",
    "correo": "",
    "telefono": "908846672",
    "banco": "INTERBANK",
    "moneda": "SOLES",
    "numeroCuenta": "0573006174663",
    "cci": "305700300617465984"
  },
  {
    "itemNo": "38",
    "ruc": "20609558726",
    "razonSocial": "FLORESINTESI FRAGANCIAS Y AROMAS PERU SAC",
    "direccion": "AV. MANUEL OLGUIN N° 335 INT 505 URB LOS GRANADOS - SURCO",
    "contacto": "",
    "correo": "",
    "telefono": "908846672",
    "banco": "INTERBANK",
    "moneda": "USD",
    "numeroCuenta": "0573006174670",
    "cci": "305700300617467008"
  },
  {
    "itemNo": "39",
    "ruc": "20521023245",
    "razonSocial": "INDUSTRIAS EIZAPLAST S.R.L.",
    "direccion": "AV. CHACRA CERRO N° B INT 15 - COMAS",
    "contacto": "",
    "correo": "ventas@eizaplast.com",
    "telefono": "994063570",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1922335920050",
    "cci": "219200233592004992"
  },
  {
    "itemNo": "40",
    "ruc": "20604114960",
    "razonSocial": "INDUSTRIAS PET SAC",
    "direccion": "CALLE MARIANO MELGAR MZA E LOTE 01 - CARABAYLLO",
    "contacto": "",
    "correo": "",
    "telefono": "994063570",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1912567152027",
    "cci": "219100256715201984"
  },
  {
    "itemNo": "41",
    "ruc": "20101216391",
    "razonSocial": "INDUSTRIAS DERIVADOS DEL ALCOHOL S.A.",
    "direccion": "CALLE LOS MARTILLOS N° 5033 URB INDUSTRIAL EL NARANJA",
    "contacto": "LILIANA HUAMAN",
    "correo": "ventas@inderal.com.pe",
    "telefono": "915232865",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1911423061053",
    "cci": ""
  },
  {
    "itemNo": "42",
    "ruc": "20100459672",
    "razonSocial": "AROMAS DEL PERU S.A.",
    "direccion": "AV ALFREDO MENDIOLA N°3915",
    "contacto": "INGRID MAMANI",
    "correo": "ventas_olivos@aromasdelperu.com",
    "telefono": "981014391",
    "banco": "BCP",
    "moneda": "USD",
    "numeroCuenta": "1917113810175",
    "cci": "21910071138107500"
  },
  {
    "itemNo": "43",
    "ruc": "20100459672",
    "razonSocial": "AROMAS DEL PERU S.A.",
    "direccion": "AV ALFREDO MENDIOLA N°3915",
    "contacto": "INGRID MAMANI",
    "correo": "ventas_olivos@aromasdelperu.com",
    "telefono": "981014391",
    "banco": "BCP",
    "moneda": "SOLES",
    "numeroCuenta": "1917113812085",
    "cci": "219100711381208000"
  }
];

export const PROVEEDORES_QUIMICORP_SEED: ProveedorReal[] = [
  {
    "id": "prov-001",
    "ruc": "20604222339",
    "razonSocial": "HIDROPONIKA SAC",
    "direccion": "AV. RAUL FERRERO 126 - LA MOLINA",
    "contacto": "",
    "correo": "",
    "telefono": "993744417",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1932648200094",
        "cci": "219300264820008992"
      }
    ]
  },
  {
    "id": "prov-002",
    "ruc": "20100860351",
    "razonSocial": "DROCERSA S.A.",
    "direccion": "AV. LOS EUCALIPTOS, PARECLA 6 SUB LOTE B-2 - LURIN",
    "contacto": "LUIS CABALLERO",
    "correo": "ventas@drocersa.com.pe",
    "telefono": "998112661",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1930844579109",
        "cci": "219300084457910016"
      }
    ]
  },
  {
    "id": "prov-003",
    "ruc": "20211040352",
    "razonSocial": "QUIMICOS GOICOCHEA SAC",
    "direccion": "AV. NESTOR GAMBETA 150 - CALLAO",
    "contacto": "BRENDA JARA PEREZ",
    "correo": "qgventas@quimicosgoicochea.com",
    "telefono": "986631240",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "INTERBANK",
        "moneda": "USD",
        "numeroCuenta": "0413000302553",
        "cci": "304100300030254976"
      }
    ]
  },
  {
    "id": "prov-004",
    "ruc": "20601134226",
    "razonSocial": "LIMACHEM SAC",
    "direccion": "JR PANCHO FIERRO 3583 - LOS OLIVOS",
    "contacto": "",
    "correo": "mayelimv@gmail.com",
    "telefono": "998588457",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1912355614189",
        "cci": "219100235561417984"
      }
    ]
  },
  {
    "id": "prov-005",
    "ruc": "20545840597",
    "razonSocial": "SG QUIMICOS DEL PERU SAC",
    "direccion": "AV 2 DE OCTUBRE MZ B LOTE 7 - LOS OLIVOS",
    "contacto": "JEAN CARLO",
    "correo": "ventas@sgquimicos.com",
    "telefono": "979633620",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "INTERBANK",
        "moneda": "SOLES",
        "numeroCuenta": "2003006799386",
        "cci": "320000300679937984"
      }
    ]
  },
  {
    "id": "prov-006",
    "ruc": "20268214284",
    "razonSocial": "QUIMICA EXPRESS SAC",
    "direccion": "AV SANTA ELVIRA N° 6172 - LOS OLIVOS",
    "contacto": "MILENE RIVERA",
    "correo": "fuerzadeventas@quimicaexpress.com",
    "telefono": "908886509",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1916884656187",
        "cci": "219100688465617984"
      }
    ]
  },
  {
    "id": "prov-007",
    "ruc": "20606967145",
    "razonSocial": "QUIMICOS NORPERU E.I.R.L.",
    "direccion": "AV. 2 DE  OCTUBRE MZ B LOTE 6 - LOS OLIVOS",
    "contacto": "CRISTINA CCARI",
    "correo": "quimicos_norperu@hotmail.com",
    "telefono": "923691618",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1919862429092",
        "cci": "219100986242908992"
      },
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1919846699113",
        "cci": "219100984669911008"
      }
    ]
  },
  {
    "id": "prov-008",
    "ruc": "20602435041",
    "razonSocial": "SOLUCIONES QUIMICAS GK E.I.R.L.",
    "direccion": "CALLE C MZ B LOTE 44 URB INDUSTRIAL. INDEPENDENCIA",
    "contacto": "ROCIO",
    "correo": "quimicas.gk@outlook.com",
    "telefono": "934206137",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1919044565040",
        "cci": "219100904456504000"
      },
      {
        "banco": "INTERBANK",
        "moneda": "SOLES",
        "numeroCuenta": "2003008577704",
        "cci": "320000300857769984"
      }
    ]
  },
  {
    "id": "prov-009",
    "ruc": "20101209181",
    "razonSocial": "MARVA SAC",
    "direccion": "CALLE C N° 190 URB INDUSTRIAL. INDEPENDENCIA",
    "contacto": "ROCIO",
    "correo": "ventas@marva.com.pe",
    "telefono": "934206137",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1932329478079",
        "cci": "219300232947807008"
      }
    ]
  },
  {
    "id": "prov-010",
    "ruc": "20294249428",
    "razonSocial": "FRAPECO SRL",
    "direccion": "JJR MANUEL GONZALES PRADA N° 400 - INDEPENDENCIA",
    "contacto": "ROCIO",
    "correo": "",
    "telefono": "934206137",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1910076803086",
        "cci": "219100007680308000"
      },
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1911800217119",
        "cci": "219100180021711008"
      }
    ]
  },
  {
    "id": "prov-011",
    "ruc": "20513315911",
    "razonSocial": "QUIMICA SKR EIRL",
    "direccion": "JR IQUITOS 803 - SAN MARTIN DE PORRES",
    "contacto": "",
    "correo": "ventas@quimicaskr.com",
    "telefono": "998316395",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": []
  },
  {
    "id": "prov-012",
    "ruc": "20614797496",
    "razonSocial": "QUIMICOS GOMBAQUI EIRL",
    "direccion": "URB. SAN VALENTIN MZ F LT 29 II ETAPA - SMP",
    "contacto": "",
    "correo": "gonbaquim@gmail.com",
    "telefono": "902848858",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": []
  },
  {
    "id": "prov-013",
    "ruc": "20604539383",
    "razonSocial": "OREGOM CHEM GROUP SAC",
    "direccion": "JR DANTE 236 - SURQUILLO",
    "contacto": "",
    "correo": "contacto@quimicaindustrial.pe",
    "telefono": "933 634 055",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": []
  },
  {
    "id": "prov-014",
    "ruc": "20461948881",
    "razonSocial": "OMNICHEM SAC",
    "direccion": "AV. SANTA ROSA DE LLANAVILLA MZ M LOTE 3 -",
    "contacto": "FLOR GARAY",
    "correo": "",
    "telefono": "919649202",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1941971566006",
        "cci": "21940019756600600"
      },
      {
        "banco": "INTERBANK",
        "moneda": "SOLES",
        "numeroCuenta": "2003002113218",
        "cci": "320000300211321024"
      }
    ]
  },
  {
    "id": "prov-015",
    "ruc": "20609766116",
    "razonSocial": "CH PLAST SAC",
    "direccion": "AV 29 DE SEPTIEMBRE 208 A.H. VILLA SEÑOR DE LOS MILAGROS - CALLAO",
    "contacto": "JOSE LOZANO",
    "correo": "",
    "telefono": "986307493",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "19272949670032",
        "cci": "21921794967003200"
      }
    ]
  },
  {
    "id": "prov-016",
    "ruc": "20566571693",
    "razonSocial": "NOVAQUIMICOS EIRL",
    "direccion": "MZA 109 LOTE 4 A.H. ENRIQUE MILLA OCHOA - LOS OLIVOS",
    "contacto": "",
    "correo": "",
    "telefono": "960453801",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1912193110135",
        "cci": "219100219311012992"
      },
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1912173613085",
        "cci": "219100217361308000"
      }
    ]
  },
  {
    "id": "prov-017",
    "ruc": "22544568834",
    "razonSocial": "MAPRIAL SAC",
    "direccion": "AV. CARLOS IZAGUIRRE 1137 - LOS OLIVOS",
    "contacto": "",
    "correo": "",
    "telefono": "946455916",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1911990860095",
        "cci": "21910019986009500"
      },
      {
        "banco": "INTERBANK",
        "moneda": "SOLES",
        "numeroCuenta": "2003005128119",
        "cci": ""
      }
    ]
  },
  {
    "id": "prov-018",
    "ruc": "20609678811",
    "razonSocial": "INSUMASTER SAC",
    "direccion": "CALLE LOS ARTESANOS MZ A 1 LOTE 78 - PUENTE PIEDRA",
    "contacto": "EFFRAIN",
    "correo": "",
    "telefono": "997895056",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": []
  },
  {
    "id": "prov-019",
    "ruc": "20117949983",
    "razonSocial": "ALKOHLER EIRL",
    "direccion": "PROLONGACION CANGALLO N°1263 - LA VICTORIA.",
    "contacto": "LUCERO CHECMAPOCCO",
    "correo": "",
    "telefono": "992366378",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1911429336036",
        "cci": "219100142933603008"
      },
      {
        "banco": "INTERBANK",
        "moneda": "SOLES",
        "numeroCuenta": "1293000476374",
        "cci": "312900300047636992"
      }
    ]
  },
  {
    "id": "prov-020",
    "ruc": "20609553241",
    "razonSocial": "QUIMICA CABANILLAS JULCA SAC",
    "direccion": "AV. BETANCOURT MZA 96 LOTE 04 A.H. JUAN PABLO II - LOS OLIVOS",
    "contacto": "",
    "correo": "",
    "telefono": "982042823",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "2003006750107",
        "cci": "320000300675009984"
      }
    ]
  },
  {
    "id": "prov-021",
    "ruc": "20608014773",
    "razonSocial": "INSUQUIMICA",
    "direccion": "AV. ALFREDO MENDIOLA 6466 - SMP",
    "contacto": "MIRELLA GRAU",
    "correo": "",
    "telefono": "993523033",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1919400248098",
        "cci": "1"
      }
    ]
  },
  {
    "id": "prov-022",
    "ruc": "20600765052",
    "razonSocial": "SMART CHEM EIRL",
    "direccion": "AV TAHUANTINSUYO 220 - SAN JUAN DE LURIGANCHO",
    "contacto": "JOSE SANCHEZ",
    "correo": "",
    "telefono": "933341721",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1912294804036",
        "cci": "219100229480403008"
      },
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1932315261184",
        "cci": "219300231526118016"
      }
    ]
  },
  {
    "id": "prov-023",
    "ruc": "20100704065",
    "razonSocial": "PFLUCKER E HIJOS S.A",
    "direccion": "JR LORETA 630 - BREÑA",
    "contacto": "",
    "correo": "pfluckerehijossa@gmail.com",
    "telefono": "998377301",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1910331329056",
        "cci": "219100033132904992"
      }
    ]
  },
  {
    "id": "prov-024",
    "ruc": "20614767881",
    "razonSocial": "NORQUIMICOS DEL PERU",
    "direccion": "AV. 2 DE  OCTUBRE MZ B LOTE 6 - LOS OLIVOS",
    "contacto": "CRISTINA CCARI",
    "correo": "norquimicos@hotmail.com",
    "telefono": "923691618",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1917289368077",
        "cci": "219100728936807008"
      }
    ]
  },
  {
    "id": "prov-025",
    "ruc": "20607231452",
    "razonSocial": "COMERCIALIZADORA MARIFE SAC",
    "direccion": "AV LOS VIRREYES MZ. D LOTE 13 FORTALEZA DE ATE VITARTE",
    "contacto": "GLORIA HUAMAN",
    "correo": "ventas@insumosmarife.com",
    "telefono": "988676667",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1938966754180",
        "cci": "00219300896675418012"
      }
    ]
  },
  {
    "id": "prov-026",
    "ruc": "20603268505",
    "razonSocial": "ECOMAFER SOLUCIONES SAC",
    "direccion": "AV. ZARAGOZA URB. PUERTA DE PRO MZA 4",
    "contacto": "",
    "correo": "ventas.ecomafer@gmail.com",
    "telefono": "939126936",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1912591815047",
        "cci": "219100259181504000"
      }
    ]
  },
  {
    "id": "prov-027",
    "ruc": "10770194348",
    "razonSocial": "EFRAIN ESQUEN CARRERA",
    "direccion": "PANAMERICANA NORTE 33.5 INT H42 MERCADO 3 REGIONES",
    "contacto": "EFRAIN ESQUEN",
    "correo": "efrainesquen1234@gmail.com",
    "telefono": "938436908",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "19103051689013",
        "cci": "219110305168900992"
      }
    ]
  },
  {
    "id": "prov-028",
    "ruc": "20549652141",
    "razonSocial": "INVERSIONES AGO SAC",
    "direccion": "AV. METROPOLITANA 711 - COMAS",
    "contacto": "",
    "correo": "",
    "telefono": "940438049",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1912252638017",
        "cci": "219100225263800992"
      }
    ]
  },
  {
    "id": "prov-029",
    "ruc": "20609558726",
    "razonSocial": "FLORESINTESI FRAGANCIAS Y AROMAS PERU SAC",
    "direccion": "AV. MANUEL OLGUIN N° 335 INT 505 URB LOS GRANADOS - SURCO",
    "contacto": "",
    "correo": "",
    "telefono": "908846672",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "INTERBANK",
        "moneda": "SOLES",
        "numeroCuenta": "0573006174663",
        "cci": "305700300617465984"
      },
      {
        "banco": "INTERBANK",
        "moneda": "USD",
        "numeroCuenta": "0573006174670",
        "cci": "305700300617467008"
      }
    ]
  },
  {
    "id": "prov-030",
    "ruc": "20521023245",
    "razonSocial": "INDUSTRIAS EIZAPLAST S.R.L.",
    "direccion": "AV. CHACRA CERRO N° B INT 15 - COMAS",
    "contacto": "",
    "correo": "ventas@eizaplast.com",
    "telefono": "994063570",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1922335920050",
        "cci": "219200233592004992"
      }
    ]
  },
  {
    "id": "prov-031",
    "ruc": "20604114960",
    "razonSocial": "INDUSTRIAS PET SAC",
    "direccion": "CALLE MARIANO MELGAR MZA E LOTE 01 - CARABAYLLO",
    "contacto": "",
    "correo": "",
    "telefono": "994063570",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1912567152027",
        "cci": "219100256715201984"
      }
    ]
  },
  {
    "id": "prov-032",
    "ruc": "20101216391",
    "razonSocial": "INDUSTRIAS DERIVADOS DEL ALCOHOL S.A.",
    "direccion": "CALLE LOS MARTILLOS N° 5033 URB INDUSTRIAL EL NARANJA",
    "contacto": "LILIANA HUAMAN",
    "correo": "ventas@inderal.com.pe",
    "telefono": "915232865",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1911423061053",
        "cci": ""
      }
    ]
  },
  {
    "id": "prov-033",
    "ruc": "20100459672",
    "razonSocial": "AROMAS DEL PERU S.A.",
    "direccion": "AV ALFREDO MENDIOLA N°3915",
    "contacto": "INGRID MAMANI",
    "correo": "ventas_olivos@aromasdelperu.com",
    "telefono": "981014391",
    "estado": "HOMOLOGADO",
    "insumoPrincipal": "Materia Prima / Insumos Químicos",
    "cuentasBancarias": [
      {
        "banco": "BCP",
        "moneda": "USD",
        "numeroCuenta": "1917113810175",
        "cci": "21910071138107500"
      },
      {
        "banco": "BCP",
        "moneda": "SOLES",
        "numeroCuenta": "1917113812085",
        "cci": "219100711381208000"
      }
    ]
  }
];
