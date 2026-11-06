import { Link } from "react-router-dom";
import siteConfig from "../config/siteConfig";
import WifiIcon from "./WifiIcon";

const speeds = [
  { label: "50", height: 14 },
  { label: "100", height: 26 },
  { label: "300", height: 48 },
  { label: "500", height: 72 },
  { label: "1000", height: 100 },
];

const perks = ["Unlimited data", "Free WiFi router", "Free installation"];

const Hero = () => (
  <section className="relative overflow-hidden bg-[#061a3d] text-white">
    {/* Glowing background shapes */}
    <div className="animate-glow pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent blur-3xl" />
    <div
      className="animate-glow pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand blur-3xl"
      style={{ animationDelay: "2s" }}
    />
    {/* Dotted texture */}
    <div
      className="pointer-events-none absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />

    <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-14 text-center md:pb-32 md:pt-20">
            {/* WiFi emblem */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-accent shadow-lg shadow-accent/20 backdrop-blur">
        <WifiIcon className="h-9 w-9" />
      </div>
      {/* Tagline */}
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent md:text-sm">
        {siteConfig.tagline}
      </p>

      {/* Badge */}
      <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
        Free router + free installation on every plan
      </span>

      {/* Headline */}
      <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
        Internet that keeps up with{" "}
        <span className="bg-gradient-to-r from-accent via-cyan-300 to-sky-400 bg-clip-text text-transparent">
          your whole home
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
        Blazing fibre speeds, unlimited data and a professionally installed
        WiFi router, so everyone in your home streams, works and plays at the
        same time.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/signup"
          className="rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-ink shadow-lg shadow-accent/30 transition hover:scale-105 hover:bg-teal-300"
        >
          Get Connected →
        </Link>
        <a
          href="#packages"
          className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
        >
          See All Plans
        </a>
      </div>

      {/* Perks */}
      <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-300">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">
              ✓
            </span>
            {p}
          </li>
        ))}
      </ul>

      {/* Speed card */}
      <div className="relative mx-auto mt-20 max-w-2xl">
        {/* Floating badges: z-20 keeps them above the glass card */}
        <div className="animate-float absolute -top-7 left-2 z-20 hidden rounded-2xl bg-white px-4 py-3 text-left text-ink shadow-xl md:block lg:-left-10">
          <p className="text-xs text-slate-500">Streaming</p>
          <p className="text-sm font-bold">4K / 8K ready</p>
        </div>
        <div className="animate-float-slow absolute -bottom-7 right-2 z-20 hidden rounded-2xl bg-white px-4 py-3 text-left text-ink shadow-xl md:block lg:-right-10">
          <p className="text-xs text-slate-500">Gaming</p>
          <p className="text-sm font-bold">Low-lag fibre</p>
        </div>

        <div className="relative z-10 rounded-3xl border border-white/15 bg-white/10 p-6 text-left shadow-2xl backdrop-blur-md md:p-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-300">
                <WifiIcon className="h-5 w-5 text-accent" />
                Pick your speed
              </p>
              <p className="mt-1 text-3xl font-bold md:text-4xl">
                Up to <span className="text-accent">1000</span> Mbps
              </p>
            </div>
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
              5 plans
            </span>
          </div>

          {/* Animated bars */}
          <div className="mt-8 flex h-44 items-end justify-between gap-3 md:gap-5">
            {speeds.map((s, i) => (
              <div
                key={s.label}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <div
                  className="animate-grow w-full rounded-t-xl bg-gradient-to-t from-brand via-sky-500 to-accent"
                  style={{
                    height: `${s.height}%`,
                    animationDelay: `${i * 150}ms`,
                  }}
                />
                <p className="mt-2 text-xs font-semibold text-slate-200">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-1 text-center text-[11px] text-slate-400">Mbps</p>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;