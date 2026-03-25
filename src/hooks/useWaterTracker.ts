"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const DAILY_GOAL = 3000;

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// ── localStorage helpers (fallback / optimistic cache) ──────────────────────
const LS_KEY = "watercheck_intake";
const LS_DATE = "watercheck_date";

function lsLoad(): number {
  if (typeof window === "undefined") return 0;
  const today = getTodayString();
  if (localStorage.getItem(LS_DATE) !== today) {
    localStorage.setItem(LS_DATE, today);
    localStorage.setItem(LS_KEY, "0");
    return 0;
  }
  return Math.min(parseInt(localStorage.getItem(LS_KEY) ?? "0", 10), DAILY_GOAL);
}

function lsSave(value: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_DATE, getTodayString());
  localStorage.setItem(LS_KEY, String(value));
}

// ── Hook ────────────────────────────────────────────────────────────────────
export function useWaterTracker(user: User | null) {
  const [intake, setIntake] = useState<number>(0);
  const [hydrated, setHydrated] = useState(false);
  const supabase = createClient();
  // Debounce timer for DB writes
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load today's intake on mount / when user changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (user) {
        // ── Authenticated: fetch from Supabase ──
        const { data, error } = await supabase
          .from("water_intake")
          .select("intake_ml")
          .eq("user_id", user.id)
          .eq("date", getTodayString())
          .maybeSingle();

        if (!cancelled) {
          if (!error && data) {
            setIntake(data.intake_ml);
            lsSave(data.intake_ml); // keep local cache in sync
          } else {
            // No row yet for today → 0
            setIntake(0);
            lsSave(0);
          }
          setHydrated(true);
        }
      } else {
        // ── Guest: use localStorage ──
        setIntake(lsLoad());
        setHydrated(true);
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Debounced Supabase write
  const persistToSupabase = useCallback(
    (newIntake: number) => {
      if (!user) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await supabase.rpc("upsert_water_intake", {
          p_date: getTodayString(),
          p_intake_ml: newIntake,
        });
      }, 600);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id]
  );

  const addWater = useCallback(
    (amount: number) => {
      if (amount <= 0 || isNaN(amount)) return;
      setIntake((prev) => {
        const next = Math.min(prev + amount, DAILY_GOAL);
        lsSave(next);
        persistToSupabase(next);
        return next;
      });
    },
    [persistToSupabase]
  );

  const reset = useCallback(async () => {
    setIntake(0);
    lsSave(0);
    if (user) {
      await supabase.rpc("upsert_water_intake", {
        p_date: getTodayString(),
        p_intake_ml: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const percentage = Math.round((intake / DAILY_GOAL) * 100);
  const remaining = Math.max(DAILY_GOAL - intake, 0);
  const isGoalReached = intake >= DAILY_GOAL;

  return {
    intake,
    percentage,
    remaining,
    isGoalReached,
    addWater,
    reset,
    hydrated,
    goal: DAILY_GOAL,
  };
}

