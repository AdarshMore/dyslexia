# Design Guidelines: NeuroLearn PWA

## Design Approach

**System Selected**: Custom Accessibility-First System inspired by Material Design's component structure but optimized for neurodiverse learners

**Guiding Principles**:
- Maximum clarity with minimal cognitive load
- Generous spacing to reduce visual overwhelm
- Consistent, predictable patterns throughout
- Touch-optimized for mobile (minimum 48px tap targets)
- Playful yet calm aesthetic

---

## Typography System

**Primary Font**: OpenDyslexic (dyslexia-friendly) for body text and learning content
**Secondary Font**: Poppins (Google Fonts) for headings and UI elements

**Scale**:
- Page Titles: text-4xl (36px) font-bold
- Section Headings: text-2xl (24px) font-semibold
- Card Titles: text-xl (20px) font-medium
- Body Text: text-lg (18px) - larger than standard for readability
- Button Text: text-base (16px) font-semibold
- Small Text/Labels: text-sm (14px)

**Text Treatment**:
- Line height: leading-relaxed (1.625) for all body text
- Letter spacing: tracking-wide for improved readability
- Never use all-caps (harder for dyslexic readers)
- Left-aligned text (no justified text)

---

## Layout System

**Spacing Units**: Use Tailwind units of **4, 6, 8, 12, 16** consistently
- Component padding: p-6 or p-8
- Section spacing: gap-8 or gap-12
- Card margins: m-4
- Icon spacing: p-4

**Container Strategy**:
- Max width: max-w-7xl for main content
- Mobile padding: px-4
- Tablet/Desktop padding: px-6 md:px-8

**Grid Patterns**:
- Activity tiles: Single column on mobile, 2 columns on tablet (md:grid-cols-2)
- Dashboard metrics: 2x2 grid on mobile, 4 columns on desktop (grid-cols-2 lg:grid-cols-4)
- Never exceed 2 columns on mobile to maintain clarity

---

## Component Library

### Navigation
**Top App Bar**:
- Fixed height: h-16
- Left: Menu icon (48x48 tap target)
- Center: App logo or page title
- Right: Profile/Settings icon
- No sub-navigation (keep simple)

### Learning Activity Cards
- Minimum height: min-h-32
- Large icon at top (64x64)
- Title below icon
- Short description (2 lines max)
- Rounded corners: rounded-2xl
- Shadow: shadow-lg for depth
- Padding: p-6
- Touch feedback: Active state with slight scale

### Math Game Interface
- Single question centered on screen
- Large answer buttons: min-h-20, full-width on mobile
- Progress indicator at top (simple dots or bar)
- Generous spacing between options: space-y-6

### Progress Dashboard Cards
- Stat cards: Compact 2x2 layout
- Chart container: aspect-ratio-video or h-64
- Badge display: Grid with gap-4, max 3 per row
- Streak counter: Prominent circular indicator

### Buttons
**Primary Actions**:
- Height: h-14 (56px for easy tapping)
- Full-width on mobile: w-full
- Rounded: rounded-xl
- Text: text-lg font-semibold
- Icon + text combination when helpful

**Secondary Actions**:
- Height: h-12
- Outline style or ghost variant
- Same rounding and text treatment

**Icon Buttons**:
- Size: w-12 h-12 (48x48 minimum)
- Rounded: rounded-full
- Centered icon

### Form Controls
**Input Fields**:
- Height: h-14
- Large text: text-lg
- Padding: px-4
- Rounded: rounded-lg
- Clear focus indicators (thick border)

**Toggles/Switches**:
- Oversized for easy manipulation
- Clear on/off states
- Labels adjacent, not inside

### Modal/Bottom Sheets
- Rounded top corners: rounded-t-3xl
- Padding: p-8
- Max width on desktop: max-w-lg
- Dismiss handle at top for mobile

---

## Screen-Specific Layouts

### Home Screen
- Welcome header with user name: p-6
- Activity grid below: grid gap-4 p-4
- 6-8 main activity cards (Math, Reading, Writing, Progress, etc.)
- Sticky bottom navigation: Fixed h-16 with 4-5 icons

### Math Game Screen
- Full-screen immersive experience
- Top bar: Back button (left), Progress dots (center), Settings (right)
- Question area: Centered, large text
- Visual aids: Images or counters above question
- Answer options: Stack vertically with space-y-4
- Feedback overlay: Full-screen with animation space

### Progress Dashboard
- Header with time range selector
- 2x2 Stat cards: Sessions, Streak, Accuracy, Time
- Chart section: Line graph showing progress
- Badge gallery: Scrollable horizontal or grid
- Encouraging message card at bottom

### Reading Module
- Clean reading area: max-w-prose, generous padding
- Text controls toolbar: Font size, spacing, highlighting
- Audio playback controls: Fixed bottom bar
- Word highlighting: Inline indication as audio plays

### Writing Canvas
- Full-screen drawing area
- Letter template overlay (optional toggle)
- Tool palette: Top or side (Pen, Eraser, Clear)
- Guidance arrows/animations
- Save/Next buttons: Bottom corners

---

## Accessibility Specifications

**Consistent Implementations**:
- All interactive elements: Minimum 48x48px touch targets
- Form inputs: Clear labels above fields, never inside
- Error states: Icon + text, never color alone
- Loading states: Spinner + text description
- Success feedback: Visual + haptic + optional audio

**Settings Panel Controls**:
- Font size slider: 3 preset sizes (Default, Large, Extra Large)
- Line spacing toggle: Normal, Relaxed, Loose
- Contrast mode toggle
- Animation toggle: On/Off
- Audio toggle: On/Off

---

## Icons

**Library**: Heroicons (via CDN)
**Sizes**:
- Navigation icons: w-6 h-6
- Card/feature icons: w-12 h-12 or w-16 h-16
- Button icons: w-5 h-5

**Usage**:
- Always pair with text labels for clarity
- Use outline style for inactive states
- Use solid style for active states

---

## Images

**Hero/Welcome Section**:
- Friendly illustration showing diverse children learning
- Placement: Top of home screen, h-48 rounded-2xl
- Style: Warm, inclusive, non-distracting

**Activity Cards**:
- Custom icons or simple illustrations for each module
- Math: Numbers/shapes
- Reading: Book/letters
- Writing: Pencil/paper
- Progress: Chart/trophy

**Achievement Badges**:
- Colorful but simple icon designs
- Circular format: w-16 h-16
- Display in grid or horizontal scroll

---

## Animation Principles

**Minimal & Purposeful**:
- Transitions: 200-300ms duration
- Page transitions: Simple slide or fade
- Success states: Gentle bounce or scale
- Loading: Simple spinner, no complex animations
- NO auto-playing animations (reduce sensory overload)
- User-triggered only: Tap for celebration effects

---

## Mobile-First PWA Patterns

**Install Prompt**:
- Appears after 2-3 successful sessions
- Dismissible banner at bottom
- Clear "Add to Home Screen" instruction

**Offline State**:
- Banner notification when offline
- Show available offline activities
- Cache progress for sync when online

**Touch Gestures**:
- Swipe between modules/levels (optional)
- Pull-to-refresh on dashboard
- Long-press for additional options (sparingly)

---

This design system prioritizes **cognitive accessibility**, **touch-friendliness**, and **consistent patterns** to create a calm, supportive learning environment for neurodiverse learners.