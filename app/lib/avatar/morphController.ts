import * as THREE from 'three';
import { Gender } from './avatarConfig';

export type MorphSemanticKey =
  | 'weightLow'
  | 'weightHigh'
  | 'chestSmall'
  | 'chestLarge'
  | 'waistSmall'
  | 'waistLarge'
  | 'hipSmall'
  | 'hipLarge'
  | 'muscleHigh'
  | 'muscleLow';

export const MORPH_SEMANTICS: Record<MorphSemanticKey, string[]> = {
  weightLow: ['weightlow', 'weight_low', 'thin', 'skinny', 'lean', 'body_thin', 'body_low'],
  weightHigh: ['weighthigh', 'weight_high', 'fat', 'heavy', 'bulk', 'body_heavy', 'weight', 'body_mass'],
  chestSmall: ['chestsmall', 'chest_small', 'chest_min', 'bust_small', 'bust_min'],
  chestLarge: ['chestlarge', 'chest_large', 'chest_max', 'chest_size', 'chest', 'bust', 'bust_large', 'pectorals'],
  waistSmall: ['waistsmall', 'waist_small', 'waist_min', 'belly_flat', 'stomach_flat'],
  waistLarge: ['waistlarge', 'waist_large', 'waist_max', 'waist_size', 'waist', 'belly', 'abdomen', 'stomach'],
  hipSmall: ['hipsmall', 'hip_small', 'hips_small', 'pelvis_narrow', 'glutes_small'],
  hipLarge: ['hiplarge', 'hip_large', 'hips_large', 'hips_size', 'hips', 'hip', 'glutes', 'pelvis_wide'],
  muscleHigh: ['muscular', 'muscle', 'muscle_mass', 'fitness', 'athletic', 'defined'],
  muscleLow: ['muscle_low', 'unmuscular', 'soft'],
};

export interface ResolvedMorphTarget {
  semanticKey: MorphSemanticKey;
  meshName: string;
  targetName: string;
  targetIndex: number;
}

export class MorphController {
  private gender: Gender;
  private discoveredMorphs: Map<string, Record<string, number>> = new Map();
  private resolvedMappings: ResolvedMorphTarget[] = [];
  private currentInfluences: Map<string, number> = new Map();

  constructor(gender: Gender = 'male') {
    this.gender = gender;
  }

  public setGender(gender: Gender) {
    this.gender = gender;
  }

  /**
   * Scans all meshes in a Three.js scene for morphTargetDictionary
   */
  public discoverMorphs(rootObject: THREE.Object3D): void {
    this.discoveredMorphs.clear();
    this.resolvedMappings = [];
    this.currentInfluences.clear();

    rootObject.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
          this.discoveredMorphs.set(mesh.name || 'unnamed_mesh', { ...mesh.morphTargetDictionary });
          this.resolveMeshMorphs(mesh);
        }
      }
    });

    console.log(`[MorphController] Discovered ${this.discoveredMorphs.size} morph meshes with ${this.resolvedMappings.length} resolved semantic mappings.`);
  }

  /**
   * Matches semantic keys to actual morph targets on a mesh
   */
  private resolveMeshMorphs(mesh: THREE.Mesh): void {
    if (!mesh.morphTargetDictionary) return;
    const dict = mesh.morphTargetDictionary;

    for (const [semanticKey, candidatePatterns] of Object.entries(MORPH_SEMANTICS)) {
      let matchedName: string | null = null;
      let matchedIndex = -1;

      for (const pattern of candidatePatterns) {
        const lowerPattern = pattern.toLowerCase();
        for (const [targetName, index] of Object.entries(dict)) {
          if (targetName.toLowerCase().includes(lowerPattern)) {
            matchedName = targetName;
            matchedIndex = index;
            break;
          }
        }
        if (matchedName !== null) break;
      }

      if (matchedName !== null && matchedIndex >= 0) {
        this.resolvedMappings.push({
          semanticKey: semanticKey as MorphSemanticKey,
          meshName: mesh.name || 'unnamed_mesh',
          targetName: matchedName,
          targetIndex: matchedIndex,
        });
      }
    }
  }

  /**
   * Applies calculated semantic morph weights to all meshes in the scene
   */
  public applyInfluences(rootObject: THREE.Object3D, weights: Partial<Record<MorphSemanticKey, number>>): void {
    this.currentInfluences.clear();

    // Reset influences on all morph-enabled meshes
    rootObject.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.morphTargetInfluences) {
          for (let i = 0; i < mesh.morphTargetInfluences.length; i++) {
            mesh.morphTargetInfluences[i] = 0;
          }
        }
      }
    });

    // Apply resolved mappings
    for (const mapping of this.resolvedMappings) {
      const weight = weights[mapping.semanticKey] ?? 0;
      const clampedWeight = Math.min(Math.max(weight, 0.0), 1.0);

      rootObject.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child.name === mapping.meshName || mapping.meshName === 'unnamed_mesh')) {
          const mesh = child as THREE.Mesh;
          if (mesh.morphTargetInfluences && mesh.morphTargetInfluences[mapping.targetIndex] !== undefined) {
            mesh.morphTargetInfluences[mapping.targetIndex] = clampedWeight;
          }
        }
      });

      this.currentInfluences.set(mapping.semanticKey, clampedWeight);
    }
  }

  public getDiscoveredMorphs(): Map<string, Record<string, number>> {
    return this.discoveredMorphs;
  }

  public getResolvedMappings(): ResolvedMorphTarget[] {
    return this.resolvedMappings;
  }

  public getActiveInfluences(): Map<string, number> {
    return this.currentInfluences;
  }

  public hasSemanticMorph(semanticKey: MorphSemanticKey): boolean {
    return this.resolvedMappings.some((m) => m.semanticKey === semanticKey);
  }
}
