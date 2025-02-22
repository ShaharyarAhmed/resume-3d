// main.js
import { createScene } from './scene.js';
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
            // initScene(data);
            initializeScene();
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

function initializeScene() {
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
}

