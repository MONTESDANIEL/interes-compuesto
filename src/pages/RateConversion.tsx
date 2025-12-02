import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import Dropdown from "../components/Dropdown";
import ResultCard from "../components/ResultCard";

const RateConversion: React.FC = () => {
  const [tasa, setTasa] = useState<string>("");
  const [tipoTasaOrigen, setTipoTasaOrigen] = useState<
    "efectiva" | "nominal" | ""
  >("");
  const [tipoTasaDestino, setTipoTasaDestino] = useState<
    "efectiva" | "nominal" | ""
  >("");
  const [periodicidadOrigen, setPeriodicidadOrigen] = useState<string>("");
  const [periodicidadDestino, setPeriodicidadDestino] = useState<string>("");
  const [resultado, setResultado] = useState<number | null>(null);

  // Mapa de periodos por año
  const periodosPorAno: Record<number, number> = {
    1: 12, // mensual
    2: 6, // bimestral
    3: 4, // trimestral
    4: 3, // cuatrimestral
    6: 2, // semestral
    12: 1, // anual
  };

  /** Cálculo principal */
  const handleSubmit = () => {
    if (
      !tasa ||
      !tipoTasaOrigen ||
      !tipoTasaDestino ||
      !periodicidadOrigen ||
      !periodicidadDestino
    )
      return;

    const tasaNum = parseFloat(tasa) / 100;
    const po = parseInt(periodicidadOrigen);
    const pd = parseInt(periodicidadDestino);

    let iOrigen = 0;
    let iDestino = 0;
    let resultadoFinal = 0;

    if (tipoTasaOrigen === "nominal") {
      const mOrigen = periodosPorAno[po];
      iOrigen = tasaNum / mOrigen;
    } else {
      iOrigen = tasaNum;
    }

    const n1 = periodosPorAno[po];
    const n2 = periodosPorAno[pd];
    iDestino = Math.pow(1 + iOrigen, n1 / n2) - 1;

    if (tipoTasaDestino === "nominal") {
      const mDestino = periodosPorAno[pd];
      resultadoFinal = iDestino * mDestino;
    } else {
      resultadoFinal = iDestino;
    }

    setResultado(resultadoFinal * 100);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-900 text-neutral-100 p-5">
      <div className="max-w-3xl w-full space-y-10">
        <h1 className="text-4xl font-bold text-center text-primary">
          Conversor de Tasas
        </h1>

        <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-8 space-y-5 shadow-2xl backdrop-blur-xl">
          {/* contenedor principal */}
          <div className="flex flex-col md:flex-row items-center w-full justify-between">
            {/* ORIGEN */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-xl p-8 flex flex-col gap-6 basis-full md:basis-[42%]">
              <h3 className="text-xl font-bold text-primary text-center">
                Origen
              </h3>

              <CustomInput
                value={tasa}
                placeholder="Tasa (%)"
                onChange={setTasa}
              />

              <Dropdown
                label="Tipo de tasa"
                value={tipoTasaOrigen}
                onChange={(value) =>
                  setTipoTasaOrigen(value as "efectiva" | "nominal")
                }
                options={[
                  { label: "Efectiva (E)", value: "efectiva" },
                  { label: "Nominal (N)", value: "nominal" },
                ]}
              />

              <Dropdown
                label="Periodicidad"
                value={periodicidadOrigen}
                onChange={setPeriodicidadOrigen}
                options={[
                  { label: "Mensual (M)", value: "1" },
                  { label: "Bimestral (B)", value: "2" },
                  { label: "Trimestral (T)", value: "3" },
                  { label: "Cuatrimestral (Q)", value: "4" },
                  { label: "Semestral (S)", value: "6" },
                  { label: "Anual (A)", value: "12" },
                ]}
              />
            </div>

            {/* FLECHA CENTRAL */}
            <div className="flex justify-center items-center">
              <div className="text-primary text-7xl font-extrabold select-none">
                →
              </div>
            </div>

            {/* DESTINO */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-xl p-8 flex flex-col gap-6 basis-full md:basis-[42%]">
              <h3 className="text-xl font-bold text-primary text-center">
                Destino
              </h3>

              <Dropdown
                label="Tipo de tasa"
                value={tipoTasaDestino}
                onChange={(value) =>
                  setTipoTasaDestino(value as "efectiva" | "nominal")
                }
                options={[
                  { label: "Efectiva (E)", value: "efectiva" },
                  { label: "Nominal (N)", value: "nominal" },
                ]}
              />

              <Dropdown
                label="Periodicidad"
                value={periodicidadDestino}
                onChange={setPeriodicidadDestino}
                options={[
                  { label: "Mensual (M)", value: "1" },
                  { label: "Bimestral (B)", value: "2" },
                  { label: "Trimestral (T)", value: "3" },
                  { label: "Cuatrimestral (Q)", value: "4" },
                  { label: "Semestral (S)", value: "6" },
                  { label: "Anual (A)", value: "12" },
                ]}
              />
            </div>
          </div>

          {/* BOTÓN */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300 cursor-pointer"
          >
            Convertir Tasa
          </button>
        </div>

        {resultado !== null && (
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-8">Resultado</h2>
            <ResultCard
              label="Tasa Convertida"
              value={`${resultado.toFixed(4)}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RateConversion;
