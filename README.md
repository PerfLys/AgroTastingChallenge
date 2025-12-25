# Agro Tasting Challenge

Website for the Agro Tasting Challenge (ATC), an international wine tasting competition organized annually since 2015 by the Association Œnologique d'AgroParisTech.

## About

The Agro Tasting Challenge is an event centered around wine tasting and sharing. This website showcases past editions, participants, rules, and information about the competition. The site is bilingual (French/English) and features a content management system for easy updates.

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Deployment**: [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Content Management**: [TinaCMS](https://tina.io)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)

### Installation

Install dependencies:

```bash
pnpm install
```

### Development

Start the development server with TinaCMS:

```bash
pnpm run dev
```

The site will be available at `http://localhost:5200`

For development without TinaCMS:

```bash
pnpm run start
```

### Building

Before building, you need to build TinaCMS:

```bash
npx tinacms build
```

Then build the production site:

```bash
pnpm run build
```

The built files will be in the `./dist/` directory.

> **Note**: In development mode (`pnpm run dev`), TinaCMS is automatically built as part of the dev command.

Preview the production build locally:

```bash
pnpm run preview
```

### Deployment

Deploy to Cloudflare Workers:

```bash
npx tinacms build && pnpm run build && pnpm run deploy
```

## Project Structure

- `src/pages/` - Astro pages (routes)
- `src/components/` - Reusable components
- `src/content/` - Content collections (editions, pages)
- `src/layouts/` - Page layouts
- `public/` - Static assets (images, PDFs, etc.)
- `tina/` - TinaCMS configuration and generated files

## Available Commands

| Command                | Action                                    |
| :--------------------- | :---------------------------------------- |
| `pnpm install`         | Installs dependencies                     |
| `pnpm run dev`         | Starts dev server with TinaCMS            |
| `pnpm run start`       | Starts dev server without TinaCMS         |
| `pnpm run build`       | Builds production site to `./dist/`       |
| `pnpm run preview`     | Preview production build locally          |
| `pnpm run deploy`      | Deploy to Cloudflare Workers              |
| `pnpm run check`       | Run linting, type checking, and dry-run   |
| `pnpm run cf-typegen`  | Generate Cloudflare Workers types         |

## Contact

For questions or issues, contact: association.oenologie@agroparistech.fr

Website: https://agrotastingchallenge.fr
