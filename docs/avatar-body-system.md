# LI-NING Real-Time Parametric Body Measurement Avatar System

## 1. System Architecture Overview

The **LI-NING AI Sports Stylist Digital Fitting Room** features a dedicated, modular **Parametric Body Measurement Avatar Pipeline**.

```
+-------------------------------------------------------------------------------+
|                             BODY PROFILE UI CONTROLS                          |
|  Gender | Height (cm) | Weight (kg) | Chest (cm) | Waist (cm) | Hips (cm)     |
|  Quick Presets: [Slim] [Regular] [Athletic] [Broad]                           |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                             avatarController.ts                               |
| - Parameter Sanitization & Boundary Constraints                               |
| - Global Height Scale (Y-axis only, feet grounded at Y=0)                     |
+-------------------------------------------------------------------------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
+------------------------------------+   +------------------------------------+
|     localDeformationEngine.ts      |   |        morphController.ts          |
| (Anatomical Vertex Falloff Masks)  |   | (Discovers Shape Keys in GLB)      |
| - Chest Mask (Y in [0.63H, 0.82H]) |   | - Semantic Mapping                 |
| - Waist Mask (Y in [0.52H, 0.65H]) |   | - Clamped Morph Target Influences  |
| - Hips Mask  (Y in [0.40H, 0.54H]) |   | - Dynamic Dictionary Resolution    |
+------------------------------------+   +------------------------------------+
                   |                                       |
                   +-------------------+-------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                             Three.js WebGL Scene                              |
| - Studio 5-Point PBR Lighting Rig & PCFShadowMap                              |
| - Real-time 60fps Vertex Buffer In-Place Updates                              |
| - Optional 3D Circumference Visual Guides (Chest, Waist, Hips)                |
| - Smooth OrbitControls & Camera Lerp Presets (FRONT 0°, SIDE 90°, BACK 180°)  |
+-------------------------------------------------------------------------------+
```

---

## 2. Strict Parameter Category Separation

### A. Global Parameters
1. **Height ($\text{cm}$)**:
   - Scales the avatar's height ($Y$-axis) proportionally based on canonical reference height ($1.75\text{m}$ for Male, $1.65\text{m}$ for Female).
   - Automatically maintains ground alignment at $Y=0$ so the feet never float or clip into the podium.
   - Camera target and distance automatically re-frame full body.
2. **Weight ($\text{kg}$)**:
   - Governs global body mass distribution across torso, arms, and thighs without affecting head, hands, or feet.

### B. Local Measurements (Strict Anatomical Isolation)
1. **Chest / Bust ($\text{cm}$)**:
   - Modifies **ONLY** the anterior chest depth, lateral ribcage width, and pectoral volume ($Y \in [0.63H, 0.82H]$).
   - **STRICTLY ZERO** effect on waist, abdomen, hips, thighs, arms, or head.
2. **Waist ($\text{cm}$)**:
   - Modifies **ONLY** the mid-torso, abdomen, and natural waistline ($Y \in [0.52H, 0.65H]$).
   - **STRICTLY ZERO** effect on chest, shoulders, hips, or legs.
3. **Hips ($\text{cm}$)**:
   - Modifies **ONLY** the pelvis width, glutes, and upper thigh root ($Y \in [0.40H, 0.54H]$).
   - **STRICTLY ZERO** effect on chest, waist, or lower legs.

---

## 3. Module Inventory

- [`app/lib/avatar/avatarConfig.ts`](file:///Users/hoangthuy/li%20ning/app/lib/avatar/avatarConfig.ts): Centralized configuration for asset paths, canonical heights, measurement ranges, and landmark ratios.
- [`app/lib/avatar/bodyParameters.ts`](file:///Users/hoangthuy/li%20ning/app/lib/avatar/bodyParameters.ts): Authoritative parameter model, normalization, boundary clamping, and BMI diagnostic calculator.
- [`app/lib/avatar/bodyPresets.ts`](file:///Users/hoangthuy/li%20ning/app/lib/avatar/bodyPresets.ts): Documented quick presets (`Slim`, `Regular`, `Athletic`, `Broad`) with anatomical ratios.
- [`app/lib/avatar/localDeformationEngine.ts`](file:///Users/hoangthuy/li%20ning/app/lib/avatar/localDeformationEngine.ts): Anatomical localized vertex-mask deformation engine with cosine-squared falloff.
- [`app/lib/avatar/morphController.ts`](file:///Users/hoangthuy/li%20ning/app/lib/avatar/morphController.ts): Dynamic morph discovery and semantic pattern matching.
- [`app/lib/avatar/measurementCalibration.ts`](file:///Users/hoangthuy/li%20ning/app/lib/avatar/measurementCalibration.ts): Calibration curves, landmark Y planes, and Ramanujan ellipse circumference estimator.
- [`app/lib/avatar/measurementGuides.ts`](file:///Users/hoangthuy/li%20ning/app/lib/avatar/measurementGuides.ts): 3D visual circumference guide lines (Chest, Waist, Hips).
- [`app/lib/avatar/avatarController.ts`](file:///Users/hoangthuy/li%20ning/app/lib/avatar/avatarController.ts): Central WebGL avatar orchestrator.
- [`app/components/ai-sports-stylist/Avatar3DViewer.tsx`](file:///Users/hoangthuy/li%20ning/app/components/ai-sports-stylist/Avatar3DViewer.tsx): Three.js UI viewer with camera controls, presets, info card, and dev diagnostics.
- [`app/components/ai-sports-stylist/BodyProfileStep.tsx`](file:///Users/hoangthuy/li%20ning/app/components/ai-sports-stylist/BodyProfileStep.tsx): Interactive slider control panel.
- [`scripts/inspect-avatar.mjs`](file:///Users/hoangthuy/li%20ning/scripts/inspect-avatar.mjs): Standalone CLI asset validator.
