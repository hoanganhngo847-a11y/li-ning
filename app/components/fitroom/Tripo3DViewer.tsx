'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Tripo3DViewerProps {
  modelUrl: string;
  posterImageUrl?: string;
  className?: string;
  onLoaded?: () => void;
}

export default function Tripo3DViewer({
  modelUrl,
  posterImageUrl,
  className = '',
  onLoaded,
}: Tripo3DViewerProps) {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  const autoRotateRef = useRef(isAutoRotate);
  autoRotateRef.current = isAutoRotate;

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const defaultCameraPosRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0.6, z: 2.6 });

  useEffect(() => {
    if (!canvasMountRef.current || !modelUrl) return;

    let isMounted = true;
    let animationFrameId: number;
    let renderer: any;
    let scene: any;
    let camera: any;
    let controls: any;
    let resizeObserver: ResizeObserver | null = null;

    const initViewer = async () => {
      try {
        setLoading(true);
        setLoadingProgress(10);
        setError(null);

        // Dynamically import Three.js modules (SSR safe)
        const THREE = await import('three');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

        if (!isMounted || !canvasMountRef.current) return;

        const mount = canvasMountRef.current;
        const width = mount.clientWidth || 500;
        const height = mount.clientHeight || 450;

        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0c0d14);

        // Camera
        camera = new THREE.PerspectiveCamera(45, (width || 1) / (height || 1), 0.1, 1000);
        camera.position.set(
          defaultCameraPosRef.current.x,
          defaultCameraPosRef.current.y,
          defaultCameraPosRef.current.z
        );
        cameraRef.current = camera;

        // WebGL Renderer
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Clear only Three.js canvas in dedicated mount node (React never mounts children here)
        while (mount.firstChild) {
          mount.removeChild(mount.firstChild);
        }
        mount.appendChild(renderer.domElement);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.maxDistance = 5.5;
        controls.minDistance = 0.8;
        controls.target.set(0, 0, 0);
        controls.autoRotate = autoRotateRef.current;
        controls.autoRotateSpeed = 1.6;
        controlsRef.current = controls;

        // Lighting: Studio PBR setup for apparel & footwear
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333333, 1.2);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        // Key light (front top right)
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        keyLight.position.set(3.5, 6, 5);
        keyLight.castShadow = true;
        scene.add(keyLight);

        // Fill light (front left)
        const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
        fillLight.position.set(-3.5, 4, 4);
        scene.add(fillLight);

        // Rim light (back red Li-Ning glow accent)
        const rimLight = new THREE.DirectionalLight(0xff2233, 1.0);
        rimLight.position.set(0, 5, -4);
        scene.add(rimLight);

        // Ground circular grid
        const gridHelper = new THREE.GridHelper(5, 10, 0xe60012, 0x27272a);
        gridHelper.position.y = -0.9;
        scene.add(gridHelper);

        setLoadingProgress(35);

        // Load GLB with progress
        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            if (!isMounted) return;

            const model = gltf.scene;

            // Auto-center and normalize size
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const targetHeight = 1.75;
            const scale = targetHeight / (maxDim || 1);
            model.scale.setScalar(scale);

            // Shift so center is at (0, 0, 0)
            model.position.x = -center.x * scale;
            model.position.y = -center.y * scale;
            model.position.z = -center.z * scale;

            // Place grid floor just below model feet
            gridHelper.position.y = - (size.y * scale) / 2 - 0.02;

            // Enhance shadows & textures
            model.traverse((child: any) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  if (child.material.map) {
                    child.material.map.colorSpace = THREE.SRGBColorSpace;
                  }
                  child.material.roughness = Math.max(0.2, child.material.roughness ?? 0.5);
                  child.material.needsUpdate = true;
                }
              }
            });

            scene.add(model);
            setLoading(false);
            setLoadingProgress(100);
            if (onLoaded) onLoaded();
          },
          (xhr) => {
            if (xhr.total > 0) {
              const pct = Math.min(95, Math.round(35 + (xhr.loaded / xhr.total) * 60));
              setLoadingProgress(pct);
            }
          },
          (err) => {
            console.error('Error loading Tripo 3D model:', err);
            if (isMounted) {
              setError('Không thể nạp dữ liệu mô hình 3D. Vui lòng bấm thử lại.');
              setLoading(false);
            }
          }
        );

        // Animation Loop
        const animate = () => {
          if (!isMounted) return;
          animationFrameId = requestAnimationFrame(animate);
          controls.autoRotate = autoRotateRef.current;
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        // Responsive Resize Observer on the mount container
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const w = entry.contentRect.width;
            const h = entry.contentRect.height;
            if (w > 0 && h > 0 && camera && renderer) {
              camera.aspect = w / h;
              camera.updateProjectionMatrix();
              renderer.setSize(w, h);
            }
          }
        });
        resizeObserver.observe(mount);

      } catch (err: any) {
        console.error('Three.js Init Error:', err);
        if (isMounted) {
          setError(err.message || 'Lỗi khởi tạo không gian 3D');
          setLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [modelUrl]);

  // Controls Handlers
  const toggleAutoRotate = () => {
    setIsAutoRotate((prev) => !prev);
  };

  const handleResetView = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(
        defaultCameraPosRef.current.x,
        defaultCameraPosRef.current.y,
        defaultCameraPosRef.current.z
      );
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className={`relative w-full flex flex-col items-center justify-between rounded-2xl overflow-hidden bg-[#0a0b12] text-white select-none ${className}`}>
      
      {/* 3D Viewport Box */}
      <div className="relative w-full flex-1 min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
        
        {/* PURE CANVAS MOUNT: Three.js canvas goes here. React renders no JSX children inside this element */}
        <div ref={canvasMountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-[#090a0f]/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none">
            {posterImageUrl && (
              <img
                src={posterImageUrl}
                alt="3D Preview"
                className="w-24 h-32 object-cover rounded-xl opacity-30 blur-xs mb-3 shadow-lg"
              />
            )}
            <div className="w-10 h-10 border-3 border-[#e60012] border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Đang Nạp Mô Hình 3D Tripo ({loadingProgress}%)
            </span>
            <div className="w-48 h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden border border-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-[#e60012] to-amber-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-400 mt-2">
              Khởi tạo vật liệu PBR & ánh sáng 360°...
            </span>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 z-20 bg-[#090a0f]/95 flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
            <span className="text-3xl mb-2">⚠️</span>
            <h4 className="text-sm font-bold text-red-400 mb-1">Không thể tải mô hình 3D</h4>
            <p className="text-xs text-zinc-400 max-w-sm mb-4">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setLoading(true);
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Floating Hint */}
        {!loading && !error && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 font-semibold border border-zinc-700 pointer-events-none flex items-center gap-1.5 z-10">
            <span>🖱️</span>
            <span>Kéo chuột xoay 360° • Cuộn để phóng to/thu nhỏ</span>
          </div>
        )}

        {/* Brand Tag */}
        <div className="absolute bottom-3 left-3 text-[10px] text-zinc-400 bg-black/50 px-2.5 py-1 rounded-md pointer-events-none backdrop-blur-xs border border-zinc-800 flex items-center gap-1.5 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mô hình 3D Tripo V3 • Tái dựng từ ảnh thử đồ</span>
        </div>
      </div>

      {/* Control Action Toolbar */}
      <div className="w-full bg-[#12131a] border-t border-zinc-800 p-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAutoRotate}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isAutoRotate
                ? 'bg-red-500/20 text-[#e60012] border-red-500/40 shadow-xs'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
            }`}
          >
            {isAutoRotate ? '⏸ Dừng xoay' : '▶ Xoay tự động'}
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 hover:text-white transition-all cursor-pointer"
          >
            ↺ Reset góc nhìn
          </button>
        </div>

        <a
          href={modelUrl}
          download="lining-outfit-tripo3d.glb"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#e60012] to-red-700 hover:from-red-600 hover:to-red-800 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>Tải file 3D (.glb)</span>
          <span>⬇</span>
        </a>
      </div>

    </div>
  );
}
