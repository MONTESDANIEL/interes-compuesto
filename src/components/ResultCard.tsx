const ResultCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div
      className="
        w-full px-4 py-3 rounded-lg
        bg-neutral-700 text-neutral-100
        border border-neutral-600
        flex flex-col
        space-y-1
        transition-all duration-200
      "
    >
      <span className="text-neutral-400 text-sm">{label}</span>

      <span className="text-xl font-bold text-white">{value}</span>
    </div>
  );
};

export default ResultCard;
