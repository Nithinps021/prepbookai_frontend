# Online Quiz Platform for Bank Exam Preparation

Build a premium, Notion-inspired online quiz platform for students preparing for bank exams (IBPS PO/Clerk, SBI PO/Clerk, RRB). The frontend will be built with **Vite + Vue 3 + TailwindCSS v4**, using mock data initially, with a backend to be integrated later.

## Resolved Design Decisions (from /grill-me)

> [!NOTE]
> **Architecture**: We will build a pure Single Page Application (SPA) using Vue Router, without a separate static landing page. This simplifies the architecture at the cost of initial SEO.
> **Design**: We will use a Notion-inspired base but incorporate more modern "web app" touches (e.g., slightly larger border radii, slightly more vibrant accent colors, softer shadows).
> **Mock Data**: We will use standard REST-like JSON structures for maximum versatility when integrating a real backend later.
> **Quiz Logic**: Negative marking will be hardcoded to -0.25 for all quizzes to keep the initial logic simpler.

## User Review Required

> [!IMPORTANT]
> Please review the updated implementation plan incorporating the decisions above. If everything looks good, approve the plan to begin execution!

## Proposed Changes

### Project Scaffolding

Set up the Vite + Vue 3 project with TailwindCSS v4, Vue Router, Pinia (state management), and dev tooling.

#### [NEW] Project root (`/Users/kannan/Online_Qz/`)

- Initialize with `npx create-vite@latest ./ --template vue`
- Install dependencies: `tailwindcss@4`, `@tailwindcss/vite`, `vue-router`, `pinia`, `canvas-confetti`
- Configure TailwindCSS v4 (CSS-first config in `index.css`)
- Configure path aliases (`@/` → `src/`)

**Project structure:**
```
Online_Qz/
├── public/
├── src/
│   ├── assets/
│   │   └── index.css         # TailwindCSS v4 entry + design tokens
│   ├── components/
│   │   ├── layout/           # Sidebar, TopBar, AppLayout
│   │   ├── quiz/             # QuizCard, QuestionGrid, Timer, QuestionView
│   │   ├── dashboard/        # StatCard, ProgressChart, RecentActivity
│   │   ├── auth/             # LoginForm, SignupForm
│   │   └── ui/               # Button, Input, Modal, SkeletonLoader, ThemeToggle
│   ├── composables/          # Reusable Vue composables (useTheme, useTimer, useQuiz)
│   ├── mock/                 # Mock data and mock API service
│   │   ├── questions.js      # Question banks per subject
│   │   ├── quizzes.js        # Quiz metadata
│   │   ├── user.js           # Mock user data
│   │   └── api.js            # Mock API service layer
│   ├── router/
│   │   └── index.js          # Vue Router config
│   ├── stores/               # Pinia stores
│   │   ├── auth.js           # Auth state
│   │   ├── quiz.js           # Quiz attempt state
│   │   └── theme.js          # Theme state (light/dark)
│   ├── views/                # Page-level components
│   │   ├── DashboardView.vue
│   │   ├── QuizListView.vue
│   │   ├── QuizAttemptView.vue
│   │   ├── ResultsView.vue
│   │   ├── ProfileView.vue
│   │   ├── LoginView.vue
│   │   └── SignupView.vue
│   ├── App.vue               # Root component with layout
│   └── main.js               # App entry point
├── index.html                # Vite entry (Vue app)
├── vite.config.js
└── package.json
```

---

### Design System & Theming

Establish a Notion-inspired design system with TailwindCSS v4 custom theme.

#### [NEW] [index.css](file:///Users/kannan/Online_Qz/src/assets/index.css)

- **Color palette**: Notion-inspired neutrals with accent colors
  - Light: `#FFFFFF` background, `#37352F` text, `#F7F6F3` secondary bg, `#E3E2DE` borders
  - Dark: `#191919` background, `#E8E8E3` text, `#252525` secondary bg, `#333333` borders
  - Accent: A warm blue `#2F81F7` for primary actions, green for success, amber for warnings
- **Typography**: Inter font, Notion-like sizing (14px base, 16px headings)
- **Spacing**: Consistent 4px grid system
- **Shadows**: Softer, modern layered shadows (slightly more pronounced than strict Notion)
- **Border radius**: Slightly larger modern rounded corners (6px for inputs, 12px for cards, 16px for modals)
- **Transitions**: Default 150ms ease for all interactive elements

#### [NEW] [ThemeToggle.vue](file:///Users/kannan/Online_Qz/src/components/ui/ThemeToggle.vue)

- Sun/moon icon toggle
- Smooth transition between themes
- Persists preference in localStorage

#### [NEW] [useTheme.js](file:///Users/kannan/Online_Qz/src/composables/useTheme.js)

- Composable for theme state management
- Toggles `dark` class on `<html>` element
- Reads system preference as default

---

### Layout Components

Build the Notion-style app shell with collapsible sidebar and minimal top bar.

#### [NEW] [AppLayout.vue](file:///Users/kannan/Online_Qz/src/components/layout/AppLayout.vue)

- Wraps all authenticated pages
- Contains Sidebar + TopBar + main content area
- Handles responsive layout (sidebar becomes drawer on mobile)
- Smooth page transition animations using Vue's `<Transition>` component

#### [NEW] [Sidebar.vue](file:///Users/kannan/Online_Qz/src/components/layout/Sidebar.vue)

- Collapsible sidebar (Notion-style)
- Navigation links: Dashboard, Subjects (expandable), Profile
- User avatar and name at top
- Collapse/expand toggle button
- Hover reveal on collapsed state (like Notion)
- Mobile: slides in as overlay with backdrop

#### [NEW] [TopBar.vue](file:///Users/kannan/Online_Qz/src/components/layout/TopBar.vue)

- Minimal top bar
- Breadcrumb / current page title
- Theme toggle (sun/moon)
- Profile avatar dropdown
- Mobile: hamburger menu to toggle sidebar

---

### UI Components

Reusable, Notion-styled building blocks.

#### [NEW] [Button.vue](file:///Users/kannan/Online_Qz/src/components/ui/Button.vue)

- Variants: primary, secondary, ghost, danger
- Sizes: sm, md, lg
- Loading state with spinner
- Hover/press micro-animations (subtle scale + shadow change)

#### [NEW] [Input.vue](file:///Users/kannan/Online_Qz/src/components/ui/Input.vue)

- Text input with Notion-style focus border
- Label, placeholder, error state
- Icon support (prefix/suffix)

#### [NEW] [Modal.vue](file:///Users/kannan/Online_Qz/src/components/ui/Modal.vue)

- Centered modal with backdrop blur
- Smooth enter/leave transitions
- Close on backdrop click + Escape key

#### [NEW] [SkeletonLoader.vue](file:///Users/kannan/Online_Qz/src/components/ui/SkeletonLoader.vue)

- Notion-style shimmer/pulse animation
- Variants: text line, card, avatar, paragraph

#### [NEW] [Badge.vue](file:///Users/kannan/Online_Qz/src/components/ui/Badge.vue)

- Small status indicators (e.g., "Easy", "Medium", "Hard")
- Color-coded variants

---

### Authentication Pages

Login and signup flows with clean, minimal design.

#### [NEW] [LoginView.vue](file:///Users/kannan/Online_Qz/src/views/LoginView.vue)

- Clean centered form (email + password)
- "Remember me" checkbox
- Link to signup
- Form validation with inline errors
- Animated transitions

#### [NEW] [SignupView.vue](file:///Users/kannan/Online_Qz/src/views/SignupView.vue)

- Name, email, password, confirm password
- Terms acceptance checkbox
- Link to login
- Form validation

#### [NEW] [auth.js (store)](file:///Users/kannan/Online_Qz/src/stores/auth.js)

- Login/logout/signup actions (mock)
- User state management
- Token persistence in localStorage

---

### Dashboard Page

Overview page showing progress, stats, and recent activity.

#### [NEW] [DashboardView.vue](file:///Users/kannan/Online_Qz/src/views/DashboardView.vue)

- Welcome greeting with user name
- Grid of stat cards (total quizzes taken, average score, time spent, streak)
- Progress overview per subject (animated progress bars)
- Recent quiz activity list
- Quick start buttons for each subject

#### [NEW] [StatCard.vue](file:///Users/kannan/Online_Qz/src/components/dashboard/StatCard.vue)

- Icon + label + value
- Subtle hover elevation
- Animated count-up on mount

#### [NEW] [ProgressBar.vue](file:///Users/kannan/Online_Qz/src/components/dashboard/ProgressBar.vue)

- Animated fill on mount
- Color-coded by completion percentage
- Label showing percentage

#### [NEW] [RecentActivity.vue](file:///Users/kannan/Online_Qz/src/components/dashboard/RecentActivity.vue)

- List of recent quiz attempts
- Shows quiz name, score, date, time taken
- Click to view detailed results

---

### Quiz Listing Page

Browse and filter quizzes by subject and topic.

#### [NEW] [QuizListView.vue](file:///Users/kannan/Online_Qz/src/views/QuizListView.vue)

- Subject tabs/filter (Quantitative, Reasoning, English, GK)
- Grid of quiz cards with skeleton loading
- Search/filter bar
- Sort options (newest, most popular, difficulty)

#### [NEW] [QuizCard.vue](file:///Users/kannan/Online_Qz/src/components/quiz/QuizCard.vue)

- Quiz title, subject, topic
- Number of questions, estimated time
- Difficulty badge (Easy/Medium/Hard)
- Hover animation (lift + shadow)
- Click to start quiz (opens quiz config modal)

#### [NEW] [QuizStartModal.vue](file:///Users/kannan/Online_Qz/src/components/quiz/QuizStartModal.vue)

- Quiz details summary
- Timer toggle (timed vs untimed mode)
- Timer duration setting (if timed)
- Negative marking info display
- "Start Quiz" button

---

### Quiz Attempt Page

The core quiz-taking experience with question grid, timer, and navigation.

#### [NEW] [QuizAttemptView.vue](file:///Users/kannan/Online_Qz/src/views/QuizAttemptView.vue)

- Full-screen quiz layout (sidebar hidden)
- Top bar: quiz title, timer (if enabled), submit button
- Main area: current question display
- Side panel: question number grid
- Bottom: prev/next buttons + mark for review button
- Submit confirmation modal with summary (answered, unanswered, marked for review)
- Auto-submit when timer runs out

#### [NEW] [QuestionView.vue](file:///Users/kannan/Online_Qz/src/components/quiz/QuestionView.vue)

- Question text (supports formatted text)
- Four option buttons (A/B/C/D) with radio-style selection
- Selected state with visual feedback (Notion-style highlight)
- Clear response button

#### [NEW] [QuestionGrid.vue](file:///Users/kannan/Online_Qz/src/components/quiz/QuestionGrid.vue)

- Grid of numbered buttons
- Color-coded states:
  - Default/unanswered: neutral gray
  - Answered: green/accent
  - Marked for review: amber/orange
  - Current: primary blue with ring
- Animated state transitions
- Click to jump to question

#### [NEW] [Timer.vue](file:///Users/kannan/Online_Qz/src/components/quiz/Timer.vue)

- Countdown timer display (HH:MM:SS)
- Color changes as time runs low (last 5 min → amber, last 1 min → red + pulse)
- Warning flash at configurable thresholds

#### [NEW] [useTimer.js](file:///Users/kannan/Online_Qz/src/composables/useTimer.js)

- Countdown timer composable
- Start, pause, resume, reset
- Time-up callback
- Formatted time output

#### [NEW] [useQuiz.js](file:///Users/kannan/Online_Qz/src/composables/useQuiz.js)

- Quiz attempt state management composable
- Track answers, marked questions, current question index
- Calculate score with negative marking (-0.25 per wrong answer)
- Generate results summary

#### [NEW] [quiz.js (store)](file:///Users/kannan/Online_Qz/src/stores/quiz.js)

- Current quiz state
- Quiz history
- Active attempt data

---

### Results/Review Page

Post-quiz score display with detailed question-by-question review.

#### [NEW] [ResultsView.vue](file:///Users/kannan/Online_Qz/src/views/ResultsView.vue)

- Score summary header (total score, percentage, rank band)
- Confetti animation on good scores (using canvas-confetti)
- Statistics: correct, wrong, unanswered, time taken
- Negative marking breakdown
- Question-by-question review list:
  - Shows question, your answer, correct answer
  - Color-coded (green = correct, red = wrong, gray = unanswered)
  - Expandable explanation for each question
- "Retake Quiz" and "Back to Quizzes" buttons

---

### Profile/Settings Page

User profile and app settings.

#### [NEW] [ProfileView.vue](file:///Users/kannan/Online_Qz/src/views/ProfileView.vue)

- User info display (name, email, avatar)
- Edit profile form
- Quiz statistics summary
- Theme preference (light/dark/system)
- Logout button

---

### Vite Configuration

#### [MODIFY] [vite.config.js](file:///Users/kannan/Online_Qz/vite.config.js)

- Standard Vite configuration for a Vue SPA
- Set up path aliases (`@/` → `src/`)

---

### Mock Data Layer

Mock API service that mimics real backend responses.

#### [NEW] [questions.js](file:///Users/kannan/Online_Qz/src/mock/questions.js)

- 10-15 questions per subject (4 subjects = ~50 questions total)
- Each question: `id`, `text`, `options[]`, `correctAnswer`, `explanation`, `subject`, `topic`, `difficulty`

#### [NEW] [quizzes.js](file:///Users/kannan/Online_Qz/src/mock/quizzes.js)

- 8-10 mock quizzes across subjects
- Each quiz: `id`, `title`, `subject`, `topic`, `questionCount`, `duration`, `difficulty`, `questionIds[]`

#### [NEW] [user.js](file:///Users/kannan/Online_Qz/src/mock/user.js)

- Mock user profile data
- Mock quiz history with scores and dates

#### [NEW] [api.js](file:///Users/kannan/Online_Qz/src/mock/api.js)

- Service layer with functions: `login()`, `signup()`, `getQuizzes()`, `getQuiz(id)`, `getQuestions(quizId)`, `submitQuiz()`, `getResults()`, `getUserStats()`
- Simulates async behavior with `setTimeout` delays
- Easy to swap with real `fetch` calls later

---

### Routing

#### [NEW] [router/index.js](file:///Users/kannan/Online_Qz/src/router/index.js)

Routes:
| Path | View | Auth Required |
|---|---|---|
| `/login` | LoginView | No |
| `/signup` | SignupView | No |
| `/dashboard` | DashboardView | Yes |
| `/quizzes` | QuizListView | Yes |
| `/quizzes/:subject` | QuizListView (filtered) | Yes |
| `/quiz/:id` | QuizAttemptView | Yes |
| `/results/:id` | ResultsView | Yes |
| `/profile` | ProfileView | Yes |

- Route guards for auth-protected pages
- Smooth page transitions via Vue `<Transition>`

---

## Verification Plan

### Automated Tests

```bash
npm run build    # Verify production build succeeds
npm run dev      # Manual visual testing in browser
```

### Manual Verification

1. **Theme toggle**: Verify light/dark mode switches correctly and persists
2. **Responsive layout**: Test sidebar collapse on mobile, quiz grid responsiveness
3. **Quiz flow**: Start quiz → answer questions → navigate with grid → mark for review → submit → view results with explanations
4. **Timer**: Verify countdown, color changes, auto-submit on time-up
5. **Animations**: Page transitions, skeleton loading, confetti, progress bars, hover effects
6. **Auth flow**: Login → redirect to dashboard, logout → redirect to login
7. **Landing page**: Verify SEO meta tags, standalone rendering, links to app
8. **Scoring**: Verify negative marking calculation (-0.25 per wrong answer)
9. **Browser recording**: Capture a walkthrough video of the full user flow
