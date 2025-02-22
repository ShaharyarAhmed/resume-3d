import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ✅ Create Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffe0a7); // ✅ **Same color**

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ✅ Create First-Person Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 10, 0); // ✅ Camera inside the car

// ✅ First-Person Controls (Like FPS Games)
const controls = new PointerLockControls(camera, document.body);

// ✅ Click to Activate First-Person Mode
document.addEventListener('click', () => {
    controls.lock();
});

// ✅ Large Soft Gradient Skybox (UNCHANGED)
const skyGeometry = new THREE.SphereGeometry(8000, 32, 32);
const skyMaterial = new THREE.MeshBasicMaterial({ color: 0xffd79a, side: THREE.BackSide });
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// ✅ Large Ground (Keeping the Original Color)
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffa07a, roughness: 0.8 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ✅ Lighting Setup (UNCHANGED)
const ambientLight = new THREE.AmbientLight(0xffcc88, 3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(200, 600, 200);
directionalLight.castShadow = true;
scene.add(directionalLight);

// ✅ Function to Add Bigger Trees (UNCHANGED)
function createTree(x, z) {
    const trunkGeometry = new THREE.BoxGeometry(20, 100, 20);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 50, z);

    const leavesGeometry = new THREE.BoxGeometry(80, 160, 80);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0xffee58 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(x, 160, z);

    scene.add(trunk);
    scene.add(leaves);
}

// ✅ Add Trees (UNCHANGED)
const treePositions = [
    [-1000, -700], [800, 1000], [-900, 850], [1200, -1300], [500, 1500], [-1400, 400], [1100, -1200]
];
treePositions.forEach(([x, z]) => createTree(x, z));

// ✅ Placeholder for Different Models (UNCHANGED)
const buildings = [
    { modelPath: '/City_Building.glb', position: { x: -2000, z: -1800 }, scale: 600, rotation: 0.1 },
    { modelPath: '/Large Building.glb', position: { x: 1500, z: -2000 }, scale: 500, rotation: -0.3 },
    { modelPath: '/Low Building (1).glb', position: { x: -1200, z: 1800 }, scale: 550, rotation: 0.2 },
    { modelPath: '', position: { x: -2000, z: -3000 }, scale: 1400, rotation: -0.2 },
    { modelPath: '/Small Building.glb', position: { x: -2000, z: 1600 }, scale: 600, rotation: 0.4 },
    { modelPath: '/Simple computer.glb', position: { x: 2500, z: -1200 }, scale: 650, rotation: -0.1 },
    { modelPath: '/Low Building.glb', position: { x: -2200, z: 1500 }, scale: 600, rotation: 0.3 },
    { modelPath: '/Schoolhouse.glb', position: { x: 0, z: 2800 }, scale: 800, rotation: -0.3 }
];

// ✅ Load Models (UNCHANGED)
const loader = new GLTFLoader();
function addModel(modelPath, x, z, scale, rotation) {
    loader.load(modelPath, function (gltf) {
        const model = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3()).length();
        const scaleFactor = scale / size;

        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        model.position.set(x, 0, z);
        model.rotation.y = rotation;
        model.castShadow = true;

        scene.add(model);
    }, undefined, function (error) {
        console.error('Error loading the model:', error);
    });
}

// ✅ Import Models
buildings.forEach(({ modelPath, position, scale, rotation }) => {
    addModel(modelPath, position.x, position.z, scale, rotation);
});

// ✅ Car Model (Invisible, Used for Movement)
const car = new THREE.Object3D();
car.position.set(0, 10, 100);
scene.add(car);
camera.position.set(0, 5, 0);
car.add(camera); // ✅ Attach Camera to Car for First-Person Mode

// ✅ Smooth Car Controls (First-Person Mode)
let velocity = 0;
const moveSpeed = 2;
const maxSpeed = 15;
const turnSpeed = 0.05;
let carDirection = 0; // Rotation in radians

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

// ✅ Listen for Key Presses
window.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

// ✅ Animation Loop (First-Person Driving)
function animate() {
    requestAnimationFrame(animate);

    // ✅ First-Person Movement
    if (keys.ArrowUp && velocity < maxSpeed) velocity += 0.5;
    if (keys.ArrowDown && velocity > -maxSpeed) velocity -= 0.5;
    velocity *= 0.98;

    car.position.x -= velocity * Math.sin(carDirection);
    car.position.z -= velocity * Math.cos(carDirection);

    if (keys.ArrowLeft) carDirection += turnSpeed;
    if (keys.ArrowRight) carDirection -= turnSpeed;
    car.rotation.y = carDirection;

    renderer.render(scene, camera);
}
animate();

// ✅ Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
