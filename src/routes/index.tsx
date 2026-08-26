import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AiMELO — Digibeet of AI-kenner? Doe de test" },
      {
        name: "description",
        content:
          "Drie vragen bepalen jouw AI-niveau: van digibeet tot AI-kenner. Kom woensdag 18:00–20:00 gratis meedoen in Almelo.",
      },
      { property: "og:title", content: "Digibeet of AI-kenner?" },
      {
        property: "og:description",
        content:
          "Test in 20 seconden jouw AI-niveau en kom woensdagavond gratis meedoen met de AiMELO-community in Almelo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    hook: "Stap 1 · Nulmeting",
    question: "Hoe vaak gebruik jij AI in je werk?",
    options: [
      { label: "Nog nooit geprobeerd", score: 0 },
      { label: "Een keertje gespeeld", score: 1 },
      { label: "Af en toe, als ik eraan denk", score: 2 },
      { label: "Elke dag, het staat open", score: 3 },
    ],
  },
  {
    hook: "Stap 2 · Praktijk",
    question: "Wat lukt je nu al met AI?",
    options: [
      { label: "Ik weet niet waar ik moet beginnen", score: 0 },
      { label: "Een mailtje of tekstje laten schrijven", score: 1 },
      { label: "Content, offertes en samenvattingen", score: 2 },
      { label: "Eigen prompts, tools en automatiseringen", score: 3 },
    ],
  },
  {
    hook: "Stap 3 · Ambitie",
    question: "Wat wil je woensdag halen?",
    options: [
      { label: "Snappen waar iedereen het over heeft", score: 0 },
      { label: "Eén concrete taak makkelijker maken", score: 1 },
      { label: "Slimmer werken met mijn klantdata", score: 2 },
      { label: "Sparren op niveau met andere makers", score: 3 },
    ],
  },
];

const LEVELS = [
  {
    max: 2,
    title: "Nieuwsgierige starter",
    line: "Je bent nog digibeet op AI-gebied — en precies daarvoor bestaat deze avond.",
  },
  {
    max: 4,
    title: "Voorzichtige gebruiker",
    line: "Je hebt geproefd. Woensdag maak je er een vaste werkgewoonte van.",
  },
  {
    max: 6,
    title: "Praktische doener",
    line: "Je gebruikt AI al echt. Tijd om de slimme trucs van anderen te stelen.",
  },
  {
    max: 9,
    title: "AI-kenner",
    line: "Jij bent verder dan de meesten. Kom je kennis delen en zelf sparren.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function Index() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  // Parallax pointer field
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });

  const total = scores.reduce((a, b) => a + b, 0);
  const level = LEVELS.find((l) => total <= l.max) ?? LEVELS[LEVELS.length - 1]!;
  const current = STEPS[step] ?? STEPS[0]!;
  const progress = done ? 100 : (step / STEPS.length) * 100;

  function pick(score: number) {
    setScores((s) => [...s.slice(0, step), score]);
    setTimeout(() => {
      if (step === STEPS.length - 1) setDone(true);
      else setStep((s) => s + 1);
    }, 160);
  }

  function reset() {
    setStep(0);
    setScores([]);
    setDone(false);
  }

  return (
    <main
      className="grain-bg relative h-dvh w-full overflow-hidden text-foreground"
      onPointerMove={(e) => {
        if (reduce) return;
        px.set(e.clientX / window.innerWidth - 0.5);
        py.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* Parallax depth layers */}
      <Layer x={sx} y={sy} depth={70} className="-left-32 top-1/4 h-[26rem] w-[26rem] bg-primary/12" />
      <Layer x={sx} y={sy} depth={-50} className="-right-24 bottom-0 h-[22rem] w-[22rem] bg-accent/12" />
      <Layer x={sx} y={sy} depth={30} className="left-1/2 top-1/2 h-[18rem] w-[18rem] bg-primary/8" />
      <ParallaxWrap x={sx} y={sy} depth={18}>
        <AuroraField />
      </ParallaxWrap>

      <div className="relative mx-auto flex h-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-7">
        <motion.header
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
            >
              <Sparkles className="h-4.5 w-4.5" strokeWidth={2.5} />
            </motion.span>
            <span className="font-display text-lg font-bold tracking-tight">
              Ai<span className="text-primary">MELO</span>
            </span>
          </div>
          <div className="hidden items-center gap-5 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Elke woensdag · 18:00–20:00
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Almelo &amp; omgeving
            </span>
            <motion.span
              className="rounded-full border border-primary/40 px-2.5 py-1 font-medium text-primary"
              animate={reduce ? {} : { opacity: [1, 0.55, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              Gratis
            </motion.span>
          </div>
        </motion.header>

        <div className="grid min-h-0 flex-1 items-center gap-8 py-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <ParallaxWrap x={sx} y={sy} depth={-14}>
            <section className="min-h-0">
              <motion.p
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.6, ease: EASE }}
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  animate={reduce ? {} : { scale: [1, 1.9, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                AI-community voor Almelo, Wierden, Borne, Rijssen &amp; Hengelo
              </motion.p>

              <h1 className="font-display text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
                {["Digibeet", "of AI-kenner?"].map((line, i) => (
                  <motion.span
                    key={line}
                    className="block"
                    initial={{ opacity: 0, y: "0.4em", filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.12 + i * 0.12, duration: 0.75, ease: EASE }}
                  >
                    {i === 1 ? (
                      <>
                        of{" "}
                        <span className="shimmer-text bg-clip-text text-transparent">
                          AI-kenner
                        </span>
                        ?
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.6, ease: EASE }}
              >
                Drie vragen bepalen jouw niveau. Geen verkooppraat, geen dure
                cursus — wel ondernemers die samen experimenteren.
              </motion.p>
              <motion.p
                className="mt-5 font-display text-lg font-semibold text-accent"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.6, ease: EASE }}
              >
                Geen AI-expert? Welkom.
              </motion.p>

              <ul className="mt-6 hidden gap-2 text-sm text-muted-foreground sm:grid">
                {[
                  "3 vragen · 20 seconden",
                  "Direct je AI-niveau",
                  "Woensdagavond gratis meedoen",
                ].map((t, i) => (
                  <motion.li
                    key={t}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.09, duration: 0.5, ease: EASE }}
                  >
                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                    {t}
                  </motion.li>
                ))}
              </ul>
            </section>
          </ParallaxWrap>

          <ParallaxWrap x={sx} y={sy} depth={26}>
            <TiltCard>
              <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {!done && (
                  <motion.div
                    key={`q-${step}`}
                    initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                    transition={{ duration: 0.38, ease: EASE }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {current.hook}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                      {current.question}
                    </h2>
                    <div className="mt-5 grid gap-2.5">
                      {current.options.map((opt, i) => (
                        <motion.button
                          key={opt.label}
                          onClick={() => pick(opt.score)}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.06 * i, duration: 0.35, ease: EASE }}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-border bg-secondary/50 px-4 py-3 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-secondary"
                        >
                          <span className="relative z-10">{opt.label}</span>
                          <ArrowRight className="relative z-10 h-4 w-4 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        </motion.button>
                      ))}
                    </div>
                    {step > 0 && (
                      <button
                        onClick={() => setStep((s) => s - 1)}
                        className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Vorige vraag
                      </button>
                    )}
                  </motion.div>
                )}

                {done && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="relative"
                  >
                    <Confetti />
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Jouw AI-niveau
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                      {level.title}
                    </h2>

                    <LevelMeter value={total} />

                    <p className="mt-4 text-sm text-muted-foreground">{level.line}</p>

                    <motion.a
                      href="https://wa.me/?text=Ik%20kom%20woensdag%20naar%20AiMELO%20in%20Almelo!"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="animate-pulse-ring mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 font-display text-sm font-bold text-primary-foreground"
                    >
                      Kom woensdag gratis meedoen{" "}
                      <ArrowRight className="h-4 w-4" />
                    </motion.a>
                    <button
                      onClick={reset}
                      className="mx-auto mt-3 flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Opnieuw testen
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </TiltCard>
          </ParallaxWrap>
        </div>

        <footer className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span>AiMELO · woensdag 18:00–20:00 · Almelo</span>
          <Link to="/optie-2" className="underline underline-offset-4 hover:text-primary">
            Bekijk optie 2
          </Link>
        </footer>
      </div>
    </main>
  );
}

function LevelMeter({ value }: { value: number }) {
  const pct = Math.round((value / 9) * 100);
  return (
    <div className="mt-5">
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, 8)}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.15 }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
        <span>Digibeet</span>
        <span>AI-kenner</span>
      </div>
    </div>
  );
}

function ParallaxWrap({
  x,
  y,
  depth,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  children: React.ReactNode;
}) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div style={{ x: tx, y: ty }} className="min-h-0">
      {children}
    </motion.div>
  );
}

function Layer({
  x,
  y,
  depth,
  className,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className?: string;
}) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div
      aria-hidden
      style={{ x: tx, y: ty }}
      className={`pointer-events-none absolute rounded-full blur-3xl ${className ?? ""}`}
    />
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, oklch(0.87 0.2 124 / 0.14), transparent 65%)`;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 26, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width;
        const cy = (e.clientY - r.top) / r.height;
        mx.set(cx * 100);
        my.set(cy * 100);
        ry.set((cx - 0.5) * 9);
        rx.set(-(cy - 0.5) * 9);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        mx.set(50);
        my.set(50);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className="glass-card relative flex min-h-0 flex-col rounded-3xl p-5 sm:p-7"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{ background: glow }}
      />
      <div className="relative">{children}</div>
    </motion.section>
  );
}

function Confetti() {
  const reduce = useReducedMotion();
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 320,
        y: -(Math.random() * 200 + 60),
        r: Math.random() * 360,
        d: Math.random() * 0.3,
        c: i % 3 === 0 ? "bg-accent" : "bg-primary",
      })),
    [],
  );
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0">
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className={`absolute left-1/2 top-0 h-1.5 w-1.5 rounded-[2px] ${b.c}`}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: b.x, y: b.y, rotate: b.r }}
          transition={{ duration: 1.4, delay: b.d, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
