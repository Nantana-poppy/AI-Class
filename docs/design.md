---
name: Kinetic Executive
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  numeric-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system targets high-velocity sales professionals, account managers, and business operators who require frictionless mobile-first CRM tracking. The personality balances razor-sharp executive competence with approachable modern tech simplicity.

### Visual Style
- **Aesthetic Movement:** Corporate Modern meets Crisp Minimalist SaaS.
- **Atmosphere:** High-clarity, distraction-free workspaces with calibrated contrast ratios and functional information density.
- **Language & Tone:** Professional Thai enterprise terminology combined with standard English SaaS idioms (e.g., "ติดตามผล", "สถานะการขาย", "ปิดการขาย", "Overdue").

## Colors
The color hierarchy directs immediate attention to actionable pipelines, lead health, and task states:

- **Primary Canvas & Slate Navy (`#0F172A`):** Used for primary navigation, high-emphasis text, and active interactive anchors.
- **Royal Indigo Accent (`#4F46E5`):** Reserved for primary call-to-actions, focused form inputs, and active tab indicators.
- **Surface Slate (`#F8FAFC`):** Subtle non-distracting screen background that elevates crisp white cards.
- **Crisp Surface Container (`#FFFFFF`):** Base background for interactive cards, sheets, and popovers.

### Functional Status Indicators
- **Pending / รอดำเนินการ:** Amber (`#F59E0B`), surface tint (`#FEF3C7`), text (`#B45309`).
- **In Progress / กำลังติดต่อ:** Sky Blue (`#3B82F6`), surface tint (`#DBEAFE`), text (`#1D4ED8`).
- **Completed & Won / สำเร็จ:** Emerald (`#10B981`), surface tint (`#D1FAE5`), text (`#047857`).
- **Overdue & Lost / เกินกำหนด:** Rose (`#EF4444`), surface tint (`#FEE2E2`), text (`#B91C1C`).
- **Dividers & Structural Borders:** Slate 200 (`#E2E8F0`).

## Typography
Typography is optimized for bilingual Thai and English data strings. Plus Jakarta Sans handles titles and financial metrics with clean geometric confidence, while Inter preserves legibility in Thai script at dense sizes.

- Ensure Thai line-height allowances prevent clipping of upper tone marks and lower vowels.
- Use `numeric-metric` for key performance cards (e.g., deal volume, overdue counts).

## Layout & Spacing
A fluid column grid provides continuous flexibility on narrow screens, expanding to structured multi-column boards on tablets and desktops.

- **Mobile Viewport (< 640px):** Single-column stack with dynamic bottom safe-area insets (`1rem` margin). Touch targets must remain at least `44px` tall.
- **Tablet / Split View (640px - 1024px):** 2-column layout (Left list/pipeline, Right deal inspection panel).
- **Desktop Viewport (> 1024px):** 12-column responsive grid with a sticky sidebar, 4-stage Kanban swimlanes, or tabular views.

## Elevation & Depth
Depth relies on crisp borders reinforced by subtle diffuse shadows:

- **Flat/Base Level:** Pure `#FFFFFF` surface bordered by a continuous `1px solid #E2E8F0` border.
- **Card Rest Level:** `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05); border: 1px solid #E2E8F0`.
- **Card Hover / Dragged State:** `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03); border-color: #CBD5E1`.
- **Modals, Bottom Drawers & Dropdowns:** `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06); border: 1px solid #E2E8F0`.

## Shapes
A unified rounded structure (`0.5rem` / `8px` baseline) establishes balance between modern friendliness and enterprise discipline:

- **Cards & Modal Sheets:** `rounded-lg` (`1rem` / `16px`) to define distinct content regions.
- **Buttons, Form Inputs, & Tab Bars:** `rounded` (`0.5rem` / `8px`).
- **Pills & Status Chips:** Full pill radius (`9999px`) for immediate status distinction.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, text `#FFFFFF`, hover `#4338CA`, active `#3730A3`. Minimum height `44px` on mobile.
- **Secondary:** Surface `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`, hover `#F8FAFC`.
- **Ghost / Action Icon:** Transparent background, text `#64748B`, hover background `#F1F5F9`.

### Status Badges & Chips
- Designed as rounded pill containers (`padding: 4px 10px`, `label-sm` typography).
- Pair filled tint background with bold colored text and a leading 6px circular dot indicator matching the accent color.

### Form Inputs & Search Fields
- Crisp border (`#CBD5E1`), background `#FFFFFF`, text `#0F172A`, placeholder `#94A3B8`.
- Focus state triggers `border-color: #4F46E5` and a `ring-2 ring-indigo-100` halo.

### Follow-up Task Cards
- Compact data layout: Lead name in bold (`Plus Jakarta Sans`), company/source badge, countdown pill showing days remaining, and quick action icon buttons (Call, WhatsApp, Email).

### Filter Tabs & Quick Segments
- Horizontal scrolling segmented control container on mobile with light slate background (`#F1F5F9`) and sliding white surface pill for the active tab state.