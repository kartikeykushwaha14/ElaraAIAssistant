// Setup Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Space background (black)

// Load space background texture (Optional: Nebula or galaxy effect)
const loader = new THREE.TextureLoader();
const spaceTexture = loader.load('assets/textures/space_background.jpg'); // Add your space background texture path here
scene.background = spaceTexture;

// Add stars using a particle system for a starry background
const starGeometry = new THREE.BufferGeometry();
const starCount = 10000; // Number of stars
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 1000; // X position
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000; // Y position
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000; // Z position
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create a nebula effect with a texture
const nebulaTexture = loader.load('assets/textures/nebula_texture.jpg'); // Add your nebula texture path
const nebulaGeometry = new THREE.SphereGeometry(500, 32, 32); // Large sphere for nebula
const nebulaMaterial = new THREE.MeshStandardMaterial({
    map: nebulaTexture,
    transparent: true,
    opacity: 0.1, // Adjust opacity for better visibility
    emissive: 0xaaaaaa, // Add some glow effect
    emissiveIntensity: 0.1, // Intensity of the glow
    side: THREE.DoubleSide // Ensure the nebula is visible from both sides
});
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Jupiter Model (Position Jupiter at the top-right corner, make it large)
const jupiterTexture = new THREE.TextureLoader().load('assets/textures/jupiter_texture.jpg');
const jupiterGeometry = new THREE.SphereGeometry(3, 32, 32); // Make Jupiter big
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.position.set(10, 5, 6); // Position it at the top-right corner (adjusted)
scene.add(jupiter);

// Moon Model (Position it at the center of the screen)
const moonTexture = new THREE.TextureLoader().load('assets/textures/moon_texture.jpg');
const moonGeometry = new THREE.SphereGeometry(3, 30, 30); // Smaller moon
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Set Moon at the center of the screen
moon.position.set(0, 0, 0); // Position it at the center

// Gradient waves behind the moon
const waveGeometry = new THREE.SphereGeometry(3.5, 64, 64); // Slightly larger than the moon
const waveMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vPosition;
        uniform float time;
        void main() {
            float intensity = sin(length(vPosition) * 10.0 - time * 5.0) * 0.5 + 0.5;
            vec3 color = mix(vec3(0.5, 0.2, 1.0), vec3(1.0, 0.7, 0.3), intensity);
            gl_FragColor = vec4(color, 0.5); // Adjust alpha for transparency
        }
    `,
    transparent: true,
    uniforms: {
        time: { value: 0.0 },
    },
});
const waveSphere = new THREE.Mesh(waveGeometry, waveMaterial);

// Position the wave sphere behind the moon
waveSphere.position.set(0, 0, -1); // Move it slightly behind the moon in the z-axis
scene.add(waveSphere);

// Lights (ambient and point light)
const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.3); // Dim ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Spotlight for additional realism
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(15, 10, 15);
spotLight.angle = Math.PI / 4;
scene.add(spotLight);

// Add a second, distant light for more space realism
const distantLight = new THREE.PointLight(0x00ffff, 0.5); // A light with a blue hue
distantLight.position.set(100, 100, 100);
scene.add(distantLight);

// Create cosmic dust using a particle system
const dustGeometry = new THREE.BufferGeometry();
const dustCount = 5000; // Number of dust particles
const dustPositions = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 2000; // X position
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000; // Y position
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // Z position
}

dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

const dustMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 1, opacity: 0.1, transparent: true });
const dust = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dust);

// Animation
function animate() {
    requestAnimationFrame(animate);

    waveMaterial.uniforms.time.value += 0.01; // Adjust speed of wave animation

    // Rotate Jupiter
    jupiter.rotation.y += 0.002; // Rotate Jupiter slowly around its axis
    jupiter.rotation.x += 0.001; // Slight rotation along the X axis to show half of Jupiter

    // Rotate the moon around its own axis
    moon.rotation.y += 0.001; // Rotate the moon slowly

    // Make stars move slightly for a parallax effect
    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0001;

    // Make the dust particles float and move randomly
    dust.rotation.x += 0.00005;
    dust.rotation.y += 0.00005;

    // Rotate nebula for a dynamic space effect
    nebula.rotation.y += 0.0002;

    renderer.render(scene, camera);
}

animate();

// Function to send a message to the backend (adjust accordingly)
async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) {
        alert("Please enter a message.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: userInput }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        // Trigger wave interaction
         interactWithWaves();
        // Handle the response here (display Elara's message)
    } catch (error) {
        console.error('Error communicating with Elara:', error);
        alert('Failed to communicate with Elara.');
    }
}

function interactWithWaves() {
    // Temporarily scale the waves
    gsap.to(waveSphere.scale, {
        x: 1.2, y: 1.2, z: 0, // Scale up
        duration: 0.3,
        yoyo: true, // Return to original size
        repeat: 1, // Repeat once for pulsing effect
        ease: "power2.out",
    });

    // Temporarily change the wave color
    waveMaterial.uniforms.time.value += 5; // Quick burst effect
}


// Function to handle voice input
function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function (event) {
        const speech = event.results[0][0].transcript;
        document.getElementById('user-input').value = speech;
        sendMessage();
    };

    recognition.onerror = function (event) {
        console.error('Error occurred in speech recognition: ', event.error);
    };
}

// Emotion Detection Placeholder
function changeMoonBehavior(emotion) {
    if (emotion === 'happy') {
        moon.material.color.setHex(0xffff00); // Yellow glow
    } else if (emotion === 'sad') {
        moon.material.color.setHex(0x555555); // Dim gray
    } else {
        moon.material.color.setHex(0xffffff); // Default
    }
}

// Simulate Emotion Input
document.getElementById('user-input').addEventListener('input', (e) => {
    const text = e.target.value.toLowerCase();
    if (text.includes('happy')) changeMoonBehavior('happy');
    else if (text.includes('sad')) changeMoonBehavior('sad');
    else changeMoonBehavior('neutral');
});
