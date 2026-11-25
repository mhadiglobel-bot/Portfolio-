# Muhammad Hadi — Portfolio

A dark, neon-lit portfolio for Muhammad Hadi: real WebGL 3D, scroll-driven motion and
glassmorphic UI. Built with Next.js, React Three Fiber, GSAP and Lenis.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| 3D | Three.js, React Three Fiber, Drei, postprocessing (Bloom) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Deploy | Vercel (auto-deploy from GitHub `main`) |

## Scripts

```bash
npm install    # install dependencies
npm run dev    # local dev server on http://localhost:3000
npm run build  # production build
npm start      # run the production build
```

## Structure

```
src/
  app/            layout, page, global styles, metadata, icons, sitemap, robots
  components/
    Header        glass navigation + mobile menu
    Hero          headline, scroll cue, glass stage
    HeroScene     WebGL orb, neon rings, particles, bloom
    Marquee       infinite discipline strip
    Statement     oversized editorial statement
    Work          featured project card + archive card
    Capabilities  three glass service cards
    Approach      sticky philosophy column + steps
    About         portrait card + bio
    Contact       email call-to-action
    Footer
    SmoothScroll  Lenis + GSAP ScrollTrigger setup
    CursorGlow    desktop cursor light
```

## Notes

- Scroll reveals are driven by `data-reveal` / `data-reveal-stagger` attributes and
  respect `prefers-reduced-motion`.
- The 3D scene is client-only (`dynamic(..., { ssr: false })`) and falls back to a CSS
  orb while loading.
- Update the canonical domain in `src/app/layout.tsx` and `sitemap.ts` if the site
  moves to a custom domain.
