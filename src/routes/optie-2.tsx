import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, RotateCcw, Zap, MapPin, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/optie-2")({
  head: () => ({
    meta: [
      { title: "AiMELO Optie 2 — Speel de AI-ladder | Almelo" },
      {
        name: "description",
        content:
          "Optie 2: klim in drie zetten de AI-ladder op en ontdek of je digibeet of AI-kenner bent. Woensdag 18:00–20:00 gratis in Almelo.",
      },
      { property: "og:title", content: "AiMELO Optie 2 — Speel de AI-ladder" },
      {
        property: "og:description",
        content:
          "Drie zetten, één score, één uitnodiging: woensdagavond gratis meedoen met de AiMELO-community in Almelo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OptieTwee,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const ROUNDS = [
  {
    tag: "Zet 1",
    question: "Waar sta je vandaag met AI?",
    options: [
      { label: "Ik kijk er van een afstandje naar", score: 0 },
      { label: "Ik heb het één keer geprobeerd", score: 1 },
      { label: "Ik gebruik het wekelijks", score: 2 },
      { label: "Het draait de hele dag mee", score: 3 },
    ],
  },
  {
    tag: "Zet 2",
    question: "Wat doe je er concreet mee?",
    options: [
      { label: "Nog niets, puur nieuwsgierig", score: 0 },
      { label: "Teksten en mailtjes", score: 1 },
      { label: "Offertes, content en research", score: 2 },
      { label: "Eigen prompts en automatiseringen", score: 3 },
    ],
  },
  {
    tag: "Zet 3",
    question: "Waarmee wil je woensdag naar huis?",
    options: [
      { label: "Eindelijk snappen waar het over gaat", score: 0 },
      { label: "Eén taak die morgen sneller gaat", score: 1 },
      { label: "Een werkwijze voor mijn klantwerk", score: 2 },
      { label: "Scherpe sparringpartners", score: 3 },
    ],
  },
];

const RUNGS = [
  { title: "Digibeet", line: "Startpunt. Precies de mensen voor wie deze avond bedacht is." },
  { title: "Meekijker", line: "Je hebt geproefd — woensdag wordt het een gewoonte." },
  { title: "Doener", line: "Je past AI al toe. Kom de trucs van anderen stelen." },
  { title: "AI-kenner", line: "Jij loopt voorop. Kom delen en op niveau sparren." },
];

function rungFor(total: number) {
  if (total <= 2) return 0;
  if (total <= 4) return 1;
  if (total <= 6) return 2;
  return 3;
}

function OptieTwee() {
  const reduce = useReducedMotion();
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const total = scores.reduce((a, b) => a + b, 0);
  const rungIndex = rungFor(total);
  const current = ROUNDS[round] ?? ROUNDS[0]!;

  function pick(score: number) {
    setScores((s) => [...s.slice(0, round), score]);
    if (round === ROUNDS.length - 1) setDone(true);
    else setRound((r) => r + 1);
  }

  function reset() {
    setRound(0);
    setScores([]);
    setDone(false);
  }

  return (
    <main className="grain-bg relative h-dvh w-full overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-5xl flex-col px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Ai<span className="text-primary">MELO</span>
            <span className="ml-2 rounded-full border border-accent/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
              Optie 2
            </span>
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
              <CalendarDays className="h-3.5 w-3.5" /> Woensdag 18:00–20:00
            </span>
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground md:inline-flex">
              <MapPin className="h-3.5 w-3.5" /> Almelo
            </span>
            <Link
              to="/"
              className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Optie 1
            </Link>
            <Link
              to="/optie-3"
              className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Optie 3
            </Link>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 items-center gap-8 py-6 md:grid-cols-[auto_1fr] md:gap-12">
          {/* De ladder */}
          <div className="flex flex-row justify-between gap-3 md:h-full md:max-h-[26rem] md:flex-col-reverse md:justify-between">
            {RUNGS.map((r, i) => {
              const active = done ? i === rungIndex : false;
              const reached = done && i <= rungIndex;
              return (
                <motion.div
                  key={r.title}
                  className="flex flex-1 items-center gap-3 md:flex-none"
                  animate={{ opacity: done ? (reached ? 1 : 0.35) : 0.6 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <motion.span
                    className={`h-1.5 rounded-full md:h-1.5 ${
                      reached ? "bg-primary" : "bg-secondary"
                    }`}
                    animate={{ width: active ? 72 : 40 }}
                    transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  />
                  <span
                    className={`font-display text-xs font-bold uppercase tracking-widest sm:text-sm ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {r.title}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Speelveld */}
          <section className="min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              {!done ? (
                <motion.div
                  key={`r-${round}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
                    <Zap className="h-3.5 w-3.5" /> {current.tag} van 3
                  </p>
                  <h1 className="mt-3 font-display text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
                    {current.question}
                  </h1>
                  <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                    {current.options.map((opt, i) => (
                      <motion.button
                        key={opt.label}
                        onClick={() => pick(opt.score)}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.3, ease: EASE }}
                        whileHover={reduce ? {} : { y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-2xl border border-border bg-secondary/40 px-4 py-4 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-secondary"
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                  {round > 0 && (
                    <button
                      onClick={() => setRound((r) => r - 1)}
                      className="mt-5 text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Vorige zet
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Jouw sport op de ladder
                  </p>
                  <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                    {RUNGS[rungIndex]!.title}
                  </h1>
                  <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                    {RUNGS[rungIndex]!.line}
                  </p>
                  <motion.a
                    href="https://wa.me/?text=Ik%20kom%20woensdag%20naar%20AiMELO%20in%20Almelo!"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-display text-sm font-bold text-primary-foreground"
                  >
                    Kom woensdag gratis meedoen <ArrowRight className="h-4 w-4" />
                  </motion.a>
                  <button
                    onClick={reset}
                    className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Opnieuw spelen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        <footer className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span>AiMELO · woensdag 18:00–20:00 · Almelo</span>
          <Link to="/" className="underline underline-offset-4 hover:text-primary">
            Vergelijk met optie 1
          </Link>
        </footer>
      </div>
    </main>
  );
}
