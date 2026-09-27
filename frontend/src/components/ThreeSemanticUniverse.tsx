"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { VectorNodePoint } from "@/types";
import { CursorState } from "./CustomCursor";

interface ThreeSemanticUniverseProps {
  nodes: VectorNodePoint[];
  selectedNodeId?: string | null;
  highlightedNodeIds?: string[];
  activeCluster?: number | null;
  onSelectNode?: (node: VectorNodePoint) => void;
  setCursorState?: (state: CursorState, label?: string) => void;
  searchTriggerPulse?: number; // increments on search to trigger vector pulse
}

const CLUSTER_COLORS = [
  0x00f0ff, // 0: Transformers (Cyan)
  0x9d4edd, // 1: BERT / Pre-trained (Violet)
  0xf59e0b, // 2: ResNet / Vision (Amber)
  0x10b981, // 3: LoRA / Tuning (Emerald)
  0xec4899, // 4: RAG / Retrieval (Pink)
  0x6366f1  // 5: GANs / Generative (Indigo)
];

export const ThreeSemanticUniverse: React.FC<ThreeSemanticUniverseProps> = ({
  nodes,
  selectedNodeId,
  highlightedNodeIds = [],
  activeCluster = null,
  onSelectNode,
  setCursorState,
  searchTriggerPulse = 0
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<VectorNodePoint | null>(null);
  const [hudPos, setHudPos] = useState({ x: 0, y: 0 });

  // Three.js internal refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesMeshGroupRef = useRef<THREE.Group | null>(null);
  const connectionsGroupRef = useRef<THREE.Group | null>(null);
  const laserBeamRef = useRef<THREE.Line | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 48));

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 48, theta: 0, phi: Math.PI / 2.2 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x07080b, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 48);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x07080b, 0.95);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 2, 80);
    pointLightCyan.position.set(20, 20, 20);
    scene.add(pointLightCyan);

    const pointLightViolet = new THREE.PointLight(0x9d4edd, 2, 80);
    pointLightViolet.position.set(-20, -20, 20);
    scene.add(pointLightViolet);

    // 5. Starfield / Dust background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 160;
      starCoords[i + 1] = (Math.random() - 0.5) * 160;
      starCoords[i + 2] = (Math.random() - 0.5) * 160;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x4a5568,
      size: 0.8,
      transparent: true,
      opacity: 0.4
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Groups for nodes and dynamic lines
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);
    nodesMeshGroupRef.current = nodesGroup;

    const connectionsGroup = new THREE.Group();
    scene.add(connectionsGroup);
    connectionsGroupRef.current = connectionsGroup;

    // Laser beam line for query trajectory
    const laserGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, 0, 0)]);
    const laserMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0 });
    const laserBeam = new THREE.Line(laserGeo, laserMat);
    scene.add(laserBeam);
    laserBeamRef.current = laserBeam;

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle scene auto-rotation when not dragging
      if (!isDraggingRef.current) {
        sphericalRef.current.theta += 0.0012;
      }

      // Smooth camera position lerping
      const r = sphericalRef.current.radius;
      const t = sphericalRef.current.theta;
      const p = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalRef.current.phi));

      const camX = r * Math.sin(p) * Math.sin(t);
      const camY = r * Math.cos(p);
      const camZ = r * Math.sin(p) * Math.cos(t);

      camera.position.x += (camX - camera.position.x) * 0.08;
      camera.position.y += (camY - camera.position.y) * 0.08;
      camera.position.z += (camZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);

      // Starfield subtle slow roll
      starField.rotation.y = elapsedTime * 0.015;

      // Pulse node meshes
      if (nodesMeshGroupRef.current) {
        nodesMeshGroupRef.current.children.forEach((child, i) => {
          const mesh = child as THREE.Mesh;
          const initialScale = (mesh.userData?.baseScale || 1.0);
          const pulse = Math.sin(elapsedTime * 2.5 + i) * 0.15;
          mesh.scale.set(initialScale + pulse, initialScale + pulse, initialScale + pulse);
        });
      }

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update nodes meshes when `nodes` changes
  useEffect(() => {
    const nodesGroup = nodesMeshGroupRef.current;
    if (!nodesGroup) return;

    // Clear existing
    while (nodesGroup.children.length > 0) {
      const obj = nodesGroup.children[0] as THREE.Mesh;
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
      else obj.material.dispose();
      nodesGroup.remove(obj);
    }

    // Geometry shared
    const nodeGeometry = new THREE.SphereGeometry(0.75, 16, 16);

    nodes.forEach((node) => {
      const colorHex = CLUSTER_COLORS[node.cluster % CLUSTER_COLORS.length];
      const isHighlighted = highlightedNodeIds.includes(node.id) || highlightedNodeIds.includes(node.chunk_id);
      const isSelected = selectedNodeId === node.id || selectedNodeId === node.chunk_id;
      const isDimmed = activeCluster !== null && node.cluster !== activeCluster;

      const material = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xffffff : colorHex,
        emissive: isSelected ? 0x00f0ff : colorHex,
        emissiveIntensity: isSelected ? 1.5 : isHighlighted ? 1.2 : 0.6,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: isDimmed ? 0.15 : 0.95
      });

      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.set(node.x, node.y, node.z);
      const baseScale = isSelected ? 2.2 : isHighlighted ? 1.8 : 1.0;
      mesh.scale.set(baseScale, baseScale, baseScale);
      mesh.userData = { nodeData: node, baseScale };

      nodesGroup.add(mesh);
    });

    // Draw semantic connection lines between nearby nodes
    const connGroup = connectionsGroupRef.current;
    if (connGroup) {
      while (connGroup.children.length > 0) {
        const line = connGroup.children[0] as THREE.Line;
        line.geometry.dispose();
        connGroup.remove(line);
      }

      // Connect nodes within distance < 8.0
      const linePositions: number[] = [];
      const lineColors: number[] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Connect if same cluster or close proximity
          if ((a.cluster === b.cluster && dist < 12.0) || dist < 7.5) {
            linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
            const col = new THREE.Color(CLUSTER_COLORS[a.cluster % CLUSTER_COLORS.length]);
            lineColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
          }
        }
      }

      if (linePositions.length > 0) {
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

        const lineMat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.18
        });

        const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
        connGroup.add(linesMesh);
      }
    }
  }, [nodes, highlightedNodeIds, selectedNodeId, activeCluster]);

  // Handle Search Laser Animation
  useEffect(() => {
    if (!laserBeamRef.current || searchTriggerPulse === 0) return;
    const beam = laserBeamRef.current;
    (beam.material as THREE.LineBasicMaterial).opacity = 0.9;
    
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      (beam.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1.0 - t);
      if (t >= 1.0) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [searchTriggerPulse]);

  // Handle Raycasting and Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !nodesMeshGroupRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Handle drag rotation
    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      sphericalRef.current.theta -= deltaX * 0.007;
      sphericalRef.current.phi -= deltaY * 0.007;
      return;
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const intersects = raycaster.intersectObjects(nodesMeshGroupRef.current.children);
    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const nodeData = hit.userData?.nodeData as VectorNodePoint;
      if (nodeData) {
        setHoveredNode(nodeData);
        setHudPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top - 20 });
        setCursorState?.("NODE", `#${nodeData.chunk_id.slice(-4)}`);
      }
    } else {
      if (hoveredNode) {
        setHoveredNode(null);
        setCursorState?.("DEFAULT");
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    setCursorState?.("DRAG");
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setCursorState?.("DEFAULT");
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    sphericalRef.current.radius = Math.max(15, Math.min(90, sphericalRef.current.radius + e.deltaY * 0.04));
  };

  const handleClick = () => {
    if (hoveredNode && onSelectNode) {
      onSelectNode(hoveredNode);
    }
  };

  return (
    <div
      ref={mountRef}
      className="relative h-full w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      {/* 3D Universe HUD Header */}
      <div className="absolute top-4 left-6 z-10 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-ping" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#00f0ff] glow-cyan">
            SEMANTIC VECTOR SPACE // 384-D PROJECTED
          </span>
        </div>
        <div className="font-mono text-[10px] text-[#8fa0b5]">
          NODES: {nodes.length} | CLUSTERS: {new Set(nodes.map(n => n.cluster)).size} | METRIC: COSINE INNER PRODUCT
        </div>
      </div>

      {/* Orbit Controls Hint */}
      <div className="absolute bottom-4 right-6 z-10 pointer-events-none rounded border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] text-white/50 backdrop-blur-md">
        DRAG TO ROTATE • SCROLL TO ZOOM • CLICK NODE TO INSPECT
      </div>

      {/* Interactive Raycast Hover HUD Card */}
      {hoveredNode && (
        <div
          className="pointer-events-none absolute z-30 w-72 rounded-lg border border-[#00f0ff]/40 bg-[#0c1018]/90 p-3.5 shadow-[0_0_25px_rgba(0,240,255,0.25)] backdrop-blur-md transition-all duration-75"
          style={{
            left: `${hudPos.x}px`,
            top: `${hudPos.y}px`
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
            <span className="font-mono text-[10px] font-bold text-[#00f0ff]">
              NODE #{hoveredNode.chunk_id.slice(-6).toUpperCase()}
            </span>
            <span className="rounded bg-[#00f0ff]/10 px-1.5 py-0.5 font-mono text-[9px] text-[#00f0ff]">
              PAGE {hoveredNode.page}
            </span>
          </div>
          <div className="font-semibold text-xs text-white leading-snug line-clamp-1 mb-1">
            {hoveredNode.title}
          </div>
          <div className="font-mono text-[10px] text-[#9d4edd] mb-2">
            SECTION: {hoveredNode.section}
          </div>
          <div className="text-[11px] text-[#8fa0b5] line-clamp-3 leading-relaxed mb-2 bg-black/40 p-2 rounded border border-white/5">
            &ldquo;{hoveredNode.preview_text}&rdquo;
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] text-white/40 pt-1 border-t border-white/5">
            <span>CLUSTER: {hoveredNode.topic}</span>
            <span className="text-[#00f0ff]">CLICK TO FOCUS →</span>
          </div>
        </div>
      )}
    </div>
  );
};
