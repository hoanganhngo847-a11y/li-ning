import * as THREE from 'three';
import { Gender } from './avatarConfig';
import { getLandmarkYPlanes } from './measurementCalibration';
import { BodyParameters } from './bodyParameters';

export class MeasurementGuidesOverlay {
  private group: THREE.Group;
  private chestRing: THREE.LineLoop | null = null;
  private waistRing: THREE.LineLoop | null = null;
  private hipsRing: THREE.LineLoop | null = null;
  private visible = false;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'MeasurementGuidesOverlay';
    this.group.visible = false;
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  public setVisible(visible: boolean) {
    this.visible = visible;
    this.group.visible = visible;
  }

  public isVisible(): boolean {
    return this.visible;
  }

  /**
   * Builds or updates the 3D measurement guide lines at Chest, Waist, and Hips
   */
  public update(modelHeightMeters: number, params: BodyParameters) {
    if (!this.visible) return;

    // Clear previous geometries
    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      this.group.remove(child);
      if ((child as THREE.Line).geometry) (child as THREE.Line).geometry.dispose();
    }

    const planes = getLandmarkYPlanes(modelHeightMeters, params.gender);

    // Radii in meters from circumference (C = 2 * PI * r => r = C / (2 * PI * 100))
    // Add small clearance (+1.5cm) so guide floats nicely around avatar skin
    const chestRadius = ((params.chestCm + 3) / (2 * Math.PI)) / 100;
    const waistRadius = ((params.waistCm + 3) / (2 * Math.PI)) / 100;
    const hipsRadius = ((params.hipCm + 3) / (2 * Math.PI)) / 100;

    // 1. Chest Line (Red Li-Ning theme)
    this.chestRing = this.createRing(chestRadius, planes.chestY, 0xf30d29, 'Vòng 1 (Ngực)');
    this.group.add(this.chestRing);

    // 2. Waist Line (Amber)
    this.waistRing = this.createRing(waistRadius, planes.waistY, 0xf59e0b, 'Vòng 2 (Eo)');
    this.group.add(this.waistRing);

    // 3. Hips Line (Emerald)
    this.hipsRing = this.createRing(hipsRadius, planes.hipsY, 0x10b981, 'Vòng 3 (Hông)');
    this.group.add(this.hipsRing);
  }

  private createRing(radius: number, y: number, color: number, name: string): THREE.LineLoop {
    const points: THREE.Vector3[] = [];
    const segments = 64;

    // Slightly elliptical cross-section (wider on X, slightly narrower on Z for natural torso shape)
    const radiusX = radius * 1.15;
    const radiusZ = radius * 0.85;

    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.sin(theta) * radiusX, y, Math.cos(theta) * radiusZ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });

    const ring = new THREE.LineLoop(geometry, material);
    ring.name = name;
    return ring;
  }

  public dispose() {
    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      this.group.remove(child);
      if ((child as THREE.Line).geometry) (child as THREE.Line).geometry.dispose();
      if ((child as THREE.Line).material) {
        const mat = (child as THREE.Line).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    }
  }
}
