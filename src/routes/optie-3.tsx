import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  Check,
  Sparkles,
  MapPin,
  CalendarDays,
  RotateCcw,
} from "lucide-react";
import { AuroraField } from "@/components/AuroraField";

export const Route = createFileRoute("/optie-3")({
  head: () => ({
    meta: [
      { title: "AiMELO Optie 3 — Digibeet of AI-kenner? (canvas-versie)" },
      {
        name: "description",
        content:
          "Optie 3 van de AiMELO-landingspagina: bepaal je AI-niveau van digibeet tot AI-kenner in drie vragen, met geanimeerd canvas-auroraveld en parallax.",
      },
      { property: "og:title", content: "AiMELO — Digibeet of AI-kenner?" },
      {
        property: "og:description",
        content:
          "Drie vragen bepalen jouw AI-niveau. Kom woensdag gratis meedoen in Almelo — elke woensdag 18:00–20:00.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Optie3,
});

const QUESTIONS = [
  {
    hook: "Vraag 1 van 3",
    question: "Hoe vaak gebruik jij AI in je werk?",
    options: [
      { label: "Nog nooit echt — ik kijk ernaar aan", score: 0 },
      { label: "Af en toe, als iemand het me laat zien", score: 1 },
      { label: "Wekelijks, voor vaste klussen", score: 2 },
      { label: "Dagelijks — het zit in mijn workflow", score: 3 },
    ],
  },
  {
    hook: "Vraag 2 van 3",
    question: "Wat doe jij als een tool nieuw is?",
    options: [
      { label: "Wachten tot het vanzelf overgaat", score: 0 },
      { label: "Even proberen, dan weer loslaten", score: 1 },
      { label: "Tutorials kijken en actief oefenen", score: 2 },
      { label: "Direct testen, limits opzoeken, delen met anderen", score: 3 },
    ],
  },
  {
    hook: "Vraag 3 van 3",
    question: "Welke uitspraak past het beste bij jou?",
    options: [
      { label: "AI is iets voor techneuten, niet voor mij", score: 0 },
      { label: "Ik ben benieuwd maar kom er niet aan toe", score: 1 },
      { label: "Ik bespaar er al uren per week mee", score: 2 },
      { label: "Ik bouw er processen en automatiseringen mee", score: 3 },
    ],
  },
];

const LEVELS = [
  {
    min: 0,
    name: "Nieuwsgierige starter",
    label: "Digibeet",
    text: "Perfect startpunt. Woensdag zie je in één avond wat AI jou concreet oplevert.",
  },
  {
    min: 3,
    name: "Voorzichtige gebruiker",
    label: "Digibeet",
    text: "Je proeft al wat. Woensdag krijg je structuur en de eerste echte trucs.",
  },
  {
    min: 6,
    name: "Praktische doener",
    label: "AI-kenner",
    text: "Je gebruikt AI al echt. Tijd om de slimme trucs van anderen te stelen.",
  },
  {
    min: 8,
    name: "AI-kenner",
    label: "AI-kenner",
    text: "Jij bent verder dan de rest. Kom woensdag je kennis delen én ophalen.",
  },
];

function levelFor(score: number) {
  let result = LEVELS[0]!;
  for (const l of LEVELS) if (score >= l.min) result = l;
  return result;
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 140,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 140,
    damping: 18,
  });

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="glass-card relative flex min-h-0 flex-col rounded-3xl p-5 sm:p-7"
    >
      {children}
    </motion.div>
  );
}

function Optie3() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = QUESTIONS[step] ?? QUESTIONS[0]!;
  const maxScore = QUESTIONS.length * 3;
  const level = useMemo(() => levelFor(score), [score]);
  const meterPct = Math.max(8, (score / maxScore) * 100);
  const progress = done ? 100 : (step / QUESTIONS.length) * 100;

  function pick(s: number) {
    setScore((v) => v + s);
    setTimeout(() => {
      if (step + 1 >= QUESTIONS.length) setDone(true);
      else setStep((v) => v + 1);
    }, 200);
  }

  function reset() {
    setStep(0);
    setScore(0);
    setDone(false);
  }

  return (
    <main className="grain-bg relative h-dvh w-full overflow-hidden text-foreground">
      <AuroraField />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4.5 w-4.5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Ai<span className="text-primary">MELO</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:gap-5">
            <span className="hidden items-center gap-1.5 sm:flex">
              <CalendarDays className="h-3.5 w-3.5" /> Elke woensdag · 18:00–20:00
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <MapPin className="h-3.5 w-3.5" /> Almelo &amp; omgeving
            </span>
            <span className="rounded-full border border-primary/40 px-2.5 py-1 font-medium text-primary">
              Gratis
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

        <div className="grid min-h-0 flex-1 items-center gap-8 py-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <section className="min-h-0">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              AI-community voor Almelo, Wierden, Borne, Rijssen &amp; Hengelo
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-display text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl"
            >
              Digibeet
              <br />
              of <span className="shimmer-text">AI-kenner</span>?
            </motion.h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
              Drie vragen bepalen jouw niveau. Geen verkooppraat, geen dure
              cursus — wel ondernemers die samen experimenteren.
            </p>
            <p className="mt-5 font-display text-lg font-semibold text-accent">
              Geen AI-expert? Welkom.
            </p>
            <ul className="mt-6 hidden gap-2 text-sm text-muted-foreground sm:grid">
              {[
                "3 vragen · 20 seconden",
                "Direct je AI-niveau",
                "Woensdagavond gratis meedoen",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <TiltCard>
            <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              {!done && (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {current.hook}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                    {current.question}
                  </h2>
                  <div className="mt-5 grid gap-2.5">
                    {current.options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => pick(opt.score)}
                        className="group flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-secondary"
                      >
                        {opt.label}
                        <ArrowRight className="h-4 w-4 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      onClick={() => {
                        setStep((s) => s - 1);
                      }}
                      className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Vorige vraag
                    </button>
                  )}
                </motion.div>
              )}

              {done && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Jouw AI-niveau
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                    {level.name}
                  </h2>

                  <div className="mt-5">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: "8%" }}
                        animate={{ width: `${meterPct}%` }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <span>Digibeet</span>
                      <span className="text-foreground/70">{level.label}</span>
                      <span>AI-kenner</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">
                    {level.text}
                  </p>

                  <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                    <a
                      href="https://wa.me/?text=Ik%20kom%20woensdag%20naar%20AiMELO%20in%20Almelo!"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-center font-display text-sm font-bold text-primary-foreground shadow-[0_0_32px_-6px] shadow-primary/60 transition-transform hover:scale-[1.01]"
                    >
                      Kom woensdag gratis meedoen
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                  <button
                    onClick={reset}
                    className="mt-3 flex w-full items-center justify-center gap-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Opnieuw testen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>
        </div>

        <footer className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span>AiMELO · woensdag 18:00–20:00 · Almelo</span>
          <span className="hidden sm:inline">
            Voor ZZP'ers, freelancers en nieuwsgierige professionals
          </span>
          <span className="flex gap-3">
            <Link to="/" className="underline underline-offset-4 hover:text-primary">
              Optie 1
            </Link>
            <Link
              to="/optie-2"
              className="underline underline-offset-4 hover:text-primary"
            >
              Optie 2
            </Link>
          </span>
        </footer>
      </div>
    </main>
  );
}
