// Install dependencies:
// npm create vite@latest threejs-vite --template vanilla
// cd threejs-vite
// npm install three

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.innerText = 'Open Scene';
    button.className = 'open-scene-btn';
    document.body.appendChild(button);

    // Center align button
    button.style.position = 'absolute';
    button.style.top = '50%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.gap = '10px';
    
    button.addEventListener('click', () => {
        showLoader(button);
        fakeApiCall().then((data) => {
            document.body.innerHTML = '';
            initScene(data);
        });
    });
});

function showLoader(button) {
    button.innerHTML = '';
    const spinner = document.createElement('div');
    spinner.style.width = '16px';
    spinner.style.height = '16px';
    spinner.style.border = '2px solid white';
    spinner.style.borderTop = '2px solid transparent';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    
    button.appendChild(spinner);
    button.disabled = true;
    button.style.opacity = '0.7';
    button.style.cursor = 'not-allowed';
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

const apiResponse = {
    "profile": {
        "name": "Your Name",
        "contact": {
            "email": "your.email@example.com",
            "phone": "123-456-7890",
            "linkedin": "https://linkedin.com/in/yourprofile",
            "github": "https://github.com/yourusername",
            "twitter": "https://twitter.com/yourhandle",
            "portfolio": "https://yourportfolio.com"
        },
        "summary": "A motivated individual with an."
    },
    "education": [
        {
            "type": "school",
            "institution": "Some High School",
            "qualification": "A-levels",
            "start_year": 2018,
            "end_year": 2020,
            "specialization": "Science, Maths"
        },
        {
            "type": "college",
            "institution": "Some College",
            "qualification": "High School Diploma",
            "start_year": 2018,
            "end_year": 2020,
            "specialization": "Computer Science, Math"
        },
        {
            "type": "university",
            "institution": "Aston University",
            "degree": "Bachelor's in Computer Science",
            "qualification": "First-Class Honors",
            "start_year": 2021,
            "end_year": 2024,
            "specialization": "AI, Network Configuration, Secure Systems"
        }
    ],
    "work_experience": [
        {
            "company": "Zamzam Road Haulage Ltd",
            "position": "Full Stack Developer Intern",
            "start_year": 2023,
            "end_year": 2023
        },
        {
            "company": "SK Group Promotions",
            "position": "Brand Ambassador",
            "start_year": 2019,
            "end_year": 2020
        },
        {
            "company": "Kreate Agency",
            "position": "Event Assistant",
            "start_year": 2021,
            "end_year": 2021
        }
    ],
    "skills": [
        "Full Stack Development",
        "Linux System Administration",
        "Network Configuration & Secure Systems",
        "AI-driven Solutions",
        "Bash Scripting",
        "Team Leadership",
        "Brand Promotion & Marketing"
    ],
    "projects": [
        {
            "name": "Dental Health Monitoring System",
            "description": "Developed an AI-driven system to monitor and analyze dental health as part of the final-year project.",
            "technologies": ["Python", "Machine Learning", "Data Analysis"]
        },
        {
            "name": "Truck Management System",
            "description": "Developed a web-based management system for truck operations, including job acceptance features for drivers.",
            "technologies": ["JavaScript", "Node.js", "MongoDB"]
        }
    ],
    "certifications": [
        {
            "name": "Secure Network Services Course",
            "institution": "University",
            "year": 2024
        }
    ],
    "awards": [
        {
            "name": "Third Place - Individual Project Showcase",
            "year": 2024
        }
    ],
    "languages": [
        "English (Fluent)",
        "Urdu (Native)"
    ],
    "interests": [
        "Technology",
        "Health and Wellness",
        "Fitness",
        "Event Planning"
    ]
};

function fakeApiCall() {
    return new Promise(resolve => {
        setTimeout(() => { resolve(apiResponse); }, 2000);
    });
}

function initScene(data) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 20;

    // Gradient ground
    const size = 10;
    const groundGeometry = new THREE.PlaneGeometry(size, size);
    const gradientCanvas = document.createElement('canvas');
    gradientCanvas.width = 256;
    gradientCanvas.height = 256;
    const ctx = gradientCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, 'orange');
    gradient.addColorStop(1, 'darkorange');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(gradientCanvas);
    const groundMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Light source for softer shadows
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(5, 10, 5);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.radius = 4;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    scene.add(light);

    // Ambient light to brighten the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Display user name in 3D text
    const nameText = document.createElement('div');
    nameText.innerText = `Name: ${data.profile.name}`;
    nameText.style.position = 'absolute';
    nameText.style.top = '10px';
    nameText.style.left = '50%';
    nameText.style.transform = 'translateX(-50%)';
    nameText.style.fontSize = '20px';
    nameText.style.fontWeight = 'bold';
    nameText.style.color = 'white';
    document.body.appendChild(nameText);

    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);
    
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
