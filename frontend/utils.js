import * as THREE from 'three';

const API_HOST = "http://localhost:8000"

// const path = createPath(CENTER_VECTOR, new THREE.Vector3(800, 0, 1));
// ground.add(path);

/**
 *  Sumbits a resume to the API and returns a structured object.
 * @param {File} resumeFile - The file object containing the PDF resume.
 * @returns {Promise<object>}
 */
export async function submitResume(resumeFile) {
    // TODO: Actually submit a file.
    const formData = new FormData();

    formData.append("resume_file", resumeFile);

    // Add a text field
    formData.append("name", "Pomegranate");
    const respose = await fetch(
        `${API_HOST}/resume`, {
            method: "POST",
            body: resumeFile
        }
    );

    console.log(await respose.json());

    return await respose.json();
}