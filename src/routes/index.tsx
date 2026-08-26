import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  Check,
  Sparkles,
  Ticket,
  MapPin,
  CalendarDays,
  RotateCcw,
} from "lucide-react";
import { AuroraField } from "@/components/AuroraField";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AiMELO — Win je plek op de AI-avond in Almelo" },
      {
        name: "description",
        content:
          "Geen AI-expert? Welkom. Doe de 3-stappen challenge en win gratis toegang tot de AiMELO-avond, elke woensdag 18:00–20:00 in Almelo.",
      },
      { property: "og:title", content: "AiMELO — Wat doe jij met AI?" },
      {
        property: "og:description",
        content:
          "Drie vragen, één ticketcode. Gratis AI-community voor ondernemers uit Almelo, Wierden, Borne, Rijssen en Hengelo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Answers = { rol: string; gebruik: string; taak: string };

const STEPS = [
  {
    key: "rol" as const,
    hook: "Stap 1 · Wie ben jij?",
    question: "Wat past het beste bij jou?",
    options: [
      "ZZP'er / freelancer",
      "Ondernemer met team",
      "Medewerker in een organisatie",
      "Student of net gestart",
    ],
  },
  {
    key: "gebruik" as const,
    hook: "Stap 2 · Eerlijk zijn mag",
    question: "Waar gebruik jij AI nu al voor?",
    options: [
      "Teksten & e-mails",
      "Marketing & social",
      "Administratie & offertes",
      "Nog nergens voor — ik wil het ontdekken",
    ],
  },
  {
    key: "taak" as const,
    hook: "Stap 3 · Jouw winst",
    question: "Welke taak wil je woensdag makkelijker maken?",
    options: [
      "Minder tijd kwijt aan schrijven",
      "Sneller offertes & voorstellen",
      "Betere content, minder gedoe",
      "Slimmer werken met mijn klantdata",
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function Index() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [naam, setNaam] = useState("");
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  const code = useMemo(() => {
    const base = (naam || "AI").replace(/[^a-zA-Z]/g, "").toUpperCase();
    return `AIMELO-${(base + "WOE").slice(0, 3)}-${String(
      100 + ((naam.length + step * 37) % 899),
    )}`;
  }, [naam, step]);

  const current = STEPS[step] ?? STEPS[0]!;
  const progress = done ? 100 : (step / (STEPS.length + 1)) * 100;

  function pick(value: string) {
    setAnswers((a) => ({ ...a, [current.key]: value }));
    setTimeout(() => setStep((s) => s + 1), 160);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setNaam("");
    setDone(false);
  }

  return (
    <main className="grain-bg relative h-dvh w-full overflow-hidden text-foreground">
      <AuroraField />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-[26rem] w-[26rem] rounded-full bg-primary/12 blur-3xl"
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-accent/12 blur-3xl"
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 24, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

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
              animate={reduce ? undefined : { opacity: [1, 0.55, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              Gratis
            </motion.span>
          </div>
        </motion.header>

        <div className="grid min-h-0 flex-1 items-center gap-8 py-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <section className="min-h-0">
            <motion.p
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6, ease: EASE }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={reduce ? undefined : { scale: [1, 1.9, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              AI-community voor Almelo, Wierden, Borne, Rijssen &amp; Hengelo
            </motion.p>

            <h1 className="font-display text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
              {["Wat doe jij", "met AI?"].map((line, i) => (
                <motion.span
                  key={line}
                  className="block overflow-hidden"
                  initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.12 + i * 0.12, duration: 0.75, ease: EASE }}
                >
                  {i === 1 ? (
                    <>
                      met{" "}
                      <span className="shimmer-text bg-clip-text text-transparent">AI</span>?
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
              Geen verkooppraat. Geen dure cursus. Wel praktische voorbeelden en
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
                "Direct je persoonlijke ticketcode",
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

          <TiltCard>
            <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {!done && step < STEPS.length && (
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
                        key={opt}
                        onClick={() => pick(opt)}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * i, duration: 0.35, ease: EASE }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-border bg-secondary/50 px-4 py-3 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-secondary"
                      >
                        <span className="relative z-10">{opt}</span>
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

              {!done && step === STEPS.length && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                  transition={{ duration: 0.38, ease: EASE }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (naam.trim()) setDone(true);
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Laatste stap · Claim je plek
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                    Op wiens naam zetten we de stoel?
                  </h2>
                  <input
                    autoFocus
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                    placeholder="Je voornaam"
                    className="mt-5 w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                  />
                  <motion.button
                    type="submit"
                    disabled={!naam.trim()}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    className="animate-pulse-ring mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary px-4 py-3 font-display text-sm font-bold text-primary-foreground disabled:opacity-40"
                  >
                    <Ticket className="h-4 w-4" /> Genereer mijn ticketcode
                  </motion.button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Gratis. Geen inschrijfgeld, geen verkooppraat.
                  </p>
                </motion.form>
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
                    Gewonnen · je bent binnen
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                    Tot woensdag, {naam.trim()} 👋
                  </h2>
                  <motion.div
                    className="mt-4 rounded-2xl border border-dashed border-primary/50 bg-primary/10 p-4 text-center"
                    initial={{ rotateX: -35, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.1 }}
                  >
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      Jouw toegangscode
                    </p>
                    <p className="font-display text-2xl font-bold text-primary">{code}</p>
                  </motion.div>
                  <div className="mt-4 grid gap-1.5 text-sm text-muted-foreground">
                    {[
                      ["Jouw focus:", answers.taak],
                      ["Nu al met AI:", answers.gebruik],
                      ["Profiel:", answers.rol],
                    ].map(([label, val], i) => (
                      <motion.p
                        key={label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                      >
                        <span className="text-foreground">{label}</span> {val}
                      </motion.p>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <motion.a
                      href="https://wa.me/?text=Ik%20kom%20woensdag%20naar%20AiMELO%20in%20Almelo!"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 rounded-xl bg-primary px-4 py-3 text-center font-display text-sm font-bold text-primary-foreground"
                    >
                      Zet me op de herinnerlijst
                    </motion.a>
                    <motion.button
                      onClick={reset}
                      whileHover={{ rotate: -4 }}
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
                    >
                      <RotateCcw className="h-4 w-4" /> Opnieuw
                    </motion.button>
                  </div>
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
        </footer>
      </div>
    </main>
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
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        mx.set(px * 100);
        my.set(py * 100);
        ry.set((px - 0.5) * 9);
        rx.set(-(py - 0.5) * 9);
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
