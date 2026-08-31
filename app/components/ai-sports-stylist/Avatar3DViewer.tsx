'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BodyProfile, toBodyParameters } from './types';
import { AvatarController } from '@/app/lib/avatar/avatarController';
import { calculateBmi } from '@/app/lib/avatar/bodyParameters';
import { DebugMaskRegion } from '@/app/lib/avatar/localDeformationEngine';

interface Avatar3DViewerProps {
  profile: BodyProfile;
  activeHoverRegion?: DebugMaskRegion;
}

type CameraPreset = 'front' | 'side' | 'back';

export default function Avatar3DViewer({ profile, activeHoverRegion = 'none' }: Avatar3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>('front');
  const [showGuides, setShowGuides] = useState(false);
  const [showDevDebug, setShowDevDebug] = useState(false);

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
    scene.background = new THREE.Color(0xfcfcfc);

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
    controls.enablePan = false; // Disable pan to maintain framing
    controls.autoRotate = false; // User rotates manually
    controls.minDistance = 1.2;
    controls.maxDistance = 5.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.04; // Do not go beneath floor
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

    // --- Floor Podium Grid / Shadow Receiver ---
    const floorGeometry = new THREE.CylinderGeometry(1.2, 1.25, 0.02, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    const ringGeometry = new THREE.RingGeometry(1.28, 1.3, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.001;
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

        // Apply current body parameters with isolated local deformation
        const params = toBodyParameters(profileRef.current);
        avatarController.applyBodyParameters(params);

        // Frame camera based on model height
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

  // 4. Update visual guide lines visibility
  useEffect(() => {
    if (avatarControllerRef.current) {
      avatarControllerRef.current.setGuidesVisible(showGuides);
    }
  }, [showGuides]);

  // 5. Update active hover debug mask region
  useEffect(() => {
    if (avatarControllerRef.current) {
      avatarControllerRef.current.setDebugMaskRegion(activeHoverRegion);
    }
  }, [activeHoverRegion]);

  // 6. Camera Presets (FRONT, SIDE, BACK)
  const handlePresetClick = (preset: CameraPreset) => {
    setActivePreset(preset);
    if (preset === 'front') {
      targetOrbitAngleRef.current = 0; // Front view (0 deg)
    } else if (preset === 'side') {
      targetOrbitAngleRef.current = Math.PI / 2; // Side profile (90 deg)
    } else if (preset === 'back') {
      targetOrbitAngleRef.current = Math.PI; // Rear back view (180 deg)
    }
  };

  const bmiInfo = calculateBmi(profile.height, profile.weight);
  const bodyTypeLabel = profile.bodyType.charAt(0).toUpperCase() + profile.bodyType.slice(1);

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full bg-gradient-to-b from-gray-50/90 via-white to-gray-100/90 rounded-2xl border border-gray-200 p-4 md:p-6 overflow-hidden select-none">
      {/* Top Header / Status Bar */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f30d29] animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase text-gray-950">
            3D DIGITAL ATHLETE
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase font-bold">
            {profile.gender}
          </span>
        </div>

        {/* View Angle Presets & Controls */}
        <div className="flex items-center gap-1.5">
          {/* 3D Measurement Guides Toggle */}
          <button
            type="button"
            onClick={() => setShowGuides(!showGuides)}
            title="Bật/tắt đường số đo 3D"
            className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border transition-all cursor-pointer ${
              showGuides
                ? 'bg-red-50 text-[#f30d29] border-red-200 shadow-2xs'
                : 'bg-white/80 text-gray-500 border-gray-200 hover:text-gray-800'
            }`}
          >
            Guides {showGuides ? 'ON' : 'OFF'}
          </button>

          {/* Camera Angles: FRONT, SIDE, BACK */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-lg border border-gray-200/90 shadow-2xs">
            {(['front', 'side', 'back'] as CameraPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  activePreset === preset
                    ? 'bg-gray-950 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Canvas Mounting Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center my-1 overflow-hidden">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center" />

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 backdrop-blur-xs z-20">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-[#f30d29] rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Đang chuẩn bị 3D Avatar...</p>
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
              Đặt file <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">male-base.glb</code> vào <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">public/models/avatar/</code>.
            </p>
          </div>
        )}

        {/* Realtime Floating Body Information Card */}
        <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-gray-200/90 shadow-md min-w-[160px]">
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between items-center gap-3">
              <span className="text-gray-500 text-[10px]">Chiều cao</span>
              <span className="font-bold text-gray-950">{profile.height} cm</span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-gray-500 text-[10px]">Cân nặng</span>
              <span className="font-bold text-gray-950">{profile.weight} kg</span>
            </div>
            <div className="border-t border-gray-100 pt-1 space-y-1">
              <div className="flex justify-between items-center gap-3">
                <span className="text-gray-500 text-[10px]">Vòng 1 (Ngực)</span>
                <span className="font-bold text-[#f30d29]">{profile.chest} cm</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-gray-500 text-[10px]">Vòng 2 (Eo)</span>
                <span className="font-bold text-amber-600">{profile.waist} cm</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-gray-500 text-[10px]">Vòng 3 (Hông)</span>
                <span className="font-bold text-emerald-600">{profile.hips} cm</span>
              </div>
            </div>
            <div className="flex justify-between items-center gap-3 pt-1 border-t border-gray-100">
              <span className="text-gray-500 text-[10px]">Dáng vóc</span>
              <span className="font-bold text-gray-900">
                {bodyTypeLabel} {profile.isCustomized && '· Tùy biến'}
              </span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-gray-500 text-[10px]">BMI ({bmiInfo.label})</span>
              <span className={`font-bold ${bmiInfo.color}`}>{bmiInfo.value}</span>
            </div>
          </div>
        </div>

        {/* Developer Diagnostics Toggle & Panel */}
        <div className="absolute bottom-2 left-2 z-10">
          <button
            type="button"
            onClick={() => setShowDevDebug(!showDevDebug)}
            className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-black/5 hover:bg-black/10 text-gray-500 transition-all cursor-pointer"
          >
            Diagnostics {showDevDebug ? '▲' : '▼'}
          </button>

          {showDevDebug && (
            <div className="mt-1 p-2 bg-gray-950/90 text-white rounded-lg shadow-xl text-[10px] font-mono max-w-xs space-y-1 backdrop-blur-md">
              <div className="text-gray-400 font-bold border-b border-gray-800 pb-0.5">DEV DIAGNOSTICS</div>
              <div>Deformation Engine: <span className="text-emerald-400">Local Vertex Mask (Active)</span></div>
              <div>Calibration Status: <span className="text-amber-400">Estimated (Anatomical)</span></div>
              <div>Model Scale X/Z: <span className="text-blue-400">1.0 (Fixed, No Fake Scale)</span></div>
              <div>Model Scale Y: <span className="text-blue-400">{(profile.height / 175).toFixed(3)} (Global)</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="w-full text-center z-10 pt-1">
        <p className="text-[10px] md:text-[11px] font-medium tracking-wide text-gray-400 uppercase select-none">
          Kéo để xoay 360° • Cuộn để phóng to/thu nhỏ • Chạm 2 ngón tay trên điện thoại
        </p>
      </div>
    </div>
  );
}
