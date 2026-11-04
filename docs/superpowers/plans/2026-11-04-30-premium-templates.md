# 30 Premium Templates (5 Per Category) Implementation Plan

- **Goal:** Deliver a world-class theme engine with exactly 5 distinct, production-grade, highly specialized templates per industry category (6 categories x 5 templates = 30 templates).
- **Architecture:** OOP singleton and factory pattern (`TemplateFactory`), industry-tailored UI variants with specific category telemetry, fully reactive cart, BDT currency formatting, and dynamic live catalog synchronization.
- **Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Vitest.

---

## 1. Scope & Matrix Overview

### 30 Specialized Templates Across 6 Categories

| Category | Category ID | 5 Assigned Templates |
|---|---|---|
| **👗 Fashion & Apparel** | `fashion` | 1. `minimal` (Minimal Atelier)<br>2. `clothing` (Clothing.co)<br>3. `milano` (Milano Streetwear)<br>4. `nickelfox` (NickelFox Bold)<br>5. `athleisure` (Aero Athleisure) |
| **🌸 Beauty & Cosmetics** | `beauty_cosmetics` | 1. `glow` (Clinical Botanical)<br>2. `luxe-glam` (Velvet Glam Parfumerie)<br>3. `k-beauty` (Seoul Dew K-Beauty)<br>4. `derma-rx` (Dermacure Lab Rx)<br>5. `apothecary` (Herbal Apothecary) |
| **👞 Footwear & Shoes** | `shoes` | 1. `artisan` (Warm Heritage Guild)<br>2. `velocity` (Velocity Sneaker Vault)<br>3. `street-hype` (SoleStreet Hype)<br>4. `bespoke` (Milano Bespoke Oxford)<br>5. `alpine-trek` (Summit Alpine Trail) |
| **⚡ Electronics & Tech** | `electronics` | 1. `bold` (Acoustic Cyber)<br>2. `lumina` (Lumina Zen Silicon)<br>3. `cyber-rgb` (CyberForge RGB Esports)<br>4. `smart-home` (Aura IoT Smart Home)<br>5. `studio-rig` (Studio Rig Pro Creator) |
| **💎 Jewelry & Luxury** | `jewelry` | 1. `maison` (Opulent Royal Maison)<br>2. `aurora` (Aurora Fine Atelier)<br>3. `solitaire` (GIA Solitaire Lounge)<br>4. `raw-silver` (Nordic Silver Craft)<br>5. `chronos` (Chronos Complication) |
| **☕ Food & Grocery** | `grocery_food` | 1. `pantry` (Artisan Pantry)<br>2. `bazaar` (Fresh Daily Bazaar)<br>3. `patisserie` (Haute French Pâtisserie)<br>4. `matcha-zen` (Zen Matcha Ceremony)<br>5. `smokehouse` (Prime Cellar & Smokehouse) |

---

## 2. File Modification & Creation Map

| Component / Layer | File Path | Responsibility |
|---|---|---|
| **Categories Registry** | `src/config/categories.ts` | Map all 6 categories to their 5 `availableTemplates` |
| **Template Factory** | `src/templates/template.factory.ts` | Register all 30 template aliases with fallback routing |
| **Template Switcher Dock** | `src/components/store/template-switcher-bar.tsx` | All 30 template choices, category filters `(5)` for each |
| **Fashion: Athleisure** | `src/components/store/templates/athleisure-storefront.tsx` | 5th Fashion template: Kinetic slate/neon volt, stretch % index |
| **Beauty Storefront** | `src/components/store/templates/beauty-storefront.tsx` | 5 variants: `glow`, `luxe-glam`, `k-beauty`, `derma-rx`, `apothecary` |
| **Footwear Storefront** | `src/components/store/templates/footwear-storefront.tsx` | 5 variants: `artisan`, `velocity`, `street-hype`, `bespoke`, `alpine-trek` |
| **Tech Storefront** | `src/components/store/templates/tech-storefront.tsx` | 5 variants: `bold`, `lumina`, `cyber-rgb`, `smart-home`, `studio-rig` |
| **Jewelry Storefront** | `src/components/store/templates/jewelry-storefront.tsx` | 5 variants: `maison`, `aurora`, `solitaire`, `raw-silver`, `chronos` |
| **Pantry Storefront** | `src/components/store/templates/pantry-storefront.tsx` | 5 variants: `pantry`, `bazaar`, `patisserie`, `matcha-zen`, `smokehouse` |
| **Tenant Storefront Router** | `src/app/store/[tenant]/page.tsx` | Routes `currentTemplateId` to the appropriate component and variant |
| **Merchant Dashboard** | `src/app/store/[tenant]/dashboard/page.tsx` | In-dashboard theme switcher showing 30 categorized templates |
| **Unit Verification** | `tests/unit/template-system.test.ts` | Tests asserting 30 templates resolve, 5 per category |

---

## 3. Tasks Decomposition

### Task 1: Update Core Registry & Factory with All 30 Templates
- **Files:** `src/config/categories.ts`, `src/templates/template.factory.ts`
- **Actions:**
  1. Update `availableTemplates` in `CATEGORIES_MAP` for all 6 categories so each lists its exact 5 template IDs.
  2. Register all 30 template aliases in `TemplateFactory` to route seamlessly to their OOP parent templates.
  3. Verify with `npx tsc --noEmit`.

### Task 2: Update `TemplateSwitcherBar` with 30 Production Choices
- **Files:** `src/components/store/template-switcher-bar.tsx`
- **Actions:**
  1. Update `CATEGORY_FILTERS` counts to `(5)` each.
  2. Add all 30 `TemplateChoice` definitions with unique names, badges, hex colors, and descriptions.
  3. Verify with `npx tsc --noEmit`.

### Task 3: Build `AthleisureStorefront` (5th Fashion Template)
- **Files:** `src/components/store/templates/athleisure-storefront.tsx`
- **Actions:**
  1. Implement modern sportswear theme with kinetic slate `#0f172a`, neon volt `#ccff00` accents.
  2. Add active stretch %, moisture-wicking index, sweatproof ratings, quick-add variant chips.
  3. Connect dynamic products, ৳ currency, cart drawer, express checkout.

### Task 4: Expand `BeautyStorefront` to 5 Distinct Variants
- **Files:** `src/components/store/templates/beauty-storefront.tsx`
- **Actions:**
  1. Add `k-beauty` (Seoul Dew pastel lavender/peach, 7-skin hydration tracker, snail mucin/centella %).
  2. Add `derma-rx` (Dermacure clinical sterile white/cobalt blue, pH indicator, lab-tested ceramide lipids).
  3. Add `apothecary` (Amber glass brown, parchment tan, cold-pressed botanical extraction notes).
  4. Retain `glow` and `luxe-glam`.

### Task 5: Expand `FootwearStorefront` to 5 Distinct Variants
- **Files:** `src/components/store/templates/footwear-storefront.tsx`
- **Actions:**
  1. Add `street-hype` (SoleStreet Hype: concrete gray/cyan, deadstock authentication badge, release alerts).
  2. Add `bespoke` (Milano Bespoke Oxford: deep espresso/burnished gold, hand-patina guide, chisel-toe specs).
  3. Add `alpine-trek` (Summit Alpine Trail: evergreen/safety orange, GORE-TEX waterproof ratings, terrain grip meter).
  4. Retain `artisan` and `velocity`.

### Task 6: Expand `TechStorefront` to 5 Distinct Variants
- **Files:** `src/components/store/templates/tech-storefront.tsx`
- **Actions:**
  1. Add `cyber-rgb` (CyberForge RGB Esports: matte obsidian/RGB neon, 240Hz polling rate telemetry).
  2. Add `smart-home` (Aura IoT Smart Home: residential stone/soft blue, Matter/Zigbee compatibility matrix).
  3. Add `studio-rig` (Studio Rig Pro Creator: broadcast charcoal/studio amber, 4K bitrate, thermal cooling stats).
  4. Retain `bold` and `lumina`.

### Task 7: Expand `JewelryStorefront` to 5 Distinct Variants
- **Files:** `src/components/store/templates/jewelry-storefront.tsx`
- **Actions:**
  1. Add `solitaire` (GIA Solitaire Lounge: platinum white, interactive 4Cs diamond loupe matrix).
  2. Add `raw-silver` (Nordic Silver Craft: oxidized 925 raw silver, hand-hammered texture notes).
  3. Add `chronos` (Chronos Complication: haute horlogerie anthracite, skeleton movement tourbillon display).
  4. Retain `maison` and `aurora`.

### Task 8: Expand `PantryStorefront` to 5 Distinct Variants
- **Files:** `src/components/store/templates/pantry-storefront.tsx`
- **Actions:**
  1. Add `patisserie` (Haute French Pâtisserie: pastel rose & gold foil, single-origin cacao %, ganache layers).
  2. Add `matcha-zen` (Zen Matcha Ceremony: ceremonial Uji matcha green, first-harvest flush rating, whisk guide).
  3. Add `smokehouse` (Prime Cellar & Smokehouse: charred hickory & aged crimson, A5 Wagyu marbling score, barrel age).
  4. Retain `pantry` and `bazaar`.

### Task 9: Update Tenant Storefront Router & Merchant Dashboard
- **Files:** `src/app/store/[tenant]/page.tsx`, `src/app/store/[tenant]/dashboard/page.tsx`
- **Actions:**
  1. Wire all 30 template IDs in `page.tsx` to the corresponding storefront component and variant prop.
  2. Ensure merchant dashboard appearance tab allows filtering and previewing all 30 templates with 1-click apply.

### Task 10: Verification & Test Suite
- **Files:** `tests/unit/template-system.test.ts`
- **Actions:**
  1. Add assertions ensuring all 6 categories have exactly 5 available templates.
  2. Add assertions that all 30 templates resolve cleanly via `TemplateFactory`.
  3. Run `npx tsc --noEmit` and `npm test -- --run`.
  4. Commit all clean changes to git.

