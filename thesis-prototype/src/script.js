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
let textBox = document.getElementById('box')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x7ba5b8);

// Objects

// First Scene
const skinModel = new THREE.Group();
scene.add(skinModel);

//Skin Model
const gltfLoader = new GLTFLoader();
gltfLoader.load('/mannequin/wateringMannequin.gltf', (gltfScene) => {
    var mesh = gltfScene.scene;

    // Enclosing model in a box and centering
    var box = new THREE.Box3().setFromObject( mesh );
    box.center( mesh.position ); // this re-sets the mesh position
    mesh.position.multiplyScalar( - 1 );

    const mixer = new THREE.AnimationMixer(gltfScene.scene);

    // find the animation clip you want to play
    const clip = gltfScene.animations.find(animation => animation.name === 'Watering');

    if (clip) {
        // create an animation action from the clip
        const action = mixer.clipAction(clip);

        // set the action to loop
        action.loop = THREE.LoopRepeat;

        // play the animation action
        action.play();

        // add the mesh to the scene and start the animation mixer
        skinModel.add(mesh);
        mixer.timeScale = 1; // adjust animation speed
        mixer.update(0);
    } else {
        console.log('Animation not found.');
    }

	// var action = mixer.clipAction( gltfScene.animations[ 0 ] );
	// action.play();

    // skinModel.add(mesh);
});

//Greenhouse
const gltfLoader2 = new GLTFLoader();
gltfLoader2.load('/greenhouse/scene.gltf', (gltfScene) => {
    var mesh = gltfScene.scene;
    var box = new THREE.Box3().setFromObject( mesh );
    box.center( mesh.position ); // this re-sets the mesh position
    mesh.position.multiplyScalar( - 1 );

    mesh.rotateY(-Math.PI / 2);
    // mesh.position.x = 44;

    // Depth test to load model parts correctly
    mesh.traverse((node) => {
        if (node.material) {
            node.material.depthTest = true;
            node.material.depthWrite = true;
        }
    });

    skinModel.add(mesh);
});

// Second Scene
const secondaryModel = new THREE.Group();
secondaryModel.visible = false;
secondaryModel.position.set(-5, 0, 0)
scene.add(secondaryModel);

//Skin Model
const gltfLoader3 = new GLTFLoader();
gltfLoader3.load('/skin/skinTest.gltf', (gltfScene) => {
    var mesh = gltfScene.scene;
    var box = new THREE.Box3();
    box.setFromObject( mesh );
    box.center( mesh.position ); // this re-sets the mesh position
    mesh.position.multiplyScalar( - 1 );

    // Depth test to load model parts correctly
    mesh.traverse((node) => {
        if (node.material) {
            node.material.depthTest = true;
            node.material.depthWrite = true;
        }
    });

    secondaryModel.add(mesh);

    // Loop through JSON data
    data.contributors.forEach(contributor => {
        // Check if sphere already exists for contributor
        const sphereExists = scene.getObjectByName(`sphere-${contributor.contributorId}`)
        
        // If sphere doesn't exist
        if (!sphereExists) {
            // Load skin cell
            gltfLoader.load('/cell/compscene.gltf', (gltfScene) => {
                var meshCell = gltfScene.scene;

                // Enclosing model in a box and centering
                var boxCell = new THREE.Box3().setFromObject( meshCell );
                boxCell.center( meshCell.position ); // this re-sets the mesh position
                meshCell.position.multiplyScalar( - 1 );
                meshCell.scale.set(0.02, 0.02, 0.02);

                meshCell.name = `cell-${contributor.contributorId}`;
                meshCell.data = data.contributors[contributor.contributorId - 1]
                meshCell.position.x = THREE.MathUtils.randFloat(box.min.x, box.max.x);
                meshCell.position.y = THREE.MathUtils.randFloat(box.min.y /20 -1.45, box.max.y /20 -1.45);
                meshCell.position.z = THREE.MathUtils.randFloat(box.min.z, box.max.z);
                meshCell.fixedX = meshCell.position.x.valueOf()
                meshCell.fixedY = meshCell.position.y.valueOf()
                meshCell.fixedZ = meshCell.position.z.valueOf()

                secondaryModel.add(meshCell);
            })

            // Create sphere
            /*
            const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 16);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFC0CB });
            var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphereMesh.position.x = THREE.MathUtils.randFloat(box.min.x, box.max.x);
            sphereMesh.position.y = THREE.MathUtils.randFloat(box.min.y, box.max.y);
            sphereMesh.position.z = THREE.MathUtils.randFloat(box.min.z, box.max.z);
            sphereMesh.name = `sphere-${contributor.contributorId}`;
            sphereMesh.data = data.contributors[contributor.contributorId - 1]
            sphereMesh.fixedX = sphereMesh.position.x.valueOf()
            sphereMesh.fixedY = sphereMesh.position.y.valueOf()
            sphereMesh.fixedZ = sphereMesh.position.z.valueOf()*/


            // Store spheres within secondaryModel group
            // secondaryModel.add(sphereMesh);

            // mesh.position.multiplyScalar( - 1 );
        }
    });
});

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight)

// const pointLightGeometry = new THREE.SphereGeometry( 0.2 );
// const pointLightMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } ); //white
// const pointLightMesh = new THREE.Mesh( pointLightGeometry, pointLightMaterial );
// pointLightMesh.position.copy( pointLight.position );
// scene.add( pointLightMesh );

const pointLight2 = new THREE.PointLight(0xffffff, 0.1)
pointLight2.position.x = 0;
pointLight2.position.y = 2;
pointLight2.position.z = -2;
scene.add(pointLight2)

// const pointLight2Geometry = new THREE.SphereGeometry( 0.2 );
// const pointLight2Material = new THREE.MeshBasicMaterial( { color: 0x8b0000 } ); //red
// const pointLight2Mesh = new THREE.Mesh( pointLight2Geometry, pointLight2Material );
// pointLight2Mesh.position.copy( pointLight2.position );
// scene.add( pointLight2Mesh );

// create an ambient light
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 );
scene.add( ambientLight );

// const ambientLightGeometry = new THREE.SphereGeometry( 0.3 );
// const ambientLightMaterial = new THREE.MeshBasicMaterial( { color: 0xFF8440 } ); //orange
// const ambientLightMesh = new THREE.Mesh( ambientLightGeometry, ambientLightMaterial );
// scene.add( ambientLightMesh ); // don't position ambient light mesh

// create a directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
directionalLight.position.set( -4, 10, -2 );
scene.add( directionalLight );

// const directionalLightGeometry = new THREE.SphereGeometry( 0.2 );
// const directionalLightMaterial = new THREE.MeshBasicMaterial( { color: 0x02D46E } ); //green
// const directionalLightMesh = new THREE.Mesh( directionalLightGeometry, directionalLightMaterial );
// directionalLightMesh.position.copy( directionalLight.position );
// scene.add( directionalLightMesh );

// sky color ground color intensity 
const hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ); 
scene.add( hemiLight );

// const hemiLightGeometry = new THREE.SphereGeometry( 0.2 );
// const hemiLightMaterial = new THREE.MeshBasicMaterial( { color: 0xFDE600 } ); //yellow
// const hemiLightMesh = new THREE.Mesh( hemiLightGeometry, hemiLightMaterial );
// hemiLightMesh.position.copy( hemiLight.position );
// scene.add( hemiLightMesh );

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
camera.position.x = 7;
camera.position.y = 0
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.enableZoom = true;
controls.maxDistance = 10;
controls.zoomSpeed = 0.5;

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

let selectedSphere = null;

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    

      // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  const spheres = secondaryModel.children.filter(child => child.type === 'Mesh');
  const intersects = raycaster.intersectObjects( spheres, true );

  // if there are intersections
  if (intersects.length > 0) {
    // get the first intersection
    const intersection = intersects[0];
    // get the selected sphere
    selectedSphere = intersection.object;
    // set the sphere's position to a jittered position
    selectedSphere.position.x = getRandomArbitrary(selectedSphere.fixedX - 0.01, selectedSphere.fixedX + 0.01)
    selectedSphere.position.y = getRandomArbitrary(selectedSphere.fixedY - 0.01, selectedSphere.fixedY + 0.01)
    selectedSphere.position.z = getRandomArbitrary(selectedSphere.fixedZ - 0.01, selectedSphere.fixedZ + 0.01)
    console.log(selectedSphere.position)
  } else {
    // reset the selected sphere
    selectedSphere = null;
  }
}

/*
var clickedSphere = false
function onMouseClick(event) {
    if (intersectedObject) {
        console.log(intersectedObject.position);
        clickedSphere = true;
        renderer.render(scene, camera)
    }
}*/

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('mousemove', onMouseMove, false);
//window.addEventListener('click', onMouseClick, false);

window.addEventListener("resize", onWindowResize, false);

// Set box position to be mouse position
document.addEventListener('mousemove', (event) => {
    textBox.style.left = `${event.clientX}px`;
    textBox.style.top = `${event.clientY}px`;
});

// Make box appear if intersectedObject
function toggleBoxVisibility() {
    if (intersectedObject && isViewingGolgi) {
      textBox.style.display = 'block'
    } else {
      textBox.style.display = 'none'
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

const clock = new THREE.Clock()
// let cameraAnimationStartTime = null;
// const cameraAnimationDuration = 1.5; // seconds
// const cameraStartPosition = new THREE.Vector3();
// const cameraStartQuaternion = new THREE.Quaternion();
// const cameraEndPosition = new THREE.Vector3();
// const cameraEndQuaternion = new THREE.Quaternion();


var selectedChild = undefined;
var isViewingGolgi = false;

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Call the function to make box visible and invisible depending on mouse pos
    toggleBoxVisibility();
    
    // Update Orbital Controls
    controls.update()
    if (controls.target.distanceTo(skinModel.position) === 0) {
        // Rotate Skin Model
        // skinModel.rotation.y = .05 * elapsedTime
    
        // Switch visibility and target depending on distance from camera
        const distance = camera.position.distanceTo(skinModel.position)
        if (distance < 0.3) {
            skinModel.visible = false;
            secondaryModel.visible = true;
            controls.target.copy(secondaryModel.position);
            isViewingGolgi = true;
        }
        
    } else if (controls.target.distanceTo(secondaryModel.position) === 0) {
        const distance = camera.position.distanceTo(secondaryModel.position)
        if (distance > 5.3) {
            skinModel.visible = true;
            secondaryModel.visible = false;
            controls.target.copy(skinModel.position);
            isViewingGolgi = false;
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
        //if (intersectedObject != intersects[0].object) {
            if (intersectedObject) {
                // Color of previous intersected object set back to its default value
                intersectedObject.material.color.set(0xFFC0CB);

                //camera.lookAt(intersectedObject.position);
                
            }

            // Update intersectedObject to the new intersected object
            if (intersects[0].object.data != undefined) {
                intersectedObject = intersects[0].object;
                intersectedObject.material.color.set(0x00FFFF); // Color changed to highlight it
                console.log(JSON.stringify(intersectedObject.data))

                // Convert the JSON object to string and set contents of the div to the JSON string
                textBox.innerHTML = `Race: ${intersectedObject.data.race} <br> Gender: ${intersectedObject.data.gender} <br> Age: ${intersectedObject.data.age} <br> Location: ${intersectedObject.data.location} <br> Story: ${intersectedObject.data.story}`;

                // Loop through all children of secondaryModel object
                
                secondaryModel.children.forEach((child) => {
                    if (child.position.distanceTo(intersectedObject.position) === 0 && !child.name.includes('sphere')) {
                            child.visible = true
                    
                    }
                })
            }
        //}
        
    } else { // If no objects are found to intersect with the raycaster
      
        if (intersectedObject) {
            intersectedObject.material.color.set(0xFFC0CB);
            /*
            secondaryModel.children.forEach((child) => {
                if (child.position.distanceTo(intersectedObject.position) === 0 && !child.name.includes('sphere')) {
                    if (clickedSphere) {
                        child.visible = false
                    }
                }
            })*/
        }
        //clickedSphere = false
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