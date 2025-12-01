interface ResultBoxProps {
  label: string;
  value: number;
}

export default function ResultBox({ label, value }: ResultBoxProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-4">
      <h2 className="text-lg font-bold">{label}</h2>
      <p className="text-2xl font-semibold text-blue-600">{value.toFixed(2)}</p>
    </div>
  );
}
