import React from "react";

const RateConversion: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 px-4 ">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 py-10">
        {/* TÍTULO */}
        <h1 className="text-4xl font-bold text-center text-primary">
          Conversión de Tasas
        </h1>

        {/* CARD PRINCIPAL */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-10 space-y-10">
          <h1 className="text-2xl font-semibold">Datos</h1>
        </div>
      </div>
    </div>
  );
};

export default RateConversion;
