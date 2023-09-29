import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { degreesToRadians, mix } from "popmotion";
import * as THREE from 'three';
import Head from 'next/head';
import { RGBELoader } from "@/components/RGBELoader";

const color = "";

// A single icosahedron
const Icosahedron = ({ rotationSpeed = -0.25 }) => {
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            const time = state.clock.elapsedTime;
            ref.current.rotation.y = time * rotationSpeed;  // Adjust the rotation speed as needed
        }
    });

    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[2, 1]} />
            <meshBasicMaterial wireframe color={color} />
        </mesh>
    );
};

// A single star
const Star = ({ initialPosition, randomRadius, speed }) => {
    const ref = useRef();
    const time = useRef(0);  // Using useRef to persist state across renders

    // Calculate initial angle
    const initialAngle = Math.atan2(initialPosition.z, initialPosition.x);


    useFrame((state, delta) => {
        if (ref.current) {
            const radius = initialPosition.length();
            const adjustedSpeed = speed;
            time.current += delta * adjustedSpeed;
            const angle = time.current + initialAngle;
            const y = initialPosition.y;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            ref.current.position.set(x, y, z);
        }
    });

    return (
        <mesh ref={ref} position={initialPosition}>
            <octahedronGeometry args={[randomRadius, 0]} />
            <meshBasicMaterial wireframe color={color} />
        </mesh>
    );
};

// A single planet
const Planet = ({ initialPosition, speed, planetColor }) => {
    const ref = useRef();
    const time = useRef(0);  // Using useRef to persist state across renders

    // Calculate initial angle
    const initialAngle = Math.atan2(initialPosition.z, initialPosition.x);

    useFrame((state, delta) => {
        if (ref.current) {
            const radius = initialPosition.length();
            const adjustedSpeed = speed;
            time.current += delta * adjustedSpeed;
            const angle = time.current + initialAngle;
            const y = initialPosition.y;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            ref.current.position.set(x, y, z);
        }
    });

    const handleOnClick = () => {
        // Handle the click event here
        event.stopPropagation();
        console.log("Planet clicked!");
    };

    return (
        <mesh ref={ref} position={initialPosition} onClick={handleOnClick}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color={planetColor} />
        </mesh>
    );
};


// The scene
const Scene = ({ starAmount }) => {
    const { camera } = useThree();
    const [scrollProgress, setScrollProgress] = useState(0);

    /*
    // Load the HDRI texture
    const { scene } = useThree();
    useEffect(() => {
        new RGBELoader().load("/images/HDRI/hdr.hdr", function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            console.log("Texture loaded", texture);
            scene.background = texture;
            scene.environment = texture;
        });
    }, [scene]);
    */

    // Keep track of the initial stars positions and speeds
    const starInputValues = {
        speedMin: 0.25, speedMax: 1,
        radiusMin: 0.02, radiusMax: 0.07,
        distanceMin: 4, distanceMax: 10,
        angleYMin: 80, angleYMax: 100
    };

    const [starsData, setStarsData] = useState([]);
    useEffect(() => {
        const newStarsData = [];
        // create stars orbiting the center
        for (let i = 0; i < starAmount; i++) {
            const distance = mix(starInputValues.distanceMin, starInputValues.distanceMax, Math.random());

            const yAngle = mix(
                degreesToRadians(starInputValues.angleYMin),
                degreesToRadians(starInputValues.angleYMax),
                Math.random()
            );
            const xAngle = degreesToRadians(360) * Math.random();
            const position = new THREE.Vector3().setFromSphericalCoords(distance, yAngle, xAngle);

            const speed = mix(starInputValues.speedMin, starInputValues.speedMax, Math.random());
            const randomRadius = mix(starInputValues.radiusMin, starInputValues.radiusMax, Math.random());
            newStarsData.push({ position: position.clone(), randomRadius, speed });
        }

        // create stationary stars far away in a circle around the center for background effect
        for (let i = 0; i < 500; i++) {
            const distance = mix(50, 500, Math.random());
            const yAngle = mix(
                degreesToRadians(60),
                degreesToRadians(180),
                Math.random()
            );
            const xAngle = degreesToRadians(360) * Math.random();
            const position = new THREE.Vector3().setFromSphericalCoords(distance, yAngle, xAngle);
            const speed = mix(0.025, 0.05, Math.random());
            const randomRadius = mix(starInputValues.radiusMin, starInputValues.radiusMax, Math.random());
            newStarsData.push({ position: position.clone(), randomRadius, speed });
        }

        setStarsData(newStarsData);
    }, []);

    // Update the stars
    const [stars, setStars] = useState([]);
    useEffect(() => {
        setStars(starsData.map((starData, i) => (
            <Star key={i} initialPosition={starData.position} randomRadius={starData.randomRadius} speed={starData.speed} />
        )));
    }, [starsData]);

    // User-Controlled Scroll
    useEffect(() => {
        const onScroll = () => {
            let scrollY = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const newProgress = (scrollY / documentHeight) % 1; // Use modulo to keep progress within [0, 1)
            setScrollProgress(newProgress);

            // If the user reaches the bottom, reset the scroll position to the top
            if (scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
                window.scrollTo(0, 1); // Scroll a little bit to avoid bouncing back to the bottom
            }

            // If the user scrolls to the top, reset the scroll position to the bottom
            if (scrollY <= 0) {
                window.scrollTo(0, documentHeight - 1); // Scroll a little bit to avoid bouncing back to the top
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Update the camera position based on scroll progress
    useFrame(() => {
        const distance = 30; // Keeping distance constant

        // During user-controlled scroll, interpolate the angle on the Y-axis for rotation
        const angleY = degreesToRadians(360 * 10) * scrollProgress;
        camera.position.setFromSphericalCoords(distance, degreesToRadians(80), angleY);

        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);
    });

    // Planet position
    const planetPosition = new THREE.Vector3().setFromSphericalCoords(20, degreesToRadians(90), degreesToRadians(0));
    const planetPosition2 = new THREE.Vector3().setFromSphericalCoords(20, degreesToRadians(90), degreesToRadians(180));

    // Return the scene
    return (
        <>
            <ambientLight />
            <Icosahedron rotationSpeed={-0.25} />
            <Planet initialPosition={planetPosition} speed={0.1} planetColor={"blue"} />
            <Planet initialPosition={planetPosition2} speed={0.1} planetColor={"red"} />
            {stars}
        </>
    );
};

// export projects page
const projects = () => {
    const containerRef = useRef();

    // useEffect hook to set the scroll position to the middle when the component is mounted
    useEffect(() => {
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, documentHeight / 2);
    }, []);

    return (
        <>
            <Head>
                <title>Lukas Thrane | Projects Page</title>
                <meta name='description' content='any description' />
            </Head>

            <Canvas style={{ position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 1, backgroundColor: "#000000" }}>
                <Scene starAmount={200} />
            </Canvas>

            <main ref={containerRef} style={{ pointerEvents: 'none' }} className='w-full h-[10000vh] bg-transparent'>
            </main>
        </>
    );
};



export default projects;

