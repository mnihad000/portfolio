# Project Card Guide

This guide explains exactly how to add new project cards and project pages in this portfolio.

## Current Architecture

- Project data source: `lib/projects.ts`
- Reusable card component: `components/ui/project-card.tsx`
- Projects index page: `app/projects/page.tsx`
- Dynamic project detail route: `app/projects/[slug]/page.tsx`
- Project images folder: `public/projects/`

One object in `projects` creates:
- One card on `/projects`
- One detail page at `/projects/[slug]`

## How Images Are Rendered

Images are rendered with Next.js `next/image` in both the card and detail page.

- Card image render: `components/ui/project-card.tsx`
- Detail image render: `app/projects/[slug]/page.tsx`
- Image path format in data: `"/projects/your-image-file.svg"` (or `.png`, `.jpg`, `.webp`)

Because images are local (`public/projects/...`), you do not need to configure remote domains for these project covers.

## Naming Conventions

Use consistent naming so routes stay predictable:

- `title`: User-facing name, e.g. `"Rhetoriq"`
- `slug`: URL-safe lowercase id, e.g. `"rhetoriq"`
- `coverImage` filename: match slug when possible, e.g. `rhetoriq-cover.svg`
- `dateLabel`: uppercase month + year, e.g. `"APRIL 2026"`

Slug rules:
- Lowercase only
- Use hyphens for spaces
- No special characters
- Must be unique across all projects

## Step-by-Step: Add a New Project

1. Add your image file to `public/projects/`

Example:
- `public/projects/agentforge-cover.png`

2. Open `lib/projects.ts`

3. Add a new object to the `projects` array

Use this template:

```ts
{
  slug: "agentforge",
  title: "AgentForge",
  description:
    "Short card summary shown on /projects. Keep this to 1-2 lines.",
  fullDescription:
    "Longer detail-page description. Explain the problem, your solution, architecture, and impact.",
  dateLabel: "MAY 2026",
  technologies: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI API"],
  coverImage: "/projects/agentforge-cover.png",
}
```

4. Save file and run checks

```bash
npm run lint
npm run build
```

5. Visit pages

- Card list: `/projects`
- Detail page: `/projects/agentforge`

You do not need to create a new route file manually. `generateStaticParams()` in `app/projects/[slug]/page.tsx` auto-generates project pages from the `projects` array.

## How The Card Uses Your Data

In `components/ui/project-card.tsx`:

- `title` -> card heading
- `description` -> card body text
- `dateLabel` -> small meta line
- `technologies` -> badge row
- `coverImage` -> card preview image
- `slug` -> click target link (`/projects/${slug}`)

Tech badges behavior:
- First 3 technologies are shown as chips
- Remaining technologies are summarized as `+N`

Example:
- `["Next.js", "TypeScript", "Tailwind", "OpenAI API"]` renders `Next.js`, `TypeScript`, `Tailwind`, `+1`

## How The Detail Page Uses Your Data

In `app/projects/[slug]/page.tsx`:

- `title`, `dateLabel`, `description` -> header block
- `coverImage` -> hero image
- `fullDescription` -> overview section
- `technologies` -> full technology badge list

If a slug is not found, `notFound()` returns the 404 page.

## Writing Guidelines

Use this quality bar for consistency:

- `description`: 90-160 characters, outcome-focused, plain language
- `fullDescription`: 2-5 sentences, include architecture and what makes it notable
- `technologies`: list the primary stack only (3-8 items)
- Keep tone technical and specific

Good:
- "Realtime inference pipeline with queue-backed workers and vector search retrieval."

Weak:
- "Cool app I made for AI."

## Checklist Before Commit

- Image exists in `public/projects/`
- `coverImage` path is correct
- Slug is unique and URL-safe
- `/projects` card renders correctly
- `/projects/[slug]` page loads
- `npm run lint` passes
- `npm run build` passes

## Optional Enhancements (Later)

- Add extra fields to `Project` type, such as `repoUrl`, `demoUrl`, `status`
- Show action buttons on card/detail pages
- Add project sorting by date
- Add tags or categories for filtering
