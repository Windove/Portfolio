import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Icosahedron = ({ rotationSpeed = -0.25, color }) => {
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

export default Icosahedron;