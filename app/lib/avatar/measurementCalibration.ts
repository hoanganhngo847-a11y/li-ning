import * as THREE from 'three';
import { Gender, AVATAR_CONFIG } from './avatarConfig';

export type CalibrationStatus = 'CALIBRATED' | 'ESTIMATED' | 'UNSUPPORTED';

export interface CalibrationPoint {
  influence: number; // 0.0 to 1.0
  circumferenceCm: number;
}

export interface ParameterCalibrationTable {
  parameterKey: 'chest' | 'waist' | 'hips' | 'weight';
  neutralValueCm: number;
  points: CalibrationPoint[];
}

/**
 * Standard Calibration Tables for canonical human base meshes
 * Used to translate real-world centimeters (cm) to morph target influences (0.0 -> 1.0)
 */
export const CALIBRATION_TABLES: Record<Gender, Record<'chest' | 'waist' | 'hips', ParameterCalibrationTable>> = {
  male: {
    chest: {
      parameterKey: 'chest',
      neutralValueCm: 96,
      points: [
        { influence: 0.0, circumferenceCm: 86 },
        { influence: 0.25, circumferenceCm: 91 },
        { influence: 0.5, circumferenceCm: 96 },
        { influence: 0.75, circumferenceCm: 104 },
        { influence: 1.0, circumferenceCm: 115 },
      ],
    },
    waist: {
      parameterKey: 'waist',
      neutralValueCm: 78,
      points: [
        { influence: 0.0, circumferenceCm: 68 },
        { influence: 0.25, circumferenceCm: 73 },
        { influence: 0.5, circumferenceCm: 78 },
        { influence: 0.75, circumferenceCm: 86 },
        { influence: 1.0, circumferenceCm: 98 },
      ],
    },
    hips: {
      parameterKey: 'hips',
      neutralValueCm: 94,
      points: [
        { influence: 0.0, circumferenceCm: 84 },
        { influence: 0.25, circumferenceCm: 89 },
        { influence: 0.5, circumferenceCm: 94 },
        { influence: 0.75, circumferenceCm: 102 },
        { influence: 1.0, circumferenceCm: 112 },
      ],
    },
  },
  female: {
    chest: {
      parameterKey: 'chest',
      neutralValueCm: 86,
      points: [
        { influence: 0.0, circumferenceCm: 76 },
        { influence: 0.25, circumferenceCm: 81 },
        { influence: 0.5, circumferenceCm: 86 },
        { influence: 0.75, circumferenceCm: 93 },
        { influence: 1.0, circumferenceCm: 105 },
      ],
    },
    waist: {
      parameterKey: 'waist',
      neutralValueCm: 66,
      points: [
        { influence: 0.0, circumferenceCm: 56 },
        { influence: 0.25, circumferenceCm: 61 },
        { influence: 0.5, circumferenceCm: 66 },
        { influence: 0.75, circumferenceCm: 74 },
        { influence: 1.0, circumferenceCm: 85 },
      ],
    },
    hips: {
      parameterKey: 'hips',
      neutralValueCm: 90,
      points: [
        { influence: 0.0, circumferenceCm: 80 },
        { influence: 0.25, circumferenceCm: 85 },
        { influence: 0.5, circumferenceCm: 90 },
        { influence: 0.75, circumferenceCm: 98 },
        { influence: 1.0, circumferenceCm: 110 },
      ],
    },
  },
};

/**
 * Maps a target circumference in cm to morph influences (Small vs Large) using the calibration table
 */
export function mapMeasurementToInfluences(
  targetCm: number,
  table: ParameterCalibrationTable
): { smallInfluence: number; largeInfluence: number; status: CalibrationStatus } {
  const neutral = table.neutralValueCm;
  const minCm = table.points[0].circumferenceCm;
  const maxCm = table.points[table.points.length - 1].circumferenceCm;

  if (targetCm < neutral) {
    const range = Math.max(1, neutral - minCm);
    const fraction = Math.min(1.0, Math.max(0.0, (neutral - targetCm) / range));
    return {
      smallInfluence: fraction,
      largeInfluence: 0.0,
      status: 'ESTIMATED',
    };
  } else {
    const range = Math.max(1, maxCm - neutral);
    const fraction = Math.min(1.0, Math.max(0.0, (targetCm - neutral) / range));
    return {
      smallInfluence: 0.0,
      largeInfluence: fraction,
      status: 'ESTIMATED',
    };
  }
}

/**
 * Estimates mesh cross-sectional circumference at a given Y height plane in Three.js
 * Used for geometric cross-section validation
 */
export function estimateCrossSectionCircumference(
  model: THREE.Object3D,
  planeY: number,
  tolerance = 0.02
): number | null {
  const sampledPoints: THREE.Vector2[] = [];

  model.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry;
      if (!geometry || !geometry.attributes.position) return;

      const pos = geometry.attributes.position;
      const vertex = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        vertex.fromBufferAttribute(pos, i);
        vertex.applyMatrix4(mesh.matrixWorld);

        if (Math.abs(vertex.y - planeY) < tolerance) {
          sampledPoints.push(new THREE.Vector2(vertex.x, vertex.z));
        }
      }
    }
  });

  if (sampledPoints.length < 8) return null;

  // Approximate ellipse/bounding circumference (Ramanujan's approximation on bounding box)
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const pt of sampledPoints) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minZ) minZ = pt.y;
    if (pt.y > maxZ) maxZ = pt.y;
  }

  const a = (maxX - minX) * 0.5 * 100; // semi-major axis in cm
  const b = (maxZ - minZ) * 0.5 * 100; // semi-minor axis in cm

  if (a <= 0 || b <= 0) return null;

  // Ramanujan ellipse perimeter: π * [ 3(a+b) - sqrt((3a+b)(a+3b)) ]
  const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
  const perimeterCm = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  return Math.round(perimeterCm);
}

/**
 * Returns landmark Y planes in world units based on model height
 */
export function getLandmarkYPlanes(modelHeightMeters: number, gender: Gender) {
  const ratios = AVATAR_CONFIG[gender].landmarkRatios;
  return {
    chestY: modelHeightMeters * ratios.chest,
    waistY: modelHeightMeters * ratios.waist,
    hipsY: modelHeightMeters * ratios.hips,
  };
}
