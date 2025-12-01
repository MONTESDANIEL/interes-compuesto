import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import ResultCard from "../components/ResultCard";
import { ArrowRight } from "lucide-react";

const TasaAnticipada: React.FC = () => {
  const [tipoConversion, setTipoConversion] = useState("normal-a-anticipada");
  const [tasa, setTasa] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);

  const calcular = () => {
    const value = Number(tasa) / 100;
    if (!value) {
      alert("Ingresa una tasa válida");
      return;
    }

    let result = 0;

    if (tipoConversion === "normal-a-anticipada") {
      result = value / (1 + value);
    } else {
      if (value >= 1) {
        alert("La tasa anticipada debe ser menor al 100%");
        return;
      }
      result = value / (1 - value);
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
              onClick={() => setTipoConversion("normal-a-anticipada")}
              className={`p-6 rounded-xl border transition-all duration-300 text-left
              ${
                tipoConversion === "normal-a-anticipada"
                  ? "border-primary bg-primary/15 shadow-lg"
                  : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700/50"
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
              onClick={() => setTipoConversion("anticipada-a-normal")}
              className={`p-6 rounded-xl border transition-all duration-300 text-left
              ${
                tipoConversion === "anticipada-a-normal"
                  ? "border-primary bg-primary/15 shadow-lg"
                  : "border-neutral-700 bg-neutral-800 hover:bg-neutral-700/50"
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
          </div>

          <CustomInput value={tasa} placeholder="Tasa (%)" onChange={setTasa} />

          <div className="flex gap-4">
            <button
              onClick={calcular}
              className="flex-1 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-dark transition-colors duration-300"
            >
              Calcular
            </button>

            <button
              onClick={limpiar}
              className="flex-1 py-3 rounded-lg bg-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors duration-300"
            >
              Limpiar
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
