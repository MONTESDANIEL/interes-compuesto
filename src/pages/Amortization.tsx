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
  const [tipoValor, setTipoValor] = useState("");
  const [valor, setValor] = useState<string>("");
  const [tasa, setTasa] = useState<string>("");
  const [periodos, setPeriodos] = useState<string>("");
  const [periodoTipo, setPeriodoTipo] = useState("");
  const [tabla, setTabla] = useState<AmortizacionRow[]>([]);

  const calcular = () => {
    if (!tipoValor || !valor || !tasa || !periodos || !periodoTipo) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const valorNumerico = Number(valor);
    const tasaNumerica = Number(tasa) / 100;
    const periodosNumerico = Number(periodos);

    if (
      isNaN(valorNumerico) ||
      isNaN(tasaNumerica) ||
      isNaN(periodosNumerico)
    ) {
      alert("Por favor ingresa números válidos.");
      return;
    }

    let cuota = 0;

    console.log("Tasa numerica:", tasaNumerica);
    console.log("Periodo numerica:", periodosNumerico);
    console.log("Valor numerico:", valorNumerico);

    if (tipoValor === "fv") {
      cuota = Math.abs(
        financial.pmt(tasaNumerica, periodosNumerico, 0, -valorNumerico)
      );
    } else if (tipoValor === "pv") {
      cuota = Math.abs(
        financial.pmt(tasaNumerica, periodosNumerico, -valorNumerico, 0)
      );
    }

    const nuevaTabla: AmortizacionRow[] = [];

    // -------------------------------------------------
    // PERIODO 0 (estado inicial)
    // -------------------------------------------------
    nuevaTabla.push({
      periodo: 0,
      cuota: 0,
      interes: 0,
      amortizacion: 0,
      saldo: Number(valorNumerico.toFixed(2)),
    });

    // -------------------------------------------------
    // ITERACIÓN NORMAL
    // -------------------------------------------------
    let saldo = valorNumerico;

    for (let i = 1; i <= periodosNumerico; i++) {
      const interes = saldo * tasaNumerica;

      // Calcular amortización (antes de ajustes)
      let amortizacion = cuota - interes;

      // Ajustar si la amortización supera el saldo restante
      if (amortizacion > saldo) {
        amortizacion = saldo;
      }

      saldo -= amortizacion;

      // Evitar valores negativos por redondeo
      if (saldo < 0) saldo = 0;

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
    setTipoValor("");
    setValor("");
    setTasa("");
    setPeriodos("");
    setPeriodoTipo("");
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
            <Dropdown
              label="¿Qué valor estás ingresando?"
              value={tipoValor}
              onChange={setTipoValor}
              options={[
                { label: "Valor Presente (PV)", value: "pv" },
                { label: "Valor Futuro (FV)", value: "fv" },
              ]}
            />

            <CustomInput
              value={valor}
              format="money"
              placeholder={
                tipoValor === "pv" ? "Valor Presente" : "Valor Futuro"
              }
              onChange={(raw) => setValor(raw)}
            />

            <CustomInput
              value={periodos}
              placeholder="Número de períodos"
              onChange={(raw) => setPeriodos(raw)}
            />

            <Dropdown
              label="Tipo de período"
              value={periodoTipo}
              onChange={setPeriodoTipo}
              options={[
                { label: "Mensual", value: "mensual" },
                { label: "Bimestral", value: "bimestral" },
                { label: "Trimestral", value: "trimestral" },
                { label: "Cuatrimestral", value: "cuatrimestral" },
                { label: "Semestral", value: "semestral" },
                { label: "Anual", value: "anual" },
              ]}
            />

            <CustomInput
              value={tasa}
              placeholder="Tasa de Interés (%)"
              onChange={(raw) => setTasa(raw)}
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
