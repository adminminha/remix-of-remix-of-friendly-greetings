
# Tota AI - সম্পূর্ণ Implementation Plan

## বর্তমান অবস্থা বিশ্লেষণ

### যা তৈরি আছে (70%):
- Landing Page, Auth (Login/Register), Dashboard, Settings
- Builder layout (40/60 split - Chat/Preview)
- Chat interface (messages save হয়)
- `generate-component` edge function (AI code generate করে)
- Database tables: `profiles`, `projects`, `pages`, `files`, `chat_messages`
- Files management hook (`useProjectFiles.ts`)

### মূল সমস্যা:
1. **Preview শুধু static HTML দেখায়** - React components interactive নয়
2. **Pre-structured codebase integrated নয়** - template components user project এ copy হয় না
3. **PageManager নেই** - multiple pages manage করা যায় না
4. **Auto-save নেই** - manually save করতে হয়

---

## Phase 1: Pre-Structured Template Integration

### Task 1.1: Template Storage System
`src/lib/templates/` folder এ pre-structured codebase store করা হবে:

```text
src/lib/templates/
├── index.ts          (template manifest - all file paths & metadata)
├── base-files.ts     (core config files: package.json, tailwind.config.ts, etc.)
└── components.ts     (all 50+ shadcn component codes as string constants)
```

এই approach এর সুবিধা:
- Template compile time এ bundle হবে
- Database dependency নেই
- Fast project initialization

### Task 1.2: Project Initialization Service
নতুন project তৈরি হলে automatically template files database এ insert হবে:

```text
CREATE PROJECT FLOW:
1. User clicks "Create Project"
2. Insert project record
3. Copy template files to `files` table (all 50+ components)
4. Create default Home page in `pages` table
5. Redirect to Builder
```

---

## Phase 2: Live React Preview System (Critical)

### বর্তমান সমস্যা:
এখন `generatePreviewHtml()` function JSX কে static HTML এ convert করে:
- `className` → `class` replace
- JSX expressions remove (`{variable}`)
- React components → simple div

এটা কাজ করে না কারণ:
- Button, Card, Badge etc. properly render হয় না
- Interactivity (onClick, state) কাজ করে না
- Tailwind CSS fully apply হয় না

### সমাধান: Sandboxed React Rendering

#### Option A: CDN-based React Runtime (সহজ, দ্রুত implement)
iframe এ:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- Pre-bundled UI components -->
<script>
  // Button, Card, Badge, etc. definitions
</script>

<div id="root"></div>
<script type="text/babel">
  // AI generated component code
  ${generatedCode}
  ReactDOM.render(<GeneratedComponent />, document.getElementById('root'));
</script>
```

#### Option B: Build-time Preview (complex, better quality)
- Vite dev server separate instance
- Real-time file sync
- Full HMR support

**Recommendation: Option A** - দ্রুত implement করা যাবে এবং MVP এর জন্য যথেষ্ট।

### Task 2.1: Create Preview HTML Generator
`supabase/functions/generate-component/index.ts` এ:

```typescript
function generatePreviewHtml(code, componentName, allProjectFiles) {
  // 1. Include UI component library (pre-bundled)
  // 2. Include generated component code
  // 3. Render with Babel + React
}
```

### Task 2.2: Pre-bundle UI Components
`src/lib/preview-components.ts`:
- All shadcn components compiled to UMD format
- Single file, CDN-hostable
- ~50KB gzipped

---

## Phase 3: PageManager Component

### Task 3.1: Create PageManager UI
`src/components/builder/PageManager.tsx`:

```text
Layout:
┌─────────────────────────┐
│ Pages               [+] │
├─────────────────────────┤
│ ● Home        [⋮]       │  ← current page highlighted
│   About       [⋮]       │
│   Contact     [⋮]       │
└─────────────────────────┘

Features:
- List all pages from `pages` table
- Click to switch page
- Add new page button
- Menu: Rename, Delete, Set as Home
```

### Task 3.2: Page Switching Logic
```text
1. User clicks page in PageManager
2. Load page's components from `files` table
3. Update preview panel
4. Update chat context (which page we're editing)
```

### Task 3.3: Database Query Updates
```sql
-- Get pages for project
SELECT * FROM pages WHERE project_id = ? ORDER BY is_home DESC, title ASC;

-- Get files for specific page
SELECT * FROM files WHERE project_id = ? AND file_path LIKE 'src/pages/%';
```

---

## Phase 4: Auto-Save System

### Task 4.1: Auto-Save Hook
`src/hooks/useAutoSave.ts`:

```typescript
function useAutoSave(projectId, interval = 30000) {
  // Save current state every 30 seconds
  // Show status: "Saving...", "Saved at 2:30 PM"
  // Debounce on active changes
}
```

### Task 4.2: TopBar Save Status
```text
┌────────────────────────────────────────────────┐
│ My Project        [Saved ✓ 2:30 PM] [Deploy]   │
└────────────────────────────────────────────────┘
```

---

## Phase 5: Missing Features

### Task 5.1: Privacy Policy Page
- `/privacy` route
- Standard privacy policy content
- Bengali + English

### Task 5.2: Terms of Service Page
- `/terms` route
- Standard ToS content

### Task 5.3: Code Export Dialog
```text
Export Options:
┌─────────────────────────────┐
│ Export Project              │
├─────────────────────────────┤
│ ○ React Project (.zip)      │
│ ○ Static HTML               │
│ ○ Copy to Clipboard         │
├─────────────────────────────┤
│ [Cancel]          [Export]  │
└─────────────────────────────┘
```

---

## Implementation Order

| Priority | Task | Estimated Time |
|----------|------|----------------|
| 1 | Preview System Fix (Phase 2) | 2-3 hours |
| 2 | Template Integration (Phase 1) | 1-2 hours |
| 3 | PageManager (Phase 3) | 1-2 hours |
| 4 | Auto-Save (Phase 4) | 30 mins |
| 5 | Privacy/Terms Pages | 30 mins |
| 6 | Export Dialog | 1 hour |

**Total: ~7-9 hours of work**

---

## Technical Details

### Files to Create:
1. `src/lib/templates/index.ts` - Template manifest
2. `src/lib/templates/base-files.ts` - Config files as strings
3. `src/lib/templates/ui-components.ts` - All shadcn components
4. `src/lib/preview-runtime.ts` - Preview HTML generator
5. `src/components/builder/PageManager.tsx` - Pages sidebar
6. `src/hooks/useAutoSave.ts` - Auto-save hook
7. `src/pages/Privacy.tsx` - Privacy policy
8. `src/pages/Terms.tsx` - Terms of service
9. `src/components/builder/ExportDialog.tsx` - Export options

### Files to Modify:
1. `supabase/functions/generate-component/index.ts` - Better preview HTML
2. `src/components/builder/PreviewPanel.tsx` - Use new preview system
3. `src/pages/Builder.tsx` - Add PageManager, auto-save
4. `src/components/builder/TopBar.tsx` - Save status indicator
5. `src/App.tsx` - Add Privacy/Terms routes
6. `src/hooks/useProjectFiles.ts` - Template initialization

### Database Considerations:
- `files` table: Will store template + generated files
- `pages` table: Already exists, will be used for page management
- No schema changes required

---

## Pre-Structured Codebase Clarification

### Lovable AI যেভাবে কাজ করে:
1. Lovable এর নিজস্ব template codebase আছে (shadcn + Tailwind + Vite)
2. User যখন project করে, এই template base হিসেবে থাকে
3. AI শুধু নতুন files create করে, template modify করে না

### Tota AI তে আমরা:
1. আপনার uploaded file (4911 lines) parse করে template হিসেবে store করব
2. নতুন project তৈরি হলে এই template copy হবে `files` table এ
3. AI generated components এই template এর components import করবে
4. Preview iframe এ template + generated code একসাথে render হবে

### Important Note:
Pre-structured codebase টি **Tota AI এর end-user projects এ** যাবে, **Tota AI app এ না**।

Tota AI app (যেটা আপনি এখন দেখছেন) → Lovable এর shadcn use করছে
Tota AI দিয়ে তৈরি projects → আপনার uploaded template use করবে

---

## Approve করলে যা করব:

1. প্রথমে Preview System fix করব (সবচেয়ে গুরুত্বপূর্ণ)
2. Template integration করব
3. PageManager তৈরি করব
4. Auto-save যোগ করব
5. Privacy/Terms pages তৈরি করব

এই plan approve করলে আমি implement শুরু করব।
