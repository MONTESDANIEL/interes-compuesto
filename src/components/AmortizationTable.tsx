export interface AmortizacionRow {
  periodo: number;
  saldo: number;
  interes: number;
  cuota: number;
  amortizacion: number;
}

interface AmortizationTableProps {
  tabla: AmortizacionRow[];
}

const formatNumber = (n: number) => new Intl.NumberFormat("de-DE").format(n);

export default function AmortizationTable({ tabla }: AmortizationTableProps) {
  return (
    <div className="overflow-hidden rounded-xl shadow-lg ">
      <table className="w-full text-sm">
        <thead className="bg-primary text-white sticky top-0 z-10">
          <tr>
            {["Periodo", "Saldo", "Interés", "Cuota", "Amortización"].map(
              (h) => (
                <th
                  key={h}
                  className="p-3 font-semibold tracking-wide border-r border-white/80 last:border-none"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-900">
          {tabla.map((row) => (
            <tr
              key={row.periodo}
              className="odd:bg-neutral-600 even:bg-neutral-700 hover:bg-primary/50 transition-colors text-neutral-white"
            >
              <td className="p-3">{row.periodo}</td>
              <td className="p-3">{formatNumber(row.saldo)}</td>
              <td className="p-3">{formatNumber(row.interes)}</td>
              <td className="p-3">{formatNumber(row.cuota)}</td>
              <td className="p-3">{formatNumber(row.amortizacion)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
