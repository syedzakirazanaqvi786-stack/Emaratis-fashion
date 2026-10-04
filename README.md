# EMARATIS FASHION — HAUTE COUTURE DIGITAL ATELIER

An ultra-premium, dark-themed, cinematic luxury fashion website designed for **Emaratis Fashion**, featuring a fluid 360-degree interactive rotating dress showcase and haute couture boutique experience.

---

## Key Features

1. **Interactive 360° Studio (Hero Section)**:
   - **240 High-Definition Studio Frames** (`ezgif-252ce33e2d298fa6-jpg/`).
   - **Dual-Tier Progressive Preloading**: Frame 1 appears instantly, keyframes allow immediate rotation within ~200ms, and intermediate frames load silently in the background.
   - **Inertia & Momentum Damping**: Natural deceleration physics when dragging or swiping with mouse or mobile touch.
   - **Continuous Auto-Rotation**: Gentle runway auto-spin with smart idle resumption after 2.2 seconds.
   - **Precision Angle Scrubbing**: 0° to 360° range scrubber and quick angle preset selectors (Front 0°, Profile 90°, Back 180°, Turn 270°).
   - **Magnifier Zoom & Fullscreen**: 2.2x detail inspection of the pure mulberry silk and antique gold zardozi embroidery.

2. **Luxury Haute Couture Aesthetics**:
   - Deep pitch black background (`#000000` / `#050505`) with ambient champagne gold radial glows.
   - Metallic gold accents (`#D4AF37`, `#F4E095`) and refined glassmorphism navigation.
   - Editorial typography: *Cinzel*, *Playfair Display*, and *Cormorant Garamond* paired with clean *Montserrat* body typography.

3. **Multi-Currency Real-Time Engine**:
   - Instant currency toggling between **USD ($)**, **AED (د.إ)**, and **PKR (₨)** across all hero prices, product cards, quick views, and cart totals.

4. **"The Capsule Wardrobe" Interactive Lookbook**:
   - Filterable catalog tabs: *All Designs*, *Silk Gowns*, *Evening Wear*, *Bespoke Cut*.
   - Dynamic product cards with hover zoom and quick inspection modal.
   - Save to Wishlist with counter badge and drawer.

5. **Slide-Out Boutique Drawers & Concierge Modals**:
   - **Curated Bag Drawer**: Dynamic quantities, subtotal calculation, and direct checkout transfer to VIP Concierge.
   - **Quick View Modal**: Fabric specifications, artisan stitch hours, sizing options, and composition blueprints.
   - **Bespoke Commission Modal**: Client inquiry form with automatic WhatsApp concierge routing.
   - **Live Search Overlay**: Instant search for gowns, silhouettes, and fabrics.

6. **Haute Couture Runway Audio Synthesizer**:
   - Built-in Web Audio API soundscape simulating the ambient warmth of an exclusive runway showcase with mute/unmute toggle.

---

## How to Run Locally

You can launch the website on `localhost` using any of the following methods:

### Option 1: Zero-Dependency Node.js Local Server (Recommended)
No `npm install` needed! Simply run:
```bash
node server.js
```
or with npm:
```bash
npm start
```
Then open your browser at:
```
http://localhost:3000
```

### Option 2: Python Built-In Server
If you prefer Python:
```bash
python -m http.server 3000
```
Then open:
```
http://localhost:3000
```

### Option 3: VS Code Live Server
- Open the project folder in VS Code.
- Right-click `index.html` and click **"Open with Live Server"**.

---

## Project Structure

```
sarri website/
├── ezgif-252ce33e2d298fa6-jpg/     # 240 high-resolution sequential frames for the 360 viewer
│   ├── ezgif-frame-001.jpg
│   └── ... (up to ezgif-frame-240.jpg)
├── assets/
│   ├── css/
│   │   └── styles.css              # Custom haute couture styles, glassmorphism, gold gradients
│   ├── js/
│   │   ├── viewer360.js            # HTML5 Canvas 360° rotation engine & momentum physics
│   │   ├── store.js                # Currency conversion, catalog state, cart & wishlist drawers
│   │   └── main.js                 # Orchestrator, accordions, search, and navigation
│   └── images/                     # High-res craftsmanship crops and lookbook photography
│       ├── craft-bodice.jpg
│       ├── craft-hemline.jpg
│       ├── craft-sleeve.jpg
│       ├── craft-back.jpg
│       ├── couture-emerald.jpg
│       ├── couture-noir.jpg
│       └── couture-ivory.jpg
├── index.html                      # Main luxury website
├── server.js                       # Fast, zero-dependency Node static server
├── package.json                    # NPM scripts configuration
└── README.md                       # Documentation & run instructions
```

---

*© 2026 EMARATIS FASHION. Handcrafted with distinction. All Rights Reserved.*
