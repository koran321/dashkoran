# 🚀 Agency OS — Master Build Prompt
## Animation & UI Upgrade for Next.js 14 + Vercel

---

You are building **Agency OS** — a premium, bilingual (English + Bengali) academic services agency dashboard. The project is already scaffolded in **Next.js 14 App Router** with **TypeScript**, **Tailwind CSS**, and **MongoDB** via serverless API routes deployed on **Vercel**. Do not change the architecture or database layer.

Your job is to apply a **world-class animation and design system** across every module using the stack below. Every interaction should feel alive, intentional, and premium. Think Vercel's dashboard meets a high-end agency site.

---

## 🏗️ Project Architecture (Do Not Change)

- **Framework**: Next.js 14 App Router, TypeScript
- **Styling**: Tailwind CSS — Glassmorphism + Premium Dark Mode
- **Database**: MongoDB via serverless API routes (Vercel-compatible, no `fs`, no long-lived connections — use `mongoose` with connection caching pattern)
- **State**: React `useState` / `useEffect`
- **Hosting**: Vercel (serverless — all `/app/api/` routes must be Edge or Node.js serverless functions, no server-side long polling)

---

## 🎨 Design System

### Theme
- **Mode**: Dark-first. Deep navy-black (`#050816`) base, glass cards with `backdrop-filter: blur(16px)`, subtle white/blue borders at 10–15% opacity.
- **Accent**: Electric indigo `#6366f1` primary, cyan `#22d3ee` secondary, emerald `#10b981` for success/earnings.
- **Typography**: Use `Clash Display` (headings) + `Satoshi` (body) via `next/font/local` or CDN. These give a premium editorial feel.
- **Glass Cards**: `bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl` — consistent across all modules.
- **Noise texture overlay**: Add a subtle SVG noise grain at 3–5% opacity over the background for depth.

---

## 📦 Animation Stack — Install All

```bash
npm install framer-motion gsap @gsap/react lenis @studio-freight/lenis react-intersection-observer
```

---

## ✨ Animation Specifications

### 1. Global Smooth Scroll — Lenis
Wrap the entire app in a Lenis smooth scroll provider in `app/layout.tsx`:
```tsx
// lib/lenis.tsx
'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smooth: true })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
}
```
Use in `app/layout.tsx` via a `<SmoothScrollProvider>` client component.

---

### 2. Page Entry — Staggered Reveal (Framer Motion)
Every page uses this pattern. Cards, stats, and list items flow in one by one:
```tsx
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

// Usage
<motion.div variants={container} initial="hidden" animate="show">
  {cards.map(card => (
    <motion.div key={card.id} variants={item}>
      {/* card content */}
    </motion.div>
  ))}
</motion.div>
```
Apply to: Dashboard stats, Kanban columns, Writer cards, Client list rows, Expense rows.

---

### 3. Tab / Route Transitions (Framer Motion AnimatePresence)
Wrap page content so switching between Dashboard / Clients / Writers / Finance slides smoothly:
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* tab content */}
  </motion.div>
</AnimatePresence>
```

---

### 4. Magnetic Buttons (Framer Motion + useMotionValue)
All primary CTA buttons (Save, Add Writer, Generate Invoice, Update) should react to mouse proximity:
```tsx
'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function MagneticButton({ children, ...props }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
```

---

### 5. Kanban Drag & Drop (Framer Motion Drag)
Upgrade the existing Kanban board with native Framer Motion drag. Each card should:
- Lift with a shadow + scale on drag start: `whileDrag={{ scale: 1.04, boxShadow: '0 24px 48px rgba(99,102,241,0.3)', zIndex: 50 }}`
- Animate to new column with a spring transition
- Use `layoutId` for shared-element transitions when moving cards between columns

```tsx
<motion.div
  layout
  layoutId={`card-${task.id}`}
  drag
  dragConstraints={columnRef}
  dragElastic={0.12}
  whileDrag={{ scale: 1.04, rotate: 1.5 }}
  transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
>
  {/* task card */}
</motion.div>
```

---

### 6. Number Counter Animation (Framer Motion useMotionValue)
Dashboard stats (Total Earned, Expected, Net Balance) should count up on page load:
```tsx
import { useMotionValue, useSpring, useEffect } from 'framer-motion'

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 80, damping: 18 })
  const [display, setDisplay] = useState(0)

  useEffect(() => { mv.set(value) }, [value])
  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring])

  return <span>{display.toLocaleString()}</span>
}
```

---

### 7. GSAP ScrollTrigger — Section Reveals
For any full-page scrollable sections (Financial overview, writer list), use GSAP ScrollTrigger for scroll-linked entrance animations:
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ScrollReveal({ children }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return <div ref={ref}>{children}</div>
}
```

---

### 8. Micro-reactions — Icon Hover & Click
All icons (edit, delete, view, add) should have subtle spring reactions:
```tsx
// Bounce on hover
<motion.div whileHover={{ scale: 1.2, rotate: 8 }} whileTap={{ scale: 0.85 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
  <EditIcon />
</motion.div>

// Spin on click (e.g. refresh icon)
<motion.div animate={{ rotate: isLoading ? 360 : 0 }} transition={{ repeat: isLoading ? Infinity : 0, duration: 0.8, ease: 'linear' }}>
  <RefreshIcon />
</motion.div>
```

---

### 9. Modal / Drawer Animations
All modals (Add Client, Add Writer, Invoice Preview, Security Gate) should use:
```tsx
// Backdrop
<motion.div
  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
/>

// Modal panel (slides up from bottom, scales in)
<motion.div
  initial={{ opacity: 0, scale: 0.92, y: 40 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.94, y: 20 }}
  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
  className="fixed bottom-0 md:inset-auto md:top-1/2 md:-translate-y-1/2 ..."
/>
```

---

### 10. Custom Cursor (Desktop Only)
A trailing dot cursor that morphs on hover over buttons and links:
```tsx
'use client'
// components/CustomCursor.tsx
// - Small 8px dot that follows mouse with spring lag
// - Expands to 40px ring when hovering over [data-cursor="hover"] elements
// - Hidden on touch devices via @media (pointer: coarse)
// Use useMotionValue + useSpring for x/y, useEffect to track mouse
```

---

### 11. Cat Loader — Lottie with Framer Motion gate
Wrap the Lottie cat animation with AnimatePresence so it fades out smoothly after loading:
```tsx
<AnimatePresence>
  {isLoading && (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]"
    >
      <Lottie animationData={catAnim} style={{ width: 180 }} />
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🌍 Bilingual (EN/BN) Animation
When switching language, animate the text swap:
```tsx
<AnimatePresence mode="wait">
  <motion.span
    key={lang + label}
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.2 }}
  >
    {t(label)}
  </motion.span>
</AnimatePresence>
```

---

## 🔒 Security Gate Animation
The master password modal (`1is2`) should have a dramatic entrance:
- Backdrop blurs in
- Modal shakes horizontally on wrong password: `animate={{ x: [0, -12, 12, -8, 8, 0] }}`
- Success: scale up briefly then dismiss

---

## 📄 PDF Invoice
Keep existing `jsPDF` or `react-pdf` implementation. Add a `motion.button` with a satisfying press animation on "Generate Invoice":
```tsx
whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96, rotate: -1 }}
```

---

## ✅ Vercel / Serverless Rules (Critical)
- All API routes in `/app/api/**/route.ts` must use `export const runtime = 'nodejs'` or `'edge'`
- MongoDB: use connection caching (`lib/mongodb.ts` with `global._mongoClientPromise`) — never open a new connection per request
- No `fs` module in any API route
- No streaming responses unless using Edge runtime properly
- Environment variables: `MONGODB_URI`, `NEXT_PUBLIC_APP_URL` in Vercel dashboard

---

## 📁 Suggested File Structure for Animation Utilities

```
lib/
  lenis.tsx          ← smooth scroll provider
  animations.ts      ← shared variants (container, item, fadeUp, slideIn)
components/
  ui/
    MagneticButton.tsx
    CustomCursor.tsx
    AnimatedNumber.tsx
    ScrollReveal.tsx
    PageTransition.tsx
  loaders/
    CatLoader.tsx
```

---

## 🎯 Priority Order (Build in this sequence)

1. Install packages + set up `animations.ts` shared variants
2. Lenis smooth scroll in `layout.tsx`
3. Staggered page entry on Dashboard + Kanban
4. Tab / route transitions (AnimatePresence)
5. Modal animations across all modals
6. Number counter on stats cards
7. Magnetic buttons on all primary CTAs
8. GSAP ScrollTrigger on Finance & Writer pages
9. Micro-reactions on all icons
10. Custom cursor (desktop)
11. Language switch animation
12. Security gate shake animation
13. Cat loader exit animation

---

Apply all of the above to the existing Agency OS codebase. Maintain all existing functionality — only enhance the visual layer. Do not break the MongoDB serverless pattern or any existing API routes.
