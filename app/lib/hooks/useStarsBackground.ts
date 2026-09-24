import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useStarsBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mouseRef = useRef({ tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a1a, 1);

    // Create stars
    const starsGeom = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;
      positions[i + 1] = (Math.random() - 0.5) * 2000;
      positions[i + 2] = (Math.random() - 0.5) * 2000;
      velocities[i] = (Math.random() - 0.5) * 0.5;
      velocities[i + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i + 2] = (Math.random() - 0.5) * 0.5;
    }

    starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starsGeom, starsMat);
    scene.add(stars);

    sceneRef.current = scene;

    let rafId = 0;

    const starsRender = () => {
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        if (Math.abs(positions[i]) > 1000) positions[i] = -positions[i];
        if (Math.abs(positions[i + 1]) > 1000) positions[i + 1] = -positions[i + 1];
        if (Math.abs(positions[i + 2]) > 1000) positions[i + 2] = -positions[i + 2];
      }
      (starsGeom.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      camera.position.x += (mouseRef.current.tx * 80 - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.ty * 80 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(starsRender);
    };
    rafId = requestAnimationFrame(starsRender);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return canvasRef;
};
