"use client";

interface StatsCardProps {
  intake: number;
  remaining: number;
  percentage: number;
  goal: number;
  isGoalReached: boolean;
  onReset: () => void;
}

function StatItem({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-bold tracking-tight ${
            highlight ? "text-sky-500" : "text-slate-700"
          }`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-400">{unit}</span>
        )}
      </div>
    </div>
  );
}

export function StatsCard({
  intake,
  remaining,
  percentage,
  goal,
  isGoalReached,
  onReset,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-6">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Tagesfortschritt
          </span>
          <span
            className={`text-xs font-bold ${
              isGoalReached ? "text-green-500" : "text-sky-500"
            }`}
          >
            {intake} / {goal} ml
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isGoalReached
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-sky-400 to-blue-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <StatItem label="Getrunken" value={intake} unit="ml" highlight />
        <StatItem
          label="Verbleibend"
          value={isGoalReached ? 0 : remaining}
          unit="ml"
        />
        <StatItem
          label="Erreicht"
          value={`${percentage}%`}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Goal reached banner */}
      {isGoalReached && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
          <span className="text-xl">🎉</span>
          <div>
            <p className="text-sm font-semibold text-green-700">
              Tagesziel erreicht!
            </p>
            <p className="text-xs text-green-500">
              Großartig – du hast heute {goal} ml getrunken.
            </p>
          </div>
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={onReset}
        className="
          flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
          text-xs font-medium text-slate-400 border border-slate-200 bg-white
          hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50
          active:scale-98 transition-all duration-200
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Tagesstand zurücksetzen
      </button>
    </div>
  );
}
