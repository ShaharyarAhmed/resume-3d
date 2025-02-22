import * as THREE from 'three';

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