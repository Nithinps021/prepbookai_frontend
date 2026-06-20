# PrepBook AI — Frontend

The web frontend for PrepBook AI, an AI-assisted exam-prep app. Students browse quizzes, attempt them under a timer, and track their progress over time. Built with Vue 3 + Vite and styled with Tailwind CSS.

## Tech stack

- **Vue 3** (`<script setup>` SFCs)
- **Vite** — dev server and build tooling
- **Vue Router** — routing with auth guards
- **Pinia** — state management (`auth`, `quiz` stores)
- **Tailwind CSS v4** — styling
- **Firebase** — authentication
- **lucide-vue-next** — icons
- **canvas-confetti** — result celebrations

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Configure environment

Create a `.env` file in the project root (see [`.env`](.env) for the full list):

```
VITE_BACKEND_URL=
VITE_API_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Run

```bash
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
├── assets/        # images and global CSS
├── components/
│   ├── dashboard/ # progress bar, stat cards, recent activity
│   ├── landing/   # marketing landing page sections
│   ├── layout/    # app shell — sidebar, top bar, layout wrapper
│   ├── quiz/      # quiz cards, question views, timer, modals
│   └── ui/        # reusable primitives — button, input, modal, badge…
├── composables/   # useQuiz, useTimer, useTheme, useCountUp, useScrollReveal
├── mock/          # mock API and seed data (quizzes, questions, user)
├── router/        # routes and navigation guards
├── stores/        # Pinia stores (auth, quiz)
├── views/         # routed pages
├── firebase.js    # Firebase initialization
└── main.js        # app entry point
```

## Routing

| Path           | Page         | Auth     |
| -------------- | ------------ | -------- |
| `/`            | Landing      | Public   |
| `/login`       | Login        | Public   |
| `/dashboard`   | Dashboard    | Required |
| `/quizzes`     | Quiz list    | Required |
| `/profile`     | Profile      | Required |
| `/quiz/:id`    | Quiz attempt | Required |
| `/results/:id` | Results      | Required |

Authenticated routes redirect to `/login` when signed out; signed-in users are sent straight to `/dashboard` from the landing and login pages.
