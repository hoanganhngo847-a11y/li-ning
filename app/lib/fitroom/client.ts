import {
  FitRoomClothType,
  FitRoomClothesCheckResponse,
  FitRoomCreateTaskResponse,
  FitRoomModelCheckResponse,
  FitRoomTaskDetailResponse,
} from './types';

const FITROOM_BASE_URL = 'https://platform.fitroom.app';

import { getProviderApiKey } from '../api-keys/resolver';

async function getApiKey(): Promise<string> {
  const key = await getProviderApiKey('fitroom');
  if (!key) {
    throw new Error('FITROOM_API_KEY_MISSING');
  }
  return key;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const key = await getApiKey();
  return {
    'X-API-KEY': key,
  };
}

/**
 * Validates whether the uploaded customer image is suitable for AI Try-On
 * Endpoint: POST /api/tryon/input_check/v1/model
 */
export async function checkModelImage(
  imageBlob: Blob,
  filename = 'model_image.jpg'
): Promise<FitRoomModelCheckResponse> {
  const formData = new FormData();
  formData.append('input_image', imageBlob, filename);

  const response = await fetch(`${FITROOM_BASE_URL}/api/tryon/input_check/v1/model`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FitRoom model check failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data as FitRoomModelCheckResponse;
}

/**
 * Validates whether the selected garment image is recognized as clothing
 * Endpoint: POST /api/tryon/input_check/v1/clothes
 */
export async function checkClothesImage(
  imageBlob: Blob,
  filename = 'cloth_image.jpg'
): Promise<FitRoomClothesCheckResponse> {
  const formData = new FormData();
  formData.append('input_image', imageBlob, filename);

  const response = await fetch(`${FITROOM_BASE_URL}/api/tryon/input_check/v1/clothes`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FitRoom clothes check failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data as FitRoomClothesCheckResponse;
}

export interface CreateTryOnParams {
  modelImage: Blob;
  modelFilename?: string;
  clothImage: Blob;
  clothFilename?: string;
  lowerClothImage?: Blob;
  lowerClothFilename?: string;
  clothType: FitRoomClothType;
  hdMode?: boolean;
}

/**
 * Creates an AI Virtual Try-On task (Single item or Combo)
 * Endpoint: POST /api/tryon/v2/tasks
 */
export async function createTryOnTask(
  params: CreateTryOnParams
): Promise<FitRoomCreateTaskResponse> {
  const {
    modelImage,
    modelFilename = 'model.jpg',
    clothImage,
    clothFilename = 'cloth.jpg',
    lowerClothImage,
    lowerClothFilename = 'lower_cloth.jpg',
    clothType,
    hdMode = false,
  } = params;

  const formData = new FormData();
  formData.append('model_image', modelImage, modelFilename);
  formData.append('cloth_image', clothImage, clothFilename);
  formData.append('cloth_type', clothType);
  formData.append('hd_mode', hdMode ? 'true' : 'false');

  if (clothType === 'combo' && lowerClothImage) {
    formData.append('lower_cloth_image', lowerClothImage, lowerClothFilename);
  }

  const response = await fetch(`${FITROOM_BASE_URL}/api/tryon/v2/tasks`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FitRoom create task failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data as FitRoomCreateTaskResponse;
}

/**
 * Polls status of a Try-On task
 * Endpoint: GET /api/tryon/v2/tasks/{taskId}
 */
export async function getTryOnStatus(
  taskId: string
): Promise<FitRoomTaskDetailResponse> {
  if (!taskId) {
    throw new Error('Missing taskId');
  }

  const response = await fetch(`${FITROOM_BASE_URL}/api/tryon/v2/tasks/${encodeURIComponent(taskId)}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FitRoom get task failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data as FitRoomTaskDetailResponse;
}
