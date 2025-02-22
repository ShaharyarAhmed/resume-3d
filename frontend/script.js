import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ✅ Create Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffe0a7); // ✅ Keeping same color

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ✅ Create Third-Person Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 50, -100); // ✅ Positioned behind the car

// ✅ Third-Person Controls (Mouse View Like Open-World Games)
const controls = new PointerLockControls(camera, document.body);

// ✅ Click to Activate Third-Person Mode
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

// ✅ Adding Cross Roads with Junction
function createRoad(x, z, width, height, rotation = 0) {
    const roadGeometry = new THREE.PlaneGeometry(width, height);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 4, z); // height is 4
    road.rotation.z = rotation;
    scene.add(road);
}

// Creating roads in a cross pattern
createRoad(0, 0, 2000, 200); // Horizontal Road
createRoad(0, 0, 200, 2000); // Vertical Road
// createRoad(0, 0, 400, 400); // Junction

// ✅ Function to Add Rocks
function createRock(x, z) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(Math.random() * 50 + 20), new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 1 }));
    rock.position.set(x, 5, z);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.castShadow = rock.receiveShadow = true;
    scene.add(rock);
}

const rockPositions = [
    [-1150, -750], [980, 1150], [-1080, 920], [1350, -1450], [690, 1680], [-1580, 530], [1280, -1380], [-100, 200], [400, -500]
];
rockPositions.forEach(([x, z]) => createRock(x, z));

// ✅ Function to Add Signposts
function createSignpost(text, x, z, offsetX = 250, offsetZ = 250) {
    // Create pole
    const poleGeometry = new THREE.CylinderGeometry(5, 5, 130, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(x + offsetX, 85, z + offsetZ);

    // Create signboard (Bigger Size, Double-Sided)
    const signGeometry = new THREE.PlaneGeometry(220, 110);

    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'Bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        return new THREE.CanvasTexture(canvas);
    }

    const texture = createTextTexture(text);
    const signMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(x + offsetX, 150, z + offsetZ + 30);
    sign.rotation.y = Math.PI / 6; // Adjust rotation for visibility

    // Add to scene
    scene.add(pole);
    scene.add(sign);
}

// Add Signposts Next to Key Buildings
createSignpost("City Center", -1900, -1700);
createSignpost("Work Experience", 1400, -1900);
createSignpost("School", 0, 2700);
createSignpost("Skills Training", 2400, -1100);
createSignpost("Small Building", -1900, 1700);

// Now the signs should be correctly visible from both sides!

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
    { modelPath: '/work_building.glb', position: { x: 1500, z: -2000 }, scale: 500, rotation: -0.3 },
    { modelPath: '/Small Building.glb', position: { x: -1200, z: 1800 }, scale: 550, rotation: 0.2 },
    { modelPath: '/Education_building.glb', position: { x: -2000, z: -3000 }, scale: 1400, rotation: -0.2 },
    { modelPath: '/Small Building.glb', position: { x: -2000, z: 1600 }, scale: 600, rotation: 0.4 },
    { modelPath: '/skill_monitor.glb', position: { x: 2500, z: -1200 }, scale: 650, rotation: -0.1 },
    { modelPath: '/work_building.glb', position: { x: -2200, z: 1500 }, scale: 600, rotation: 0.3 },
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

// ✅ Car Model (Now Visible)
const carGeometry = new THREE.BoxGeometry(40, 25, 60);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 15, 100);
car.castShadow = true;
scene.add(car);

// ✅ Attach Camera Behind Car for Third-Person View
const carFollowDistance = 150; // ✅ Distance behind the car
function updateCameraPosition() {
    camera.position.x = car.position.x - carFollowDistance * Math.sin(car.rotation.y);
    camera.position.z = car.position.z - carFollowDistance * Math.cos(car.rotation.y);
    camera.position.y = car.position.y + 50; // ✅ Slightly above the car
    camera.lookAt(car.position.x, car.position.y + 20, car.position.z);
}

// ✅ Smooth Car Controls (Fixed Movement)
let velocity = 0;
const moveSpeed = 2;
const maxSpeed = 15;
const turnSpeed = 0.05;
let carDirection = Math.PI; // ✅ Corrected initial direction

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

// ✅ Animation Loop (Fixed Car Movement)
function animate() {
    requestAnimationFrame(animate);

    // ✅ Corrected Car Movement
    if (keys.ArrowUp && velocity < maxSpeed) velocity += 0.5; // ✅ Move FORWARD
    if (keys.ArrowDown && velocity > -maxSpeed) velocity -= 0.5; // ✅ Move BACKWARD
    velocity *= 0.98; // ✅ Friction (Smooth Stop)

    car.position.x += velocity * Math.sin(carDirection);
    car.position.z += velocity * Math.cos(carDirection);

    if (keys.ArrowLeft) carDirection += turnSpeed; // ✅ Turn Left
    if (keys.ArrowRight) carDirection -= turnSpeed; // ✅ Turn Right
    car.rotation.y = carDirection;

    // ✅ Update Camera to Follow Car Correctly
    updateCameraPosition();

    renderer.render(scene, camera);
}
animate();

// ✅ Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
