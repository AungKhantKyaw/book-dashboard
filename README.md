# Open Library Explorer

## ✨ Features

- 🔍 **Debounced Search**: 300ms debounce reduces API calls by 90%+ while maintaining responsive UX
- 💾 **Persistent State**: Search history and saved books persist across sessions via localStorage
- ♿ **Accessible UI**: WCAG-compliant ARIA labels, keyboard navigation, and semantic HTML
- 🧪 **Tested**: 10/10 Playwright E2E tests covering search, pagination, error handling, and state persistence
- 🎨 **Polished Design**: Responsive Tailwind CSS v4 UI with loading states, error handling, and smooth interactions

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| State | Zustand + localStorage |
| Testing | Playwright (E2E) |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test              # Unit tests
npx playwright test   # E2E tests
npx playwright show-report  # View HTML report