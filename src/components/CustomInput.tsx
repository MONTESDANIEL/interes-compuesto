import React, { useEffect, useRef, useState } from "react";

interface CustomInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (raw: string, parsed: number) => void;
  format?: "money" | "none";
}

const groupThousands = (digits: string) => {
  if (!digits) return "";
  const noLeading = digits.replace(/^0+(?=\d)/, "");
  const n = noLeading === "" ? "0" : noLeading;
  try {
    return new Intl.NumberFormat("de-DE").format(Number(n));
  } catch {
    return n.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  className = "",
  value = "",
  onChange,
  format = "none",
}) => {
  const [internal, setInternal] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInternal(value ?? "");
  }, [value]);

  const displayValue =
    format === "money" ? groupThousands(internal.replace(/\D/g, "")) : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    if (raw.includes("-")) return;

    if (format === "money") {
      const digits = raw.replace(/\D/g, "");
      setInternal(digits);
      const parsed = digits === "" ? 0 : Number(digits);
      onChange?.(digits, parsed);
      window.requestAnimationFrame(() => {
        if (inputRef.current) {
          const len = (groupThousands(digits) || "").length;
          inputRef.current.setSelectionRange(len, len);
        }
      });
      return;
    }

    const cleaned = raw.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;

    setInternal(cleaned);
    const parsed = cleaned === "" || cleaned === "." ? 0 : Number(cleaned);
    onChange?.(cleaned, isNaN(parsed) ? 0 : parsed);
  };

  const handleBlur = () => {
    if (format === "none" && internal === ".") {
      setInternal("0.");
      onChange?.("0.", 0);
    }
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="
          w-full px-4 py-3 rounded-lg
          bg-neutral-700 text-neutral-100
          placeholder-neutral-400
          border border-neutral-600
          outline-none
          focus:border-neutral-500
          focus:bg-neutral-600
          transition-all duration-200
        "
      />
    </div>
  );
};

export default CustomInput;
