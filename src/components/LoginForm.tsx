"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: sbError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (sbError) {
      setError(sbError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center px-5">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0" aria-hidden>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-100">
            <span className="text-sky-500 text-sm">💧</span>
            <span className="text-xs font-semibold text-sky-600 tracking-wide uppercase">
              Water Check
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Hydration Tracker
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Melde dich an, um deinen Fortschritt geräteübergreifend zu speichern.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center text-2xl">
                📬
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Check deine E-Mails!
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Wir haben einen Magic Link an{" "}
                  <span className="font-medium text-sky-500">{email}</span>{" "}
                  geschickt. Einfach draufklicken – fertig.
                </p>
              </div>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-xs text-slate-400 hover:text-sky-500 transition-colors"
              >
                Andere E-Mail verwenden
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">

              {/* ── Magic Link Form ── */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-slate-500 mb-1.5"
                  >
                    E-Mail-Adresse
                  </label>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="du@beispiel.de"
                    className={`
                      w-full px-4 py-3 rounded-xl border text-sm font-medium
                      bg-white placeholder-slate-300 text-slate-700
                      focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400
                      transition-all duration-200
                      ${error ? "border-red-300 bg-red-50/40" : "border-slate-200"}
                    `}
                  />
                  {error && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-3 rounded-xl text-sm font-semibold
                    bg-sky-500 text-white shadow-sm shadow-sky-200
                    hover:bg-sky-600 active:scale-95
                    transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Sende Link…
                    </>
                  ) : (
                    "Magic Link senden ✨"
                  )}
                </button>
              </form>

              <p className="text-center text-[11px] text-slate-400 leading-relaxed">
                Kein Passwort nötig. Du bekommst einen Einmal-Link per E-Mail.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
