import * as financial from "financial";

export interface AmortizacionRow {
  periodo: number;
  pago: number;
  interes: number;
  abono: number;
  saldo: number;
}

/** Valor Futuro */
export function valorFuturo(PV: number, tasa: number, periodos: number) {
  return financial.fv(tasa, periodos, 0, -PV);
}

/** Valor Presente */
export function valorPresente(FV: number, tasa: number, periodos: number) {
  return financial.pv(tasa, periodos, 0, -FV);
}

/** Cuota (PMT) */
export function cuota(PV: number, tasa: number, periodos: number) {
  return -financial.pmt(tasa, periodos, PV);
}

/** Número de periodos */
export function numeroPeriodos(tasa: number, pago: number, PV: number) {
  return financial.nper(tasa, -pago, PV);
}

/** Tasa por periodo */
export function tasaPeriodo(pv: number, fv: number, n: number) {
  return financial.rate(n, 0, -pv, fv);
}

/** Tabla de amortización sistema francés */
export function amortizacion(PV: number, tasa: number, periodos: number) {
  const A = cuota(PV, tasa, periodos);
  let saldo = PV;

  const tabla = [];

  for (let i = 1; i <= periodos; i++) {
    const interes = saldo * tasa;
    const abono = A - interes;
    saldo -= abono;

    tabla.push({
      periodo: i,
      pago: Number(A.toFixed(2)),
      interes: Number(interes.toFixed(2)),
      abono: Number(abono.toFixed(2)),
      saldo: Number(saldo.toFixed(2)),
    });
  }

  return {
    cuota: Number(A.toFixed(2)),
    tabla,
  };
}
