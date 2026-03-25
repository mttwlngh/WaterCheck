"use client";

interface QuickAddButtonsProps {
  onAdd: (amount: number) => void;
  isGoalReached: boolean;
}

const QUICK_AMOUNTS = [100, 250, 330, 500, 750] as const;

export function QuickAddButtons({ onAdd, isGoalReached }: QuickAddButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_AMOUNTS.map((amount) => (
        <button
          key={amount}
          onClick={() => onAdd(amount)}
          disabled={isGoalReached}
          className={`
            flex-1 min-w-[60px] px-3 py-2.5 rounded-xl
            text-xs font-semibold text-sky-600 bg-sky-50
            border border-sky-100
            hover:bg-sky-100 hover:border-sky-200 hover:text-sky-700
            active:scale-95
            transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
        >
          +{amount}
          <span className="ml-0.5 font-normal opacity-70">ml</span>
        </button>
      ))}
    </div>
  );
}
