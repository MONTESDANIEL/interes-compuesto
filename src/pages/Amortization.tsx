import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import Dropdown from "../components/Dropdown";
import AmortizationTable from "../components/AmortizationTable";
import * as financial from "financial";

export interface AmortizacionRow {
  periodo: number;
  saldo: number;
  interes: number;
  cuota: number;
  amortizacion: number;
}

const Amortization: React.FC = () => {
  const [tipoValor, setTipoValor] = useState<"normal" | "anticipado" | "">("");
  const [valorPresente, setValorPresente] = useState<string>("");
  const [tasa, setTasa] = useState<string>("");
  const [periodicidadMes, setPeriodicidadMes] = useState<string>("");
  const [periodicidadTasa, setPeriodicidadTasa] = useState<string>("");
  const [periodos, setPeriodos] = useState("");
  const [tipoTasa, setTipoTasa] = useState<"efectiva" | "nominal" | "">("");
  const [tabla, setTabla] = useState<AmortizacionRow[]>([]);

  const periodosPorAnoMap: Record<number, number> = {
    1: 12,
    2: 6,
    3: 4,
    4: 3,
    6: 2,
    12: 1,
  };

  const convertirTasa = (
    tasaConocida: number,
    periodoOrigen: number,
    periodoDestino: number
  ): number => {
    const nOrigen = periodosPorAnoMap[periodoOrigen];
    const nDestino = periodosPorAnoMap[periodoDestino];

    if (!nOrigen || !nDestino) throw new Error("Periodicidad desconocida");

    return Math.pow(1 + tasaConocida, nOrigen / nDestino) - 1;
  };

  const tasaNominalPorPeriodo = (
    tasaAnual: number,
    periodicidadNum: number
  ): number => {
    const periodosPorAno = periodosPorAnoMap[periodicidadNum];
    if (!periodosPorAno) throw new Error("Periodicidad desconocida");

    return tasaAnual / periodosPorAno;
  };

  const calcular = () => {
    const tasaDecimalEntrada = Number(tasa) / 100;
    const periodicidadTasaNum = Number(periodicidadTasa);
    const periodicidadPagoNum = Number(periodicidadMes);
    const numeroPeriodos = Number(periodos);
    const valorPresenteNum = Number(valorPresente);

    let tasaPorPeriodoOrigen: number;
    if (tipoTasa === "nominal") {
      tasaPorPeriodoOrigen = tasaNominalPorPeriodo(
        tasaDecimalEntrada,
        periodicidadTasaNum
      );
    } else {
      tasaPorPeriodoOrigen = tasaDecimalEntrada;
    }

    let tasaPorPeriodoFinal: number;
    if (periodicidadTasaNum !== periodicidadPagoNum) {
      tasaPorPeriodoFinal = convertirTasa(
        tasaPorPeriodoOrigen,
        periodicidadTasaNum,
        periodicidadPagoNum
      );
    } else {
      tasaPorPeriodoFinal = tasaPorPeriodoOrigen;
    }

    const cuota = Math.abs(
      financial.pmt(tasaPorPeriodoFinal, numeroPeriodos, -valorPresenteNum, 0)
    );

    const nuevaTabla: AmortizacionRow[] = [];

    nuevaTabla.push({
      periodo: 0,
      cuota: 0,
      interes: 0,
      amortizacion: 0,
      saldo: Number(valorPresenteNum.toFixed(2)),
    });

    let saldo = valorPresenteNum;

    for (let i = 1; i <= numeroPeriodos; i++) {
      const interes = saldo * tasaPorPeriodoFinal;
      let amortizacion = cuota - interes;

      if (amortizacion > saldo) {
        amortizacion = saldo;
      }

      saldo -= amortizacion;
      if (saldo < 1e-8) saldo = 0;

      nuevaTabla.push({
        periodo: i,
        cuota: Number(cuota.toFixed(2)),
        interes: Number(interes.toFixed(2)),
        amortizacion: Number(amortizacion.toFixed(2)),
        saldo: Number(saldo.toFixed(2)),
      });
    }

    setTabla(nuevaTabla);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calcular();
  };

  const clearForm = () => {
    setValorPresente("");
    setTasa("");
    setPeriodicidadMes("");
    setPeriodicidadTasa("");
    setPeriodos("");
    setTipoValor("");
    setTipoTasa("");
    setTabla([]);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 py-10">
        {/* TÍTULO */}
        <h1 className="text-4xl font-bold text-center text-primary">
          Amortización
        </h1>

        {/* CARD PRINCIPAL */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-10 space-y-10">
          <h1 className="text-2xl font-semibold">Datos</h1>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              value={valorPresente}
              format="money"
              className="col-span-2"
              placeholder={`Valor presente ${tipoValor ? tipoValor : ""}`}
              onChange={setValorPresente}
            />

            <CustomInput
              value={periodos}
              placeholder="Número de periodos"
              onChange={setPeriodos}
            />

            <Dropdown
              label="Periodicidad de meses"
              value={periodicidadMes}
              onChange={setPeriodicidadMes}
              options={[
                { label: "Mensual (M)", value: "1" },
                { label: "Bimestral (B)", value: "2" },
                { label: "Trimestral (T)", value: "3" },
                { label: "Cuatrimestral (Q)", value: "4" },
                { label: "Semestral (S)", value: "6" },
                { label: "Anual (A)", value: "12" },
              ]}
            />

            <CustomInput
              value={tasa}
              placeholder="Tasa de Interés (%)"
              onChange={setTasa}
            />

            <Dropdown
              label="Periodicidad de la tasa"
              value={periodicidadTasa}
              onChange={setPeriodicidadTasa}
              options={[
                { label: "Mensual (M)", value: "1" },
                { label: "Bimestral (B)", value: "2" },
                { label: "Trimestral (T)", value: "3" },
                { label: "Cuatrimestral (Q)", value: "4" },
                { label: "Semestral (S)", value: "6" },
                { label: "Anual (A)", value: "12" },
              ]}
            />

            <Dropdown
              label="Tipo de tasa"
              value={tipoTasa}
              onChange={(value) => setTipoTasa(value as "efectiva" | "nominal")}
              options={[
                { label: "Efectiva", value: "efectiva" },
                { label: "Nominal", value: "nominal" },
              ]}
            />

            {/* BOTÓN LIMPIAR */}
            <button
              type="button"
              onClick={clearForm}
              className="w-full py-3 rounded-lg bg-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-light transition-colors duration-300 cursor-pointer"
            >
              Limpiar Campos
            </button>
          </div>

          {/* BOTÓN PRINCIPAL */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300 cursor-pointer"
          >
            Calcular Amortización
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-10">
          <h1 className="text-2xl font-semibold mb-6">Tabla</h1>
          <AmortizationTable tabla={tabla} />
        </div>
      </div>
    </div>
  );
};

export default Amortization;
