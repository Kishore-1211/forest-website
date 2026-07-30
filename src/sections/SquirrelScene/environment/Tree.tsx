"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/tree.glb";
const TARGET_HEIGHT = 3.0;

interface TreeProps {
  position?: [number, number, number];
}

export function Tree({ position = [1.2, -1.4, -0.2] }: TreeProps) {
  // Meshopt decoder — see the note in Rock.tsx.
  const { scene } = useGLTF(MODEL_PATH, false, true);

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const boxSize = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(boxSize);
    box.getCenter(center);
    const fitScale = boxSize.y > 0 ? TARGET_HEIGHT / boxSize.y : 1;
    return {
      scale: fitScale,
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [scene]);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        const std = mat as THREE.MeshStandardMaterial;
        if (std.map) std.map.colorSpace = THREE.SRGBColorSpace;
      });
    });
  }, [scene]);

  return (
    <group position={position}>
      <group position={offset} scale={scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH, false, true);
