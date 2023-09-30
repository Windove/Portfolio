import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlanetHover } from '@/pages/projects';

const Planet = ({ initialPosition, speed, color }) => {
    const [isPlanetHovered, setIsPlanetHovered] = usePlanetHover(false);
    const [isLocalHovered, setIsLocalHovered] = useState(false);
    const ref = useRef();
    const time = useRef(0);

    // Calculate initial angle
    const initialAngle = Math.atan2(initialPosition.z, initialPosition.x);
    const actualSpeed = isPlanetHovered ? 0 : speed;

    useFrame((state, delta) => {
        if (ref.current) {
            const radius = initialPosition.length();
            const adjustedSpeed = actualSpeed;
            time.current += delta * adjustedSpeed;
            const angle = time.current + initialAngle;
            const y = initialPosition.y;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            ref.current.position.set(x, y, z);
        }

        if (ref.current && isLocalHovered) {
            ref.current.scale.set(1.2, 1.2, 1.2);
        } else if (ref.current) {
            ref.current.scale.set(1, 1, 1);
        }
    });

    
    const handleOnClick = () => {
        // Handle the click event here
        console.log("Planet clicked!");
    };

    return (
        <mesh ref={ref} position={initialPosition} onClick={handleOnClick}
            onPointerOver={() => {
                setIsPlanetHovered(true);
                setIsLocalHovered(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setIsPlanetHovered(false);
                setIsLocalHovered(false);
                document.body.style.cursor = 'auto';
            }}
        >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
};

export default Planet;