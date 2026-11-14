const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

function createNetwork(THREE, group, mobile) {
  const count = mobile ? 48 : 88;
  const positions = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = goldenAngle * i;
    positions.push(new THREE.Vector3(Math.cos(angle) * radius * 2.25, y * 2.25, Math.sin(angle) * radius * 2.25));
  }

  const nodeGeometry = new THREE.SphereGeometry(mobile ? .035 : .042, 8, 8);
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: '#91dff4',
    emissive: '#3e74a9',
    emissiveIntensity: 1.1,
    metalness: .22,
    roughness: .3
  });
  const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, count);
  const dummy = new THREE.Object3D();
  positions.forEach((point, index) => {
    dummy.position.copy(point);
    dummy.updateMatrix();
    nodes.setMatrixAt(index, dummy.matrix);
  });
  nodes.instanceMatrix.needsUpdate = true;
  group.add(nodes);

  const links = [];
  positions.forEach((point, index) => {
    const nearest = positions
      .map((candidate, otherIndex) => ({otherIndex, distance: point.distanceToSquared(candidate)}))
      .filter(candidate => candidate.otherIndex > index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
    for (const neighbor of nearest) {
      links.push(point.x, point.y, point.z);
      const end = positions[neighbor.otherIndex];
      links.push(end.x, end.y, end.z);
    }
  });

  const linkGeometry = new THREE.BufferGeometry();
  linkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(links, 3));
  group.add(new THREE.LineSegments(linkGeometry, new THREE.LineBasicMaterial({
    color: '#8f83f4',
    transparent: true,
    opacity: mobile ? .18 : .23
  })));
}

function addFloatingShape(THREE, group, geometry, material, position, scale) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.setScalar(scale);
  mesh.userData.floatOffset = position[1];
  group.add(mesh);
  return mesh;
}

function renderScene(THREE, canvas, host) {
  const mobile = matchMedia('(max-width: 700px)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !mobile,
    powerPreference: 'low-power'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 60);
  camera.position.set(0, 0, 9.2);

  scene.add(new THREE.AmbientLight('#a9b5ff', 1.15));
  const keyLight = new THREE.PointLight('#8e7aff', 34, 18);
  keyLight.position.set(-2.2, 2.6, 4);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight('#46dce8', 24, 16);
  fillLight.position.set(3.2, -1.5, 2.3);
  scene.add(fillLight);

  const root = new THREE.Group();
  scene.add(root);
  const network = new THREE.Group();
  root.add(network);

  createNetwork(THREE, network, mobile);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: '#9784ff',
    emissive: '#41337e',
    emissiveIntensity: .65,
    metalness: .56,
    roughness: .3,
    transparent: true,
    opacity: .76
  });
  const cyanRingMaterial = ringMaterial.clone();
  cyanRingMaterial.color.set('#66e4eb');
  cyanRingMaterial.emissive.set('#1c6570');

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.62, .012, 8, 160), ringMaterial);
  ringA.rotation.set(.85, .2, -.24);
  root.add(ringA);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.86, .009, 8, 160), cyanRingMaterial);
  ringB.rotation.set(1.7, -.5, .15);
  root.add(ringB);

  const core = new THREE.Group();
  const coreMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(.66, 2),
    new THREE.MeshPhysicalMaterial({
      color: '#7563d5',
      emissive: '#4136a0',
      emissiveIntensity: 1.35,
      roughness: .22,
      metalness: .35,
      clearcoat: .8,
      clearcoatRoughness: .2
    })
  );
  core.add(coreMesh);
  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(.7, 1),
    new THREE.MeshBasicMaterial({color: '#c4b8ff', wireframe: true, transparent: true, opacity: .34})
  );
  core.add(coreWire);
  root.add(core);

  const shapeMaterial = new THREE.MeshStandardMaterial({
    color: '#b7adff',
    emissive: '#5140a0',
    emissiveIntensity: .5,
    metalness: .58,
    roughness: .24,
    wireframe: true,
    transparent: true,
    opacity: .84
  });
  const shapeA = addFloatingShape(THREE, root, new THREE.OctahedronGeometry(.42, 0), shapeMaterial, [-2.7, .85, .15], 1);
  const shapeB = addFloatingShape(THREE, root, new THREE.TetrahedronGeometry(.5, 0), shapeMaterial.clone(), [2.65, -.7, -.3], .88);
  const shapeC = addFloatingShape(THREE, root, new THREE.IcosahedronGeometry(.28, 0), cyanRingMaterial.clone(), [1.65, 1.7, -.8], 1);

  const starPositions = new Float32Array((mobile ? 100 : 190) * 3);
  for (let i = 0; i < starPositions.length; i++) starPositions[i] = (Math.random() - .5) * 11;
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({
    color: '#bcb8ff',
    size: mobile ? .018 : .022,
    transparent: true,
    opacity: .58,
    sizeAttenuation: true
  })));

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollProgress = 0;
  let targetScroll = 0;
  let visible = !document.hidden;
  const clock = new THREE.Clock();

  function resize() {
    const bounds = host.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    camera.aspect = width / height;
    camera.position.z = mobile ? 10 : 9.2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (visible) draw();
  }

  function updatePointer(event) {
    const bounds = host.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / Math.max(1, bounds.width) - .5) * 2;
    targetY = ((event.clientY - bounds.top) / Math.max(1, bounds.height) - .5) * 2;
  }

  function updateScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    targetScroll = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  function draw() {
    if (!width || !height) return;
    const elapsed = clock.getElapsedTime();
    pointerX += (targetX - pointerX) * .045;
    pointerY += (targetY - pointerY) * .045;
    scrollProgress += (targetScroll - scrollProgress) * .035;

    network.rotation.y = elapsed * .105 + pointerX * .12 + scrollProgress * .12;
    network.rotation.x = -.12 + pointerY * .09 + scrollProgress * .035;
    ringA.rotation.z = -.24 + elapsed * .045 + pointerX * .06;
    ringB.rotation.y = -.5 - elapsed * .035 + pointerY * .05;
    core.rotation.y = elapsed * .14 + pointerX * .08;
    core.rotation.x = elapsed * .08 + pointerY * .06;
    shapeA.rotation.set(elapsed * .18, elapsed * .3, elapsed * .12);
    shapeB.rotation.set(-elapsed * .16, elapsed * .23, elapsed * .19);
    shapeC.rotation.set(elapsed * .24, -elapsed * .2, elapsed * .16);
    shapeA.position.y = .85 + Math.sin(elapsed * .8) * .12;
    shapeB.position.y = -.7 + Math.sin(elapsed * .7 + 1.4) * .14;
    shapeC.position.y = 1.7 + Math.sin(elapsed * .9 + 2.3) * .1;
    root.position.y = -.1 - scrollProgress * .16;
    renderer.render(scene, camera);
  }

  function animate() {
    animationFrame = 0;
    if (!visible || reducedMotion) return;
    draw();
    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!visible || reducedMotion || animationFrame) return;
    animationFrame = requestAnimationFrame(animate);
  }

  function onVisibilityChange() {
    visible = !document.hidden;
    if (!visible && animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else {
      startAnimation();
    }
  }

  host.addEventListener('pointermove', updatePointer, {passive: true});
  host.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; }, {passive: true});
  window.addEventListener('scroll', updateScroll, {passive: true});
  document.addEventListener('visibilitychange', onVisibilityChange);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  updateScroll();
  if (reducedMotion) draw();
  else startAnimation();
}

export async function startHeroScene(fallbackCanvas) {
  if (!fallbackCanvas?.parentElement) return;
  if (matchMedia('(prefers-reduced-motion: reduce), (max-width: 700px)').matches) {
    const {startOrbit} = await import('./orbit.js');
    startOrbit(fallbackCanvas);
    return;
  }

  const host = fallbackCanvas.parentElement;
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-three-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);

  try {
    const THREE = await import(THREE_URL);
    renderScene(THREE, canvas, host);
    fallbackCanvas.classList.add('hero-canvas--fallback');
  } catch (error) {
    canvas.remove();
    console.warn('ThreadLab 3D scene unavailable; using the built-in canvas fallback.', error);
    const {startOrbit} = await import('./orbit.js');
    startOrbit(fallbackCanvas);
  }
}
