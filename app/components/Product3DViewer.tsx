'use client';

import { useEffect, useRef, useState } from 'react';

interface Product3DViewerProps {
  modelUrl: string;
  posterImage?: string;
  productTitle?: string;
  className?: string;
}

export default function Product3DViewer({
  modelUrl,
  posterImage,
  productTitle,
  className = '',
}: Product3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const autoRotateRef = useRef(isAutoRotate);
  autoRotateRef.current = isAutoRotate;

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;

    let isMounted = true;
    let animationFrameId: number;
    let renderer: any;
    let scene: any;
    let camera: any;
    let controls: any;

    const initViewer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import Three.js modules
        const THREE = await import('three');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

        if (!isMounted || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 500;
        const height = container.clientHeight || 500;

        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xfbfbfb);

        // Camera
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 1, 3.5);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.shadowMap.enabled = true;

        // Clear previous canvas
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 10;
        controls.minDistance = 0.5;
        controls.autoRotate = autoRotateRef.current;
        controls.autoRotateSpeed = 2.0;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight1.position.set(5, 10, 7);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight2.position.set(-5, -5, -5);
        scene.add(dirLight2);

        // Subtle ground grid / shadow
        const gridHelper = new THREE.GridHelper(10, 20, 0xe5e5e5, 0xf0f0f0);
        gridHelper.position.y = -0.7;
        scene.add(gridHelper);

        // Load 3D Model
        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            if (!isMounted) return;

            const model = gltf.scene;

            // Center & normalize model size
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1.6 / (maxDim || 1);
            model.scale.setScalar(scale);

            model.position.x = -center.x * scale;
            model.position.y = -center.y * scale;
            model.position.z = -center.z * scale;

            scene.add(model);
            setLoading(false);
          },
          undefined,
          (err) => {
            console.error('Error loading 3D model:', err);
            if (isMounted) {
              setError('Không thể tải file 3D hoặc định dạng không phải GLB/GLTF hợp lệ.');
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

        // Resize handler
        const handleResize = () => {
          if (!container || !renderer || !camera) return;
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (err: any) {
        console.error(err);
        if (isMounted) {
          setError(err?.message || 'Lỗi khởi tạo 3D Viewer');
          setLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [modelUrl]);

  return (
    <div className={`relative w-full h-full min-h-[380px] bg-[#fbfbfb] rounded-2xl overflow-hidden border border-gray-200 select-none ${className}`}>
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full min-h-[380px] cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-xs z-10 gap-3">
          {posterImage && (
            <img src={posterImage} alt="" className="w-20 h-20 object-contain opacity-50 animate-pulse mb-2" />
          )}
          <div className="w-8 h-8 border-3 border-[#f30d29] border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Đang tải mô hình 3D tương tác...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6 text-center z-10 gap-2">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl font-bold mb-1">
            ✕
          </div>
          <div className="text-xs font-bold text-gray-900">{error}</div>
          <p className="text-[11px] text-gray-500 max-w-xs">
            Vui lòng kiểm tra lại đường dẫn file (.glb / .gltf) hoặc upload lại từ trang quản trị.
          </p>
        </div>
      )}

      {/* 3D Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-gray-200 text-[11px] font-bold text-gray-900 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>3D AR 360°</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border shadow-xs transition-all cursor-pointer ${
              isAutoRotate
                ? 'bg-[#111111] text-white border-black'
                : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {isAutoRotate ? '🔄 Tự xoay: Bật' : '⏸ Tự xoay: Tắt'}
          </button>
        </div>
      </div>

      {/* Interaction Hint Bottom */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-20">
        <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
          Kéo chuột để xoay 360° • Cuộn chuột để phóng to / thu nhỏ
        </span>
      </div>
    </div>
  );
}
