import * as THREE from 'three';
import { BodyParameters } from './bodyParameters';
import { BODY_PRESETS } from './bodyPresets';

interface MeshBaseline {
  mesh: THREE.Mesh;
  originalPositions: Float32Array;
  originalNormals: Float32Array | null;
  minY: number;
  maxY: number;
  height: number;
  centerX: number;
  centerZ: number;
}

export type DebugMaskRegion = 'none' | 'chest' | 'waist' | 'hips' | 'all';

/**
 * Safe cosine-squared falloff mask helper to prevent any NaN or numerical discontinuity
 */
function smoothCosineMask(dist: number, radius: number, power = 2.0): number {
  if (dist >= radius || radius <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, dist / radius));
  const cosVal = Math.cos(ratio * (Math.PI * 0.5));
  return Math.pow(cosVal, power);
}

/**
 * Anatomical Local Vertex Deformation Engine
 * 
 * Guarantees STRICT anatomical separation between:
 * - GLOBAL parameters (Height, Weight)
 * - LOCAL measurements (Chest/Bust, Waist, Hips)
 * 
 * Uses strict lateral torso boundaries to ensure arms, forearms,
 * wrists, and hands remain 100% immune to torso expansion.
 */
export class LocalDeformationEngine {
  private meshBaselines: MeshBaseline[] = [];
  private currentDebugRegion: DebugMaskRegion = 'none';

  /**
   * Initializes baseline vertex geometry for all meshes in the model
   */
  public initialize(rootObject: THREE.Object3D): void {
    this.meshBaselines = [];

    rootObject.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geometry = mesh.geometry;
        if (!geometry || !geometry.attributes.position) return;

        // Clone pristine baseline vertex positions
        const posAttr = geometry.attributes.position;
        const originalPositions = new Float32Array(posAttr.array.length);
        originalPositions.set(posAttr.array);

        let originalNormals: Float32Array | null = null;
        if (geometry.attributes.normal) {
          originalNormals = new Float32Array(geometry.attributes.normal.array.length);
          originalNormals.set(geometry.attributes.normal.array);
        }

        // Calculate mesh bounding parameters in local space
        let minY = Infinity, maxY = -Infinity;
        let minX = Infinity, maxX = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        for (let i = 0; i < posAttr.count; i++) {
          const x = originalPositions[i * 3 + 0];
          const y = originalPositions[i * 3 + 1];
          const z = originalPositions[i * 3 + 2];

          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (z < minZ) minZ = z;
          if (z > maxZ) maxZ = z;
        }

        const height = Math.max(0.001, maxY - minY);
        const centerX = (minX + maxX) * 0.5;
        const centerZ = (minZ + maxZ) * 0.5;

        this.meshBaselines.push({
          mesh,
          originalPositions,
          originalNormals,
          minY,
          maxY,
          height,
          centerX,
          centerZ,
        });
      }
    });
  }

  /**
   * Deforms model geometry strictly according to local and global parameter rules
   */
  public applyDeformation(params: BodyParameters): void {
    if (this.meshBaselines.length === 0) return;

    const { gender, weightKg, chestCm, waistCm, hipCm, preset } = params;

    // Use the selected preset's sculpted baseline measurements
    const presetBaseline = BODY_PRESETS[gender][preset] || BODY_PRESETS[gender].muscular;
    const refChest = presetBaseline.chest;
    const refWaist = presetBaseline.waist;
    const refHips = presetBaseline.hips;
    const refWeight = presetBaseline.weight;

    // Relative delta ratios from the preset's natural sculpted base
    const deltaChest = refChest > 0 ? (chestCm - refChest) / refChest : 0;
    const deltaWaist = refWaist > 0 ? (waistCm - refWaist) / refWaist : 0;
    const deltaHips = refHips > 0 ? (hipCm - refHips) / refHips : 0;
    const deltaWeight = refWeight > 0 ? (weightKg - refWeight) / refWeight : 0;

    for (const baseline of this.meshBaselines) {
      const { mesh, originalPositions, minY, height, centerX, centerZ } = baseline;
      const posAttr = mesh.geometry.attributes.position;
      const positions = posAttr.array as Float32Array;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const x0 = originalPositions[idx];
        const y0 = originalPositions[idx + 1];
        const z0 = originalPositions[idx + 2];

        // Normalized relative vertical position from feet (0.0) to crown of head (1.0)
        const yNorm = (y0 - minY) / height;

        // Relative horizontal offsets from torso center
        const dx = x0 - centerX;
        const dz = z0 - centerZ;
        const absDx = Math.abs(dx);

        // ============================================================
        // 1. CHEST MASK (Strictly upper torso / pectoral region)
        // Center: 0.72, Range: [0.63, 0.82]
        // Torso Lateral Bound: absDx <= 0.205m (Excludes upper arms & biceps)
        // ============================================================
        const chestYWeight = smoothCosineMask(Math.abs(yNorm - 0.72), 0.095, 2.0);
        const chestXWeight = smoothCosineMask(absDx, 0.205, 1.8);
        const wChest = chestYWeight * chestXWeight;

        // ============================================================
        // 2. WAIST MASK (Strictly mid torso / natural waist & abdomen)
        // Center: 0.585, Range: [0.52, 0.65]
        // Torso Lateral Bound: absDx <= 0.175m (Strictly excludes passing forearms/wrists)
        // ============================================================
        const waistYWeight = smoothCosineMask(Math.abs(yNorm - 0.585), 0.065, 2.0);
        const waistXWeight = smoothCosineMask(absDx, 0.175, 2.0);
        const wWaist = waistYWeight * waistXWeight;

        // ============================================================
        // 3. HIPS MASK (Strictly pelvis, glutes, and upper thigh root)
        // Center: 0.47, Range: [0.40, 0.54]
        // Pelvis Lateral Bound: absDx <= 0.195m (Strictly excludes hands and wrists)
        // ============================================================
        const hipsYWeight = smoothCosineMask(Math.abs(yNorm - 0.47), 0.07, 2.0);
        const hipsXWeight = smoothCosineMask(absDx, 0.195, 2.0);
        const wHips = hipsYWeight * hipsXWeight;

        // ============================================================
        // 4. GLOBAL WEIGHT MASS MASK (Smooth global body mass distribution)
        // Torso & thighs only; completely isolated from hands and feet
        // ============================================================
        const wWeightY = smoothCosineMask(Math.abs(yNorm - 0.52), 0.28, 2.0);
        const wWeightX = smoothCosineMask(absDx, 0.22, 1.5);
        const wWeight = wWeightY * wWeightX;

        // ============================================================
        // DISPLACEMENT CALCULATIONS (Strict Separation & No Arm Warping)
        // ============================================================

        // Chest local displacement (with anterior pectoral emphasis for z > centerZ)
        const chestZFactor = dz > 0 ? 0.45 : 0.25;
        const dispChestX = dx * deltaChest * 0.32 * wChest;
        const dispChestZ = dz * deltaChest * chestZFactor * wChest;

        // Waist local displacement (abdominal & lateral waist expansion/contraction)
        const waistZFactor = dz > 0 ? 0.45 : 0.32;
        const dispWaistX = dx * deltaWaist * 0.35 * wWaist;
        const dispWaistZ = dz * deltaWaist * waistZFactor * wWaist;

        // Hips local displacement (pelvis width & posterior glute volume)
        const hipsZFactor = dz < 0 ? 0.45 : 0.30;
        const dispHipsX = dx * deltaHips * 0.32 * wHips;
        const dispHipsZ = dz * deltaHips * hipsZFactor * wHips;

        // Global Weight displacement
        const dispWeightX = dx * deltaWeight * 0.16 * wWeight;
        const dispWeightZ = dz * deltaWeight * 0.16 * wWeight;

        // Compose final vertex coordinates safely
        positions[idx] = x0 + dispChestX + dispWaistX + dispHipsX + dispWeightX;
        positions[idx + 1] = y0;
        positions[idx + 2] = z0 + dispChestZ + dispWaistZ + dispHipsZ + dispWeightZ;
      }

      posAttr.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    }

    if (this.currentDebugRegion !== 'none') {
      this.updateDebugColors();
    }
  }

  /**
   * Sets and renders debug vertex color heatmaps for anatomical masks
   */
  public setDebugMaskRegion(region: DebugMaskRegion): void {
    this.currentDebugRegion = region;
    this.updateDebugColors();
  }

  private updateDebugColors(): void {
    for (const baseline of this.meshBaselines) {
      const { mesh, originalPositions, minY, height, centerX, centerZ } = baseline;
      const count = mesh.geometry.attributes.position.count;

      if (this.currentDebugRegion === 'none') {
        if (mesh.geometry.attributes.color) {
          mesh.geometry.deleteAttribute('color');
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.vertexColors = false;
            mesh.material.needsUpdate = true;
          }
        }
        continue;
      }

      let colorAttr = mesh.geometry.attributes.color as THREE.BufferAttribute | undefined;
      if (!colorAttr || colorAttr.count !== count) {
        colorAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
        mesh.geometry.setAttribute('color', colorAttr);
      }

      const colors = colorAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const x0 = originalPositions[idx];
        const y0 = originalPositions[idx + 1];
        const yNorm = (y0 - minY) / height;
        const absDx = Math.abs(x0 - centerX);

        let r = 0.85, g = 0.85, b = 0.85; // Base neutral

        // Chest mask (Red)
        if (this.currentDebugRegion === 'chest' || this.currentDebugRegion === 'all') {
          const w = smoothCosineMask(Math.abs(yNorm - 0.72), 0.095, 2.0) * smoothCosineMask(absDx, 0.205, 1.8);
          if (w > 0) {
            r = THREE.MathUtils.lerp(r, 0.95, w);
            g = THREE.MathUtils.lerp(g, 0.05, w);
            b = THREE.MathUtils.lerp(b, 0.16, w);
          }
        }

        // Waist mask (Amber/Yellow)
        if (this.currentDebugRegion === 'waist' || this.currentDebugRegion === 'all') {
          const w = smoothCosineMask(Math.abs(yNorm - 0.585), 0.065, 2.0) * smoothCosineMask(absDx, 0.175, 2.0);
          if (w > 0) {
            r = THREE.MathUtils.lerp(r, 0.96, w);
            g = THREE.MathUtils.lerp(g, 0.62, w);
            b = THREE.MathUtils.lerp(b, 0.04, w);
          }
        }

        // Hips mask (Emerald Green)
        if (this.currentDebugRegion === 'hips' || this.currentDebugRegion === 'all') {
          const w = smoothCosineMask(Math.abs(yNorm - 0.47), 0.07, 2.0) * smoothCosineMask(absDx, 0.195, 2.0);
          if (w > 0) {
            r = THREE.MathUtils.lerp(r, 0.06, w);
            g = THREE.MathUtils.lerp(g, 0.72, w);
            b = THREE.MathUtils.lerp(b, 0.50, w);
          }
        }

        colors[idx] = r;
        colors[idx + 1] = g;
        colors[idx + 2] = b;
      }

      colorAttr.needsUpdate = true;
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.vertexColors = true;
        mesh.material.needsUpdate = true;
      }
    }
  }

  public reset(): void {
    for (const baseline of this.meshBaselines) {
      const posAttr = baseline.mesh.geometry.attributes.position;
      (posAttr.array as Float32Array).set(baseline.originalPositions);
      posAttr.needsUpdate = true;
      baseline.mesh.geometry.computeVertexNormals();
    }
  }
}
