import React, { useState } from "react";
import { fv as futureValue, PaymentDueTime } from "financial";

import CustomInput from "../components/CustomInput";
import Dropdown from "../components/Dropdown";
import ResultCard from "../components/ResultCard";

const FutureValue: React.FC = () => {
  const [tipoValor, setTipoValor] = useState<"normal" | "anticipado" | "">("");
  const [tab, setTab] = useState<"interes" | "anualidad">("interes");
  const [anualidad, setAnualidad] = useState<string>("");
  const [valorPresente, setValorPresente] = useState<string>("");
  const [periodos, setPeriodos] = useState<string>("");
  const [tipoPeriodo, setTipoPeriodo] = useState<string>("");
  const [periodicidadTasa, setPeriodicidadTasa] = useState<string>("");
  const [tasa, setTasa] = useState<string>("");
  const [tipoTasa, setTipoTasa] = useState<"efectiva" | "nominal" | "">("");
  const [resultado, setResultado] = useState<number | null>(null);

  const periodosPorAnoMap: Record<number, number> = {
    1: 12,
    2: 8,
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

  const clearForm = () => {
    setTipoValor("");
    setAnualidad("");
    setPeriodos("");
    setTipoPeriodo("");
    setPeriodicidadTasa("");
    setTasa("");
    setValorPresente("");
    setTipoTasa("");
    setResultado(null);
  };

  const handleSubmitAnualidad = () => {
    const tasaNum = Number(tasa) / 100;
    const periodicidadNum = Number(periodicidadTasa);
    const periodoNum = Number(tipoPeriodo);
    const anualidadNum = Number(anualidad);
    const totalPeriodos = Number(periodos);

    if (
      !tasaNum ||
      !periodicidadNum ||
      !periodoNum ||
      !anualidadNum ||
      !totalPeriodos
    ) {
      alert("Completa todos los campos correctamente");
      return;
    }

    let tasaPorPeriodoFinal = tasaNum;

    // Caso: tasa nominal
    if (tipoTasa === "nominal") {
      tasaPorPeriodoFinal = tasaNominalPorPeriodo(tasaNum, periodicidadNum);
    }

    // Caso: tasa efectiva con diferente periodicidad
    if (periodicidadNum !== periodoNum) {
      tasaPorPeriodoFinal = convertirTasa(
        tasaPorPeriodoFinal,
        periodicidadNum,
        periodoNum
      );
    }

    // Determinar tipo de pago
    const paymentType =
      tipoValor === "anticipado" ? PaymentDueTime.Begin : PaymentDueTime.End;

    console.log(totalPeriodos);

    // Cálculo de valor presente
    const fv = futureValue(
      tasaPorPeriodoFinal,
      totalPeriodos,
      -anualidadNum,
      0,
      paymentType
    );

    setResultado(fv);
  };

  const handleSubmitInteres = () => {
    const tasaNum = Number(tasa) / 100;
    const periodicidadNum = Number(periodicidadTasa); // origen
    const periodoNum = Number(tipoPeriodo); // destino
    const totalPeriodos = Number(periodos);
    const valorPresenteNum = Number(valorPresente);

    if (
      !tasaNum ||
      !periodicidadNum ||
      !periodoNum ||
      !valorPresenteNum ||
      !totalPeriodos
    ) {
      alert("Completa todos los campos correctamente");
      return;
    }

    let tasaPorPeriodoFinal = tasaNum;

    if (tipoTasa === "nominal") {
      tasaPorPeriodoFinal = tasaNominalPorPeriodo(tasaNum, periodicidadNum);
    }

    if (periodicidadNum !== periodoNum) {
      tasaPorPeriodoFinal = convertirTasa(
        tasaPorPeriodoFinal,
        periodicidadNum,
        periodoNum
      );
    }

    const PV =
      valorPresenteNum * Math.pow(1 + tasaPorPeriodoFinal, totalPeriodos);

    setResultado(PV);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-neutral-100 p-5">
      <div className="max-w-6xl mx-auto flex flex-col w-full gap-10">
        <h1 className="text-4xl font-bold text-center text-primary">
          Valor Futuro
        </h1>

        <div className="flex justify-center">
          <div className="inline-flex bg-neutral-800 border border-neutral-700 rounded-xl p-1 gap-2">
            <button
              className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                tab === "interes"
                  ? "bg-primary text-white"
                  : "text-neutral-400 hover:text-neutral-200 cursor-pointer"
              }`}
              onClick={() => {
                setTab("interes");
                clearForm();
              }}
            >
              Interes Compuesto
            </button>

            <button
              className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                tab === "anualidad"
                  ? "bg-primary text-white"
                  : "text-neutral-400 hover:text-neutral-200 cursor-pointer"
              }`}
              onClick={() => {
                setTab("anualidad");
                clearForm();
              }}
            >
              Anualidad
            </button>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-10 space-y-10">
          <h2 className="text-2xl font-semibold">Datos</h2>

          {tab === "interes" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  value={valorPresente}
                  format="money"
                  placeholder="Valor Presente"
                  className="md:col-span-2"
                  onChange={setValorPresente}
                />

                <CustomInput
                  value={periodos}
                  placeholder="Número de periodos"
                  onChange={setPeriodos}
                />

                <Dropdown
                  label="Tipo de período"
                  value={tipoPeriodo}
                  onChange={setTipoPeriodo}
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
                  onChange={(value) =>
                    setTipoTasa(value as "efectiva" | "nominal")
                  }
                  options={[
                    { label: "Efectiva (E)", value: "efectiva" },
                    { label: "Nominal (N)", value: "nominal" },
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
                onClick={handleSubmitInteres}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300 cursor-pointer"
              >
                Calcular Valor Presente
              </button>
            </>
          )}

          {tab === "anualidad" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  label="Tipo de valor"
                  value={tipoValor}
                  onChange={(value) =>
                    setTipoValor(value as "normal" | "anticipado")
                  }
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
                  onChange={setAnualidad}
                />
                <CustomInput
                  value={periodos}
                  placeholder="Número de meses"
                  onChange={setPeriodos}
                />
                <Dropdown
                  label="Periodicidad de meses"
                  value={tipoPeriodo}
                  onChange={setTipoPeriodo}
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
                  label="Periodicidad de tasa"
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
                  onChange={(value) =>
                    setTipoTasa(value as "efectiva" | "nominal")
                  }
                  options={[
                    { label: "Efectiva (E)", value: "efectiva" },
                    { label: "Nominal (N)", value: "nominal" },
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
                onClick={handleSubmitAnualidad}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300 cursor-pointer"
              >
                Calcular Valor Presente
              </button>
            </>
          )}
        </div>

        {resultado !== null && (
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-8">Resultado</h2>
            <ResultCard
              label="Valor Presente"
              value={`$${resultado.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
              })}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureValue;
