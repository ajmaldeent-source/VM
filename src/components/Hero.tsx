"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { company, sectors } from "@/content/site";

// Lightweight stand-in for the WebGL hero: an SVG valve/pipeline schematic that
// tilts with the pointer. Swap for a React Three Fiber scene once 3D assets are approved.
export default function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="noise relative isolate overflow-hidden bg-ink-950 pb-24 pt-32 text-white sm:pt-40"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-safety-500/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-volt-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-safety-500" />
            Kuwait · {sectors.join(" · ")}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
          >
            Engineering
            <br />
            <span className="bg-gradient-to-r from-safety-400 via-safety-500 to-volt-400 bg-clip-text text-transparent">
              Excellence
            </span>{" "}
            Since {company.founded}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-xl text-lg text-slate-300"
          >
            {company.intro}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link href="/contact" className="btn-primary">
              Request a quote
              <span aria-hidden>→</span>
            </Link>
            <Link href="/services" className="btn border border-white/20 text-white hover:border-white/50">
              Explore services
            </Link>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-md [perspective:1000px] lg:max-w-none">
          <motion.div style={{ rotateX, rotateY }} className="relative aspect-square [transform-style:preserve-3d]">
            <div className="absolute inset-6 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-sm" />
            <ValveSchematic />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ValveSchematic() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="pipe" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#334155" />
          <stop offset=".5" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#e05a00" />
        </linearGradient>
      </defs>
      {/* pipeline */}
      <rect x="20" y="205" width="360" height="50" rx="6" fill="url(#pipe)" />
      <rect x="70" y="195" width="14" height="70" rx="3" fill="#475569" />
      <rect x="316" y="195" width="14" height="70" rx="3" fill="#475569" />
      {/* flow particles */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} r="4" cy="230" fill="#4cc3ff">
          <animate attributeName="cx" from="20" to="380" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* valve body */}
      <path d="M140 180 L200 230 L140 280 Z M260 180 L200 230 L260 280 Z" fill="url(#body)" />
      <rect x="192" y="120" width="16" height="90" fill="#cbd5e1" />
      {/* handwheel */}
      <g transform="translate(200 110)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite" />
          <circle r="46" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          {[0, 60, 120].map((a) => (
            <rect key={a} x="-3" y="-46" width="6" height="92" fill="#e2e8f0" transform={`rotate(${a})`} />
          ))}
          <circle r="10" fill="#ff6a00" />
        </g>
      </g>
      {/* gauge */}
      <g transform="translate(320 140)">
        <rect x="-4" y="20" width="8" height="45" fill="#64748b" />
        <circle r="30" fill="#0b1220" stroke="#94a3b8" strokeWidth="4" />
        <path d="M-20 10 A22 22 0 1 1 20 10" fill="none" stroke="#334155" strokeWidth="4" />
        <line x1="0" y1="0" x2="0" y2="-20" stroke="#ff6a00" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="-60;40;-10;60;-60" dur="8s" repeatCount="indefinite" />
        </line>
      </g>
      {/* labels */}
      <g fontFamily="monospace" fontSize="10" fill="#94a3b8">
        <text x="28" y="300">DN 200 · CL 600</text>
        <text x="272" y="300">PT-101</text>
      </g>
    </svg>
  );
}
