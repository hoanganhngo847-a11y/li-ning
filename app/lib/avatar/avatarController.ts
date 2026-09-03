import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Gender, BodyPresetId, AVATAR_CONFIG } from './avatarConfig';
import { BodyParameters, sanitizeBodyParameters } from './bodyParameters';
import { MorphController, MorphSemanticKey } from './morphController';
import { LocalDeformationEngine, DebugMaskRegion } from './localDeformationEngine';
import { MeasurementGuidesOverlay } from './measurementGuides';
import { ClothingEngine } from './clothingEngine';
import { mapMeasurementToInfluences, CALIBRATION_TABLES } from './measurementCalibration';
import { FittedItem } from '@/app/components/ai-sports-stylist/types';

import { getProduct3DConfig } from './product3DRegistry';

export interface AvatarControllerCallbacks {
  onLoadStart?: () => void;
  onLoadSuccess?: (model: THREE.Group) => void;
  onLoadError?: (error: Error) => void;
}

export class AvatarController {
  private gender: Gender = 'male';
  private currentPreset: BodyPresetId = 'muscular';
  private currentLoadedPath: string | null = null;
  private loadRequestId = 0;
  private currentSkinTone: string | number = 0xe6b8a2;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private avatarGroup: THREE.Group;
  private currentModel: THREE.Group | null = null;
  private baseScale = 1.0;
  private canonicalHeight = 1.75;
  private floorOffsetY = 0.0;

  // Sub-controllers
  public morphController: MorphController;
  public localDeformationEngine: LocalDeformationEngine;
  public measurementGuides: MeasurementGuidesOverlay;
  public clothingEngine: ClothingEngine;

  private currentParameters: BodyParameters | null = null;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;

    // Dedicated single-avatar container in the scene
    this.avatarGroup = new THREE.Group();
    this.avatarGroup.name = 'AvatarContainerGroup';
    this.scene.add(this.avatarGroup);

    this.morphController = new MorphController('male');
    this.localDeformationEngine = new LocalDeformationEngine();
    this.measurementGuides = new MeasurementGuidesOverlay();
    this.scene.add(this.measurementGuides.getGroup());

    this.clothingEngine = new ClothingEngine(this.scene);
  }

  /**
   * Sets the skin tone color in real-time on all avatar meshes
   */
  public setSkinTone(colorHex: string | number): void {
    this.currentSkinTone = colorHex;
    if (!this.currentModel) return;

    const threeColor = new THREE.Color(colorHex);
    this.currentModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.color.copy(threeColor);
                mat.roughness = 0.52;
                mat.metalness = 0.04;
                mat.needsUpdate = true;
              }
            });
          } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.color.copy(threeColor);
            mesh.material.roughness = 0.52;
            mesh.material.metalness = 0.04;
            mesh.material.needsUpdate = true;
          }
        }
      }
    });
  }

  /**
   * Equips a sportswear item (exact 3D model or procedural shirt/shorts) onto the 3D model
   */
  public async equipClothingItem(item: FittedItem): Promise<void> {
    if (this.currentModel) {
      this.clothingEngine.setBaseAvatarModel(this.currentModel);
    }
    const heightMeters = (this.currentParameters?.heightCm || 175) / 100;

    const registryConfig = getProduct3DConfig(item.product.sku, item.product.handle);

    if (registryConfig?.exact3D) {
      if (item.category === 'top' && registryConfig.garments.top) {
        await this.clothingEngine.equipExactGarment(
          'top',
          registryConfig.garments.top.modelUrl,
          registryConfig.garments.top
        );
        return;
      } else if (item.category === 'bottom' && registryConfig.garments.bottom) {
        await this.clothingEngine.equipExactGarment(
          'bottom',
          registryConfig.garments.bottom.modelUrl,
          registryConfig.garments.bottom
        );
        return;
      }
    }

    if (item.exactModelUrl) {
      await this.clothingEngine.equipExactGarment(item.category, item.exactModelUrl);
      return;
    }

    if (item.category === 'top') {
      this.clothingEngine.equipShirt(item, heightMeters);
    } else if (item.category === 'bottom') {
      this.clothingEngine.equipShorts(item, heightMeters);
    }
  }


  public clearClothing(): void {
    this.clothingEngine.clear();
  }

  /**
   * Loads the 3D avatar model matching the chosen gender and body preset
   */
  public loadAvatar(
    gender: Gender,
    preset: BodyPresetId = 'muscular',
    callbacks?: AvatarControllerCallbacks
  ): void {
    this.gender = gender;
    this.currentPreset = preset;
    this.morphController.setGender(gender);

    const config = AVATAR_CONFIG[gender];
    this.canonicalHeight = config.canonicalHeightMeters;

    const targetModelPath = config.modelPaths[preset] || config.modelPaths.muscular;

    // If already loaded this exact asset, simply re-apply parameters without reloading
    if (this.currentModel && this.currentLoadedPath === targetModelPath) {
      if (this.currentParameters) {
        this.applyBodyParameters(this.currentParameters);
      }
      callbacks?.onLoadSuccess?.(this.currentModel);
      return;
    }

    const requestId = ++this.loadRequestId;
    callbacks?.onLoadStart?.();

    const loader = new GLTFLoader();
    loader.load(
      targetModelPath,
      (gltf) => {
        // Discard stale async responses if user switched preset/gender in the meantime
        if (requestId !== this.loadRequestId) {
          this.disposeObject(gltf.scene);
          return;
        }

        // Clean up any existing model inside the avatar container
        while (this.avatarGroup.children.length > 0) {
          const oldChild = this.avatarGroup.children[0];
          this.avatarGroup.remove(oldChild);
          this.disposeObject(oldChild);
        }

        const model = gltf.scene;
        this.currentModel = model;
        this.currentLoadedPath = targetModelPath;

        // Apply chosen skin tone material
        const skinColor = new THREE.Color(this.currentSkinTone);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.color.copy(skinColor);
                    mat.roughness = 0.52;
                    mat.metalness = 0.04;
                    mat.needsUpdate = true;
                  }
                });
              } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.color.copy(skinColor);
                mesh.material.roughness = 0.52;
                mesh.material.metalness = 0.04;
                mesh.material.needsUpdate = true;
              }
            } else {
              mesh.material = new THREE.MeshStandardMaterial({
                color: skinColor,
                roughness: 0.52,
                metalness: 0.04,
              });
            }
          }
        });

        // Compute Bounding Box & Canonical Base Scale
        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());

        this.baseScale = size.y > 0 ? this.canonicalHeight / size.y : 1.0;

        // Center model at origin on X/Z, feet at Y=0
        model.position.x = -center.x * this.baseScale;
        model.position.z = -center.z * this.baseScale;
        this.floorOffsetY = -bbox.min.y * this.baseScale;
        model.position.y = this.floorOffsetY;

        // Set baseline scale (strictly uniform base scale, NO X/Z fake scaling)
        model.scale.set(this.baseScale, this.baseScale, this.baseScale);
        this.avatarGroup.add(model);

        // Initialize Morph Controller, Local Deformation Engine & Clothing Engine
        this.clothingEngine.setBaseAvatarModel(model);
        this.morphController.discoverMorphs(model);
        this.localDeformationEngine.initialize(model);

        // Re-apply current body parameters if available
        if (this.currentParameters) {
          this.applyBodyParameters(this.currentParameters);
        }

        callbacks?.onLoadSuccess?.(model);
      },
      undefined,
      (error) => {
        if (requestId !== this.loadRequestId) return;
        console.warn(`[AvatarController] Failed to load model at ${targetModelPath}:`, error);
        callbacks?.onLoadError?.(error instanceof Error ? error : new Error(String(error)));
      }
    );
  }

  /**
   * Applies Body Parameters to the 3D avatar with strict parameter separation
   */
  public applyBodyParameters(
    rawParams: BodyParameters,
    callbacks?: AvatarControllerCallbacks
  ): void {
    const params = sanitizeBodyParameters(rawParams, rawParams.gender || this.gender);
    this.currentParameters = params;

    // Check if preset or gender changed requiring model reload
    const config = AVATAR_CONFIG[params.gender];
    const targetModelPath = config.modelPaths[params.preset] || config.modelPaths.muscular;

    if (
      this.gender !== params.gender ||
      this.currentPreset !== params.preset ||
      !this.currentLoadedPath ||
      this.currentLoadedPath !== targetModelPath
    ) {
      this.loadAvatar(params.gender, params.preset, callbacks);
      return;
    }

    if (!this.currentModel) return;

    // ============================================================
    // 1. GLOBAL HEIGHT TRANSFORMATION
    // ============================================================
    const targetRefHeight = this.gender === 'female' ? 165 : 175;
    const heightScaleFactor = params.heightCm / targetRefHeight;
    const actualHeightScaleY = this.baseScale * heightScaleFactor;

    this.currentModel.scale.set(this.baseScale, actualHeightScaleY, this.baseScale);
    this.currentModel.position.y = this.floorOffsetY * heightScaleFactor;

    // ============================================================
    // 2. LOCAL ANATOMICAL VERTEX DEFORMATION ENGINE
    // ============================================================
    this.localDeformationEngine.applyDeformation(params);

    // ============================================================
    // 3. MORPH TARGET INFLUENCES
    // ============================================================
    const tables = CALIBRATION_TABLES[this.gender];
    const chestInfluences = mapMeasurementToInfluences(params.chestCm, tables.chest);
    const waistInfluences = mapMeasurementToInfluences(params.waistCm, tables.waist);
    const hipsInfluences = mapMeasurementToInfluences(params.hipCm, tables.hips);

    const refWeight = this.gender === 'female' ? 58 : 76;
    const deltaWeight = (params.weightKg - refWeight) / refWeight;

    const morphWeights: Partial<Record<MorphSemanticKey, number>> = {
      chestSmall: chestInfluences.smallInfluence,
      chestLarge: chestInfluences.largeInfluence,
      waistSmall: waistInfluences.smallInfluence,
      waistLarge: waistInfluences.largeInfluence,
      hipSmall: hipsInfluences.smallInfluence,
      hipLarge: hipsInfluences.largeInfluence,
      weightLow: deltaWeight < 0 ? Math.min(1.0, Math.abs(deltaWeight) * 2) : 0,
      weightHigh: deltaWeight > 0 ? Math.min(1.0, deltaWeight * 1.8) : 0,
      muscleHigh: params.preset === 'muscular' ? 1.0 : params.preset === 'fat' ? 0.4 : 0.0,
      muscleLow: params.preset === 'slim' || params.preset === 'skinny_fat' ? 0.7 : 0.0,
    };

    this.morphController.applyInfluences(this.currentModel, morphWeights);

    // ============================================================
    // 4. 3D MEASUREMENT GUIDES UPDATE
    // ============================================================
    const modelHeightMeters = params.heightCm / 100;
    this.measurementGuides.update(modelHeightMeters, params);

    // ============================================================
    // 5. UPDATE 3D CLOTHING LAYER SCALE
    // ============================================================
    this.clothingEngine.updateScale(modelHeightMeters, params);
  }

  public setDebugMaskRegion(region: DebugMaskRegion): void {
    this.localDeformationEngine.setDebugMaskRegion(region);
  }

  public setGuidesVisible(visible: boolean): void {
    this.measurementGuides.setVisible(visible);
    if (this.currentParameters) {
      this.measurementGuides.update(this.currentParameters.heightCm / 100, this.currentParameters);
    }
  }

  public getModel(): THREE.Group | null {
    return this.currentModel;
  }

  public getCurrentParameters(): BodyParameters | null {
    return this.currentParameters;
  }

  private disposeObject(obj: THREE.Object3D): void {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.dispose();
            });
          } else {
            mesh.material.dispose();
          }
        }
      }
    });
  }

  public dispose(): void {
    if (this.avatarGroup) {
      while (this.avatarGroup.children.length > 0) {
        const child = this.avatarGroup.children[0];
        this.avatarGroup.remove(child);
        this.disposeObject(child);
      }
      this.scene.remove(this.avatarGroup);
    }
    this.currentModel = null;
    this.measurementGuides.dispose();
    this.scene.remove(this.measurementGuides.getGroup());
    this.clothingEngine.dispose();
  }
}
