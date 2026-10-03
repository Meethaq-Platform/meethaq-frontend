# Meethaq

Meethaq is a web app for freelancers and their clients. It keeps the contract, chat, delivery and payment for a project on one documented track, and a milestone's payment only becomes due after the client accepts the work.

The repo holds the Next.js frontend. It talks to a separate backend API through server-side route handlers.

## How it works

1. **Create the client and project.** The freelancer adds a client and opens a project space for them.
2. **Agree on the milestones.** Scope, deadline, acceptance criteria and value for each milestone, approved by both sides as a contract.
3. **Deliver each milestone.** Files or links are attached to the milestone they belong to.
4. **Review the delivery.** The client accepts it or asks for a specific revision. Every decision is recorded with a date.
5. **Release the payment.** Once a milestone is accepted, its value becomes due, and the payment and its evidence are tracked against it.

The app also covers contract amendments, change requests, disputes, a per-project chat, an activity log, dashboards with financial trends, and real-time notifications.

There are two roles:

- **Freelancer:** manages clients and projects, drafts contracts and milestones, and submits deliveries.
- **Client:** accepts project invitations, approves contracts, reviews submissions and records payments.

## Tech stack

| Area                 | Tools                                                               |
| -------------------- | ------------------------------------------------------------------- |
| Framework            | [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript |
| Styling              | Tailwind CSS 4                                                      |
| Data fetching        | TanStack React Query                                                |
| Forms and validation | react-hook-form, Zod                                                |
| Internationalization | next-intl (English and Arabic, with RTL)                            |
| Real-time            | Microsoft SignalR                                                   |
| Charts               | Recharts                                                            |
| UI extras            | lucide-react icons, sonner toasts                                   |

## Project structure

```
src/
├── app/                  # Routes (App Router)
│   ├── (auth)/           # Login and register pages
│   ├── (protected)/      # Pages that need a signed-in user: dashboard, clients, projects, profile
│   └── api/              # Route handlers that proxy requests to the backend API
├── features/             # One folder per feature
│   └── <feature>/
│       ├── components/
│       ├── hooks/        # React Query hooks
│       ├── lib/          # API calls, cache keys and helpers
│       ├── schemas/      # Zod schemas
│       └── types/
├── shared/               # Code used across features: components, hooks, lib, providers
└── i18n/                 # Locale config, formats and message catalogs
docs/i18n/                # Arabic glossary
scripts/                  # Repo scripts, such as the i18n checker
```

Features include `auth`, `dashboard`, `clients`, `projects`, `contracts`, `milestones`, `submissions`, `payments`, `change-requests`, `disputes`, `project-chat`, `activity-log`, `notifications` and `profile`. Client-side views live in their own `client-*` folders.

### Authentication and the API layer

The browser never calls the backend directly. Components call the route handlers under `src/app/api`, and those handlers forward each request to `API_URL`. On login, the handler stores the access and refresh tokens in HTTP-only cookies. The `(protected)` layout sends anyone without an `access_token` cookie to `/login`.

## Internationalization

The app supports English (`en`, the default) and Arabic (`ar`, right-to-left).

- The locale comes from the `NEXT_LOCALE` cookie. URLs don't include a locale prefix.
- Messages live in `src/i18n/messages/<locale>/`, with one JSON file per feature.
- Digits are always Western (0–9), including in Arabic. In messages, write counts as `{n, number, integer}`, not `#` or a bare `{n, number}`.
- Arabic copy follows the terms and style rules in [docs/i18n/glossary.md](docs/i18n/glossary.md).

Run `pnpm i18n:check` after you change any messages. It checks that every locale has the same files and keys as English, that no message is empty, and that numbers use the approved formats.

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) runs on pushes and pull requests to `main`. It installs dependencies, lints, generates Next.js types, type-checks with `tsc --noEmit`, and runs a production build.
