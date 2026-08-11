# Chainvoice Brand Kit

This folder is the canonical source for Chainvoice's visual identity: logo, favicons/icons, color palette, and typography. All assets referenced below live in this `brand/` folder.

## Logo

| Asset | File |
| --- | --- |
| Primary logo (SVG) | [`logo.svg`](./logo.svg) |

The logo is a rounded square badge (dashed border) containing two interlocking arrows in the brand green, symbolizing the two-way flow of invoices and payments between parties.

## Favicons & Icons

Generated from `logo.svg` at the standard sizes used across browsers, bookmarks, and mobile home screens:

| File | Size | Use |
| --- | --- | --- |
| [`favicon.ico`](./favicon.ico) | 16/32/48 (multi-res) | Classic browser favicon |
| [`favicon-16x16.png`](./favicon-16x16.png) | 16×16 | Browser tab |
| [`favicon-32x32.png`](./favicon-32x32.png) | 32×32 | Browser tab (HiDPI) |
| [`favicon-48x48.png`](./favicon-48x48.png) | 48×48 | Windows taskbar |
| [`apple-touch-icon.png`](./apple-touch-icon.png) | 180×180 | iOS home screen |
| [`icon-512.png`](./icon-512.png) | 512×512 | PWA manifest / app icon |

## Color Palette

### Brand Accent

| Swatch | Name | Hex |
| --- | --- | --- |
| 🟩 | Chainvoice Green (logo) | `#25C65E` |
| 🟩 | Stability Nexus Green | `#228B22` |
| 🟨 | Stability Nexus Gold | `#FFC517` |

Source: [`frontend/public/logo.svg`](../frontend/public/logo.svg) and the badge colors used in [`README.md`](../README.md).

### UI Design Tokens

The app itself uses a semantic, HSL-based token system (light/dark) defined in [`frontend/src/index.css`](../frontend/src/index.css) and mapped in [`frontend/tailwind.config.js`](../frontend/tailwind.config.js):

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `hsl(0 0% 100%)` | `hsl(224 71.4% 4.1%)` |
| `foreground` | `hsl(224 71.4% 4.1%)` | `hsl(210 20% 98%)` |
| `primary` | `hsl(220.9 39.3% 11%)` | `hsl(210 20% 98%)` |
| `secondary` / `muted` / `accent` | `hsl(220 14.3% 95.9%)` | `hsl(215 27.9% 16.9%)` |
| `destructive` | `hsl(0 84.2% 60.2%)` | `hsl(0 62.8% 30.6%)` |
| `border` / `input` | `hsl(220 13% 91%)` | `hsl(215 27.9% 16.9%)` |
| `chart-1` … `chart-5` | see `index.css` | see `index.css` |

These tokens are consumed via Tailwind utility classes (e.g. `bg-background`, `text-primary`) rather than hardcoded hex values, so any palette change happens in one place.

## Typography

Defined in [`frontend/index.html`](../frontend/index.html) (Google Fonts import) and registered in `tailwind.config.js`:

| Font | Weights | Usage |
| --- | --- | --- |
| **Inter** | 400–700 | Body text, UI copy |
| **Montserrat** | 600–700 | Headings, emphasis |

Both are loaded as `fontFamily.Inter` / `fontFamily.Montserrat` Tailwind utilities.
