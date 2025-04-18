import { useRef, useEffect } from "react";
import * as THREE from "three";

interface NebulaBackgroundProps {
  intensity?: number;
}

const NebulaBackground = ({ intensity = 1.0 }: NebulaBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    cameraRef.current = camera;

    // Initialize clock
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 15000; // Increased from 10000
    const starsPositions = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);
    const starsColors = new Float32Array(starsCount * 3);

    const colorPalette = [
      new THREE.Color("#1EAEDB"), // Blue
      new THREE.Color("#F2FCE2"), // Green
      new THREE.Color("#F97316"), // Orange
      new THREE.Color("#9b87f5"), // Purple
      new THREE.Color("#ffffff"), // White
      new THREE.Color("#ff69b4"), // Pink
      new THREE.Color("#4b0082"), // Indigo
    ];

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      starsPositions[i3] = (Math.random() - 0.5) * 200;
      starsPositions[i3 + 1] = (Math.random() - 0.5) * 200;
      starsPositions[i3 + 2] = (Math.random() - 0.5) * 200;

      starsSizes[i] = Math.random() * 2 + 0.5;

      const colorIndex = Math.floor(Math.random() * colorPalette.length);
      const color = colorPalette[colorIndex];
      starsColors[i3] = color.r;
      starsColors[i3 + 1] = color.g;
      starsColors[i3 + 2] = color.b;
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute("size", new THREE.BufferAttribute(starsSizes, 1));
    starsGeometry.setAttribute("color", new THREE.BufferAttribute(starsColors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Create a nebula effect
    const nebulaTexture = new THREE.TextureLoader().load("/placeholder.svg");
    const nebulaMaterial = new THREE.SpriteMaterial({
      map: nebulaTexture,
      color: 0x5517af,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.6, // Increased from 0.4
    });

    for (let i = 0; i < 15; i++) {
      const nebula = new THREE.Sprite(nebulaMaterial);
      const scale = 30 + Math.random() * 20; // Varied sizes
      nebula.scale.set(scale, scale, 1);
      nebula.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      scene.add(nebula);
    }

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !clockRef.current || !starsRef.current) {
        return;
      }

      const elapsedTime = clockRef.current.getElapsedTime();

      // Rotate stars
      starsRef.current.rotation.y = elapsedTime * 0.05 * intensity;
      starsRef.current.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05 * intensity;

      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [intensity]);

  return <div ref={containerRef} className="fixed inset-0 z-[-1]" />;
};

export default NebulaBackground;
