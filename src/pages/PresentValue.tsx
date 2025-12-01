import React, { useState } from "react";
import * as financial from "financial";
import { PaymentDueTime } from "financial";

import CustomInput from "../components/CustomInput";
import Dropdown from "../components/Dropdown";
import ResultCard from "../components/ResultCard";

const Annuities: React.FC = () => {
  const [tipoValor, setTipoValor] = useState("normal");
  const [anualidad, setAnualidad] = useState("");
  const [periodos, setPeriodos] = useState("");
  const [tipoPeriodo, setTipoPeriodo] = useState("mensual");
  const [tasa, setTasa] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const clearForm = () => {
    setTipoValor("normal");
    setAnualidad("");
    setPeriodos("");
    setTipoPeriodo("mensual");
    setTasa("");
    setResultado(null);
  };

  const handleSubmit = () => {
    const pmt = Number(anualidad);
    const nper = Number(periodos);
    const rateInput = Number(tasa) / 100;

    if (!pmt || !nper || !rateInput) {
      alert("Completa todos los campos correctamente");
      return;
    }

    // Mapeo de períodos por año
    const mapping: Record<string, number> = {
      mensual: 12,
      bimestral: 6,
      trimestral: 4,
      cuatrimestral: 3,
      semestral: 2,
      anual: 1,
    };

    const m = mapping[tipoPeriodo];

    console.log("Anualidad ingresada:", pmt);
    console.log("Tasa de interés ingresada:", rateInput);
    console.log("Número de períodos ingresados:", nper);

    console.log("Períodos por año (m):", m);

    const paymentType =
      tipoValor === "anticipado" ? PaymentDueTime.Begin : PaymentDueTime.End;

    console.log("Tipo de pago:", paymentType);

    const pv = financial.pv(rateInput, nper, -pmt, 0, paymentType);

    // TODO : Verificar el resultado de la tasa segun el tipo de período
    // El periodo queda en meses

    setResultado(pv);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-neutral-100 px-4">
      <div className="max-w-6xl mx-auto flex flex-col w-full gap-10 py-10">
        <h1 className="text-4xl font-bold text-center text-primary">
          Valor Presente
        </h1>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-10 space-y-10">
          <h1 className="text-2xl font-semibold">Datos</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Dropdown
              label="Tipo de valor"
              value={tipoValor}
              onChange={setTipoValor}
              options={[
                { label: "Normal (Final del periodo)", value: "normal" },
                {
                  label: "Anticipado (Inicio del periodo)",
                  value: "anticipado",
                },
              ]}
            />

            <CustomInput
              value={anualidad}
              format="money"
              placeholder="Anualidad"
              onChange={(raw) => setAnualidad(raw)}
            />

            <CustomInput
              value={periodos}
              placeholder="Número de período (Meses)"
              onChange={(raw) => setPeriodos(raw)}
            />

            <Dropdown
              label="Tipo de período"
              value={tipoPeriodo}
              onChange={setTipoPeriodo}
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

            <Dropdown
              label="Periodicidad de la tasa"
              value={tipoPeriodo}
              onChange={setTipoPeriodo}
              options={[
                { label: "Mensual", value: "mensual" },
                { label: "Bimestral", value: "bimestral" },
                { label: "Trimestral", value: "trimestral" },
                { label: "Cuatrimestral", value: "cuatrimestral" },
                { label: "Semestral", value: "semestral" },
                { label: "Anual", value: "anual" },
              ]}
            />

            <Dropdown
              label="Tipo de tasa"
              value={tipoPeriodo}
              onChange={setTipoPeriodo}
              options={[
                { label: "Efectiva", value: "efectiva" },
                { label: "Nominal", value: "nominal" },
              ]}
            />

            <button
              type="button"
              onClick={clearForm}
              className="w-full py-3 rounded-lg bg-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors duration-300 cursor-pointer"
            >
              Limpiar Campos
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300 cursor-pointer"
          >
            Calcular Valor Presente
          </button>
        </div>

        {/* TARJETA DE RESULTADO */}
        {resultado !== null && (
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-8">Resultado</h2>
            <ResultCard
              label="Valor Presente"
              value={
                "$" +
                resultado.toLocaleString("es-CO", {
                  minimumFractionDigits: 2,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Annuities;
