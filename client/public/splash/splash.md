# #Quant Splash Screen Architecture: "The Market Triumph"

## Design Concept
The aesthetic is "Altered Art Collage". It contrasts serious, high-contrast black-and-white classical Roman fine art with chaotic, brightly colored, highly saturated Web3 meme culture.

## Technical Execution (Framer Motion)
Instead of flat SVG backgrounds, the Splash Screen is now a stacked layout using absolute positioning to create a diorama effect.

### Asset Mapping & CSS Requirements
- All assets are located in `/public/...` (Assume standard image paths).
- Images must use `object-cover` or `object-contain` appropriately to span the screen.

### The Meme "Sticker" Effect
All Web3 meme cutouts (Diamond, McDonald's Hat, Arrow) must have a sharp white border to look like magazine clippings pasted onto the statues. 
**Tailwind utility to use:** `drop-shadow-[0_0_3px_#ffffff]`

### The Laser Eyes Screen Effect
The laser eyes asset has a solid black background. Do not attempt to make it transparent. Instead, use the CSS blend mode `Screen` so the black turns entirely invisible while keeping the red neon glow perfectly intact.
**Tailwind utility to use:** `mix-blend-screen`

### State Management
The splash screen runs for ~4.5 seconds. 
- It uses an `<AnimatePresence>` wrapper.
- `isVisible` state is set to `false` after the timeout.
- The `exit={{ opacity: 0, scale: 1.1 }}` prop on the main container gives a smooth transition into the main landing page.

### Existing Code to Replace:
Remove the three `<svg>` "Paper Cutout" layers in the current code, and replace them with `motion.img` or `motion.div` wrapped Next.js `<Image>` components using the z-index hierarchy defined in the prompt. Keep the `#Quant` branding and text identical to the current implementation.