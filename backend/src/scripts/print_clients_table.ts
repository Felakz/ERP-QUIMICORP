import * as xlsx from 'xlsx';
import * as path from 'path';

function printClientTable() {
  const excelPath = path.resolve('/host/CONTROL DE VENTAS Y COBRANZAS.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Rep. Vtas y Cobranzas'];
  const rows: any[] = xlsx.utils.sheet_to_json(sheet, { range: 5 });

  const byCli = new Map<string, { ruc: string; docs: Map<string, { tot: number; est: string; items: number }>; tot: number }>();

  rows.forEach(r => {
    const comp = String(r['Comprobante'] || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!comp) return;
    const cli = String(r['Cliente'] || 'SIN CLIENTE').trim().toUpperCase();
    const ruc = String(r['RUC'] || '').trim();
    const tot = Number(r['Total']) || 0;
    const est = String(r['Estado'] || 'Pendiente').trim();

    if (!byCli.has(cli)) {
      byCli.set(cli, { ruc, docs: new Map(), tot: 0 });
    }
    const c = byCli.get(cli)!;
    c.tot += tot;
    if (ruc && !c.ruc) c.ruc = ruc;

    if (!c.docs.has(comp)) {
      c.docs.set(comp, { tot: 0, est, items: 0 });
    }
    const d = c.docs.get(comp)!;
    d.tot += tot;
    d.items++;
    if (est.toLowerCase() === 'pagado') d.est = 'Pagado';
  });

  console.log('| # | CLIENTE | RUC | TOTAL FACTURADO (S/.) | PAGADO (S/.) | SALDO PENDIENTE (S/.) | N° DOCS | ESTADO |');
  console.log('| :-: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |');

  let idx = 1;
  let granTotal = 0;
  let granPagado = 0;
  let granPendiente = 0;

  byCli.forEach((data, cli) => {
    let pag = 0;
    let pen = 0;
    data.docs.forEach(d => {
      if (d.est.toLowerCase() === 'pagado') pag += d.tot;
      else pen += d.tot;
    });

    granTotal += data.tot;
    granPagado += pag;
    granPendiente += pen;

    const statusBadge = pen > 0 ? '⏳ CON DEUDA' : '✅ AL DÍA';
    console.log(`| ${idx++} | **${cli}** | ${data.ruc || 'S/N'} | **S/. ${data.tot.toFixed(2)}** | S/. ${pag.toFixed(2)} | **S/. ${pen.toFixed(2)}** | ${data.docs.size} | ${statusBadge} |`);
  });

  console.log(`| — | **TOTAL GENERAL** | — | **S/. ${granTotal.toFixed(2)}** | **S/. ${granPagado.toFixed(2)}** | **S/. ${granPendiente.toFixed(2)}** | **61** | — |`);
}

printClientTable();
