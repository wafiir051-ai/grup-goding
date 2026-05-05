import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.set(0, 60, 120);
    camera.lookAt(0, 0, 0);

    const COLS = 42, ROWS = 28, SPACING = 5.5;
    const count = (COLS + 1) * (ROWS + 1);
    const baseY = new Float32Array(count);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    let idx = 0;
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const x = (c - COLS / 2) * SPACING;
        const z = (r - ROWS / 2) * SPACING;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = z;
        baseY[idx] = 0;
        idx++;
      }
    }

    const lineIndices = [];
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const i = r * (COLS + 1) + c;
        if (c < COLS) lineIndices.push(i, i + 1);
        if (r < ROWS) lineIndices.push(i, i + (COLS + 1));
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setIndex(lineIndices);

    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 });
    const mesh = new THREE.LineSegments(geo, mat);
    scene.add(mesh);

    const dotGeo = new THREE.BufferGeometry();
    const dotPos = new Float32Array(count * 3);
    const dotCol = new Float32Array(count * 3);
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotCol, 3));
    const dotMat = new THREE.PointsMaterial({ vertexColors: true, size: 1.8, transparent: true, opacity: 0.9, sizeAttenuation: true });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    let t = 0;
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      camera.position.x += (mouseX * 25 - camera.position.x) * 0.03;
      camera.position.z = 120 + mouseY * 15;
      camera.lookAt(0, 0, 0);

      const pos = geo.attributes.position.array;
      const col = geo.attributes.color.array;
      const dpos = dotGeo.attributes.position.array;
      const dcol = dotGeo.attributes.color.array;

      let vi = 0;
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const x = (c - COLS / 2) * SPACING;
          const z = (r - ROWS / 2) * SPACING;
          const dist = Math.sqrt(x * x + z * z);
          const y = Math.sin(dist * 0.18 - t * 2.2) * 14 + Math.sin(c * 0.3 + t) * 5;

          pos[vi * 3] = x;
          pos[vi * 3 + 1] = y;
          pos[vi * 3 + 2] = z;

          dpos[vi * 3] = x;
          dpos[vi * 3 + 1] = y;
          dpos[vi * 3 + 2] = z;

          const bright = (y + 20) / 34;
          const b = Math.max(0, Math.min(1, bright));

          col[vi * 3] = b * 0.1;
          col[vi * 3 + 1] = 0.4 + b * 0.6;
          col[vi * 3 + 2] = 1.0;

          dcol[vi * 3] = b * 0.2;
          dcol[vi * 3 + 1] = 0.5 + b * 0.5;
          dcol[vi * 3 + 2] = 1.0;

          vi++;
        }
      }

      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      dotGeo.attributes.position.needsUpdate = true;
      dotGeo.attributes.color.needsUpdate = true;

      mesh.rotation.y += 0.0015;
      dots.rotation.y += 0.0015;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nW = el.clientWidth, nH = el.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, overflow: 'hidden'
      }}
    />
  );
}
