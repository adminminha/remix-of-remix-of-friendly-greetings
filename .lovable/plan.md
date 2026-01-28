

# 🦜 Tota AI - সম্পূর্ণ MVP Implementation Plan

## 📊 বর্তমান অবস্থা - যা শুধু UI Shell

আপনি সঠিক বলেছেন। এখন পর্যন্ত শুধু:
- ✅ Tota AI এর Landing page UI
- ✅ Dashboard UI
- ✅ Builder layout (40/60 split)
- ✅ Chat interface UI (messages save হয়)
- ✅ AI response আসে (Lovable Gateway থেকে)
- ❌ কিন্তু AI actual React code generate করে না!
- ❌ Preview panel এ কিছুই render হয় না!

---

## 🎯 সম্পূর্ণ Implementation Plan (Task by Task)

### Phase 1: Core Code Generation System 🔴 (সবচেয়ে গুরুত্বপূর্ণ)

#### Task 1.1: AI Code Generation Edge Function
**নতুন Edge Function তৈরি করব: `generate-component`**

এই function যা করবে:
- User request নিবে (যেমন: "একটা hero section বানাও")
- AI দিয়ে actual React/JSX code generate করবে
- Pre-structured template components use করবে (Button, Card, Input etc.)
- Generated code database এ save করবে (`files` table)
- Code return করবে

**Output:**
```typescript
{
  code: "const Hero = () => { return <div>...</div> }",
  componentName: "Hero",
  filePath: "src/components/Hero.tsx"
}
```

#### Task 1.2: Files Management System
- Project এর সব files track করা (`files` table ব্যবহার করে)
- File create, update, delete functionality
- Pre-structured template থেকে initial files copy করা (নতুন project এ)

---

### Phase 2: Live Preview System 🔴

#### Task 2.1: Preview Rendering (Most Critical!)
**PreviewPanel কে functional করব:**

- AI generated code নিবে
- Real-time iframe এ render করবে
- iframe এর ভিতরে: React + Tailwind + Template components

**How it works:**
1. Chat এ message send করলে → AI code generate করে
2. Code → files table এ save হয়
3. Preview panel → files থেকে load করে
4. iframe এ → sandboxed React app render করে

#### Task 2.2: Hot Reload System
- Code change হলে immediately preview update
- Device switching (Desktop/Tablet/Mobile)
- Refresh button কাজ করা

---

### Phase 3: Multi-Page Support 🟡

#### Task 3.1: PageManager Component
**নতুন component: `src/components/builder/PageManager.tsx`**

Features:
- Sidebar এ pages list দেখাবে
- Current page highlight হবে
- "Add Page" button
- Page rename/delete করা যাবে
- Pages database থেকে load হবে (`pages` table)

#### Task 3.2: Page Switching
- Click করলে page switch হবে
- Preview update হবে
- Chat context update হবে (কোন page এ আছেন)

---

### Phase 4: Builder Enhanced Features 🟡

#### Task 4.1: Auto-Save (Every 30 seconds)
- useInterval hook
- Save status indicator (TopBar এ)
- "Saving..." → "Saved at 2:30 PM"

#### Task 4.2: Component Selector
- Dropdown/sidebar with available components
- Click করলে chat এ prompt add হবে
- Categories: Layout, Forms, Navigation, Content

#### Task 4.3: Basic Style Editor
- Selected element এর styles change করা
- Color picker
- Spacing controls
- Font size/weight

---

### Phase 5: Code Export 🟡

#### Task 5.1: Export as React
- Download complete project as zip
- All components + pages
- package.json, tailwind config, etc.

#### Task 5.2: Export as HTML
- Static HTML export
- Inline CSS
- Single file output

---

### Phase 6: Deployment 🟢

#### Task 6.1: Deploy Button Functionality
**নতুন Edge Function: `deploy-project`**

- Project build করবে
- Static files generate করবে
- Unique URL assign করবে (*.tota.ai)
- Deploy status tracking

#### Task 6.2: Preview URL Generation
- Each project gets preview URL
- Auto-update on save
- Shareable link

---

### Phase 7: Missing Pages 🟢

#### Task 7.1: Privacy Policy Page
- `/privacy` route
- Standard privacy policy content
- Footer থেকে link করা

#### Task 7.2: Terms of Service Page
- `/terms` route
- Standard ToS content
- Footer থেকে link করা

---

## 🏗️ Technical Architecture

### New Edge Functions:
1. `generate-component` - AI code generation
2. `deploy-project` - Deployment service
3. `build-preview` - Preview URL generation

### New Frontend Components:
1. `PageManager.tsx` - Sidebar pages list
2. `ComponentSelector.tsx` - Component palette
3. `StyleEditor.tsx` - Basic styling controls
4. `ExportDialog.tsx` - Export options

### Database Usage:
- `files` - Store generated code files
- `pages` - Multi-page tracking
- `projects.preview_url` - Live preview URL

---

## 📅 Implementation Order (Recommended)

| Priority | Task | Time Estimate |
|----------|------|---------------|
| 🔴 1 | AI Code Generation Edge Function | 1-2 sessions |
| 🔴 2 | Live Preview Rendering | 1-2 sessions |
| 🔴 3 | Files Management | 1 session |
| 🟡 4 | PageManager Component | 1 session |
| 🟡 5 | Auto-Save | 30 mins |
| 🟡 6 | Component Selector | 1 session |
| 🟡 7 | Code Export | 1 session |
| 🟢 8 | Deploy System | 1-2 sessions |
| 🟢 9 | Privacy/Terms Pages | 30 mins |

**মোট সময়: 8-12 sessions**

---

## 🎯 MVP শেষে কী কী কাজ করবে:

1. ✅ User chat এ বাংলা/English এ বলবে "hero section বানাও"
2. ✅ AI actual React code generate করবে
3. ✅ Preview panel এ real-time render হবে
4. ✅ Multiple pages create করা যাবে
5. ✅ Auto-save হবে
6. ✅ Code export করা যাবে (React/HTML)
7. ✅ One-click deploy হবে (*.tota.ai)
8. ✅ Pre-structured template ব্যবহার করবে

---

## ⚠️ Important Notes

1. **Pre-structured template**: আপনার দেওয়া `New_Text_Document_1.txt` এর components (Button, Card, etc.) AI generated code এ use হবে - এটা Tota AI এর end-user projects এ যাবে

2. **Current shadcn/ui**: Lovable এ যেটা আছে সেটা Tota AI app এর জন্য - end-user এর জন্য না

3. **Incremental Updates**: Phase 2+ এ implement হবে - initially full component generation

এই plan অনুযায়ী implement করলে Tota AI fully functional no-code builder হয়ে যাবে! 🚀

