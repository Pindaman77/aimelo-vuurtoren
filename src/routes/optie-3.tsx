import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, RotateCcw, MapPin, CalendarDays, Sparkles } from "lucide-react";

export const Route = createFileRoute("/optie-3")({
  head: () => ({
    meta: [
      { title: "AiMELO Optie 3 — Schuif jezelf op de AI-schaal | Almelo" },
      {
        name: "description",
        content:
          "Optie 3: schuif in drie bewegingen jezelf op de AI-schaal van digibeet tot AI-kenner. Woensdag 18:00–20:00 gratis in Almelo.",
      },
      { property: "og:title", content: "AiMELO Optie 3 — Schuif jezelf op de AI-schaal" },
      {
        property: "og:description",
        content:
          "Drie schuiven, direct je AI-profiel en één uitnodiging: woensdagavond gratis meedoen in Almelo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OptieDrie,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const SLIDERS = [
  {
    key: "gebruik",
    label: "Hoe vaak gebruik je AI?",
    left: "Nooit",
    right: "Dagelijks",
  },
  {
    key: "diepte",
    label: "Hoe ver ga je erin?",
    left: "Alleen gehoord",
    right: "Eigen automatiseringen",
  },
  {
    key: "lef",
    label: "Hoeveel wil je woensdag ophalen?",
    left: "Rustig kijken",
    right: "Direct toepassen",
  },
] as const;

const LEVELS = [
  { title: "Digibeet", line: "Startpunt. Precies de mensen voor wie deze avond bedacht is." },
  { title: "Meekijker", line: "Je hebt geproefd — woensdag wordt het een gewoonte." },
  { title: "Doener", line: "Je past AI al toe. Kom de trucs van anderen stelen." },
  { title: "AI-kenner", line: "Jij loopt voorop. Kom delen en op niveau sparren." },
];

function OptieDrie() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<number[]>([20, 20, 50]);
  const [touched, setTouched] = useState(false);

  const pct = useMemo(
    () => Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    [values]
  );
  const levelIndex = pct < 25 ? 0 : pct < 50 ? 1 : pct < 75 ? 2 : 3;
  const level = LEVELS[levelIndex]!;

  function setAt(i: number, v: number) {
    setTouched(true);
    setValues((prev) => prev.map((p, idx) => (idx === i ? v : p)));
  }

  return (
    <main className="grain-bg relative h-dvh w-full overflow-hidden text-foreground">
      <motion.div
        className="pointer-events-none absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl"
        animate={reduce ? {} : { scale: 1 + pct / 200, opacity: 0.5 + pct / 300 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      />

      <div className="relative mx-auto flex h-full max-w-5xl flex-col px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Ai<span className="text-primary">MELO</span>
            <span className="ml-2 rounded-full border border-accent/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
              Optie 3
            </span>
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <CalendarDays className="h-3.5 w-3.5" /> Woensdag 18:00–20:00
            </span>
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <MapPin className="h-3.5 w-3.5" /> Almelo
            </span>
            <Link
              to="/"
              className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Optie 1
            </Link>
            <Link
              to="/optie-2"
              className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Optie 2
            </Link>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 items-center gap-8 py-6 md:grid-cols-2 md:gap-12">
          <section>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Schuif in 3 bewegingen
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-[1.05] sm:text-4xl">
              Digibeet of AI-kenner?
            </h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Sleep de schuiven. Je profiel verandert live mee.
            </p>

            <div className="mt-7 space-y-5">
              {SLIDERS.map((s, i) => (
                <div key={s.key}>
                  <label
                    htmlFor={s.key}
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    {s.label}
                  </label>
                  <input
                    id={s.key}
                    type="range"
                    min={0}
                    max={100}
                    value={values[i]}
                    onChange={(e) => setAt(i, Number(e.target.value))}
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>{s.left}</span>
                    <span>{s.right}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-3xl border border-border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {touched ? "Jouw profiel" : "Schuif om te starten"}
            </p>
            <motion.h2
              key={level.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-2 font-display text-4xl font-bold sm:text-5xl"
            >
              {level.title}
            </motion.h2>
            <p className="mt-2 text-sm text-muted-foreground">{level.line}</p>

            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>Digibeet</span>
                <span className="font-semibold text-primary">{pct}%</span>
                <span>AI-kenner</span>
              </div>
            </div>

            <motion.a
              href="https://wa.me/?text=Ik%20kom%20woensdag%20naar%20AiMELO%20in%20Almelo!"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-display text-sm font-bold text-primary-foreground"
            >
              Kom woensdag gratis meedoen <ArrowRight className="h-4 w-4" />
            </motion.a>
            <button
              onClick={() => {
                setValues([20, 20, 50]);
                setTouched(false);
              }}
              className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Opnieuw
            </button>
          </section>
        </div>

        <footer className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span>AiMELO · woensdag 18:00–20:00 · Almelo</span>
          <span className="flex gap-3">
            <Link to="/" className="underline underline-offset-4 hover:text-primary">
              Optie 1
            </Link>
            <Link to="/optie-2" className="underline underline-offset-4 hover:text-primary">
              Optie 2
            </Link>
          </span>
        </footer>
      </div>
    </main>
  );
}
