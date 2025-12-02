import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import ResultCard from "../components/ResultCard";
import { ArrowRight } from "lucide-react";
import Dropdown from "../components/Dropdown";

const TasaAnticipada: React.FC = () => {
  const [tipoConversion, setTipoConversion] = useState("normal-a-anticipada");
  const [tipoPeriodoOrigen, setTipoPeriodoOrigen] = useState("");
  const [tipoPeriodoDestino, setTipoPeriodoDestino] = useState("");
  const [tasa, setTasa] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);

  const convertirTasa = (
    tasaConocida: number,
    periodoOrigen: number,
    periodoDestino: number
  ): number => {
    const nOrigen = periodoOrigen;
    const nDestino = periodoDestino;

    if (!nOrigen || !nDestino) throw new Error("Periodicidad desconocida");

    return Math.pow(1 + tasaConocida, nOrigen / nDestino) - 1;
  };

  const calcular = () => {
    const tasaNum = Number(tasa) / 100;
    const tipoPeriodoOrigenNum = Number(tipoPeriodoOrigen);
    const tipoPeriodoDestinoNum = Number(tipoPeriodoDestino);

    if (!tasaNum || !tipoPeriodoDestinoNum || !tipoPeriodoOrigenNum) {
      alert("Completa todos los campos correctamente");
      return;
    }

    let tasaPorPeriodoFinal = tasaNum;
    let result = 0;

    console.log(tasaPorPeriodoFinal);

    if (tipoPeriodoOrigenNum !== tipoPeriodoDestinoNum) {
      tasaPorPeriodoFinal = convertirTasa(
        tasaPorPeriodoFinal,
        tipoPeriodoOrigenNum,
        tipoPeriodoDestinoNum
      );
    }

    console.log(tasaPorPeriodoFinal);

    if (tipoConversion === "normal-a-anticipada") {
      result = tasaPorPeriodoFinal / (1 + tasaPorPeriodoFinal);
    } else {
      result = tasaPorPeriodoFinal / (1 - tasaPorPeriodoFinal);
    }

    setResultado((result * 100).toFixed(6));
  };

  const limpiar = () => {
    setTasa("");
    setResultado(null);
    setTipoConversion("normal-a-anticipada");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 px-4 flex justify-center items-center">
      <div className="max-w-3xl w-full space-y-10 py-10">
        <h1 className="text-4xl font-bold text-center text-primary">
          Conversión de Tasas
        </h1>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-10 space-y-10">
          <h2 className="text-2xl font-semibold mb-4">Tipo de Conversión</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD: Normal → Anticipada */}
            <button
              type="button"
              onClick={() => {
                setTipoConversion("normal-a-anticipada");
                setResultado(null);
              }}
              className={`p-6 rounded-xl border transition-all duration-300 text-left
              ${
                tipoConversion === "normal-a-anticipada"
                  ? "border-primary bg-primary/15 shadow-lg"
                  : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700/50 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-1 mb-2">
                <span className="text-lg font-bold text-neutral-100">
                  Normal
                </span>
                <ArrowRight className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold text-neutral-100">
                  Anticipada
                </span>
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed">
                Convierte una tasa pagada al final del periodo a una pagada al
                inicio.
              </p>
            </button>

            {/* CARD: Anticipada → Normal */}
            <button
              type="button"
              onClick={() => {
                setTipoConversion("anticipada-a-normal");
                setResultado(null);
              }}
              className={`p-6 rounded-xl border transition-all duration-300 text-left
              ${
                tipoConversion === "anticipada-a-normal"
                  ? "border-primary bg-primary/15 shadow-lg"
                  : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700/50 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-1 mb-2">
                <span className="text-lg font-bold text-neutral-100">
                  Anticipada
                </span>
                <ArrowRight className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold text-neutral-100">
                  Normal
                </span>
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed">
                Convierte una tasa anticipada a una tasa normal o vencida.
              </p>
            </button>

            <Dropdown
              label="Tipo de período origen"
              value={tipoPeriodoOrigen}
              onChange={setTipoPeriodoOrigen}
              options={[
                { label: "Mensual", value: "12" },
                { label: "Bimestral", value: "6" },
                { label: "Trimestral", value: "4" },
                { label: "Cuatrimestral", value: "3" },
                { label: "Semestral", value: "2" },
                { label: "Anual", value: "1" },
              ]}
            />
            <Dropdown
              label="Tipo de período destino"
              value={tipoPeriodoDestino}
              onChange={setTipoPeriodoDestino}
              options={[
                { label: "Mensual", value: "12" },
                { label: "Bimestral", value: "6" },
                { label: "Trimestral", value: "4" },
                { label: "Cuatrimestral", value: "3" },
                { label: "Semestral", value: "2" },
                { label: "Anual", value: "1" },
              ]}
            />
            <CustomInput
              value={tasa}
              placeholder="Tasa (%)"
              onChange={setTasa}
            />
            <button
              onClick={limpiar}
              className="flex-1 py-3 rounded-lg bg-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors duration-300"
            >
              Limpiar
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={calcular}
              className="flex-1 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300 cursor-pointer"
            >
              Calcular
            </button>
          </div>
        </div>

        {resultado && (
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-8 space-y-8">
            <h2 className="text-2xl font-bold text-primary text-center">
              Resultado
            </h2>

            <ResultCard
              label={
                tipoConversion === "normal-a-anticipada"
                  ? "Tasa Anticipada (ia)"
                  : "Tasa Normal (i)"
              }
              value={`${resultado}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TasaAnticipada;
