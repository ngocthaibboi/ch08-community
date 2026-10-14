---
name: Cyber Lounge F&B Command
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#fff3ea'
  on-tertiary: '#472a00'
  tertiary-container: '#ffd19c'
  on-tertiary-container: '#855300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-station:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.05em
  label-status:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-kds: 1.25rem
  margin: 1.5rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

The brand personality merges high-performance esports engineering with the rapid operational rhythm of high-volume cyber cafe food and beverage service. It embodies technical precision, adrenaline, nocturnal focus, and relentless reliability. 

Designed for lounge operators, station managers, and fast-paced kitchen/barista crews, the interface projects an authoritative command-deck atmosphere. It avoids whimsical cartoon aesthetics in favor of sharp, functional cyberpunk HUD architecture: dense operational data, hyper-readable status indicators, and luminous visual hierarchy.

The design style combines **Dark High-Contrast Tech** with controlled **Glassmorphism and Cyberpunk Luminescence**:
- Ultra-deep midnight backplates (#0B0F19, #111827) provide absolute negative space to prevent ambient screen glare in dimmed gaming arenas.
- Controlled neon light emission (electric cyan, neon lime, hyper amber, and tactical crimson) serves strictly semantic operational goals: identifying order states, terminal tiers (VIP vs Standard), and urgency triggers.
- Translucent container surfaces and structural hairline dividers evoke military HUDs and professional telemetry software.

## Colors

The palette is tuned specifically for low-light cyber cafe environments, ensuring intense contrast ratios (WCAG AAA for primary text) without ocular fatigue during extended shifts.

### Palette Architecture
- **Primary (`#00F0FF` - Electric Cyan):** Core telemetry, focused active states, primary system actions, high-tier workstation identification (`Máy VIP`), and active cursor glows.
- **Secondary (`#10B981` - Neon Matrix Lime):** Success states, fulfilled orders (`Hoàn thành`, `Đã giao`), healthy terminal statuses, and online indicators.
- **Tertiary (`#F59E0B` - Energetic Flame Amber):** Food highlights, orders in progress (`Đang làm`), modifier alerts, and prep timers approaching escalation thresholds.
- **Critical / Urgent (`#EF4444` - Crimson Beacon):** Queued pending kitchen orders (`Chờ chế biến`), overdue tickets, hardware faults, and immediate call-outs.
- **Neutral Core (`#0B0F19` canvas, `#111827` surface-1, `#1F2937` surface-2/borders):** Deep black-blue foundation layers that eliminate ambient contrast washout.

### Functional Surfaces
- Base Canvas: `#0B0F19`
- Card/Panel Fill: `rgba(17, 24, 39, 0.75)` with `backdrop-filter: blur(16px)`
- Subtle Grid / Borders: `rgba(31, 41, 55, 0.8)` with active states jumping to `rgba(0, 240, 255, 0.35)`
- High-Contrast Text: `#F9FAFB` (Primary), `#9CA3AF` (Secondary / Timestamps), `#4B5563` (Muted / Labels)

## Typography

Typography establishes an instant operational partition: **Space Grotesk** drives structural wayfinding, terminal tags, metric callouts, and statuses, while **Inter** delivers clean, rapid parsing for nested food items, customer add-ons, and detailed order logs.

### Application Rules
- **Terminal & Machine Identifiers (`label-station`):** Always rendered in uppercase Space Grotesk with expanded tracking (`0.05em`) to ensure instant station recognition from several meters away (e.g., `MÁY VIP-08`, `MÁY ZONE-A-12`).
- **Kitchen Status Tickers (`label-status`):** Rendered in Space Grotesk Bold, fully capitalized with distinct optical framing (`0.08em` tracking).
- **Line Items & Quantities:** Set in Inter with tabular numerals (`font-feature-settings: 'tnum' on, 'zero' on`) so multi-item order prices, counts, and wait-time counters stack without horizontal shifting.
- **Vietnamese Language Support:** Both typefaces guarantee complete diacritic integrity without glyph clipping or vertical baseline breaks on characters such as `ờ`, `ế`, and `đ`.

## Layout & Spacing

The layout is built exclusively for desktop monitors, wall-mounted KDS (Kitchen Display System) displays, and multi-monitor manager command bars (1080p through 4K displays).

### Layout Grid Model
- **Primary Grid:** 12-column or 16-column flexible layout with consistent `gutter: 1rem` and `margin: 1.5rem`.
- **KDS Board Layout:** A dedicated horizontal swimlane model utilizing continuous flex columns with `gutter-kds: 1.25rem`. Order cards stack vertically within fixed-width buckets (320px to 360px per lane), ensuring zero horizontal scrolling during peak operating hours.
- **POS / Station Grid:** Multi-pane dashboard using rigid structural splits: left rail for lounge zone map / PC station filters (260px fixed), center zone for active interactive ordering/menu matrix (fluid), right rail for live ticket inspection and quick dispatch (380px fixed).

### Internal Component Spacing
- Compact metrics utilize `space-xs` (4px) and `space-sm` (8px) for tightly coupled visual tokens (e.g., station status dots and PC IDs).
- Card container internal padding strictly locks to `space-md` (12px) for high-density tables or `space-lg` (16px) for standard order cards.

## Elevation & Depth

Visual hierarchy does not use soft natural daylight shadows. Instead, depth is achieved through **translucent layered darkness**, **cybernetic hairline borders**, and **semantically charged colored rim luminescence**.

### Depth Tiers
- **Tier 0 (Deep Ground):** Canvas background `#0B0F19` with a subtle technical dot-grid pattern (`radial-gradient(rgba(31, 41, 55, 0.4) 1px, transparent 1px)` spaced at 24px intervals).
- **Tier 1 (Surface Containers):** Dark panels at `#111827` with 75% alpha, 16px backdrop blur, and a 1px border of `rgba(31, 41, 55, 0.9)`.
- **Tier 2 (Elevated Active Cards):** Foreground KDS tickets and focused workstations at `rgba(20, 28, 45, 0.9)`, featuring a 1px border tinted by station class or state:
  - *Standard PC:* `rgba(0, 240, 255, 0.2)`
  - *VIP PC:* `rgba(0, 240, 255, 0.6)` with outer halo `box-shadow: 0 0 16px rgba(0, 240, 255, 0.15)`
  - *Urgent Kitchen Ticket:* `rgba(239, 68, 68, 0.5)` with pulsating outer rim glow `box-shadow: 0 0 20px rgba(239, 68, 68, 0.2)`
- **Tier 3 (Floating HUD Overlays & Modals):** `#0F172A` with 95% opacity, 24px backdrop blur, bordered by `rgba(0, 240, 255, 0.4)`, and projected shadow `0 20px 40px -10px rgba(0, 0, 0, 0.8)`.

## Shapes

The system adheres to an angular, tactical, aerospace-inspired edge profile. A low roundedness profile (`roundedness: 1`) provides crisp precision across all modules.

### Geometries
- **Base Components (Buttons, Inputs, Cards):** `0.25rem` (4px) corner radius. This prevents the interface from feeling bubbly or casual while avoiding razor-sharp 0px brutalist unfriendliness.
- **Station Badges & Tags:** Chamfered or cut-corner geometry on primary station chips (e.g., `clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)`) or locked to a tight 2px radius.
- **Status Indicators:** Micro pill-capsules or crisp square dots (4px) with high-intensity centered light sources.

## Components

### 1. Buttons
- **Primary Cyber Button:** Cyan fill (`#00F0FF`) with ultra-dark slate text (`#0B0F19`), font `Space Grotesk` 600. On hover: inner bloom effect and outer glow `box-shadow: 0 0 14px rgba(0, 240, 255, 0.45)`.
- **Action Secondary:** Dark base (`#111827`), 1px border in `rgba(0, 240, 255, 0.4)`, text in `#00F0FF`. On hover: background transitions to `rgba(0, 240, 255, 0.1)`.
- **Urgent / Expedite Action:** Fiery crimson fill (`#EF4444`) or border with pulsing ambient aura for orders requiring instant priority.

### 2. PC Table & Station Badges
- **VIP Station Badge:** High-luminance chip with background `rgba(0, 240, 255, 0.12)`, border `1px solid #00F0FF`, text `#00F0FF` (`MÁY VIP-08`). Includes an integrated micro beacon dot.
- **Zone Station Badge:** Dark slate chip with border `1px solid #374151`, text `#E5E7EB` (`MÁY ZONE-A-12`).

### 3. Kitchen Status Chips (KDS Indicators)
- **Chờ chế biến (Pending):** Crimson indicator (`#EF4444`). Border `rgba(239, 68, 68, 0.3)`, fill `rgba(239, 68, 68, 0.1)`, text `#FCA5A5`. Accompanied by a flashing timer once wait duration exceeds 10 minutes.
- **Đang làm (In Progress):** Amber highlight (`#F59E0B`). Border `rgba(245, 158, 11, 0.35)`, fill `rgba(245, 158, 11, 0.1)`, text `#FCD34D`.
- **Hoàn thành (Completed):** Neon matrix lime (`#10B981`). Border `rgba(16, 185, 129, 0.35)`, fill `rgba(16, 185, 129, 0.1)`, text `#6EE7B7`.
- **Đã giao (Delivered):** Muted cool gray (`#6B7280`). Subdued surface to reduce visual competition on finished tickets.

### 4. Cards & Food Order Tickets
- **KDS Ticket Card:** Card header displays station badge, elapsed prep timer, and ticket ID. Body renders order items with bold count multipliers (e.g., `2x Mì Trộn Indomie Double Trứng`, `1x Sting Dâu Lạnh`). Modifiers (e.g., `Không hành`, `Ít cay`) render in amber tertiary `#F59E0B`.
- **Card Separators:** 1px hairline horizontal rules tinted `rgba(31, 41, 55, 0.8)`.

### 5. Input Fields & Search Bars
- Background `rgba(11, 15, 25, 0.85)`, border `1px solid #374151`, text `#F9FAFB`. Placeholder `#4B5563`.
- Focus state: border transforms instantly to `#00F0FF` with a subtle glow `box-shadow: 0 0 8px rgba(0, 240, 255, 0.25)`. Includes built-in clear button and shortcut indicator (e.g., `[ESC]`).

### 6. Station Matrix Grid (Floor Map Component)
- Interactive grid view of all cafe machines. Each cell indicates power state, logged-in customer handle, active session time remaining, and a glowing dot badge indicating pending food/drink delivery.