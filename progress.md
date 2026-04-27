# Project Card Tutorial (Same Structure)

Use this checklist whenever you want to add a new project card that matches the current site structure.

## 1) Add the Card Data in `lib/projects.ts`

Every card is driven by one object in the exported `projects` array.

Required fields:
- `slug`: URL-safe unique id (lowercase + hyphens), e.g. `agent-orchestrator`
- `title`: Card/project title
- `description`: Short text shown on the card
- `fullDescription`: Text shown in the basic detail page
- `dateLabel`: Uppercase date label on card, e.g. `APRIL 2026`
- `technologies`: string array used for card tags
- `coverImage`: path under `public`, e.g. `/projects/my-cover.svg`

Example:

```ts
{
  slug: "my-new-project",
  title: "My New Project",
  description: "One-line card description.",
  fullDescription: "Longer detail page description.",
  dateLabel: "APRIL 2026",
  technologies: ["Next.js", "TypeScript", "PostgreSQL"],
  coverImage: "/projects/my-new-project-cover.svg",
}
```

## 2) Add the Cover Image in `public/projects`

Create a matching file at:
- `public/projects/<slug>-cover.svg` (or `.png`, `.jpg`, etc.)

Important:
- `coverImage` in `lib/projects.ts` must exactly match the filename/path.
- Prefer `1600x900` for consistent visual crop in cards and detail pages.

## 3) Verify Routing + Detail Page

You do not need to manually register routes.

Why:
- `app/projects/page.tsx` maps over `projects`.
- `app/projects/[slug]/page.tsx` uses `generateStaticParams()` from `projects`.
- `getProjectBySlug()` resolves the clicked card by `slug`.

So once the new object is in `projects`, both card and detail page are auto-wired.

## 4) Optional: Enable Rich Detail Layout

If you want the advanced long-form project page (sections like Overview, Architecture, Datasets, etc.), add a `richDetail` object to the same project entry.  
If `richDetail` is omitted, the project uses the simpler default detail layout.

## 5) Quick Quality Checklist Before Commit

- `slug` is unique in `projects`
- `coverImage` path exists in `public/projects`
- Card description fits without awkward truncation
- Technology tags look balanced (3-6 is usually ideal)
- `npx tsc --noEmit` passes
- `npm run lint` passes (or only known unrelated warnings)

## 6) Fast Copy/Paste Template

```ts
{
  slug: "",
  title: "",
  description: "",
  fullDescription: "",
  dateLabel: "APRIL 2026",
  technologies: ["", "", ""],
  coverImage: "/projects/-cover.svg",
}
```
