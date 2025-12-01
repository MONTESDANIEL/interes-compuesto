import {
  DollarSign,
  TrendingUp,
  Percent,
  RefreshCw,
  CalendarRange,
  BarChart3,
} from "lucide-react";

export default function HomeEconomica() {
  const tools = [
    {
      title: "Valor Presente (PV)",
      description: "Calcula cuánto vale hoy un monto futuro.",
      icon: <DollarSign className="w-12 h-12 text-primary" />,
      link: "/present-value",
    },
    {
      title: "Valor Futuro (FV)",
      description: "Proyecta un valor hacia el futuro con interés compuesto.",
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      link: "/future-value",
    },
    {
      title: "Tasa Anticipada",
      description: "Determina la tasa anticipado basado en la tasa normal.",
      icon: <Percent className="w-12 h-12 text-primary" />,
      link: "/advance-rate",
    },
    {
      title: "Conversión de Tasas",
      description: "Convierte tasas nominales, efectivas y periódicas.",
      icon: <RefreshCw className="w-12 h-12 text-primary" />,
      link: "/conversion-rate",
    },
    {
      title: "Anualidades",
      description:
        "Calcula pagos, valores presentes y futuros de rentas periódicas.",
      icon: <CalendarRange className="w-12 h-12 text-primary" />,
      link: "/annuities",
    },

    {
      title: "Amortización",
      description: "Genera la tabla completa con capital, interés y saldo.",
      icon: <BarChart3 className="w-12 h-12 text-primary" />,
      link: "/amortization",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-neutral-100 p-5">
      <div className="max-w-6xl mx-auto flex flex-col gap-12 py-10">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-primary drop-shadow-lg">
            Calculadora de Interés Compuesto
          </h1>
          <p className="text-xl opacity-90">
            Proyecto Final - Ingeniería Económica
          </p>
        </div>

        {/* CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.link}
              className="
                group p-8 rounded-2xl bg-white/8 border border-white/10
                backdrop-blur-xl shadow-xl transition-all duration-300
                hover:bg-white/12 hover:-translate-y-1
                hover:shadow-2xl cursor-pointer relative overflow-hidden
              "
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-105">
                {tool.icon}
              </div>

              <h2 className="text-2xl font-bold text-primary">{tool.title}</h2>

              <p className="text-neutral-300 mt-3 text-sm leading-relaxed">
                {tool.description}
              </p>
            </a>
          ))}
        </section>
      </div>
    </div>
  );
}
