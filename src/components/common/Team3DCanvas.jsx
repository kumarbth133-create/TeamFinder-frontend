import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FiUsers, FiCpu, FiCode, FiLayout, FiAward, FiLayers } from "react-icons/fi";

const TEAM_ROLES = [
  {
    id: "lead",
    title: "Team Lead",
    tech: "Project Mgmt",
    color: 0xf59e0b, // Amber
    hex: "#f59e0b",
    icon: FiAward,
    pos: [0, 2.2, 0.2],
    badgeOffset: "translate(-50%, -100%) translateY(-14px)",
  },
  {
    id: "frontend",
    title: "Frontend Dev",
    tech: "React / Vite",
    color: 0x3b82f6, // Blue
    hex: "#3b82f6",
    icon: FiCode,
    pos: [-3.2, 0.8, 0.4],
    badgeOffset: "translate(-90%, -50%) translateX(-10px)",
  },
  {
    id: "backend",
    title: "Backend Dev",
    tech: "Node.js / Mongo",
    color: 0x10b981, // Emerald
    hex: "#10b981",
    icon: FiCpu,
    pos: [3.2, 0.8, 0.4],
    badgeOffset: "translate(10%, -50%) translateX(10px)",
  },
  {
    id: "designer",
    title: "UI/UX Designer",
    tech: "Figma / Tailwind",
    color: 0xec4899, // Pink
    hex: "#ec4899",
    icon: FiLayout,
    pos: [-2.7, -1.7, 0.3],
    badgeOffset: "translate(-85%, 25%)",
  },
  {
    id: "ai",
    title: "AI Specialist",
    tech: "Python / ML",
    color: 0x8b5cf6, // Violet
    hex: "#8b5cf6",
    icon: FiUsers,
    pos: [2.7, -1.7, 0.3],
    badgeOffset: "translate(15%, 25%)",
  },
];

const Team3DCanvas = () => {
  const mountRef = useRef(null);
  const [activeRole, setActiveRole] = useState(null);
  const activeRoleRef = useRef(null);
  const [nodeCoords, setNodeCoords] = useState({});

  useEffect(() => {
    activeRoleRef.current = activeRole;
  }, [activeRole]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(6, 10, 6);
    scene.add(mainLight);

    const pointLightRed = new THREE.PointLight(0xca0019, 5.0, 30);
    pointLightRed.position.set(7, 7, 7);
    scene.add(pointLightRed);

    const pointLightRose = new THREE.PointLight(0xf43f5e, 3.5, 30);
    pointLightRose.position.set(-7, -7, 6);
    scene.add(pointLightRose);

    // 3. Central Core Node (Holographic Team Hub)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Core Sphere - Gemlike Crimson Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.05, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xca0019,
      roughness: 0.1,
      metalness: 0.85,
      emissive: 0x990013,
      emissiveIntensity: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Outer Wireframe Shell
    const shellGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xf87171,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    coreGroup.add(shellMesh);

    // Dual Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.0, 0.03, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.35, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xfca5a5,
      transparent: true,
      opacity: 0.45,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.8;
    coreGroup.add(ring2);

    // 4. Role Nodes & Energy Beams
    const roleGroup = new THREE.Group();
    scene.add(roleGroup);

    const roleMap = {};
    const pulseData = [];

    TEAM_ROLES.forEach((role) => {
      const nodeSubGroup = new THREE.Group();
      nodeSubGroup.position.set(...role.pos);

      // Main Role Sphere
      const sphereGeo = new THREE.SphereGeometry(0.52, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: role.color,
        roughness: 0.2,
        metalness: 0.75,
        emissive: role.color,
        emissiveIntensity: 0.5,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeSubGroup.add(sphereMesh);

      // Orbiting Micro Ring for each node
      const miniRingGeo = new THREE.TorusGeometry(0.72, 0.025, 16, 32);
      const miniRingMat = new THREE.MeshBasicMaterial({
        color: role.color,
        transparent: true,
        opacity: 0.7,
      });
      const miniRing = new THREE.Mesh(miniRingGeo, miniRingMat);
      miniRing.rotation.x = Math.PI / 2.5;
      nodeSubGroup.add(miniRing);

      roleGroup.add(nodeSubGroup);

      roleMap[role.id] = {
        group: nodeSubGroup,
        sphere: sphereMesh,
        miniRing: miniRing,
        initialPos: [...role.pos],
        color: role.color,
      };

      // Connecting Beam (Line)
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...role.pos)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: role.color,
        transparent: true,
        opacity: 0.5,
        linewidth: 2,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      roleMap[role.id].lineMat = lineMat;

      // Energy Pulse Particle
      const pulseGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      scene.add(pulseMesh);

      pulseData.push({
        mesh: pulseMesh,
        startPos: new THREE.Vector3(0, 0, 0),
        endPos: new THREE.Vector3(...role.pos),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.006,
      });
    });

    // 5. Ambient Particle Starfield
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 22;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xe0e7ff,
      size: 0.075,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / width - 0.5) * 2;
      mouseY = (y / height - 0.5) * 2;
    };

    currentMount.addEventListener("mousemove", handleMouseMove);

    // 7. Render & Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera tilt
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      scene.rotation.y = targetX * 0.32 + elapsedTime * 0.07;
      scene.rotation.x = -targetY * 0.22;

      // Core Rotations
      coreMesh.rotation.y = elapsedTime * 0.6;
      shellMesh.rotation.y = -elapsedTime * 0.35;
      shellMesh.rotation.z = elapsedTime * 0.3;
      ring1.rotation.z = elapsedTime * 0.7;
      ring2.rotation.z = -elapsedTime * 0.45;

      // Energy Pulses Moving Along Connections
      pulseData.forEach((pd) => {
        pd.progress += pd.speed;
        if (pd.progress > 1) pd.progress = 0;
        pd.mesh.position.lerpVectors(pd.startPos, pd.endPos, pd.progress);
      });

      // Role Node Floating & Hover Scale Reactions
      const activeId = activeRoleRef.current;

      TEAM_ROLES.forEach((role, idx) => {
        const item = roleMap[role.id];
        if (!item) return;

        // Gentle sin floating offset
        const phase = idx * 1.3;
        const floatY = item.initialPos[1] + Math.sin(elapsedTime * 1.6 + phase) * 0.12;
        item.group.position.y = floatY;

        // Rotate mini rings
        item.miniRing.rotation.z = elapsedTime * 1.3;

        // Active Role Highlight Scaling
        const isSelected = activeId === role.id;
        const targetScale = isSelected ? 1.4 : 1.0;
        const currentScale = item.sphere.scale.x;
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.15);

        item.sphere.scale.set(newScale, newScale, newScale);
        item.lineMat.opacity = isSelected ? 0.95 : 0.5;
      });

      // Particle rotation
      particles.rotation.y = elapsedTime * 0.025;

      // Sync 2D screen positions for HTML overlay badges
      const newCoords = {};
      const tempVec = new THREE.Vector3();

      TEAM_ROLES.forEach((role) => {
        const item = roleMap[role.id];
        if (!item) return;

        item.group.getWorldPosition(tempVec);
        tempVec.project(camera);

        const x = (tempVec.x * 0.5 + 0.5) * width;
        const y = (-tempVec.y * 0.5 + 0.5) * height;

        newCoords[role.id] = { x, y, visible: tempVec.z < 1 };
      });

      setNodeCoords(newCoords);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth || 500;
      const newHeight = currentMount.clientHeight || 450;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[480px] rounded-3xl overflow-hidden bg-slate-950/80 dark:bg-dark-900/80 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl group transition-all duration-300">
      
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#ca0019]/30 blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-rose-600/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />

      {/* 3D Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Banner Tag */}
      <div className="absolute top-4 left-5 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/15 text-white text-xs font-semibold pointer-events-none shadow-xl">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        <span className="tracking-wide flex items-center gap-1.5">
          <FiLayers className="text-red-400" /> Interactive 3D Team Mesh
        </span>
      </div>

      {/* Synchronized Non-Overlapping Floating Badges */}
      {TEAM_ROLES.map((role) => {
        const coords = nodeCoords[role.id];
        if (!coords || !coords.visible) return null;

        const IconComponent = role.icon;
        const isActive = activeRole === role.id;

        return (
          <div
            key={role.id}
            onMouseEnter={() => setActiveRole(role.id)}
            onMouseLeave={() => setActiveRole(null)}
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              transform: role.badgeOffset,
            }}
            className={`absolute z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-2xl backdrop-blur-xl text-xs font-semibold transition-all duration-200 cursor-pointer pointer-events-auto border shadow-xl ${
              isActive
                ? "scale-110 border-white text-white bg-slate-900/95 shadow-indigo-500/40 ring-2 ring-indigo-500/50"
                : "bg-slate-900/85 dark:bg-dark-800/90 border-white/20 text-slate-100 hover:border-white/40 hover:scale-105"
            }`}
          >
            <span
              className="p-1.5 rounded-xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: `${role.hex}25`, color: role.hex }}
            >
              <IconComponent size={15} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold tracking-tight text-white">{role.title}</span>
              <span className="text-[10px] text-slate-400 font-normal">{role.tech}</span>
            </div>
          </div>
        );
      })}

      {/* Bottom Interactive Hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <span className="text-[11px] text-white/90 font-medium tracking-widest uppercase bg-slate-900/80 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/15 shadow-lg">
          ✦ Move mouse to interact with 3D team mesh ✦
        </span>
      </div>
    </div>
  );
};

export default Team3DCanvas;

