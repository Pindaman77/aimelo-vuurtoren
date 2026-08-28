import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowRight,
  Check,
  Sparkles,
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
          "Bepaal je AI-niveau van digibeet tot AI-kenner in drie vragen, met geanimeerd canvas-veld en parallax.",
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
  component: Index,
});

const QUESTIONS = [
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
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  const score = answers.reduce((a, b) => a + b, 0);
  const level = LEVELS.find((l) => score <= l.max) ?? LEVELS[LEVELS.length - 1]!;
  const current = QUESTIONS[step] ?? QUESTIONS[0]!;
  const progress = done ? 100 : (step / QUESTIONS.length) * 100;

  function pick(s: number) {
    setAnswers((prev) => [...prev.slice(0, step), s]);
    setTimeout(() => {
      if (step === QUESTIONS.length - 1) setDone(true);
      else setStep((v) => v + 1);
    }, 160);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setDone(false);
  }

  return (
    <main
      className="grain-bg relative h-dvh w-full overflow-hidden text-foreground"
      onPointerMove={(e) => {
        if (reduce) return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <Blob x={sx} y={sy} depth={70} className="-left-32 top-1/4 h-[26rem] w-[26rem] bg-primary/12" />
      <Blob x={sx} y={sy} depth={-50} className="-right-24 bottom-0 h-[22rem] w-[22rem] bg-accent/12" />
      <Blob x={sx} y={sy} depth={30} className="left-1/2 top-1/2 h-[18rem] w-[18rem] bg-primary/8" />
      <Layer x={sx} y={sy} depth={18}>
        <AuroraField />
      </Layer>

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
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.div
              className="hidden items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 backdrop-blur sm:flex"
              animate={reduce ? {} : { boxShadow: ["0 0 0 0 oklch(0.87 0.2 124 / 0)", "0 0 0 10px oklch(0.87 0.2 124 / 0.14)", "0 0 0 0 oklch(0.87 0.2 124 / 0)"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <CalendarDays className="h-4 w-4 text-primary" strokeWidth={2} />
              <div className="flex flex-col leading-none">
                <span className="font-display text-xs font-bold uppercase tracking-wide text-primary">
                  De Woensdag
                </span>
                <span className="text-[11px] font-medium text-foreground/80">
                  18:00–20:00 · Almelo
                </span>
              </div>
            </motion.div>

            <motion.span
              className="rounded-full border border-primary/40 px-2.5 py-1 text-xs font-medium text-primary"
              animate={reduce ? {} : { opacity: [1, 0.55, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              Gratis
            </motion.span>
            <Link
              to="/optie-3"
              className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Optie 3
            </Link>
            <Link
              to="/optie-2"
              className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Optie 2
            </Link>
          </div>
        </motion.header>

        <div className="grid min-h-0 flex-1 items-center gap-8 py-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Layer x={sx} y={sy} depth={-14}>
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
              <h1 className="text-aura font-display text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
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
                Drie vragen bepalen jouw niveau. Geen verkooppraat, geen dure cursus — wel
                ondernemers die samen experimenteren.
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
          </Layer>

          <Layer x={sx} y={sy} depth={26}>
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
                    <Fireworks />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                      className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
                    >
                      <Sparkles className="h-4 w-4" />
                      Gefeliciteerd — je mag meedoen!
                    </motion.div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Jouw AI-niveau
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                      {level.title}
                    </h2>
                    <LevelMeter value={score} />
                    <p className="mt-4 text-sm text-muted-foreground">{level.line}</p>
                    <motion.a
                      href="https://aimelo.nl/aanmelden/2/"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="animate-pulse-ring mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 font-display text-sm font-bold text-primary-foreground"
                    >
                      Kom woensdag gratis meedoen <ArrowRight className="h-4 w-4" />
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
          </Layer>
        </div>

        <footer className="flex items-center justify-between border-t border-border pt-3 text-[11px]">
          <span className="flex items-center gap-2">
            <span className="font-display font-bold text-primary">De Woensdag</span>
            <span className="text-muted-foreground">18:00–20:00 · Almelo</span>
          </span>
          <span className="hidden text-muted-foreground sm:inline">
            Voor ZZP'ers, freelancers en nieuwsgierige professionals
          </span>
          <span className="flex gap-3 text-muted-foreground">
            <Link to="/optie-3" className="underline underline-offset-4 hover:text-primary">
              Optie 3
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

function Layer({
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

function Blob({
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
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, oklch(0.87 0.2 124 / 0.14), transparent 65%)`;

  return (
    <motion.section
      ref={ref as never}
      initial={{ opacity: 0, y: 26, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        gx.set(px * 100);
        gy.set(py * 100);
        rotateY.set((px - 0.5) * 9);
        rotateX.set(-(py - 0.5) * 9);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
        gx.set(50);
        gy.set(50);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
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

function Fireworks() {
  const reduce = useReducedMotion();
  const bursts = useMemo(() => {
    const colors = ["bg-primary", "bg-accent", "bg-primary/80", "bg-accent/80"];
    return Array.from({ length: 5 }, (_, i) => {
      const angleBase = Math.random() * Math.PI * 2;
      const originX = (Math.random() - 0.5) * 260;
      const originY = -(Math.random() * 120 + 40);
      return {
        id: i,
        delay: i * 0.18,
        originX,
        originY,
        particles: Array.from({ length: 18 }, (_, j) => {
          const angle = angleBase + (j / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
          const speed = Math.random() * 90 + 60;
          return {
            id: `${i}-${j}`,
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed + 30,
            color: colors[j % colors.length]!,
            size: Math.random() * 3 + 2,
          };
        }),
      };
    });
  }, []);

  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0">
      {bursts.map((burst) => (
        <div key={burst.id} className="absolute left-1/2 top-0">
          {burst.particles.map((p) => (
            <motion.span
              key={p.id}
              className={`absolute rounded-full ${p.color}`}
              style={{ width: p.size, height: p.size }}
              initial={{ opacity: 1, x: burst.originX, y: burst.originY, scale: 1 }}
              animate={{
                opacity: [1, 1, 0],
                x: burst.originX + p.x,
                y: burst.originY + p.y,
                scale: [1, 0.6, 0.2],
              }}
              transition={{
                duration: 1.6,
                delay: burst.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
