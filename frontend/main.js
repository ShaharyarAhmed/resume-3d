import { createScene } from './scene.js';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    // Create main container
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.height = '100vh';
    container.style.width = '100vw';
    container.style.background = 'linear-gradient(135deg, #FF7E5F, #FFB88C)';
    container.style.fontFamily = "'Poppins', sans-serif";

    // Create Heading
    const heading = document.createElement('h1');
    heading.innerText = 'Resume Visualization';
    heading.style.fontSize = '42px';
    heading.style.color = '#fff';
    heading.style.fontWeight = '700';
    heading.style.marginBottom = '20px';
    heading.style.textShadow = '2px 2px 10px rgba(0, 0, 0, 0.3)';
    heading.style.letterSpacing = '2px';

    // Card Container
    const card = document.createElement('div');
    card.style.background = '#ffffff';
    card.style.padding = '30px';
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0px 10px 30px rgba(0, 0, 0, 0.1)';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.width = '350px';
    card.style.textAlign = 'center';

    // Title
    const title = document.createElement('h2');
    title.innerText = 'Upload Your Resume';
    title.style.color = '#333';
    title.style.marginBottom = '15px';
    title.style.fontWeight = '600';

    // File Input Wrapper (Styled as a Button)
    const fileInputWrapper = document.createElement('label');
    fileInputWrapper.style.display = 'inline-block';
    fileInputWrapper.style.padding = '12px 20px';
    fileInputWrapper.style.backgroundColor = '#FF5E3A';
    fileInputWrapper.style.color = '#fff';
    fileInputWrapper.style.borderRadius = '6px';
    fileInputWrapper.style.cursor = 'pointer';
    fileInputWrapper.style.fontSize = '14px';
    fileInputWrapper.style.marginBottom = '15px';
    fileInputWrapper.style.transition = '0.3s ease-in-out';
    fileInputWrapper.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    fileInputWrapper.innerText = 'Choose File';

    fileInputWrapper.onmouseover = () => {
        fileInputWrapper.style.backgroundColor = '#E64A19';
        fileInputWrapper.style.transform = 'scale(1.05)';
    };
    fileInputWrapper.onmouseleave = () => {
        fileInputWrapper.style.backgroundColor = '#FF5E3A';
        fileInputWrapper.style.transform = 'scale(1)';
    };

    // Hidden File Input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', () => {
        fileInputWrapper.innerText = fileInput.files.length ? fileInput.files[0].name : 'Choose File';
    });

    fileInputWrapper.appendChild(fileInput);

    // Upload Button
    const uploadButton = document.createElement('button');
    uploadButton.innerText = 'Get Your Visualized Resume'; // Updated text here
    uploadButton.style.padding = '12px 20px';
    uploadButton.style.fontSize = '16px';
    uploadButton.style.cursor = 'pointer';
    uploadButton.style.border = 'none';
    uploadButton.style.borderRadius = '6px';
    uploadButton.style.background = '#FF7E5F';
    uploadButton.style.color = '#fff';
    uploadButton.style.transition = '0.3s ease-in-out';
    uploadButton.style.width = '100%';
    uploadButton.style.marginTop = '10px';
    uploadButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';

    uploadButton.onmouseover = () => {
        uploadButton.style.background = '#E64A19';
        uploadButton.style.transform = 'scale(1.05)';
        uploadButton.style.boxShadow = '0px 6px 10px rgba(0, 0, 0, 0.15)';
    };
    uploadButton.onmouseleave = () => {
        uploadButton.style.background = '#FF7E5F';
        uploadButton.style.transform = 'scale(1)';
        uploadButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };

    uploadButton.onmousedown = () => {
        uploadButton.style.transform = 'scale(0.95)';
    };

    uploadButton.onmouseup = () => {
        uploadButton.style.transform = 'scale(1.05)';
    };

    // Append elements
    container.appendChild(heading);
    card.appendChild(title);
    card.appendChild(fileInputWrapper);
    card.appendChild(uploadButton);
    container.appendChild(card);
    document.body.appendChild(container);

    uploadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a resume file.');
            return;
        }
    
        // Disable button and clear text
        uploadButton.disabled = true;
        uploadButton.innerHTML = ''; // Clear existing text
    
        // Create Spinner Element
        const spinner = document.createElement('div');
        spinner.style.border = '4px solid rgba(255, 255, 255, 0.3)';
        spinner.style.borderTop = '4px solid #fff';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '24px';
        spinner.style.height = '24px';
        spinner.style.animation = 'spin 1s linear infinite';
        spinner.style.margin = 'auto';
    
        // Add Spinner to Button
        uploadButton.appendChild(spinner);
        uploadButton.style.background = '#C62828';
    
        // CSS for Spinner Animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    
        try {
            const responseData = await uploadResume(file);
            document.body.innerHTML = ''; // Clear the page
            initializeScene(responseData);
        } catch (error) {
            console.error('Error uploading resume:', error);
            alert('Failed to upload resume. Try again.');
    
            // Reset Button
            uploadButton.disabled = false;
            uploadButton.innerHTML = 'Get Your Visualized Resume'; // Reset text
            uploadButton.style.background = '#FF7E5F';
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
