"use client";

import { useState } from "react";

interface WaterInputProps {
  onAdd: (amount: number) => void;
  isGoalReached: boolean;
}

export function WaterInput({ onAdd, isGoalReached }: WaterInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (val: string): number | null => {
    const num = parseInt(val, 10);
    if (!val.trim()) {
      setError("Bitte eine Menge eingeben.");
      return null;
    }
    if (isNaN(num) || !Number.isInteger(num)) {
      setError("Bitte eine ganze Zahl eingeben.");
      return null;
    }
    if (num <= 0) {
      setError("Die Menge muss größer als 0 ml sein.");
      return null;
    }
    if (num > 2000) {
      setError("Maximal 2000 ml pro Eintrag.");
      return null;
    }
    setError("");
    return num;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = validate(value);
    if (amount !== null) {
      onAdd(amount);
      setValue("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow digits
    if (val === "" || /^\d+$/.test(val)) {
      setValue(val);
      if (error) setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2.5">
        <div className="flex-1 relative">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleChange}
            placeholder="z.B. 300"
            disabled={isGoalReached}
            maxLength={4}
            className={`
              w-full px-4 py-3.5 pr-14 rounded-xl border text-base font-medium
              bg-white placeholder-slate-300 text-slate-700
              focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-red-300 bg-red-50/40" : "border-slate-200"}
            `}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
            ml
          </span>
        </div>
        <button
          type="submit"
          disabled={isGoalReached || !value}
          className={`
            min-w-[88px] px-5 py-3.5 rounded-xl text-sm font-semibold
            bg-sky-500 text-white shadow-sm shadow-sky-200
            hover:bg-sky-600 active:scale-95
            transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
            whitespace-nowrap
          `}
        >
          + Hinzufügen
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
      )}
    </form>
  );
}
