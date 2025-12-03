import React, { useState } from "react";

import CustomInput from "../components/CustomInput";
import Dropdown from "../components/Dropdown";
import ResultCard from "../components/ResultCard";

const Annuities: React.FC = () => {
  const [tipoValor, setTipoValor] = useState<"normal" | "anticipado" | "">("");
  const [tab, setTab] = useState<"presente" | "futuro">("presente");
  const [valorFuturo, setValorFuturo] = useState<string>("");
  const [valorPresente, setValorPresente] = useState<string>("");
  const [periodos, setPeriodos] = useState<string>("");
  const [periodicidadMes, setPeriodicidadMes] = useState<string>("");
  const [periodicidadTasa, setPeriodicidadTasa] = useState<string>("");
  const [tasa, setTasa] = useState<string>("");
  const [tipoTasa, setTipoTasa] = useState<"efectiva" | "nominal" | "">("");
  const [periodosDiferidos, setPeriodosDiferidos] = useState<string>("");
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

  const calcularAnualidadPresente = (
    PV: number,
    tasa: number,
    periodos: number,
    diferido: number,
    tipo: "normal" | "anticipado"
  ): number => {
    if (tasa === 0) return PV / periodos; // Caso raro

    const factorBase = (1 - Math.pow(1 + tasa, -periodos)) / tasa;

    let factor = 0;

    if (diferido === 0) {
      factor = tipo === "anticipado" ? factorBase * (1 + tasa) : factorBase;
    } else {
      factor =
        tipo === "anticipado"
          ? factorBase * Math.pow(1 + tasa, diferido * -1)
          : factorBase;
    }

    return PV / factor;
  };

  const calcularAnualidadFutura = (
    FV: number,
    tasa: number,
    periodos: number,
    diferido: number,
    tipo: "normal" | "anticipado"
  ): number => {
    if (tasa === 0) return FV / periodos; // Caso raro

    const factorBase = (Math.pow(1 + tasa, periodos) - 1) / tasa;

    let factor = 0;

    if (diferido === 0) {
      factor = tipo === "anticipado" ? factorBase * (1 + tasa) : factorBase;
    } else {
      factor =
        tipo === "anticipado"
          ? factorBase * Math.pow(1 + tasa, diferido * -1)
          : factorBase;
    }

    return FV / factor;
  };

  const clearForm = () => {
    setTipoValor("");
    setValorFuturo("");
    setValorPresente("");
    setPeriodos("");
    setPeriodicidadTasa("");
    setPeriodicidadMes("");
    setTasa("");
    setTipoTasa("");
    setPeriodosDiferidos("");
    setResultado(null);
  };

  const handleSubmitPresente = () => {
    const tasaNum = Number(tasa) / 100;
    const periodicidadTasaNum = Number(periodicidadTasa);
    const periodicidadMesNum = Number(periodicidadMes);
    const periodosDifNum = Number(periodosDiferidos);
    const totalPeriodos = Number(periodos);
    const valorPresenteNum = Number(valorPresente);

    if (
      !tasaNum ||
      !periodicidadTasaNum ||
      !periodicidadMesNum ||
      !valorPresenteNum ||
      !totalPeriodos ||
      !tipoValor
    ) {
      alert("Completa todos los campos correctamente");
      return;
    }

    let tasaPorPeriodoFinal = tasaNum;

    if (tipoTasa === "nominal") {
      tasaPorPeriodoFinal = tasaNominalPorPeriodo(tasaNum, periodicidadTasaNum);
    }

    if (periodicidadTasaNum !== periodicidadMesNum) {
      tasaPorPeriodoFinal = convertirTasa(
        tasaPorPeriodoFinal,
        periodicidadTasaNum,
        periodicidadMesNum
      );
    }

    const anualidad = calcularAnualidadPresente(
      valorPresenteNum,
      tasaPorPeriodoFinal,
      totalPeriodos,
      periodosDifNum,
      tipoValor
    );

    setResultado(anualidad);
  };

  const handleSubmitFutura = () => {
    const tasaNum = Number(tasa) / 100;
    const periodicidadTasaNum = Number(periodicidadTasa);
    const periodicidadMesNum = Number(periodicidadMes);
    const periodosDifNum = Number(periodosDiferidos);
    const totalPeriodos = Number(periodos);
    const valorFuturoNum = Number(valorFuturo);

    if (
      !tasaNum ||
      !periodicidadTasaNum ||
      !periodicidadMesNum ||
      !valorFuturoNum ||
      !totalPeriodos ||
      !tipoValor
    ) {
      alert("Completa todos los campos correctamente");
      return;
    }

    let tasaPorPeriodoFinal = tasaNum;

    if (tipoTasa === "nominal") {
      tasaPorPeriodoFinal = tasaNominalPorPeriodo(tasaNum, periodicidadTasaNum);
    }

    if (periodicidadTasaNum !== periodicidadMesNum) {
      tasaPorPeriodoFinal = convertirTasa(
        tasaPorPeriodoFinal,
        periodicidadTasaNum,
        periodicidadMesNum
      );
    }
    const anualidad = calcularAnualidadFutura(
      valorFuturoNum,
      tasaPorPeriodoFinal,
      totalPeriodos,
      periodosDifNum,
      tipoValor
    );

    setResultado(anualidad);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-neutral-100 p-5">
      <div className="max-w-6xl mx-auto flex flex-col w-full gap-10">
        <h1 className="text-4xl font-bold text-center text-primary">
          Anualidad
        </h1>

        <div className="flex justify-center">
          <div className="inline-flex bg-neutral-800 border border-neutral-700 rounded-xl p-1 gap-2">
            <button
              className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                tab === "presente"
                  ? "bg-primary text-white"
                  : "text-neutral-400 hover:text-neutral-200 cursor-pointer"
              }`}
              onClick={() => {
                setTab("presente");
                clearForm();
              }}
            >
              Valor Presente
            </button>

            <button
              className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                tab === "futuro"
                  ? "bg-primary text-white"
                  : "text-neutral-400 hover:text-neutral-200 cursor-pointer"
              }`}
              onClick={() => {
                setTab("futuro");
                clearForm();
              }}
            >
              Valor Futuro
            </button>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-10 space-y-10">
          <h2 className="text-2xl font-semibold">Datos</h2>

          {tab === "presente" && (
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
                  value={valorPresente}
                  format="money"
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
                  onChange={(value) =>
                    setTipoTasa(value as "efectiva" | "nominal")
                  }
                  options={[
                    { label: "Efectiva", value: "efectiva" },
                    { label: "Nominal", value: "nominal" },
                  ]}
                />

                {tipoValor === "anticipado" && (
                  <CustomInput
                    value={periodosDiferidos}
                    placeholder="Periodos Diferidos"
                    onChange={setPeriodosDiferidos}
                  />
                )}
                <button
                  type="button"
                  onClick={clearForm}
                  className={`w-full py-3 rounded-lg bg-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors duration-300 cursor-pointer ${
                    tipoValor === "anticipado" ? "col-span-2" : ""
                  }`}
                >
                  Limpiar Campos
                </button>
              </div>
              <button
                onClick={handleSubmitPresente}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300 cursor-pointer"
              >
                Calcular Anualidad
              </button>
            </>
          )}

          {tab === "futuro" && (
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
                  value={valorFuturo}
                  format="money"
                  placeholder={`Valor Futuro ${tipoValor ? tipoValor : ""}`}
                  onChange={setValorFuturo}
                />
                <CustomInput
                  value={periodos}
                  placeholder="Número de meses"
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
                {tipoValor === "anticipado" && (
                  <CustomInput
                    value={periodosDiferidos}
                    placeholder="Periodos Diferidos"
                    onChange={setPeriodosDiferidos}
                  />
                )}
                <button
                  type="button"
                  onClick={clearForm}
                  className={`w-full py-3 rounded-lg bg-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors duration-300 cursor-pointer ${
                    tipoValor === "anticipado" ? "col-span-2" : ""
                  }`}
                >
                  Limpiar Campos
                </button>
              </div>

              <button
                onClick={handleSubmitFutura}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300 cursor-pointer"
              >
                Calcular Anualidad
              </button>
            </>
          )}
        </div>

        {resultado !== null && (
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-8">Resultado</h2>
            <ResultCard
              label="Anualidad"
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

export default Annuities;
