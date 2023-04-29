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
const box = document.getElementById('box')

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
    var box = new THREE.Box3();
    box.setFromObject( mesh );
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
            var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphereMesh.position.x = THREE.MathUtils.randFloat(box.min.x, box.max.x);
            sphereMesh.position.y = THREE.MathUtils.randFloat(box.min.y, box.max.y);
            sphereMesh.position.z = THREE.MathUtils.randFloat(box.min.z, box.max.z);
            sphereMesh.name = `sphere-${contributor.contributorId}`;

            // Create textbox mesh
            const textboxGeometry = new THREE.PlaneGeometry(2, 1);
            const textboxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            const textboxMesh = new THREE.Mesh(textboxGeometry, textboxMaterial);
            textboxMesh.position.copy(sphereMesh.position);
            textboxMesh.visible = false; // Start with textbox hidden

            // Store spheres within secondaryModel group
            secondaryModel.add(sphereMesh);
            // secondaryModel.add(textboxMesh);
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

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

var intersectedObject = null;

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

var clickedSphere = false
function onMouseClick(event) {
    if (intersectedObject) {
        console.log(intersectedObject.position);
        clickedSphere = true;
        renderer.render(scene, camera)
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

window.addEventListener("resize", onWindowResize, false);

// Set box position to be mouse position
document.addEventListener('mousemove', (event) => {
    box.style.left = `${event.clientX}px`;
    box.style.top = `${event.clientY}px`;
  });

// Make box appear if intersectedObject
function toggleBoxVisibility() {
    if (intersectedObject) {
      box.style.display = 'block'
    } else {
      box.style.display = 'none'
    }
  }

// Loop through each contributor object and check the value of the gender property
for (let i = 0; i < data.contributors.length; i++) {
    const contributor = data.contributors[i];
    const gender = contributor.gender;

    // Convert the JSON object to a string using JSON.stringify
    const jsonString = JSON.stringify(data.contributors[i].name, null, 2);

    // Set the contents of the div to the JSON string
    box.innerHTML = `<pre>${jsonString}</pre>`;

    // console.log(`Contributor ${i + 1} gender: ${gender}`);
}

// Convert the JSON object to a string using JSON.stringify
const jsonString = JSON.stringify(data.contributors[0].gender, null, 2);

// Set the contents of the div to the JSON string
box.innerHTML = `<pre>${jsonString}</pre>`;

const clock = new THREE.Clock()
// let cameraAnimationStartTime = null;
// const cameraAnimationDuration = 1.5; // seconds
// const cameraStartPosition = new THREE.Vector3();
// const cameraStartQuaternion = new THREE.Quaternion();
// const cameraEndPosition = new THREE.Vector3();
// const cameraEndQuaternion = new THREE.Quaternion();


var selectedChild = undefined;
const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    toggleBoxVisibility();
    
    // Update Orbital Controls
    controls.update()
    if (controls.target.distanceTo(skinModel.position) === 0) {
        // Rotate Skin Model
        skinModel.rotation.y = .05 * elapsedTime
    
        // Switch visibility and target depending on distance from camera
        const distance = camera.position.distanceTo(skinModel.position)
        if (distance < 2) {
            skinModel.visible = false;
            secondaryModel.visible = true;
            controls.target.copy(secondaryModel.position);
        }
        
    } else if (controls.target.distanceTo(secondaryModel.position) === 0) {
        const distance = camera.position.distanceTo(secondaryModel.position)
        if (distance > 7) {
            skinModel.visible = true;
            secondaryModel.visible = false;
            controls.target.copy(skinModel.position);
        }
    }

    // Update raycaster based on the current mouse position and camera
    raycaster.setFromCamera(mouse, camera);

    // Find all objects that intersect with ray created by mouse and camera positions
    const intersects = raycaster.intersectObjects(secondaryModel.children);

    // If any objects intersect with the raycaster
    if (intersects.length > 0) {
        console.log(intersects)

        // intersectedObject variable keeps track of last object that was intersected
        // If current intersected object is different from the previous one
        if (intersectedObject != intersects[0].object) {
            if (intersectedObject) {
                // Color of previous intersected object set back to its default value
                intersectedObject.material.color.set(0xFFC0CB);

                //camera.lookAt(intersectedObject.position);
                
            }

            // Update intersectedObject to the new intersected object
            intersectedObject = intersects[0].object;
            intersectedObject.material.color.set(0x00FFFF); // Color changed to highlight it

            // Loop through all children of secondaryModel object
            secondaryModel.children.forEach((child) => {
                if (child.position.distanceTo(intersectedObject.position) === 0 && !child.name.includes('sphere')) {
                    if (clickedSphere) {
                        child.visible = true
                    }
                }
            })
        }
        
    } else { // If no objects are found to intersect with the raycaster
      
        if (intersectedObject) {
            intersectedObject.material.color.set(0xFFC0CB);
            secondaryModel.children.forEach((child) => {
                if (child.position.distanceTo(intersectedObject.position) === 0 && !child.name.includes('sphere')) {
                    if (clickedSphere) {
                        child.visible = false
                    }
                }
            })
        }
        clickedSphere = false
        selectedChild = undefined
        intersectedObject = null;
    }

    // // Render
    // if (clickedSphere) {
    //     const targetPosition = intersectedObject.position.clone();

    // // Calculate camera position and rotation to look at target position
    // const currentRotation = camera.quaternion.clone();
    // camera.lookAt(targetPosition);
    // const targetRotation = camera.quaternion.clone();
    // camera.quaternion.copy(currentRotation);
    // const currentPosition = camera.position.clone();
    // const distance = camera.position.distanceTo(targetPosition);
    // const offset = new THREE.Vector3(0, 0, distance);
    // offset.applyQuaternion(camera.quaternion);
    // const targetPositionWithOffset = targetPosition.clone().add(offset);

    // // Set camera animation variables
    // cameraStartPosition.copy(currentPosition);
    // cameraStartQuaternion.copy(currentRotation);
    // cameraEndPosition.copy(targetPositionWithOffset);
    // cameraEndQuaternion.copy(targetRotation);
    // cameraAnimationStartTime = performance.now();
    
    // }
    // if (cameraAnimationStartTime !== null) {
    //     // Calculate camera position and rotation based on lerp
    //     const t = Math.min(1, (performance.now() - cameraAnimationStartTime) / (cameraAnimationDuration * 1000));
    //     camera.position.lerpVectors(cameraStartPosition, cameraEndPosition, t);
    //     camera.quaternion.slerpQuaternions(cameraStartQuaternion, cameraEndQuaternion, t);
      
    //     // If animation is complete, reset animation variables
    //     if (t === 1) {
    //       cameraAnimationStartTime = null;
    //     }
    // }
    // clickedSphere = false

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
    

    // Call tick again on the next frame
    
}

tick()