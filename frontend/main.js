// main.js
import { createScene } from './scene.js';

// ✅ Initialize Scene
const { scene, camera, renderer, controls, car, updateCameraPosition } = createScene();

// ✅ Car Movement
let velocity = 0;
const moveSpeed = 2;
const maxSpeed = 15;
const turnSpeed = 0.05;
let carDirection = Math.PI;

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
