/**
 * Centralized Product 3D Outfit & Garment Registry
 * Maps SKU to exact 3D models (GLB) with fitting configurations
 */

export interface Garment3DModelConfig {
  modelUrl: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export interface Product3DOutfitConfig {
  sku: string;
  name: string;
  type: 'outfit' | 'single';
  exact3D: boolean;
  garments: {
    top?: Garment3DModelConfig;
    bottom?: Garment3DModelConfig;
    shoes?: Garment3DModelConfig;
  };
}

export const PRODUCT_3D_REGISTRY: Record<string, Product3DOutfitConfig> = {
  'AWET001-1': {
    sku: 'AWET001-1',
    name: 'Bộ quần áo nỉ Nam AWET001-1',
    type: 'outfit',
    exact3D: true,
    garments: {
      top: {
        modelUrl: '/models/products/AWET001-1/top.glb',
        scale: [1.01, 1.00, 1.02],
        position: [0, -0.155, 0.010],
        rotation: [0, 0, 0],
      },
      bottom: {
        modelUrl: '/models/products/AWET001-1/bottom.glb',
        scale: [0.98, 0.85, 0.98],
        position: [0, -0.970, 0.008],
        rotation: [0, 0, 0],
      },
    },
  },
};

/**
 * Helper to lookup 3D configuration by SKU or Product Handle
 */
export function getProduct3DConfig(sku?: string, handle?: string): Product3DOutfitConfig | null {
  if (!sku && !handle) return null;

  if (sku && PRODUCT_3D_REGISTRY[sku]) {
    return PRODUCT_3D_REGISTRY[sku];
  }

  // Fallback search by handle
  const found = Object.values(PRODUCT_3D_REGISTRY).find(
    (cfg) => cfg.sku.toLowerCase() === sku?.toLowerCase() || (handle && handle.toLowerCase().includes(cfg.sku.toLowerCase()))
  );

  return found || null;
}
