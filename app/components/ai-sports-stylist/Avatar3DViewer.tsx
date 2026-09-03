'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BodyProfile, toBodyParameters, FittingState } from './types';
import { AvatarController } from '@/app/lib/avatar/avatarController';
import { calculateBmi } from '@/app/lib/avatar/bodyParameters';
import { BODY_PRESETS } from '@/app/lib/avatar/bodyPresets';
import { DebugMaskRegion } from '@/app/lib/avatar/localDeformationEngine';

interface Avatar3DViewerProps {
  profile: BodyProfile;
  skinTone?: string;
  fittingState?: FittingState;
  activeHoverRegion?: DebugMaskRegion;
  showGuides?: boolean;
}

type CameraPreset = 'all' | 'front' | 'side' | 'back';

export default function Avatar3DViewer({
  profile,
  skinTone = '#e6b8a2',
  fittingState,
  activeHoverRegion = 'none',
  showGuides: propShowGuides = false,
}: Avatar3DViewerProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>('front');
  const [showGuides, setShowGuides] = useState(propShowGuides);

  useEffect(() => {
    setShowGuides(propShowGuides);
  }, [propShowGuides]);


  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const avatarControllerRef = useRef<AvatarController | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Target camera orbit angle for smooth transitions
  const targetOrbitAngleRef = useRef<number | null>(null);

  const profileRef = useRef(profile);
  profileRef.current = profile;

  // 1. Initialize Three.js Scene, Camera, Lights, OrbitControls, and AvatarController
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc);

    // --- Camera Setup ---
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(0, 0.98, 3.2);

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Clear and mount canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- OrbitControls Setup ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 5.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.04;
    controls.minPolarAngle = Math.PI / 6;
    controls.target.set(0, 0.90, 0);
    controls.update();

    // --- Studio Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf0f4ff, 0.75);
    fillLight.position.set(-3, 2.5, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.15);
    rimLight.position.set(0, 3.5, -3.5);
    scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.35);
    bounceLight.position.set(0, -2, 0);
    scene.add(bounceLight);

    // --- Elevated White Studio Podium Stage ---
    const floorGeometry = new THREE.CylinderGeometry(1.35, 1.4, 0.08, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    scene.add(floor);

    const ringGeometry = new THREE.RingGeometry(1.42, 1.45, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    // --- Avatar Controller Instance ---
    const avatarController = new AvatarController(scene, camera);
    avatarControllerRef.current = avatarController;

    // Load initial avatar model
    avatarController.loadAvatar(profileRef.current.gender, profileRef.current.bodyType, {
      onLoadStart: () => {
        if (isMounted) {
          setLoading(true);
          setLoadError(null);
        }
      },
      onLoadSuccess: (model) => {
        if (!isMounted) return;
        setLoading(false);

        const params = toBodyParameters(profileRef.current);
        avatarController.applyBodyParameters(params);

        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3());
        const centerY = size.y * 0.52;

        controls.target.set(0, centerY, 0);
        const fovRad = (camera.fov * Math.PI) / 180;
        const requiredDistance = (size.y / (2 * Math.tan(fovRad / 2))) * 1.25;

        camera.position.set(0, centerY * 1.02, requiredDistance);
        controls.minDistance = requiredDistance * 0.55;
        controls.maxDistance = requiredDistance * 1.8;
        controls.update();
      },
      onLoadError: (error) => {
        if (!isMounted) return;
        console.warn('[Avatar3DViewer] Model error:', error);
        setLoadError(error.message || 'Không thể tải mô hình 3D.');
        setLoading(false);
      },
    });

    // --- Animation & Smooth Camera Lerp Loop ---
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (targetOrbitAngleRef.current !== null && controlsRef.current && cameraRef.current) {
        const targetAngle = targetOrbitAngleRef.current;
        const currentTarget = controlsRef.current.target;

        const offset = new THREE.Vector3().subVectors(cameraRef.current.position, currentTarget);
        const radius = offset.length();
        let theta = Math.atan2(offset.x, offset.z);
        const phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

        let deltaTheta = targetAngle - theta;
        while (deltaTheta > Math.PI) deltaTheta -= Math.PI * 2;
        while (deltaTheta < -Math.PI) deltaTheta += Math.PI * 2;

        if (Math.abs(deltaTheta) > 0.005) {
          theta += deltaTheta * 0.1;
          const targetPhi = Math.PI / 2.05;
          const nextPhi = THREE.MathUtils.lerp(phi, targetPhi, 0.08);

          cameraRef.current.position.x = currentTarget.x + radius * Math.sin(nextPhi) * Math.sin(theta);
          cameraRef.current.position.y = currentTarget.y + radius * Math.cos(nextPhi);
          cameraRef.current.position.z = currentTarget.z + radius * Math.sin(nextPhi) * Math.cos(theta);
          cameraRef.current.lookAt(currentTarget);
        } else {
          targetOrbitAngleRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      controls.dispose();
      avatarController.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Real-time updates & Model Swapping (Gender, Body Preset, Measurements)
  useEffect(() => {
    if (avatarControllerRef.current) {
      const params = toBodyParameters(profile);
      avatarControllerRef.current.applyBodyParameters(params, {
        onLoadStart: () => setLoading(true),
        onLoadSuccess: () => {
          setLoading(false);
          setLoadError(null);
        },
        onLoadError: (err) => {
          setLoadError(err.message);
          setLoading(false);
        },
      });
    }
  }, [profile]);

  // 3. Update Skin Tone in Real-Time
  useEffect(() => {
    if (avatarControllerRef.current && skinTone) {
      avatarControllerRef.current.setSkinTone(skinTone);
    }
  }, [skinTone]);

  // 4. Update 3D Clothing Fit in Real-Time
  useEffect(() => {
    if (avatarControllerRef.current) {
      avatarControllerRef.current.clearClothing();
      if (fittingState?.top) {
        avatarControllerRef.current.equipClothingItem(fittingState.top);
      }
      if (fittingState?.bottom) {
        avatarControllerRef.current.equipClothingItem(fittingState.bottom);
      }
    }
  }, [fittingState]);

  // 5. Update visual guide lines visibility
  useEffect(() => {
    if (avatarControllerRef.current) {
      avatarControllerRef.current.setGuidesVisible(showGuides);
    }
  }, [showGuides]);

  // 6. Update active hover debug mask region
  useEffect(() => {
    if (avatarControllerRef.current) {
      avatarControllerRef.current.setDebugMaskRegion(activeHoverRegion);
    }
  }, [activeHoverRegion]);

  // Camera Presets
  const handlePresetClick = (preset: CameraPreset) => {
    setActivePreset(preset);
    if (preset === 'front' || preset === 'all') {
      targetOrbitAngleRef.current = 0;
    } else if (preset === 'side') {
      targetOrbitAngleRef.current = Math.PI / 2;
    } else if (preset === 'back') {
      targetOrbitAngleRef.current = Math.PI;
    }
  };

  const bmiInfo = calculateBmi(profile.height, profile.weight);
  const bodyTypeLabel = BODY_PRESETS[profile.gender][profile.bodyType]?.label || profile.bodyType;

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full bg-[#f8fafc] rounded-3xl border border-gray-100 p-4 md:p-6 overflow-hidden select-none">
      {/* Top Header / Status Bar */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-gray-900">
            MÔ HÌNH 3D VẬN ĐỘNG VIÊN
          </span>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gray-200/70 text-gray-700 uppercase">
            {profile.gender === 'male' ? 'NAM' : 'NỮ'}
          </span>
        </div>

        {/* 3D Mode Camera Controls: TẤT / TRƯỚC / NGANG / SAU */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase text-gray-700 hidden sm:inline">
            CHẾ ĐỘ 3D
          </span>
          <div className="flex items-center bg-gray-100/90 p-1 rounded-xl border border-gray-200/80">
            {[
              { id: 'all' as CameraPreset, label: 'TẤT' },
              { id: 'front' as CameraPreset, label: 'TRƯỚC' },
              { id: 'side' as CameraPreset, label: 'NGANG' },
              { id: 'back' as CameraPreset, label: 'SAU' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handlePresetClick(id)}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activePreset === id
                    ? 'bg-[#f30d29] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Canvas Center Stage */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center my-1 overflow-hidden">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center" />

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs z-20">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-[#f30d29] rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Đang tải mô hình 3D...</p>
          </div>
        )}

        {/* Model Load Error Notice */}
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/95 text-center z-20">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#f30d29] flex items-center justify-center mb-3 border border-red-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Cần file 3D Avatar</h4>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-3">
              Mô hình 3D đang hoạt động ở chế độ giải phẫu tham số.
            </p>
          </div>
        )}

        {/* Right Floating Stats Card: THÔNG SỐ HIỆN TẠI (Compact Version) */}
        <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-gray-200/80 shadow-md w-[145px] sm:w-[160px]">
          <div className="text-[9px] font-black uppercase tracking-wider text-gray-600 mb-1.5">
            THÔNG SỐ HIỆN TẠI
          </div>

          <div className="space-y-1 text-[10.5px] font-mono">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-[9.5px]">Chiều cao</span>
              <span className="font-bold text-gray-950">{profile.height} cm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-[9.5px]">Cân nặng</span>
              <span className="font-bold text-gray-950">{profile.weight} kg</span>
            </div>

            <div className="border-t border-gray-100 pt-1 space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9.5px]">Vòng 1 (Ngực)</span>
                <span className="font-bold text-[#f30d29]">{profile.chest} cm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9.5px]">Vòng 2 (Eo)</span>
                <span className="font-bold text-amber-500">{profile.waist} cm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9.5px]">Vòng 3 (Hông)</span>
                <span className="font-bold text-emerald-600">{profile.hips} cm</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-1 space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9.5px]">Dáng người</span>
                <span className="font-bold text-gray-900 text-[10px]">{bodyTypeLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9.5px]">BMI</span>
                <span className="font-bold text-emerald-600">{bmiInfo.value}</span>
              </div>
            </div>

            {/* Health Balance Callout */}
            <div className="mt-1.5 p-1.5 bg-emerald-50/90 border border-emerald-200/80 rounded-lg text-emerald-800 text-[9px] font-medium leading-tight flex items-start gap-1">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Cân đối & khỏe mạnh.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User Controls Guide */}
      <div className="w-full flex items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-medium text-gray-400 select-none z-10 pt-1">
        <span className="flex items-center gap-1">
          <span>🖱️</span> KÉO ĐỂ XOAY 360°
        </span>
        <span className="flex items-center gap-1">
          <span>🖱️*</span> CUỘN ĐỂ PHÓNG TO/THU NHỎ
        </span>
        <span className="flex items-center gap-1 hidden md:flex">
          <span>👆</span> CHẠM 2 NGÓN TAY TRÊN ĐIỆN THOẠI
        </span>
      </div>
    </div>
  );
}
