# Parametric Human Avatar Pipeline — Asset Evaluation & Realistic Roadmap

## 1. Visual Realism Standards & Mandatory Acceptance Criteria

For the **LI-NING AI Sports Stylist Digital Fitting Room**, the avatar visual quality must represent a **realistic adult sportswear model** inside a premium e-commerce environment.

### 🚫 Strictly Prohibited Styles:
- Anime faces, stylized eyes, oversized features
- Cartoon proportions / exaggerated curves or cartoon muscles
- Cel shading, flat toon shaders, VRoid / VRChat stylized characters
- Roblox / Minecraft / game-like voxel or low-poly aesthetics

### ✅ Required Target Visual Quality:
- **Anatomy**: Anatomically accurate adult human male and female proportions (athletic, regular, slim, broad).
- **Face**: Subtle, neutral human facial geometry.
- **Surface**: Photorealistic / neutral studio PBR shading (`MeshStandardMaterial` with realistic skin roughness and ambient occlusion).
- **Pose**: Neutral A-pose or athletic standing pose, feet firmly planted on the fitting room stage ($Y = 0$).
- **Pose & Fitting**: Optimized for sportswear outfit previewing and layering.

---

## 2. Asset Evaluation & Visual Realism Audit

| Candidate Asset | Source & Author | License | Visual Realism Verdict | Technical Viability | Status | Reason / Evaluation |
|---|---|---|---|---|---|---|
| **Blender Studio Photorealistic Human Base Meshes (Male & Female)** | [Blender Studio Demo Files](https://studio.blender.org/characters/human-base-meshes/) (Blender Foundation) | **CC0 1.0 Universal (Public Domain)** | **Photorealistic (5/5)** | Full Quad topology, UV unwrapped, multi-res sculpts, easy Blender $\to$ GLTF export | **RECOMMENDED PRODUCTION TARGET** | Professional human baseline with anatomically accurate musculature and neutral adult facial features. |
| **MakeHuman + MPFB2 Realistic Human Exporter** | [MakeHuman Community](http://www.makehumancommunity.org/) | **CC0 / MIT** | **Photorealistic (4.5/5)** | Rigged, SkinnedMesh, 50+ parametric morph targets | **HIGH PRIORITY PARAMETRIC PIPELINE** | Capable of exporting realistic base meshes with dedicated weight, muscle, and body shape blendshapes. |
| **3D Scan Store / Scanned Athletic Mannequin** | Commercial 3D Photogrammetry (TurboSquid / Sketchfab) | Commercial Royalty-Free ($40 - $120) | **Hyper-Realistic (5/5)** | Photogrammetry raw scan, requires retopology & web optimization | **COMMERCIAL HIGH-END OPTION** | Real human scans of fitness athletes. |
| **Three.js Xbot / Ybot** | Three.js Authors / Mixamo (MIT) | MIT License | Stylized / Robot (2/5) | Rigged SkinnedMesh | **REJECTED AS PRODUCTION AVATAR** (Reference only) | Robot / mannequin joint aesthetic, does not represent real human skin. |
| **Webaverse Avatar Base (`male-base.glb` / `female-base.glb`)** | Webaverse Project (MIT) | MIT License | Stylized / Semi-Anime (2.5/5) | 39-41 Morph Targets, Rigged SkinnedMesh | **TEMPORARY TECHNICAL PLACEHOLDER ONLY** | Technically functional for morph and slider testing, but visually rejected for final production due to stylized facial geometry. |
| **Ready Player Me Avatars** | Ready Player Me (Discontinued Jan 2026) | Non-Commercial / Closed | Stylized / Cartoon (2/5) | Rigged | **STRICTLY REJECTED** | Cartoon aesthetics and proprietary platform limitations. |

---

## 3. Parametric Avatar Architecture Design (`avatar-pipeline.ts`)

To ensure complete independence from any single 3D model asset, the system implements a **Decoupled Parametric Pipeline**:

```
           +---------------------------------------------+
           |       User Controls (BodyProfile State)     |
           | Gender | Height (cm) | Weight (kg) | Type   |
           +---------------------------------------------+
                                  |
                                  v
           +---------------------------------------------+
           |           avatar-pipeline.ts                |
           | - Height Normalization Factor               |
           | - Morph Influence Dictionary Mapping        |
           | - Asset Config by Gender (Male / Female)    |
           +---------------------------------------------+
                                  |
                                  v
           +---------------------------------------------+
           |           Avatar3DViewer.tsx                |
           | - Three.js WebGL Engine (Studio Lighting)   |
           | - Real-time Y-Scale & Morph Interpolation   |
           | - Seamless Drop-in GLB Model Swapping       |
           +---------------------------------------------+
```

### Key Architectural Benefits:
1. **Drop-in Model Swapping**: When the production photorealistic GLB is ready, simply updating the file in `public/models/avatar/` or changing `AVATAR_PIPELINE_CONFIG` in `avatar-pipeline.ts` will immediately update the fitting room without any code refactoring.
2. **Standardized Morph Target Keys**: The pipeline maps `slim`, `athletic`, `broad`, `weightLow`, and `weightHigh` to any model's `morphTargetDictionary` automatically.
3. **PBR Studio Lighting**: The Three.js lighting rig provides neutral 5-point studio lighting (`PCFShadowMap`, soft key, fill, and athletic rim lighting) ready for photorealistic skin textures.
