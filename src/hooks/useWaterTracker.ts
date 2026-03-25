"use client";

import { useState, useEffect, useCallback } from "react";

const DAILY_GOAL = 3000;
const STORAGE_KEY = "watercheck_intake";
const DATE_KEY = "watercheck_date";

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function useWaterTracker() {
  const [intake, setIntake] = useState<number>(0);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount & reset if new day
  useEffect(() => {
    const today = getTodayString();
    const storedDate = localStorage.getItem(DATE_KEY);
    const storedIntake = localStorage.getItem(STORAGE_KEY);

    if (storedDate === today && storedIntake !== null) {
      setIntake(Math.min(parseInt(storedIntake, 10), DAILY_GOAL));
    } else {
      localStorage.setItem(DATE_KEY, today);
      localStorage.setItem(STORAGE_KEY, "0");
      setIntake(0);
    }
    setHydrated(true);
  }, []);

  // Persist intake changes
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, String(intake));
    }
  }, [intake, hydrated]);

  const addWater = useCallback((amount: number) => {
    if (amount <= 0 || isNaN(amount)) return;
    setIntake((prev) => Math.min(prev + amount, DAILY_GOAL));
  }, []);

  const reset = useCallback(() => {
    setIntake(0);
    localStorage.setItem(STORAGE_KEY, "0");
    localStorage.setItem(DATE_KEY, getTodayString());
  }, []);

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
