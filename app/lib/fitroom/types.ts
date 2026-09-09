import { Product } from '@/app/lib/types';

export type FitRoomClothType = 'upper' | 'lower' | 'combo' | 'full_set';

export type FitRoomTaskStatus = 'CREATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface FitRoomModelCheckResponse {
  is_good: boolean;
  good_clothes_types?: string[];
  error_code?: string;
  message?: string;
}

export interface FitRoomClothesCheckResponse {
  is_clothes: boolean;
  clothes_type?: string;
  error_code?: string;
  message?: string;
}

export interface FitRoomCreateTaskResponse {
  task_id: string;
  status: string;
  message?: string;
  error?: boolean;
}

export interface FitRoomTaskDetailResponse {
  task_id: string;
  status: FitRoomTaskStatus;
  progress: number;
  download_signed_url?: string;
  error_message?: string;
  error?: boolean;
  message?: string;
}

export interface TryOnSelection {
  upper: Product | null;
  lower: Product | null;
  full: Product | null;
}

export type TryOnStep =
  | 'idle'
  | 'validating'
  | 'preparing'
  | 'submitting'
  | 'created'
  | 'processing'
  | 'completed'
  | 'failed';

export interface TryOnResult {
  taskId: string;
  resultImageUrl: string;
  modelImageUrl: string;
  upperProduct?: Product | null;
  lowerProduct?: Product | null;
  fullProduct?: Product | null;
  clothType: FitRoomClothType;
  hdMode: boolean;
  timestamp: number;
}
