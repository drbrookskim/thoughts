import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue
scene.fog = new THREE.Fog(0x87ceeb, 0, 750);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.6; // Eye level

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- Lighting ---
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(3, 10, 10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);

// --- Environment ---
// Floor
const floorGeometry = new THREE.PlaneGeometry(2000, 2000);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Obstacles
for (let i = 0; i < 10; i++) {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.5 });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.x = (Math.random() - 0.5) * 150;
    wall.position.z = (Math.random() - 0.5) * 150;
    wall.position.y = 5;
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
}

// Grid helper
const gridHelper = new THREE.GridHelper(2000, 100);
scene.add(gridHelper);

// --- Controls & Movement ---
// --- Controls & Movement ---
const controls = new PointerLockControls(camera, document.body);

const instructions = document.getElementById('instructions');

console.log("Game script loaded. Waiting for click.");

instructions.addEventListener('click', () => {
    console.log("Instructions clicked. Attempting to lock controls.");
    controls.lock();
});

controls.addEventListener('lock', () => {
    console.log("Controls locked.");
    instructions.style.display = 'none';
});

controls.addEventListener('unlock', () => {
    console.log("Controls unlocked.");
    instructions.style.display = 'block';
});

// Movement State
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Keyboard Listeners
const onKeyDown = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            if (canJump === true) velocity.y += 350;
            canJump = false;
            break;
    }
};

const onKeyUp = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// --- Game Logic ---
const targets = [];
let score = 0;
const scoreElement = document.getElementById('score');
const ammoElement = document.getElementById('ammo');

function updateScore() {
    score += 10;
    scoreElement.innerText = `Score: ${score}`;
}

function createTarget() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const target = new THREE.Mesh(geometry, material);

    // Random position
    target.position.x = (Math.random() - 0.5) * 100;
    target.position.z = (Math.random() - 0.5) * 100;
    target.position.y = 1 + Math.random() * 5; // Above floor

    scene.add(target);
    targets.push(target);
}

// Create initial targets
for (let i = 0; i < 20; i++) {
    createTarget();
}

// Shooting
const raycaster = new THREE.Raycaster();
const shootSound = new Audio(); // Placeholder for sound if needed

function shoot() {
    raycaster.setFromCamera(new THREE.Vector2(), camera);
    const intersects = raycaster.intersectObjects(targets);

    if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        scene.remove(hitObject);
        targets.splice(targets.indexOf(hitObject), 1);
        updateScore();

        // Respawn a new target
        createTarget();
    }

    // Visual effect (simple line)
    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const points = [];
    points.push(controls.getObject().position.clone().add(new THREE.Vector3(0, -0.5, 0))); // Slightly below camera

    // End point
    let endPoint;
    if (intersects.length > 0) {
        endPoint = intersects[0].point;
    } else {
        endPoint = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(100));
    }
    points.push(endPoint);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Remove line after a short time
    setTimeout(() => {
        scene.remove(line);
        geometry.dispose();
        material.dispose();
    }, 100);
}

document.addEventListener('mousedown', (event) => {
    if (controls.isLocked && event.button === 0) { // Left click
        shoot();
    }
});

// --- Game Loop ---
let prevTime = performance.now();

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta); // new behavior

        if (controls.getObject().position.y < 1.6) {
            velocity.y = 0;
            controls.getObject().position.y = 1.6;
            canJump = true;
        }
    }

    // Animate targets (optional simple rotation)
    targets.forEach(target => {
        target.rotation.x += 0.01;
        target.rotation.y += 0.01;
    });

    prevTime = time;

    renderer.render(scene, camera);
}

// --- Resize Handler ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
