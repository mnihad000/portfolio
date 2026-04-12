# Progress

## Current Build Status
- Next.js App Router + TypeScript + Tailwind + shadcn configured and working.
- Primary nav is a stable pill bar with routes:
  - `/`
  - `/projects`
  - `/experiences`
  - `/contact`
- Resume route is removed from nav and does not have an active page file.

## Implemented Features
- Hero landing page with UnicornStudio background and retro overlays.
- Route-based pages for `Projects`, `Experiences`, and `Contact`.
- Reusable project system:
  - Shared typed data model in `lib/projects.ts`
  - Reusable card component in `components/ui/project-card.tsx`
  - Dynamic detail route in `app/projects/[slug]/page.tsx`
- Starter project card/page:
  - `Rhetoriq` at `/projects/rhetoriq`

## Image + Project Flow
- Project cards and detail pages render images with Next.js `next/image`.
- Local project image assets are stored in `public/projects/`.
- Add/edit projects by updating only `lib/projects.ts`.

## Documentation Added
- `project-guide.md` explains exactly how to add new projects:
  - naming and slug rules
  - image placement
  - required fields
  - validation steps (`lint` + `build`)

## Validation
- `npm run lint` passes.
- `npm run build` passes.
