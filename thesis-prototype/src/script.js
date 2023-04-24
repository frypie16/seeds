import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'
import * as data from '../diagnosis_stories.json'

// Debug
const gui = new dat.GUI() 

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

// Skin Model
const skinModel = new THREE.Group();
scene.add(skinModel);

const gltfLoader = new GLTFLoader();
gltfLoader.load('/skincell/scene.gltf', (gltfScene) => {
    var mesh = gltfScene.scene;

    // Enclosing model in a box and centering
    var box = new THREE.Box3().setFromObject( mesh );
    box.center( mesh.position ); // this re-sets the mesh position
    mesh.position.multiplyScalar( - 1 );

    skinModel.add(mesh);
});

// Melanocyte? Model
const secondaryModel = new THREE.Group();
secondaryModel.visible = false;
secondaryModel.position.set(-5, 0, 0)
scene.add(secondaryModel);

const gltfLoader2 = new GLTFLoader();
gltfLoader2.load('/golgiapparatus/scene.gltf', (gltfScene) => {
    var mesh = gltfScene.scene;
    var box = new THREE.Box3().setFromObject( mesh );
    box.center( mesh.position ); // this re-sets the mesh position
    mesh.position.multiplyScalar( - 1 );

    secondaryModel.add(mesh);
    
    // Loop through JSON data
    data.contributors.forEach(contributor => {
        // Check if sphere already exists for contributor
        const sphereExists = scene.getObjectByName(`sphere-${contributor.contributorId}`)

        // If sphere doesn't exist
        if (!sphereExists) {
            // Create sphere
            const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 16);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFC0CB });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphereMesh.position.x = THREE.MathUtils.randFloat(box.min.x, box.max.x);
            sphereMesh.position.y = THREE.MathUtils.randFloat(box.min.y, box.max.y);
            sphereMesh.position.z = THREE.MathUtils.randFloat(box.min.z, box.max.z);
            sphereMesh.name = `sphere-${contributor.contributorId}`;

            // Store spheres within secondaryModel group
            secondaryModel.add(sphereMesh);
        }
    });
});

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 50;
camera.position.y = 0
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true

controls.maxDistance = 50;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()


const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Add spheres for contributors
   
    
    // Update Orbital Controls
    controls.update()
    if (controls.target.distanceTo(skinModel.position) === 0) {
        // Rotate Skin Model
        skinModel.rotation.y = .05 * elapsedTime
    
        // Switch visibility and target depending on distance from camera
        const distance = camera.position.distanceTo(skinModel.position)
        if (distance < 5) {
            skinModel.visible = false;
            secondaryModel.visible = true;
            controls.target.copy(secondaryModel.position);
        }
        
    } else if (controls.target.distanceTo(secondaryModel.position) === 0) {
        const distance = camera.position.distanceTo(secondaryModel.position)
        if (distance > 5) {
            skinModel.visible = true;
            secondaryModel.visible = false;
            controls.target.copy(skinModel.position);
        }
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    
}

tick()