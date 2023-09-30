import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Star = ({ initialPosition, randomRadius, speed, color }) => {
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

export default Star;