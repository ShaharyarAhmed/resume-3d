import * as THREE from 'three';

const API_HOST = "http://localhost:8000"

// const path = createPath(CENTER_VECTOR, new THREE.Vector3(800, 0, 1));
// ground.add(path);

export function createPath(start, end) {
    const length = start.distanceTo(end); // Get distance between points
    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(10, length), 
        new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    road.position.lerpVectors(start, end, 0.5); // Set position to the midpoint
    road.receiveShadow = true;

    return road;
}

/**
 *  Sumbits a resume to the API and returns a structured object.
 * @param {File} resumeFile - The file object containing the PDF resume.
 * @returns {Promise<object>}
 */
export async function submitResume(resumeFile) {
    // TODO: Actually submit a file.
    const respose = await fetch(
        `${API_HOST}/resume`, {method: "POST"}
    );

    console.log(await respose.json());

    return await respose.json();
}