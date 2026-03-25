"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useWaterTracker } from "@/hooks/useWaterTracker";
import { StanleyCup } from "@/components/StanleyCup";
import { StatsCard } from "@/components/StatsCard";
import { WaterInput } from "@/components/WaterInput";
import { QuickAddButtons } from "@/components/QuickAddButtons";
import { LoginForm } from "@/components/LoginForm";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const supabase = createClient();

  // Listen to auth state changes
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const {
    intake,
    percentage,
    remaining,
    isGoalReached,
    addWater,
    reset,
    hydrated,
    goal,
  } = useWaterTracker(user);

  // ── Auth loading state ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Not logged in ──
  if (!user) {
    return <LoginForm />;
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const motivationText =
    percentage === 0
      ? "Starte deinen Tag mit einem großen Glas Wasser!"
      : percentage < 30
      ? "Gut gestartet! Denke daran, regelmäßig zu trinken."
      : percentage < 60
      ? "Halbzeit fast erreicht – weiter so!"
      : percentage < 80
      ? "Du bist auf der Zielgeraden. Nur noch ein bisschen!"
      : `Fast geschafft – nur noch ${remaining} ml bis zum Ziel!`;

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col">
      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-0"
        aria-hidden
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ════════════════════════════════
            MOBILE LAYOUT  (< lg)
        ════════════════════════════════ */}
        <div className="flex flex-col flex-1 lg:hidden">

          {/* Mobile Header */}
          <header className="px-5 pt-8 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100">
                <span className="text-sky-500 text-xs">💧</span>
                <span className="text-[11px] font-semibold text-sky-600 tracking-widest uppercase">
                  Water Check
                </span>
              </div>
              {/* User + Logout */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  title="Abmelden"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-800 tracking-tight">
              Hydration Tracker
            </h1>
          </header>

          {/* Mobile Progress Bar (full-width, prominent) */}
          <div className="mx-5 mt-3 mb-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Tagesfortschritt
              </span>
              <span
                className={`text-xs font-bold tabular-nums ${
                  isGoalReached ? "text-green-500" : "text-sky-500"
                }`}
              >
                {intake} / {goal} ml
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
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

          {/* Mobile scrollable body */}
          <div className="flex-1 overflow-y-auto pb-44 px-5 pt-4 flex flex-col gap-4">

            {/* Cup + Stats side by side on mobile */}
            <div className="flex items-center gap-4">
              {/* Cup – compact on mobile */}
              <div className="flex-shrink-0">
                <StanleyCup percentage={percentage} isGoalReached={isGoalReached} mobile />
              </div>

              {/* Mini stats next to cup */}
              <div className="flex-1 flex flex-col gap-3">
                <MobileStat
                  label="Getrunken"
                  value={`${intake}`}
                  unit="ml"
                  color="text-sky-500"
                />
                <MobileStat
                  label="Verbleibend"
                  value={`${isGoalReached ? 0 : remaining}`}
                  unit="ml"
                  color="text-slate-600"
                />
                <MobileStat
                  label="Erreicht"
                  value={`${percentage}%`}
                  color={isGoalReached ? "text-green-500" : "text-slate-600"}
                />

                {/* Reset button (mobile, compact) */}
                <button
                  onClick={reset}
                  className="
                    mt-1 flex items-center gap-1.5 text-xs font-medium
                    text-slate-400 hover:text-rose-500
                    transition-colors duration-200 active:scale-95
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Zurücksetzen
                </button>
              </div>
            </div>

            {/* Goal reached banner */}
            {isGoalReached && (
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-2xl border border-green-100">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-sm font-semibold text-green-700">Tagesziel erreicht!</p>
                  <p className="text-xs text-green-500">Großartig – {goal} ml heute getrunken.</p>
                </div>
              </div>
            )}

            {/* Motivation tip */}
            {!isGoalReached && (
              <div className="px-4 py-3 rounded-xl bg-sky-50/80 border border-sky-100 flex items-start gap-2.5">
                <span className="text-sm mt-0.5">💡</span>
                <p className="text-xs text-sky-600/80 leading-relaxed">{motivationText}</p>
              </div>
            )}
          </div>

          {/* ── Sticky Bottom Action Bar (mobile) ── */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] px-5 pt-3 safe-bottom">
            {/* Quick amounts */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[100, 250, 330, 500, 750].map((amount) => (
                <button
                  key={amount}
                  onClick={() => addWater(amount)}
                  disabled={isGoalReached}
                  className="
                    flex flex-col items-center justify-center py-2.5 rounded-xl
                    bg-sky-50 border border-sky-100
                    text-sky-600 font-semibold
                    text-[11px] leading-tight
                    active:scale-95 active:bg-sky-100
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-150
                  "
                >
                  <span>+{amount}</span>
                  <span className="text-[10px] font-normal opacity-60">ml</span>
                </button>
              ))}
            </div>

            {/* Manual input */}
            <WaterInput onAdd={addWater} isGoalReached={isGoalReached} />
          </div>
        </div>

        {/* ════════════════════════════════
            DESKTOP LAYOUT  (>= lg)
        ════════════════════════════════ */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1">
          {/* Desktop Header */}
          <header className="px-8 pt-8 pb-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              {/* Brand */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-100">
                  <span className="text-sky-500 text-sm">💧</span>
                  <span className="text-xs font-semibold text-sky-600 tracking-wide uppercase">
                    Water Check
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight ml-1">
                  Hydration Tracker
                </h1>
              </div>
              {/* User info + logout */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-[10px] font-bold text-sky-600 uppercase">
                    {user.email?.[0]}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 border border-slate-200 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Abmelden
                </button>
              </div>
            </div>
          </header>

          {/* Desktop Main */}
          <main className="flex-1 px-5 py-6 max-w-5xl mx-auto w-full">
            <div className="flex gap-12 items-start justify-center">
              {/* Cup */}
              <div className="flex flex-col items-center gap-4 pt-4">
                <StanleyCup percentage={percentage} isGoalReached={isGoalReached} />
              </div>

              {/* Right column */}
              <div className="w-full max-w-sm flex flex-col gap-4">
                <StatsCard
                  intake={intake}
                  remaining={remaining}
                  percentage={percentage}
                  goal={goal}
                  isGoalReached={isGoalReached}
                  onReset={reset}
                />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700">Wasser hinzufügen</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Gib die Menge manuell ein oder wähle eine Schnellmenge.
                    </p>
                  </div>
                  <WaterInput onAdd={addWater} isGoalReached={isGoalReached} />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2.5">
                      Schnellmengen
                    </p>
                    <QuickAddButtons onAdd={addWater} isGoalReached={isGoalReached} />
                  </div>
                </div>

                {!isGoalReached && (
                  <div className="px-4 py-3.5 rounded-xl bg-sky-50/70 border border-sky-100/80 flex items-start gap-3">
                    <span className="text-base mt-0.5">💡</span>
                    <p className="text-xs text-sky-600/80 leading-relaxed">{motivationText}</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          <footer className="px-6 py-5 text-center">
            <p className="text-xs text-slate-300 tracking-wide">
              WaterCheck · Bleib hydratisiert, jeden Tag.
            </p>
          </footer>
        </div>

      </div>
    </div>
  );
}

// ── Helper: compact stat for mobile ──
function MobileStat({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit?: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-bold tabular-nums tracking-tight ${color}`}>
          {value}
        </span>
        {unit && (
          <span className="text-[11px] font-medium text-slate-400">{unit}</span>
        )}
      </div>
    </div>
  );
}
