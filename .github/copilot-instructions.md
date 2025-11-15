# Affiliate Launchpad - AI Coding Agent Instructions

## Project Overview
Single-page React application for affiliate marketing lead capture and digital product sales. Integrates with SendShark email automation API. Deployed to GitHub Pages at https://aj9891.github.io/affiliate-launchpad/.

## Architecture & Key Patterns

### Single-Component Design
- **All UI logic in one file**: `src/AffiliateLaunchpad.jsx` contains the entire application (no routing, no separate components)
- `src/App.jsx` is a thin wrapper that just imports and renders `AffiliateLaunchpad`
- This is intentional for simplicity - keep all logic in `AffiliateLaunchpad.jsx` when making changes

### Environment Variables Pattern
- **All config via Vite env vars**: Use `import.meta.env.VITE_*` (NOT `process.env`)
- Required vars: `VITE_SENDSHARK_API_URL`, `VITE_SENDSHARK_API_KEY`, `VITE_SENDSHARK_LIST_ID`, `VITE_LEAD_MAGNET_DOWNLOAD`
- See `.env.example` for the complete list - never commit actual `.env` file
- All env vars have fallback defaults in `AffiliateLaunchpad.jsx` (lines 13-17)

### SendShark Integration
- **API endpoint pattern**: `${SENDSHARK_API_URL}/lists/${LIST_ID}/subscribers` (see `sendToSendShark()`)
- **Tag-based workflows**: Use tags `affiliate-lead` for subscribers, `buyer` for purchasers
- **Authorization**: Bearer token via `Authorization: Bearer ${API_KEY}` header
- Error handling: Gracefully degrade if API is not configured (logs warning but doesn't crash)

### State Management
- **localStorage for persistence**: Cart (`al_cart`), orders (`al_orders`), subscription status (`al_subscribed`)
- **React useState only**: No Redux/Context - all state is local to the single component
- Cart syncs to localStorage via `useEffect` dependency on `cart` (lines 54-56)

### PDF Generation Pattern
- **Client-side PDFs via pdf-lib**: `generateSamplePDF()` creates downloadable products dynamically
- **Image embedding**: Fetches product cover images from Unsplash, handles CORS and PNG/JPEG detection
- **Error resilience**: Continues without cover image if fetch fails (lines 126-133)
- Returns `{ url, filename }` using `URL.createObjectURL(blob)` for instant downloads

## Development Workflow

### Local Development
```bash
npm install
npm run dev  # Vite dev server at http://localhost:5173
```

### Build & Deploy to GitHub Pages
```bash
npm run build          # Builds to dist/ with base path /Affiliate-launchpad/
npm run deploy         # Pushes dist/ to gh-pages branch using gh-pages package
```

**Critical**: Vite config sets `base: '/Affiliate-launchpad/'` - this must match the GitHub repo name for assets to load correctly on GitHub Pages.

## Code Conventions

### Tailwind Usage
- **Utility-first, inline classes**: No custom CSS components (see `index.css` - only Tailwind directives + font)
- **Color scheme**: Indigo for primary actions, emerald for success/purchase, amber/sky/emerald for product cards
- **Responsive**: Use `md:` prefix for desktop layouts (e.g., `md:grid-cols-2`)

### Data Structures
- **Product schema**: `{ id, title, price, bullets[], img, color }` (see `sampleProducts` lines 19-44)
- **Order schema**: `{ id, items, buyer: { name, email }, date, downloads[], apiError? }`
- **Download schema**: `{ productId, url, filename }`

### Async Patterns
- **Fetch with error handling**: All API calls wrapped in try/catch, return `{ ok, status?, data?, msg? }`
- **Loading states**: Set `loading` boolean before async operations, clear after
- **User feedback**: Display API errors via `apiError` state, success via `subscribed`/`orderSuccess`

## Common Modifications

### Adding New Products
Edit the `sampleProducts` array (lines 19-44). Each product requires:
- Unique `id`, `title`, `price`, `bullets[]`, `img` (Unsplash URL), `color` (Tailwind bg class)

### Changing Email Automation Tags
Modify tag arrays in:
- Line 186: `["affiliate-lead"]` for subscribers
- Line 117: `["buyer"]` for purchasers

### Customizing SendShark Payload
Update `sendToSendShark()` payload object (lines 72-77) - current fields: `email`, `first_name`, `tags`, `source`

### Styling Updates
- Hero section: lines 212-235 (2-column grid with email capture)
- Product cards: lines 240-259 (3-column responsive grid)
- Checkout modal: lines 264-278 (fixed overlay with form)

## Testing Strategy
No automated tests configured. Manual testing checklist:
1. Subscribe with test email → verify SendShark contact created with `affiliate-lead` tag
2. Add products to cart → verify localStorage persistence across page refresh
3. Complete purchase → verify PDF downloads work, buyer tagged in SendShark
4. Test with missing env vars → should show config warnings, not crash

## Known Limitations
- **Mock checkout only**: No payment processing (intentional demo behavior)
- **Client-side only**: No backend, all data in localStorage (orders not persisted server-side)
- **CORS dependency**: PDF cover images require CORS-enabled sources (Unsplash works, some CDNs may not)
- **No email validation**: Basic `includes('@')` check only
