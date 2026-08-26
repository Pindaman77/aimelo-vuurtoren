import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
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

export const Route = createFileRoute("/optie-3")({
  head: () => ({
    meta: [
      { title: "AiMELO Optie 3 — Grafische canvas-versie" },
      {
        name: "description",
        content:
          "Optie 3 van de AiMELO-landingspagina: dezelfde 3-stappen challenge, met een geanimeerd canvas-auroraveld, parallax en 3D-tilt.",
      },
      { property: "og:title", content: "AiMELO Optie 3 — canvas & parallax" },
      {
        property: "og:description",
        content:
          "Grafisch opgewaardeerde variant met canvas-particles, parallaxlagen en één CTA voor de gratis woensdagavond in Almelo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Optie3,
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

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 18 });

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
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [naam, setNaam] = useState("");
  const [done, setDone] = useState(false);

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
    setTimeout(() => setStep((s) => s + 1), 180);
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
              Wat doe jij
              <br />
              met <span className="text-primary">AI</span>?
            </motion.h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
              Geen verkooppraat. Geen dure cursus. Wel praktische voorbeelden en
              ondernemers die samen experimenteren.
            </p>
            <p className="mt-5 font-display text-lg font-semibold text-accent">
              Geen AI-expert? Welkom.
            </p>
            <ul className="mt-6 hidden gap-2 text-sm text-muted-foreground sm:grid">
              {[
                "3 vragen · 20 seconden",
                "Direct je persoonlijke ticketcode",
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
                className="h-full rounded-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              {!done && step < STEPS.length && (
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
                        key={opt}
                        onClick={() => pick(opt)}
                        className="group flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-secondary"
                      >
                        {opt}
                        <ArrowRight className="h-4 w-4 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </button>
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
                  key="naam"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
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
                  <button
                    type="submit"
                    disabled={!naam.trim()}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-40"
                  >
                    <Ticket className="h-4 w-4" /> Genereer mijn ticketcode
                  </button>
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
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Gewonnen · je bent binnen
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                    Tot woensdag, {naam.trim()} 👋
                  </h2>
                  <div className="mt-4 rounded-2xl border border-dashed border-primary/50 bg-primary/10 p-4 text-center">
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      Jouw toegangscode
                    </p>
                    <p className="font-display text-2xl font-bold text-primary">{code}</p>
                  </div>
                  <div className="mt-4 grid gap-1.5 text-sm text-muted-foreground">
                    <p>
                      <span className="text-foreground">Jouw focus:</span> {answers.taak}
                    </p>
                    <p>
                      <span className="text-foreground">Nu al met AI:</span> {answers.gebruik}
                    </p>
                    <p>
                      <span className="text-foreground">Profiel:</span> {answers.rol}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href="https://wa.me/?text=Ik%20kom%20woensdag%20naar%20AiMELO%20in%20Almelo!"
                      className="flex-1 rounded-xl bg-primary px-4 py-3 text-center font-display text-sm font-bold text-primary-foreground"
                    >
                      Kom woensdag gratis meedoen
                    </a>
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
                    >
                      <RotateCcw className="h-4 w-4" /> Opnieuw
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>
        </div>

        <footer className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span>AiMELO · woensdag 18:00–20:00 · Almelo</span>
          <span className="hidden sm:inline">Optie 3 · grafische canvas-versie</span>
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
