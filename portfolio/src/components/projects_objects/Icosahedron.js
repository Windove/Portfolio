import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Icosahedron = ({ rotationSpeed = -0.25, color }) => {
    const ref = useRef();
    const time = useRef(0);

    useFrame((state, delta) => {
        if (ref.current) {
            time.current += delta * rotationSpeed;
            ref.current.rotation.y = time.current;
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