import { createScene } from './scene.js';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.height = '100vh';

    // File Input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.style.marginBottom = '20px';

    // Upload Button
    const uploadButton = document.createElement('button');
    uploadButton.innerText = 'Upload Resume & Start Scene';
    uploadButton.style.padding = '10px 20px';
    uploadButton.style.fontSize = '16px';
    uploadButton.style.cursor = 'pointer';

    container.appendChild(fileInput);
    container.appendChild(uploadButton);
    document.body.appendChild(container);

    uploadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a resume file.');
            return;
        }

        uploadButton.disabled = true;
        uploadButton.innerText = 'Uploading...';

        try {
            const responseData = await uploadResume(file);
            document.body.innerHTML = ''; // Clear the page
            initializeScene(responseData);
        } catch (error) {
            console.error('Error uploading resume:', error);
            alert('Failed to upload resume. Try again.');
            uploadButton.disabled = false;
            uploadButton.innerText = 'Upload Resume & Start Scene';
        }
    });
});

async function uploadResume(file) {
    const formData = new FormData();
    formData.append('resume_file', file);

    const response = await fetch('http://127.0.0.1:8000/resume', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Failed to upload resume');
    
    return response.json(); // API response with profile, skills, education, etc.
}

async function initializeScene(data) {
    console.log(data);

    const allSkill = data.skills;
    const allWorkExperience = data.work_experience;
    const allEducation = data.education;

    const { scene, camera, renderer, controls, airplane, updateCameraPosition } = await createScene(allSkill, allWorkExperience, allEducation);

    let velocity = 0;
    const moveSpeed = 2;
    const maxSpeed = 15;
    const turnSpeed = 0.05;
    let airplaneDirection = Math.PI;

    const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

    window.addEventListener('keydown', (event) => { if (keys.hasOwnProperty(event.key)) keys[event.key] = true; });
    window.addEventListener('keyup', (event) => { if (keys.hasOwnProperty(event.key)) keys[event.key] = false; });

    function animate() {
        requestAnimationFrame(animate);

        if (keys.ArrowUp && velocity < maxSpeed) velocity += 0.5;
        if (keys.ArrowDown && velocity > -maxSpeed) velocity -= 0.5;
        velocity *= 0.98;

        airplane.position.x += velocity * Math.sin(airplaneDirection);
        airplane.position.z += velocity * Math.cos(airplaneDirection);

        if (keys.ArrowLeft) airplaneDirection += turnSpeed;
        if (keys.ArrowRight) airplaneDirection -= turnSpeed;
        airplane.rotation.y = airplaneDirection;

        updateCameraPosition();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}
