import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col space-y-1" ref={ref}>
      <div className="relative">
        {/* Botón */}
        <button
          onClick={() => setOpen(!open)}
          className="
            w-full px-4 py-3 rounded-xl
            bg-neutral-700 text-neutral-200
            border border-neutral-600
            flex justify-between items-center
            transition-all duration-200
            hover:bg-neutral-600
            cursor-pointer
          "
        >
          <span>{selected ? selected.label : label}</span>

          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

        {/* Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full w-full mt-2 z-50 bg-neutral-700 rounded-xl shadow-xl border border-neutral-600 overflow-hidden"
            >
              <div className="overflow-y-auto h-full max-h-40 ">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange?.(opt.value);
                      setOpen(false);
                    }}
                    className="
                      w-full px-4 py-2 text-left
                      text-neutral-200
                      hover:bg-neutral-600
                      transition-all
                      cursor-pointer
                    "
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dropdown;
