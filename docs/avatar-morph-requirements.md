# LI-NING 3D Avatar — Shape Keys & Morph Target Specification for Blender

## 1. Executive Summary
This document specifies the exact **Shape Keys (Blend Shapes)** required for the **LI-NING AI Sports Stylist Digital Fitting Room**. 

To maintain strict anatomical isolation, **Local Measurements (Chest, Waist, Hips)** must ONLY deform their respective anatomical vertex zones and must **NEVER** scale the entire torso, limbs, or character width.

---

## 2. Mandatory Shape Keys List

| Shape Key Name in Blender | Semantic Channel | Anatomical Target Region | Vertex Mask / Boundaries | Target Circumference $\Delta$ |
|---|---|---|---|---|
| **`Basis`** | Neutral Baseline | Full Body | Unmodified canonical adult athletic body ($1.75\text{m}$, $74\text{kg}$) | Chest: $96\text{cm}$, Waist: $78\text{cm}$, Hips: $94\text{cm}$ |
| **`WeightLow`** | Global Body Mass | Torso, Thighs, Arms | Vertices from $Y=0.18$ to $Y=0.85$ (Zero on head, hands, feet) | Overall lean/slender body mass (down to $45\text{kg}$) |
| **`WeightHigh`** | Global Body Mass | Torso, Thighs, Arms | Vertices from $Y=0.18$ to $Y=0.85$ (Zero on head, hands, feet) | Overall heavy/muscular mass (up to $115\text{kg}$) |
| **`ChestSmall`** | **Local Chest** | Upper Torso / Ribcage | **STRICT MASK**: $Y \in [0.63H, 0.82H]$, Torso Width $\le 0.32H$. **Zero on waist, hips, arms, head.** | Reduces chest circumference down to $75\text{cm}$ |
| **`ChestLarge`** | **Local Chest** | Upper Torso / Pectorals | **STRICT MASK**: $Y \in [0.63H, 0.82H]$, Torso Width $\le 0.32H$. Anterior pectoral expansion. | Increases chest circumference up to $125\text{cm}$ |
| **`WaistSmall`** | **Local Waist** | Mid Torso / Abdomen | **STRICT MASK**: $Y \in [0.52H, 0.65H]$, Torso Width $\le 0.22H$. **Zero on chest, hips, arms.** | Tapers natural waist down to $55\text{cm}$ |
| **`WaistLarge`** | **Local Waist** | Mid Torso / Abdomen | **STRICT MASK**: $Y \in [0.52H, 0.65H]$, Torso Width $\le 0.22H$. Lateral & abdominal depth. | Expands waist circumference up to $120\text{cm}$ |
| **`HipSmall`** | **Local Hips** | Pelvis / Glutes | **STRICT MASK**: $Y \in [0.40H, 0.54H]$, Torso Width $\le 0.26H$. **Zero on waist, chest, lower legs.** | Narrows pelvis / hips down to $75\text{cm}$ |
| **`HipLarge`** | **Local Hips** | Pelvis / Glutes | **STRICT MASK**: $Y \in [0.40H, 0.54H]$, Torso Width $\le 0.26H$. Posterior glute & lateral pelvis. | Expands hip circumference up to $135\text{cm}$ |

---

## 3. Vertex Masking & Falloff Rules in Blender

To prevent sharp seams or tearing when combining multiple shape keys:
1. **Weight Painting & Vertex Groups**:
   - Create separate Vertex Groups for each zone: `vg_chest`, `vg_waist`, `vg_hips`.
   - Apply a smooth **Gaussian / Cosine Falloff ($1.0 \to 0.0$)** at the borders between chest/waist and waist/hips.
2. **Arm Isolation in A-Pose**:
   - Ensure the arms (biceps, forearms, hands) have **0.0 weight** in `vg_chest`, `vg_waist`, and `vg_hips` so moving chest or waist sliders never changes arm thickness.
3. **Neck & Head Isolation**:
   - The head and neck base must remain completely untouched by `ChestLarge`/`ChestSmall`.

---

## 4. Blender glTF / GLB Export Settings

When exporting from Blender (`File` $\to$ `Export` $\to$ `glTF 2.0 (.glb)`):

- **Format**: `glTF Binary (.glb)`
- **Include**:
  - ☑️ **Limit to Selected Objects** (Select character mesh & rig)
  - ☑️ **Custom Properties**
- **Geometry**:
  - ☑️ **Apply Modifiers** (Ensure Shape Keys are preserved)
  - ☑️ **Normals**
  - ☑️ **Tangents** (for normal maps)
  - ☑️ **Shape Keys (Morph Targets)** $\leftarrow$ *Crucial!*
  - ☑️ **Vertex Colors** (Optional)
- **Animation**:
  - ☑️ **Shape Keys**
- **Materials**:
  - **PBR Materials**: `Export` (Roughness 0.54, Metalness 0.04, Subsurface / PBR Skin map).

---

## 5. Drop-in File Paths
Once exported, place the `.glb` files at:
- Male model: `public/models/avatar/male-base.glb`
- Female model: `public/models/avatar/female-base.glb`

The WebGL `AvatarController` and `MorphController` will automatically detect `mesh.morphTargetDictionary`, link the semantic keys, and run the real-time calibrated deformation pipeline.
