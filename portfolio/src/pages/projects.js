import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { degreesToRadians, mix } from "popmotion";
import * as THREE from 'three';
import Head from 'next/head';
import Star from "@/components/projects_objects/Star";
import Planet from "@/components/projects_objects/Planet";
import Icosahedron from "@/components/projects_objects/Icosahedron";

/* (LAGS) Load the HDRI texture (put in Scene component and import at top)
import { RGBELoader } from "@/components/loaders/RGBELoader";
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

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// The scene
const Scene = ({ starAmount, cameraAngle }) => {
    // camera controls
    const { camera } = useThree();
    useFrame(() => {
        const distance = 35;

        // Use the cameraAngle prop to set the camera's position
        camera.position.setFromSphericalCoords(distance, degreesToRadians(80), cameraAngle);

        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);
    });
    
    const [currentCameraAngle, setCurrentCameraAngle] = useState(cameraAngle);
    useFrame(() => {
        const distance = 35;

        // Lerp the current camera angle towards the target camera angle
        setCurrentCameraAngle(prev => lerp(prev, cameraAngle, 0.05)); // Adjust the 0.05 value to change the smoothness

        camera.position.setFromSphericalCoords(distance, degreesToRadians(80), currentCameraAngle);
        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);
    });

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
            <Star key={i} initialPosition={starData.position} randomRadius={starData.randomRadius} speed={starData.speed} color={"red"} />
        )));
    }, [starsData]);

    // Planet position
    const planetPosition = new THREE.Vector3().setFromSphericalCoords(20, degreesToRadians(90), degreesToRadians(0));
    const planetPosition2 = new THREE.Vector3().setFromSphericalCoords(20, degreesToRadians(90), degreesToRadians(180));

    // Return the scene
    return (
        <>
            <ambientLight />
            <Icosahedron rotationSpeed={-0.25} color={"red"} />
            <Planet initialPosition={planetPosition} speed={0.1} color={"blue"} />
            <Planet initialPosition={planetPosition2} speed={0.1} color={"blue"} />
            {stars}
        </>
    );
};

// export projects page
const projects = () => {
    const containerRef = useRef();

    // When scrolling, move camera position
    const [cameraAngle, setCameraAngle] = useState(0);
    useEffect(() => {
        const handleScroll = (event) => {
            // Determine scroll direction and magnitude
            const delta = event.deltaY;

            // Update camera angle
            setCameraAngle(prevAngle => prevAngle + delta * 0.001);  // Adjust the multiplier as needed

            // Prevent default scroll behavior
            event.preventDefault();
        };

        window.addEventListener('wheel', handleScroll, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);

    return (
        <>
            <Head>
                <title>Lukas Thrane | Projects Page</title>
                <meta name='description' content='any description' />
            </Head>

            <Canvas style={{ position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 1, backgroundColor: "#000000" }}>
                <Scene starAmount={200} cameraAngle={cameraAngle} />
            </Canvas>

            <main ref={containerRef} style={{ pointerEvents: 'none' }} className='w-full bg-transparent'>
            </main>
        </>
    );
};


export default projects;