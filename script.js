let scene, camera, renderer, mixer;

function initThreeJS(containerId) {
  // Create a new Three.js scene for each container
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio set to 1 (square containers)
  
  // Create WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(300, 300); // Adjust size for each container
  document.getElementById(containerId).appendChild(renderer.domElement);
  
  // Add lights to the scene
  const light = new THREE.AmbientLight(0x404040); // Ambient light
  scene.add(light);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // Position the camera
  camera.position.z = 5;
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(0.01); // Update animation mixer if animations exist
    renderer.render(scene, camera);
  }
  animate();
}

// Function to load a yoga pose 3D model
function loadYogaPose(poseId) {
  const containerId = `pose-${poseId}`;
  
  // Prevent loading the model if it's already loaded in the container
  if (!document.getElementById(containerId).childElementCount) {
    initThreeJS(containerId); // Initialize Three.js for this container
    
    // Load the 3D model for the selected yoga pose
    const loader = new THREE.GLTFLoader();
    const modelPath = `path/to/yoga-pose-${poseId}.glb`; // Update with actual model paths
    
    loader.load(modelPath, function (gltf) {
      const model = gltf.scene;
      scene.add(model); // Add model to the scene
      
      // If the model contains animations, set up the animation mixer
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }
    }, undefined, function (error) {
      console.error('Error loading the model:', error);
    });
  }
}

// Optional: Resize the renderer if the window size changes
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
