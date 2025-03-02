import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

function getWorkExperienceModels(allWorkExperience) {
    const buildings = [
        { modelPath: '/work_building1.glb', scale: 700, rotation: 1.5 },
        { modelPath: '/work_building3.glb', scale: 900, rotation: -3 },
        { modelPath: '/work_building4.glb', scale: 600, rotation: 1.5 },
    ];

    const outputBuildings = [];
    const zStart = 500;
    const zSpacing = 600; // Space between buildings

    for (let i = 0; i < allWorkExperience.length; i++) {
        const assignedBuilding = buildings[i % buildings.length]; // Cycle through available models
        const zPosition = zStart + i * zSpacing; // Adjust z position dynamically
        const yPosition = assignedBuilding.modelPath === '/work_building3.glb' ? 700 : 0;

        outputBuildings.push({
            modelPath: assignedBuilding.modelPath,
            position: { x: -500, y: yPosition, z: zPosition },
            scale: assignedBuilding.scale,
            rotation: assignedBuilding.rotation,
            text: {
                content: allWorkExperience[i].company,
                position: { x: -200, y: 20, z: zPosition + 100 }, // Text in front of building
                rotation: 1.5,
                color: 0xffffff,
                size: 40
            }
        });
    }

    console.log('---------experience-----------');
    console.log(outputBuildings);
    return outputBuildings;
}

function getEducationModels(allEducation) {
    const buildings = [
        { modelPath: '/school_building.glb', type: 'school', scale: 500, rotation: 0.0 },
        { modelPath: '/college_building.glb', type: 'college', scale: 400, rotation: -1.5 },
        { modelPath: '/university_building2.glb', type: 'university', scale: 600, rotation: 1.5 },
    ];

    const outputBuildings = [];
    const zStart = -500;
    const zSpacing = 600; // Space between buildings

    for (let i = 0; i < allEducation.length; i++) {
        const assignedBuilding = buildings[i % buildings.length]; // Cycle through available models
        const zPosition = zStart + -(i * zSpacing); // Adjust z position dynamically
        const yPosition = 0;

        outputBuildings.push({
            modelPath: assignedBuilding.modelPath,
            position: { x: -500, y: yPosition, z: zPosition },
            scale: assignedBuilding.scale,
            rotation: assignedBuilding.rotation,
            text: {
                content: allEducation[i].institution,
                position: { x: -200, y: 20, z: zPosition + 100 }, // Text in front of building
                rotation: 1.5,
                color: 0xffffff,
                size: 20
            }
        });
    }

    console.log('---------education-----------');
    console.log(outputBuildings);
    return outputBuildings;
}

export async function createScene(allSkill, allWorkExperience, allEducation, basicInfo) {

    // ✅ Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffe0a7); // ✅ Keeping same color

    scene.fog = new THREE.Fog(0xe8a87c, 50, 2500);

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

    // ✅ Large Ground (Keeping the Original Color)
    const groundGeometry = new THREE.PlaneGeometry(15000, 15000);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffa07a, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ✅ Adding Cross Roads with Junction
    function createRoad(x, z, width, height, rotation = 0) {
        // Road Surface
        const roadGeometry = new THREE.PlaneGeometry(width, height);
        const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.set(x, 4, z);
        road.rotation.z = rotation;
        scene.add(road);
    
        // Add Road Markings
        createRoadMarkings(x, z, width, height, rotation);
    }
    

    function createRoadMarkings(x, z, width, height, rotation) {
        const markingLength = 100;
        const markingSpacing = 200;
        const markingWidth = 10;
        const numMarkings = Math.floor((width > height ? width : height) / (markingLength + markingSpacing));
    
        for (let i = -numMarkings / 2; i < numMarkings / 2; i++) {
            const markingGeometry = new THREE.PlaneGeometry(markingLength, markingWidth);
            const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    
            const marking = new THREE.Mesh(markingGeometry, markingMaterial);
            marking.rotation.x = -Math.PI / 2; // Keep the markings flat on the ground
    
            if (width > height) {
                // Horizontal Road: markings should align along the Z-axis
                marking.position.set(x + i * (markingLength + markingSpacing), 5, z);
            } else {
                // Vertical Road: markings should align along the X-axis
                marking.rotation.z = Math.PI / 2; // Rotate markings to align properly
                marking.position.set(x, 5, z + i * (markingLength + markingSpacing));
            }
    
            scene.add(marking);
        }
    }    

    // Creating roads in a cross pattern
    createRoad(0, 0, 15000, 200); // Horizontal Road
    createRoad(0, 0, 200, 15000); // Vertical Road
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
        [-1150, -750], [980, 1150], [-1080, 920], [1350, -1450], [690, 1680], [-1580, 530], [1280, -1380], [400, -500]
    ];
    rockPositions.forEach(([x, z]) => createRock(x, z));

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
    const treePositions = [];

    const max = 5000;

    function areTreesTooClose(x, z, treePositions, minDistance) {
        for (const [tx, tz] of treePositions) {
            const distance = Math.sqrt((x - tx) ** 2 + (z - tz) ** 2);
            if (distance < minDistance) {
                return true; // Too close to an existing tree
            }
        }
        return false;
    }

    for (let index = 0; index < 40; index++) { 
        let randomX, randomZ;
        let attempts = 0;
        const maxAttempts = 20; // Prevent infinite loops
    
        do {
            randomX = Math.floor(Math.random() * (2 * max)) - max;
            randomZ = Math.floor(Math.random() * (1.8 * max)) - (max * 0.9);
            attempts++;
        } while (
            isInExclusionZone(randomX, randomZ) || 
            areTreesTooClose(randomX, randomZ, treePositions, 150) && 
            attempts < maxAttempts
        );
    
        if (attempts < maxAttempts) {
            treePositions.push([randomX, randomZ]);
        }
    }

    treePositions.forEach(([x, z]) => createTree(x, z));

    // ✅ Adding 3D Text
    // parameters: text, x, y, z, rotation, color, size
    function createText(text, x, y, z, rotation = 0, color = 0xFFFFFF, size = 100) {
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/optimer_regular.typeface.json', function (font) {
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: size,
                font: font,
                depth: 3,
                size: size,
                height: 10,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 5,
                bevelSize: 3,
                bevelSegments: 5,
            });
            const textMaterial = new THREE.MeshStandardMaterial({ color: color });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(x, y, z);
            textMesh.castShadow = true;
            textMesh.rotation.y = rotation;
            scene.add(textMesh);
        });
    }

    // createText('School', -200, 20, -400, 1.5, 0xffffff, 40);
    // createText('College', -200, 20, -900, 1.5, 0xffffff, 40);
    // createText('University', -200, 20, -1400, 1.5, 0xffffff, 40);

    // createText('Google', -200, 20, 600, 1.5, 0xffffff, 40);
    // createText('Microsoft', -200, 20, 1100, 1.5, 0xffffff, 40);
    // createText('Amazon', -200, 20, 1600, 1.5, 0xffffff, 40);
    // createText('Apple', -200, 20, 2100, 1.5, 0xffffff, 40);

    createText('Skills', 600, 20, 1500, 0.5, 0x000000, 80);
    createText(basicInfo.full_name, 600, 20, -900, 0.5, 0x000000, 150);

    function createTextList(textList, startX, startY, startZ, spacing) {
        textList.forEach((text, index) => {
            const x = startX;
            const y = startY;
            const z = startZ + index * spacing; // Adjust z position for equal spacing
            createText(text, x, y, z, 0, 0xffffff, 40);
        });
    }

    createTextList(allSkill, 200, 20, 300, 300);

    // ✅ Placeholder for Different Models (UNCHANGED)
    const buildings = [
        // Education
        // { modelPath: '/school_building.glb', position: { x: -500, y: 0, z: -500 }, scale: 500, rotation: 0.0 },
        // { modelPath: '/college_building.glb', position: { x: -500, y: 0, z: -1000 }, scale: 400, rotation: -1.5 },
        // { modelPath: '/university_building2.glb', position: { x: -500, y: 0, z: -1500 }, scale: 600, rotation: 1.5 },
        // { modelPath: '/paper_airplane2.glb', position: { x: -500, y: 0, z: 0 }, scale: 700, rotation: 1.5 },

        // Work
        // { modelPath: '/work_building1.glb', position: { x: -500, y: 0, z: 500 }, scale: 700, rotation: 1.5 },
        // { modelPath: '/work_building3.glb', position: { x: -500, y: 700, z: 1000 }, scale: 900, rotation: -3 },
        // { modelPath: '/work_building4.glb', position: { x: -500, y: 0, z: 1500 }, scale: 600, rotation: 1.5 },
        // { modelPath: '/work_building1.glb', position: { x: -500, y: 10, z: 2000 }, scale: 700, rotation: 1.5 },
    ];

    // ✅ Load Models (UNCHANGED)
    const loader = new GLTFLoader();
    function addModel(modelPath, x, y, z, scale, rotation) {
        loader.load(modelPath, function (gltf) {
            const model = gltf.scene;
            const bbox = new THREE.Box3().setFromObject(model);
            const size = bbox.getSize(new THREE.Vector3()).length();
            const scaleFactor = scale / size;

            model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            model.position.set(x, y, z);
            model.rotation.y = rotation;
            model.castShadow = true;

            scene.add(model);
        }, undefined, function (error) {
            console.error('Error loading the model:', error);
        });
    }

    // ✅ Import Models
    buildings.forEach(({ modelPath, position, scale, rotation }) => {
        addModel(modelPath, position.x, position.y, position.z, scale, rotation);
    });

    // work experience models
    const workExperienceModels = getWorkExperienceModels(allWorkExperience);
    workExperienceModels.forEach(({ modelPath, position, scale, rotation, text }) => {
        addModel(modelPath, position.x, position.y, position.z, scale, rotation);
        createText(text.content, text.position.x, text.position.y, text.position.z, text.rotation, text.color, text.size);
    });

    // education models
    const educationModels = getEducationModels(allEducation);
    educationModels.forEach(({ modelPath, position, scale, rotation, text }) => {
        addModel(modelPath, position.x, position.y, position.z, scale, rotation);
        createText(text.content, text.position.x, text.position.y, text.position.z, text.rotation, text.color, text.size);
    });

    // ✅ Car Model (Now Visible)
    const airplaneLoader = new GLTFLoader();
    function loadModelBlocking(url) {
        return new Promise((resolve, reject) => {
            airplaneLoader.load(
                url,
                (gltf) => resolve(gltf.scene), // ✅ Resolve with the loaded scene
                undefined,
                (error) => reject(error) // ❌ Reject if there's an error
            );
        });
    }
    
    let airplane;
    try {
        airplane = await loadModelBlocking('/airplane.glb');
        airplane.scale.set(10, 10, 10);
        airplane.position.set(0, 80, 100);
        airplane.castShadow = true;
        scene.add(airplane);
    } catch (error) {
        console.error('Error loading the airplane model:', error);
    }

    // ✅ Attach Camera Behind Car for Third-Person View
    const airplaneFollowDistance = 150; // ✅ Distance behind the car
    function updateCameraPosition() {
        camera.position.x = airplane.position.x - airplaneFollowDistance * Math.sin(airplane.rotation.y);
        camera.position.z = airplane.position.z - airplaneFollowDistance * Math.cos(airplane.rotation.y);
        camera.position.y = airplane.position.y + 100; // ✅ Slightly above the car
        camera.lookAt(airplane.position.x, airplane.position.y + 20, airplane.position.z);
    }

    // // ✅ Smooth Car Controls (Fixed Movement)
    // let velocity = 0;
    // const moveSpeed = 2;
    // const maxSpeed = 15;
    // const turnSpeed = 0.05;
    // let carDirection = Math.PI; // ✅ Corrected initial direction

    // const keys = {
    //     ArrowUp: false,
    //     ArrowDown: false,
    //     ArrowLeft: false,
    //     ArrowRight: false,
    // };

    return { scene, camera, renderer, controls, airplane, updateCameraPosition };
}

function isInExclusionZone(x, z) {
    // Define exclusion zones (adjust these based on actual sizes)
    const roads = [
        { x: 0, z: 0, width: 8000, height: 200 }, // Horizontal road
        { x: 0, z: 0, width: 200, height: 8000 }  // Vertical road
    ];
    
    const buildings = [
        { x: -500, z: -500, size: 600 },
        { x: -500, z: -1000, size: 500 },
        { x: -500, z: -1500, size: 700 },
        { x: -500, z: 500, size: 800 },
        { x: -500, z: 1000, size: 900 },
        { x: -500, z: 1500, size: 700 },
        { x: -500, z: 2000, size: 800 }
    ];

    // Check if inside a road
    for (const road of roads) {
        if (Math.abs(x - road.x) < road.width / 2 && Math.abs(z - road.z) < road.height / 2) {
            return true;
        }
    }

    // Check if inside a building
    for (const building of buildings) {
        if (Math.abs(x - building.x) < building.size / 2 && Math.abs(z - building.z) < building.size / 2) {
            return true;
        }
    }

    return false;
}

// // ✅ Listen for Key Presses
// window.addEventListener('keydown', (event) => {
//     if (keys.hasOwnProperty(event.key)) {
//         keys[event.key] = true;
//     }
// });

// window.addEventListener('keyup', (event) => {
//     if (keys.hasOwnProperty(event.key)) {
//         keys[event.key] = false;
//     }
// });

// // ✅ Animation Loop (Fixed Car Movement)
// function animate() {
//     requestAnimationFrame(animate);

//     // ✅ Corrected Car Movement
//     if (keys.ArrowUp && velocity < maxSpeed) velocity += 0.5; // ✅ Move FORWARD
//     if (keys.ArrowDown && velocity > -maxSpeed) velocity -= 0.5; // ✅ Move BACKWARD
//     velocity *= 0.98; // ✅ Friction (Smooth Stop)

//     airplane.position.x += velocity * Math.sin(carDirection);
//     airplane.position.z += velocity * Math.cos(carDirection);

//     if (keys.ArrowLeft) carDirection += turnSpeed; // ✅ Turn Left
//     if (keys.ArrowRight) carDirection -= turnSpeed; // ✅ Turn Right
//     airplane.rotation.y = carDirection;

//     // ✅ Update Camera to Follow Car Correctly
//     updateCameraPosition();

//     renderer.render(scene, camera);
// }
// animate();

// // ✅ Handle Window Resize
// window.addEventListener('resize', () => {
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
// });
