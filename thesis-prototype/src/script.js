import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'
import * as data from '../diagnosis_stories.json'

// Debug
// const gui = new dat.GUI() 

// Canvas
var canvas = document.querySelector('canvas.webgl')
let textBox = document.getElementById('box')

// UI Elements
/*
document.addEventListener("DOMContentLoaded", function() {
    const title = document.getElementById("title");
    const text = "SEEDS";
    let index = 0;
  
    function displayText() {
      if (index < text.length) {
        title.innerHTML += text.charAt(index);
        index++;
        setTimeout(displayText, 200); // Adjust the delay between letters here
      } else {
        setTimeout(() => {
          title.classList.add("fade-out");
          loadElements(); // Load the additional HTML elements
        }, 1000); // Adjust the delay before fading out here
      }
    }
  
    // Delay before animation starts
    setTimeout(displayText, 1000); // Adjust the delay before the first letter appears here
  
    function loadElements() {
      const header = document.createElement("header");
      header.innerHTML = `
        <button id="menu-button">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <button id="conceptButton">CONCEPT</button>
      `;
      document.body.appendChild(header);
  
      const canvas = document.createElement("canvas");
      canvas.classList.add("webgl");
      document.body.appendChild(canvas);
  
      const homeButton = document.createElement("div");
      homeButton.id = "home-button";
      homeButton.innerText = "⌂";
      document.body.appendChild(homeButton);
  
      const menu = document.createElement("div");
      menu.id = "menu";
      menu.innerHTML = `
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">The Data</a></li>
          <li><a href="#">Contribute</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      `;
      document.body.appendChild(menu);
  
      const overlay = document.createElement("div");
      overlay.id = "overlay";
      overlay.innerHTML = `
        <div id="overlayContent">
          <button id="closeButton">x</button>
          <p>Step into the enchanting greenhouse of "Seeds." 
            Uncover the hidden stories of misdiagnoses in healthcare 
            as you guide patients to nurture their silenced experiences. 
            With each tale explored, watch as plants sprout from the seeds, 
            adorning the once-bare mannequin. Together, we cultivate empathy, 
            accountability, and a more just future. Join "Seeds" and breathe 
            life into the voices that deserve to be heard.</p>
          <button id="goButton">GO →</button>
        </div>
      `;
      document.body.appendChild(overlay);
  
      const dataContainer = document.createElement("div");
      dataContainer.id = "data-container";
      dataContainer.innerHTML = `
        <div id="data-tabs">
          <div class="tab active-tab" onclick="toggleData('gender')">Gender</div>
          <div class="tab" onclick="toggleData('race')">Race</div>
        </div>
  
        <div id="gender-box" class="active">
          <div id="gender-bar-container" class="bar-container">
            <div class="column">
              <div class="bar-label">Female</div>
              <div class="bar-label">Male</div>
              <div class="bar-label">Trans-male</div>
              <div class="bar-label">Trans-female</div>
              <div class="bar-label">Gender-variant</div>
              <div class="bar-label">Prefer not to say</div>
              <div class="bar-label">Other</div>
              </div>
              <div class="column">
                <div id="gender-bar-female"></div>
                <div id="gender-bar-male"></div>
                <div id="gender-bar-trans-male"></div>
                <div id="gender-bar-trans-female"></div>
                <div id="gender-bar-variant"></div>
                <div id="gender-bar-prefer-not"></div>
                <div id="gender-bar-other"></div>
              </div>
            </div>
          </div>
    
          <div id="race-box">
            <div id="race-bar-container" class="bar-container">
              <div class="column">
                <div class="bar-label">South Asian</div>
                <div class="bar-label">White</div>
              </div>
              <div class="column">
                <div id="race-bar-south-asian"></div>
                <div id="race-bar-white"></div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(dataContainer);
    
        const box = document.createElement("div");
        box.id = "box";
        box.style.display = "none";
        document.body.appendChild(box);
      }
    });
*/

document.addEventListener("DOMContentLoaded", function () {
  const background = document.getElementById("background");
  const title = document.getElementById("title");
  const canvas = document.querySelector(".webgl");
  const text = "SEEDS";
  let index = 0;

  canvas.style.opacity = "0";
  homeButton.style.opacity = "0";
  menuButton.style.opacity = "0";
  conceptButton.style.opacity = "0";

  function displayText() {
    if (index < text.length) {
      title.innerHTML += text.charAt(index);
      index++;
      setTimeout(displayText, 150); // Adjust the delay between letters here
    } else {
      setTimeout(() => {
        title.classList.add("fade-out");
        background.classList.add("fade-out");
        setTimeout(() => {
          canvas.style.opacity = "1";
          homeButton.style.opacity = "1";
          menuButton.style.opacity = "1";
          conceptButton.style.opacity = "1";
          canvas.style.animation = "fade-in 3s forwards";
        }, 1000);
      }, 1000);
    }
  }

  setTimeout(displayText, 5000);
});

var homeButton = document.getElementById("home-button");
var menuButton = document.getElementById("menu-button");
var menu = document.getElementById("menu");
var conceptButton = document.getElementById('conceptButton');
var closeButton = document.getElementById('closeButton');
var goButton = document.getElementById('goButton');
var overlay = document.getElementById('overlay');

window.onload = function () {
  homeButton.addEventListener("click", function () {
    // Reload the page to restart the website
    location.reload();
  });
};

// Function to toggle the overlay box
function toggleOverlay() {
  if (overlay.style.display === 'block') {
    overlay.style.display = 'none'; // Hide the overlay box
    canvas.classList.remove('blurred'); // Remove blur effect from canvas
  } else {
    overlay.style.display = 'block'; // Show the overlay box
    canvas.classList.add('blurred'); // Apply blur effect to canvas
  }
}

// click event listener to the button
menuButton.addEventListener("click", function () {
  if (menu.style.display === "none") {
    menu.style.display = "block"; // Show the menu
  } else {
    menu.style.display = "none"; // Hide the menu
  }
});
conceptButton.addEventListener('click', toggleOverlay);
closeButton.addEventListener('click', toggleOverlay);
goButton.addEventListener('click', toggleOverlay);
// overlayMenu.addEventListener('click', toggleMenu);

var contributors = data.contributors;
var totalContributors = contributors.length;

//Gender calculations
var femaleCount = contributors.filter(function (contributor) {
  return contributor.gender === "Female";
}).length;

var maleCount = contributors.filter(function (contributor) {
  return contributor.gender === "Male";
}).length;

var transMaleCount = contributors.filter(function (contributor) {
  return contributor.gender === "Trans-male";
}).length;

var transFemaleCount = contributors.filter(function (contributor) {
  return contributor.gender === "Trans-female";
}).length;

var variantCount = contributors.filter(function (contributor) {
  return contributor.gender === "Gender-variant / non-conforming";
}).length;

var preferNotCount = contributors.filter(function (contributor) {
  return contributor.gender === "Prefer not to say";
}).length;

var otherCount = contributors.filter(function (contributor) {
  return contributor.gender !== "Female" && contributor.gender !== "Male" && contributor.gender !== "Trans-male" && contributor.gender !== "Trans-female" && contributor.gender !== "Gender-variant / non-conforming" && contributor.gender !== "Prefer not to say";
}).length;

var femalePercentage = (femaleCount / totalContributors) * 100;
var malePercentage = (maleCount / totalContributors) * 100;
var transMalePercentage = (transMaleCount / totalContributors) * 100;
var transFemalePercentage = (transFemaleCount / totalContributors) * 100;
var variantPercentage = (variantCount / totalContributors) * 100;
var preferNotPercentage = (preferNotCount / totalContributors) * 100;
var otherPercentage = (otherCount / totalContributors) * 100;

var genderBarFemale = document.getElementById("gender-bar-female");
genderBarFemale.style.width = femalePercentage + "%";

var genderBarMale = document.getElementById("gender-bar-male");
genderBarMale.style.width = malePercentage + "%";

var genderBarTransMale = document.getElementById("gender-bar-trans-male");
genderBarTransMale.style.width = transMalePercentage + "%";

var genderBarTransFemale = document.getElementById("gender-bar-trans-female");
genderBarTransFemale.style.width = transFemalePercentage + "%";

var genderBarVariant = document.getElementById("gender-bar-variant");
genderBarVariant.style.width = variantPercentage + "%";

var genderBarPreferNot = document.getElementById("gender-bar-prefer-not");
genderBarPreferNot.style.width = preferNotPercentage + "%";

var genderBarOther = document.getElementById("gender-bar-other");
genderBarOther.style.width = otherPercentage + "%";

//Race calculations
function updateRaceBars() {
  var southAsianCount = contributors.filter(function (contributor) {
    return contributor.race === "South Asian";
  }).length;

  var whiteCount = contributors.filter(function (contributor) {
    return contributor.race === "White";
  }).length;

  var southAsianPercentage = (southAsianCount / totalContributors) * 100;
  var whitePercentage = (whiteCount / totalContributors) * 100;

  var raceBarSouthAsian = document.getElementById("race-bar-south-asian");
  raceBarSouthAsian.style.width = southAsianPercentage + "%";

  var raceBarWhite = document.getElementById("race-bar-white");
  raceBarWhite.style.width = whitePercentage + "%";
}

function toggleData(dataType) {
  var genderBox = document.getElementById("gender-box");
  var raceBox = document.getElementById("race-box");
  var genderTab = document.getElementsByClassName("tab")[0];
  var raceTab = document.getElementsByClassName("tab")[1];

  if (dataType === "gender") {
    genderBox.classList.add("active");
    raceBox.classList.remove("active");
    genderTab.classList.add("active-tab");
    raceTab.classList.remove("active-tab");
  } else if (dataType === "race") {
    genderBox.classList.remove("active");
    raceBox.classList.add("active");
    genderTab.classList.remove("active-tab");
    raceTab.classList.add("active-tab");

    // Update race bars
    updateRaceBars();
  }
}

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
  var box = new THREE.Box3().setFromObject(mesh);
  box.center(mesh.position); // this re-sets the mesh position
  mesh.position.multiplyScalar(- 1);

  mesh.position.y = -1.1;

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
  var box = new THREE.Box3().setFromObject(mesh);
  box.center(mesh.position); // this re-sets the mesh position
  mesh.position.multiplyScalar(- 1);

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
const lod = new THREE.LOD();
gltfLoader3.load('/testskin/scene.gltf', (gltfScene) => {
  var mesh = gltfScene.scene;
  var box = new THREE.Box3();
  box.setFromObject(mesh);
  box.center(mesh.position); // this re-sets the mesh position
  mesh.position.multiplyScalar(- 1);

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
    // Check if cell already exists for contributor
    const cellExists = scene.getObjectByName(`cell-${contributor.contributorId}`)

    // If cell doesn't exist
    if (!cellExists) {
      // Load skin cell
      // gltfLoader.load('/skincell/scene.gltf', (gltfScene) => {

      //     // Get the mesh from the GLTF scene
      //     const meshCell = gltfScene.scene;

      //     // Enclosing model in a box and centering
      //     const boxCell = new THREE.Box3().setFromObject( meshCell );
      //     boxCell.center( meshCell.position ); // this re-sets the mesh position
      //     meshCell.position.multiplyScalar( - 1 );
      //     meshCell.scale.set(0.02, 0.02, 0.02);

      //     // Set the name and data properties
      //     meshCell.name = `cell-${contributor.contributorId}`;
      //     meshCell.data = data.contributors[contributor.contributorId - 1]

      //     // Create the low-quality model
      //     const lowQualityLoader = new THREE.GLTFLoader();
      //     lowQualityLoader.load('/cell/compscene.gltf', (lowQualityGltfScene) => {

      //       // Get the mesh from the low-quality GLTF scene
      //       const lowQualityMeshCell = lowQualityGltfScene.scene.children[0];

      //       // Set the position, scale, and name properties
      //       lowQualityMeshCell.position.copy(meshCell.position);
      //       lowQualityMeshCell.scale.copy(meshCell.scale);
      //       lowQualityMeshCell.name = meshCell.name;

      //       // Add the high-quality model to the LOD object
      //       lod.addLevel(meshCell, 0);

      //       // Add the low-quality model to the LOD object
      //       lod.addLevel(lowQualityMeshCell, 500); // Show low-quality model when the camera is 500 units away

      //       // Set the random position
      //       meshCell.position.x = THREE.MathUtils.randFloat(box.min.x, box.max.x);
      //       meshCell.position.y = THREE.MathUtils.randFloat(box.min.y /20 -1.45, box.max.y /20 -1.45);
      //       meshCell.position.z = THREE.MathUtils.randFloat(box.min.z, box.max.z);

      //       // Set the fixed position properties
      //       meshCell.fixedX = meshCell.position.x.valueOf()
      //       meshCell.fixedY = meshCell.position.y.valueOf()
      //       meshCell.fixedZ = meshCell.position.z.valueOf()

      //       // Add the LOD object to the secondaryModel
      //       secondaryModel.add(lod);
      //     });
      //   });
      gltfLoader.load('/cellskin/scene.gltf', (gltfScene) => {
        var meshCell = gltfScene.scene;

        // Enclosing model in a box and centering
        // var boxCell = new THREE.Box3().setFromObject( meshCell );
        // boxCell.center( meshCell.position ); // this re-sets the mesh position
        // meshCell.position.multiplyScalar( - 1 );
        meshCell.scale.set(0.02, 0.02, 0.02);

        meshCell.name = `cell-${contributor.contributorId}`;
        meshCell.data = data.contributors[contributor.contributorId - 1]
        meshCell.position.x = THREE.MathUtils.randFloat(box.min.x, box.max.x);
        meshCell.position.y = THREE.MathUtils.randFloat(box.min.y / 20 - 1.45, box.max.y / 20 - 1.45);
        meshCell.position.z = THREE.MathUtils.randFloat(box.min.z, box.max.z);
        meshCell.fixedX = meshCell.position.x.valueOf()
        meshCell.fixedY = meshCell.position.y.valueOf()
        meshCell.fixedZ = meshCell.position.z.valueOf()

        // meshCell.userData = { hover: false };

        // meshCell.addEventListener('mouseover', function(event) {
        //     textBox.textContent = JSON.stringify(meshCell.data); // Show JSON data in the textBox
        //     textBox.style.display = 'block';
        //     meshCell.userData.hover = true;
        // });

        // meshCell.addEventListener('mouseout', function(event) {
        //     textBox.style.display = 'none'; // Hide the textBox
        //     meshCell.userData.hover = false;
        // });

        secondaryModel.add(meshCell);
      })

      // Create sphere

      // const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 16);
      // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFC0CB });
      // var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // sphereMesh.position.x = THREE.MathUtils.randFloat(box.min.x, box.max.x);
      // sphereMesh.position.y = THREE.MathUtils.randFloat(box.min.y, box.max.y);
      // sphereMesh.position.z = THREE.MathUtils.randFloat(box.min.z, box.max.z);
      // sphereMesh.name = `sphere-${contributor.contributorId}`;
      // sphereMesh.data = data.contributors[contributor.contributorId - 1]
      // sphereMesh.fixedX = sphereMesh.position.x.valueOf()
      // sphereMesh.fixedY = sphereMesh.position.y.valueOf()
      // sphereMesh.fixedZ = sphereMesh.position.z.valueOf()


      // Store spheres within secondaryModel group
      // secondaryModel.add(sphereMesh);

      // mesh.position.multiplyScalar( - 1 );
    }
  });
});

// const gltfLoader4 = new GLTFLoader();
// gltfLoader4.load('/plant/scene.gltf', (gltfScene) => {
//     var mesh = gltfScene.scene;
//     var box = new THREE.Box3().setFromObject( mesh );
//     box.center( mesh.position ); // this re-sets the mesh position
//     mesh.position.multiplyScalar( - 1 );

//     // mesh.rotateY(-Math.PI / 2);
//     // mesh.position.x = 44;

//     // secondaryModel.add(mesh);
// });


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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// const ambientLightGeometry = new THREE.SphereGeometry( 0.3 );
// const ambientLightMaterial = new THREE.MeshBasicMaterial( { color: 0xFF8440 } ); //orange
// const ambientLightMesh = new THREE.Mesh( ambientLightGeometry, ambientLightMaterial );
// scene.add( ambientLightMesh ); // don't position ambient light mesh

// create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(-4, 10, -2);
scene.add(directionalLight);

// const directionalLightGeometry = new THREE.SphereGeometry( 0.2 );
// const directionalLightMaterial = new THREE.MeshBasicMaterial( { color: 0x02D46E } ); //green
// const directionalLightMesh = new THREE.Mesh( directionalLightGeometry, directionalLightMaterial );
// directionalLightMesh.position.copy( directionalLight.position );
// scene.add( directionalLightMesh );

// sky color ground color intensity 
const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
scene.add(hemiLight);

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

window.addEventListener('resize', () => {
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

// Audio
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/audio/birds.mp3', function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true); //set the sound to loop
  sound.setVolume(1); //set the volume (0 to 1)
  sound.play();
});


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

let selectedCell = null;

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;



  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const cells = secondaryModel.children.filter(child => child.name.includes('cell'));
  const intersects = raycaster.intersectObjects(cells, true);

  // if there are intersections
  if (intersects.length > 0 && isViewingGolgi) {
    // get the first intersection
    const intersection = intersects[0];
    // get the selected sphere
    selectedCell = intersection.object.parent;
    //textBox.innerHTML = `Race: ${intersectedObject.data.race} <br> Gender: ${intersectedObject.data.gender} <br> Age: ${intersectedObject.data.age} <br> Location: ${intersectedObject.data.location} <br> Story: ${intersectedObject.data.story}`;

    // set the sphere's position to a jittered position

    console.log(selectedCell.position)
  } else {
    // reset the selected sphere
    selectedCell = null;
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
  textBox.style.top = `${event.clientY- textBox.offsetHeight/2}px`;
});

// Make box appear if intersectedObject
function toggleBoxVisibility() {
  if (intersectedObject && isViewingGolgi) {
    textBox.style.display = 'block'
  } else {
    textBox.style.display = 'none'
  }
}

function toggleBoxVisOnHover(intersect = false) {
  if (intersect && isViewingGolgi) {
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

const tick = () => {

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

  if (selectedCell != undefined) {
    selectedCell.position.x = getRandomArbitrary(selectedCell.fixedX - 0.01, selectedCell.fixedX + 0.01)
    if (selectedCell.position.y > -0.83) {
      selectedCell.position.y = getRandomArbitrary(-0.82, -0.84)
    } else {
      selectedCell.position.y = selectedCell.position.y + .01
    }
    selectedCell.position.z = getRandomArbitrary(selectedCell.fixedZ - 0.01, selectedCell.fixedZ + 0.01)
    textBox.innerHTML = `Race: ${selectedCell.data.race} <br> Gender: ${selectedCell.data.gender} <br> Age: ${selectedCell.data.age} <br> Location: ${selectedCell.data.location} <br> Story: ${selectedCell.data.story}`;
    textBox.style.display = 'block'
  } else {
    textBox.style.display = 'none'
  }

  // Update raycaster based on the current mouse position and camera

  //const cells = secondaryModel.children.filter(child => child.name.includes('cell'));
  //const intersects = raycaster.intersectObjects( cells);
  //raycaster.setFromCamera(mouse, camera);

  // Find all objects that intersect with ray created by mouse and camera positions
  //const intersects = raycaster.intersectObjects(secondaryModel.children);

  // If any objects intersect with the raycaster
  /*
  if (intersects.length > 0) {
      console.log('round 2')
      console.log(intersects)

      // intersectedObject variable keeps track of last object that was intersected
      // If current intersected object is different from the previous one
      //if (intersectedObject != intersects[0].object) {
          // if (intersectedObject) {
          //     // Color of previous intersected object set back to its default value
          //     intersectedObject.material.color.set(0xFFC0CB);

          //     //camera.lookAt(intersectedObject.position);
              
          // }

          // Update intersectedObject to the new intersected object
          if (intersects[0].object.parent.data != undefined) {
              intersectedObject = intersects[0].object.parent;
              // intersectedObject.material.color.set(0x00FFFF); // Color changed to highlight it
              console.log(JSON.stringify(intersectedObject.data))

              // Convert the JSON object to string and set contents of the div to the JSON string
              textBox.innerHTML = `Race: ${intersectedObject.data.race} <br> Gender: ${intersectedObject.data.gender} <br> Age: ${intersectedObject.data.age} <br> Location: ${intersectedObject.data.location} <br> Story: ${intersectedObject.data.story}`;

              // Loop through all children of secondaryModel object
              
              secondaryModel.children.forEach((child) => {
                  if (child.position.distanceTo(intersectedObject.position) === 0 && !child.name.includes('cell')) {
                          child.visible = true
                  
                  }
              })
          }
      //}
      
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
      //clickedSphere = false
      selectedChild = undefined
      intersectedObject = null;
  }*/

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