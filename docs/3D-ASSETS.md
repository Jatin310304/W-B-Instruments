# 3D assets: what is conceptual, and how to replace it

No manufacturer CAD or 3D models were supplied, so every model is an original, procedural, **conceptual** illustration built in code (`src/three/models/`). Each viewer shows a “Conceptual 3D model” tag with this note: *“Conceptual 3D illustration of a typical instrument of this type. It is not a model of a specific manufacturer's product, and the internal components shown are typical, not manufacturer-verified.”*

| Model key | Represents | Used for | Explodable |
| --- | --- | --- | --- |
| `pyrometer` | Fixed infrared pyrometer | Hero; IR temperature, glass, metal, non-metal ranges | Yes, 7 parts |
| `panel-meter` | Panel-mount digital indicator | Digital displays | Yes, 6 parts |
| `loop-indicator` | Loop-powered field indicator | Loop powered displays | Yes, 5 parts |
| `blackbody` | Blackbody reference furnace (+ demo pyrometer) | IR calibration sources, VERIFY | No |
| `dry-block` | Dry block temperature calibrator | Giussani temperature calibration, calibration service | No |
| `handheld-sound/air/humidity/light/water` | Handheld meters with probes | Matching Senseca ranges | No |

No model is shown for data logging, meteorological, microclimate or IR high-speed pyrometers, because no fair generic illustration exists.

## To replace a model with an authentic one

Ask W&B or the manufacturer for, per instrument:
- **Format:** glTF 2.0 binary (`.glb`), Draco or Meshopt compressed, Y-up, metres, origin at the instrument's centre.
- **Budget:** ≤ 150k triangles, ≤ 4 MB, PBR metallic-roughness textures ≤ 2048 px (KTX2 preferred).
- **For the exploded view:** one named node per component (for example `optics`, `sensor`, `electronics`, `housing`), plus permission to show internals.
- **Rights:** written permission to display the model on the W&B website.

Then:
1. Put the file in `public/models/<key>.glb`.
2. Create `src/three/models/<Name>.tsx` that loads it with Drei `useGLTF('/models/<key>.glb')` and wraps each named node in `<Part id="..." offset={[x, y, z]}>` (see `Pyrometer.tsx` for offsets and labels).
3. Register it in `registry.ts` (`MODELS[key]`): name, parts with descriptions approved by the manufacturer, camera, and `explodable`.
4. Change the tag text for that model from “Conceptual” to the verified wording W&B approves, and point the product's `model` field at it in `src/data/catalog.ts`.
