import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BodyParameters } from './bodyParameters';
import { ClothingSize, FittedItem } from '@/app/components/ai-sports-stylist/types';
import { Garment3DModelConfig } from './product3DRegistry';

/**
 * Generates an athletic sportswear PBR texture with Li-Ning branding, collar trims, and fabric weave
 */
function createSportswearTexture(colorHex: string, isShirt = true): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Base Fabric Color
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 512, 512);

    // 2. Micro-perforated breathable athletic mesh pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let x = 0; x < 512; x += 6) {
      for (let y = 0; y < 512; y += 6) {
        ctx.fillRect(x + (y % 12 === 0 ? 3 : 0), y, 2, 2);
      }
    }

    if (isShirt) {
      // 3. Subtle athletic chest & shoulder lighting gradient
      const gradient = ctx.createLinearGradient(0, 0, 512, 0);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
      gradient.addColorStop(0.25, 'rgba(0, 0, 0, 0.04)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
      gradient.addColorStop(0.75, 'rgba(0, 0, 0, 0.04)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // 4. Collar Trim Line (Sport V-Neck / Polo accent at top)
      ctx.fillStyle = colorHex === '#111111' ? '#f30d29' : '#111111';
      ctx.fillRect(160, 480, 192, 28);

      // 5. Iconic Li-Ning Logo on Left Chest (u ~ 0.65, v ~ 0.75)
      const logoColor =
        colorHex === '#ffffff' || colorHex === '#f8fafc' ? '#f30d29' : '#ffffff';
      ctx.fillStyle = logoColor;

      // Speed stroke
      ctx.beginPath();
      ctx.moveTo(340, 360);
      ctx.bezierCurveTo(365, 340, 395, 350, 420, 335);
      ctx.bezierCurveTo(395, 365, 365, 355, 340, 360);
      ctx.fill();

      // Top wing mark
      ctx.beginPath();
      ctx.moveTo(350, 372);
      ctx.lineTo(375, 358);
      ctx.lineTo(368, 376);
      ctx.closePath();
      ctx.fill();
    } else {
      // Shorts: Elastic waistband & side contrast racing stripe
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, 475, 512, 37);

      // Side athletic racing stripes
      ctx.fillStyle = '#f30d29';
      ctx.fillRect(15, 0, 18, 512);
      ctx.fillRect(479, 0, 18, 512);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates high-quality sportswear PBR material
 */
function createClothingMaterial(colorHex: string, isShirt = true): THREE.MeshStandardMaterial {
  const texture = createSportswearTexture(colorHex, isShirt);

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    map: texture,
    roughness: 0.58,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
}

/**
 * Extracts submesh geometry from the avatar model with outward normal offset
 */
function extractSubmeshGeometry(
  sourceGeometry: THREE.BufferGeometry,
  filterFn: (x: number, y: number, z: number, yNorm: number, absX: number) => boolean,
  offsetDistance: number,
  isShirt = true
): THREE.BufferGeometry | null {
  const posAttr = sourceGeometry.attributes.position;
  const normalAttr = sourceGeometry.attributes.normal;
  const indexAttr = sourceGeometry.index;

  if (!posAttr) return null;

  // Calculate local bounding height
  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const height = Math.max(0.001, maxY - minY);

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  const processTriangle = (iA: number, iB: number, iC: number) => {
    const yA = posAttr.getY(iA), xA = posAttr.getX(iA), zA = posAttr.getZ(iA);
    const yB = posAttr.getY(iB), xB = posAttr.getX(iB), zB = posAttr.getZ(iB);
    const yC = posAttr.getY(iC), xC = posAttr.getX(iC), zC = posAttr.getZ(iC);

    const matchA = filterFn(xA, yA, zA, (yA - minY) / height, Math.abs(xA));
    const matchB = filterFn(xB, yB, zB, (yB - minY) / height, Math.abs(xB));
    const matchC = filterFn(xC, yC, zC, (yC - minY) / height, Math.abs(xC));

    // Include triangle if all 3 vertices belong to the apparel region
    if (matchA && matchB && matchC) {
      for (const idx of [iA, iB, iC]) {
        const nx = normalAttr ? normalAttr.getX(idx) : 0;
        const ny = normalAttr ? normalAttr.getY(idx) : 0;
        const nz = normalAttr ? normalAttr.getZ(idx) : 1;

        const px = posAttr.getX(idx) + nx * offsetDistance;
        const py = posAttr.getY(idx) + ny * offsetDistance;
        const pz = posAttr.getZ(idx) + nz * offsetDistance;

        positions.push(px, py, pz);
        normals.push(nx, ny, nz);

        // Cylindrical UV projection centered on chest
        const angle = Math.atan2(px, pz); // -PI to PI
        const u = 0.5 + angle / (2 * Math.PI);

        let v: number;
        if (isShirt) {
          // Normalize v between shirt bottom (0.49) and collar (0.81)
          const yNorm = (py - minY) / height;
          v = Math.max(0, Math.min(1, (yNorm - 0.49) / 0.32));
        } else {
          // Shorts between 0.33 and 0.53
          const yNorm = (py - minY) / height;
          v = Math.max(0, Math.min(1, (yNorm - 0.33) / 0.20));
        }

        uvs.push(u, v);
      }
    }
  };

  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i += 3) {
      processTriangle(indexAttr.getX(i), indexAttr.getX(i + 1), indexAttr.getX(i + 2));
    }
  } else {
    for (let i = 0; i < posAttr.count; i += 3) {
      processTriangle(i, i + 1, i + 2);
    }
  }

  if (positions.length === 0) return null;

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

/**
 * 3D Clothing Fit Engine
 * 
 * Supports both:
 * 1. Exact 3D Mesh Loading (GLTF/GLB) for multi-part outfits (AWET001-1 top.glb, bottom.glb...)
 * 2. Anatomical Procedural extraction for standard catalog products
 */
export class ClothingEngine {
  private clothingGroup: THREE.Group;
  private currentShirtMesh: THREE.Mesh | null = null;
  private currentShortsMesh: THREE.Mesh | null = null;
  private exactTopGroup: THREE.Group | null = null;
  private exactBottomGroup: THREE.Group | null = null;
  private exactShoesGroup: THREE.Group | null = null;

  private baseAvatarMesh: THREE.Mesh | null = null;
  private currentAvatarModel: THREE.Group | null = null;
  private gltfLoader = new GLTFLoader();

  constructor(scene: THREE.Scene) {
    this.clothingGroup = new THREE.Group();
    this.clothingGroup.name = 'AvatarClothingLayer';
  }

  /**
   * Sets the active avatar model and attaches clothingGroup directly inside it
   */
  public setBaseAvatarModel(model: THREE.Group): void {
    this.currentAvatarModel = model;

    let foundMesh: THREE.Mesh | null = null;
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !foundMesh) {
        foundMesh = child as THREE.Mesh;
      }
    });
    this.baseAvatarMesh = foundMesh;

    // Attach clothingGroup directly into the avatar model hierarchy
    if (this.clothingGroup.parent) {
      this.clothingGroup.parent.remove(this.clothingGroup);
    }
    model.add(this.clothingGroup);

    // Reset local transformation relative to parent model
    this.clothingGroup.position.set(0, 0, 0);
    this.clothingGroup.scale.set(1, 1, 1);
    this.clothingGroup.rotation.set(0, 0, 0);
  }

  /**
   * Loads and equips an EXACT 3D garment GLB file (e.g. AWET001-1 top.glb or bottom.glb)
   */
  public async equipExactGarment(
    slot: 'top' | 'bottom' | 'shoes',
    modelUrl: string,
    config?: Garment3DModelConfig
  ): Promise<THREE.Group | null> {
    // 1. Clear previous garment in this specific slot
    if (slot === 'top') {
      if (this.currentShirtMesh) {
        this.clothingGroup.remove(this.currentShirtMesh);
        this.disposeMesh(this.currentShirtMesh);
        this.currentShirtMesh = null;
      }
      if (this.exactTopGroup) {
        this.clothingGroup.remove(this.exactTopGroup);
        this.disposeObject(this.exactTopGroup);
        this.exactTopGroup = null;
      }
    } else if (slot === 'bottom') {
      if (this.currentShortsMesh) {
        this.clothingGroup.remove(this.currentShortsMesh);
        this.disposeMesh(this.currentShortsMesh);
        this.currentShortsMesh = null;
      }
      if (this.exactBottomGroup) {
        this.clothingGroup.remove(this.exactBottomGroup);
        this.disposeObject(this.exactBottomGroup);
        this.exactBottomGroup = null;
      }
    } else if (slot === 'shoes') {
      if (this.exactShoesGroup) {
        this.clothingGroup.remove(this.exactShoesGroup);
        this.disposeObject(this.exactShoesGroup);
        this.exactShoesGroup = null;
      }
    }

    if (!modelUrl) return null;

    try {
      const gltf = await this.gltfLoader.loadAsync(modelUrl);
      const model = gltf.scene;

      // Set Shadows and preserve original textures & materials
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          m.castShadow = true;
          m.receiveShadow = true;
        }
      });

      // Apply fitting transform
      const scale = config?.scale || [1, 1, 1];
      const position = config?.position || [0, 0, 0];
      const rotation = config?.rotation || [0, 0, 0];

      model.scale.set(scale[0], scale[1], scale[2]);
      model.position.set(position[0], position[1], position[2]);
      model.rotation.set(rotation[0], rotation[1], rotation[2]);

      this.clothingGroup.add(model);

      if (slot === 'top') {
        this.exactTopGroup = model;
      } else if (slot === 'bottom') {
        this.exactBottomGroup = model;
      } else if (slot === 'shoes') {
        this.exactShoesGroup = model;
      }

      return model;
    } catch (error) {
      console.error(`[ClothingEngine] Failed to load exact 3D garment (${slot}) from ${modelUrl}:`, error);
      return null;
    }
  }

  /**
   * Equips a realistic athletic shirt/polo/jersey onto the avatar (procedural fallback)
   */
  public equipShirt(item: FittedItem, modelHeight = 1.75): void {
    if (this.exactTopGroup) {
      this.clothingGroup.remove(this.exactTopGroup);
      this.disposeObject(this.exactTopGroup);
      this.exactTopGroup = null;
    }
    if (this.currentShirtMesh) {
      this.clothingGroup.remove(this.currentShirtMesh);
      this.disposeMesh(this.currentShirtMesh);
      this.currentShirtMesh = null;
    }

    if (!this.baseAvatarMesh || !this.baseAvatarMesh.geometry) return;

    const sizeOffset = this.getSizeOffset(item.size);

    const shirtGeom = extractSubmeshGeometry(
      this.baseAvatarMesh.geometry,
      (x, y, z, yNorm, absX) => {
        const inTorso = yNorm >= 0.49 && yNorm <= 0.81 && absX <= 0.22;
        const inSleeve = yNorm >= 0.64 && yNorm <= 0.81 && absX > 0.22 && absX <= 0.34;
        return inTorso || inSleeve;
      },
      sizeOffset,
      true
    );

    if (!shirtGeom) return;

    const mat = createClothingMaterial(item.colorHex || '#f30d29', true);
    const mesh = new THREE.Mesh(shirtGeom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.position.set(0, 0, 0);
    mesh.scale.set(1, 1, 1);
    mesh.rotation.set(0, 0, 0);

    this.currentShirtMesh = mesh;
    this.clothingGroup.add(mesh);
  }

  /**
   * Equips realistic athletic shorts/pants onto the avatar (procedural fallback)
   */
  public equipShorts(item: FittedItem, modelHeight = 1.75): void {
    if (this.exactBottomGroup) {
      this.clothingGroup.remove(this.exactBottomGroup);
      this.disposeObject(this.exactBottomGroup);
      this.exactBottomGroup = null;
    }
    if (this.currentShortsMesh) {
      this.clothingGroup.remove(this.currentShortsMesh);
      this.disposeMesh(this.currentShortsMesh);
      this.currentShortsMesh = null;
    }

    if (!this.baseAvatarMesh || !this.baseAvatarMesh.geometry) return;

    const sizeOffset = this.getSizeOffset(item.size);

    const shortsGeom = extractSubmeshGeometry(
      this.baseAvatarMesh.geometry,
      (x, y, z, yNorm, absX) => {
        return yNorm >= 0.33 && yNorm <= 0.53 && absX <= 0.23;
      },
      sizeOffset,
      false
    );

    if (!shortsGeom) return;

    const mat = createClothingMaterial(item.colorHex || '#111111', false);
    const mesh = new THREE.Mesh(shortsGeom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.position.set(0, 0, 0);
    mesh.scale.set(1, 1, 1);
    mesh.rotation.set(0, 0, 0);

    this.currentShortsMesh = mesh;
    this.clothingGroup.add(mesh);
  }

  /**
   * Synchronizes clothing transformation with the avatar model
   */
  public updateScale(modelHeightMeters: number, params: BodyParameters): void {
    // When parent avatar model deforms or scales, clothing automatically inherits because it is a child node
  }

  /**
   * Clears all equipped clothing layers
   */
  public clear(): void {

    if (this.currentShirtMesh) {
      this.clothingGroup.remove(this.currentShirtMesh);
      this.disposeMesh(this.currentShirtMesh);
      this.currentShirtMesh = null;
    }
    if (this.currentShortsMesh) {
      this.clothingGroup.remove(this.currentShortsMesh);
      this.disposeMesh(this.currentShortsMesh);
      this.currentShortsMesh = null;
    }
    if (this.exactTopGroup) {
      this.clothingGroup.remove(this.exactTopGroup);
      this.disposeObject(this.exactTopGroup);
      this.exactTopGroup = null;
    }
    if (this.exactBottomGroup) {
      this.clothingGroup.remove(this.exactBottomGroup);
      this.disposeObject(this.exactBottomGroup);
      this.exactBottomGroup = null;
    }
    if (this.exactShoesGroup) {
      this.clothingGroup.remove(this.exactShoesGroup);
      this.disposeObject(this.exactShoesGroup);
      this.exactShoesGroup = null;
    }
  }

  public getGroup(): THREE.Group {
    return this.clothingGroup;
  }

  private getSizeOffset(size: ClothingSize): number {
    switch (size) {
      case 'S':
        return 0.0020;
      case 'M':
        return 0.0030;
      case 'L':
        return 0.0042;
      case 'XL':
        return 0.0058;
      case 'XXL':
        return 0.0076;
      default:
        return 0.0035;
    }
  }

  private disposeMesh(mesh: THREE.Mesh): void {
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  }

  private disposeObject(obj: THREE.Object3D): void {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        this.disposeMesh(child as THREE.Mesh);
      }
    });
  }

  public dispose(): void {
    this.clear();
    if (this.clothingGroup.parent) {
      this.clothingGroup.parent.remove(this.clothingGroup);
    }
  }
}
