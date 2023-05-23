import {Canvas, useLoader} from "@react-three/fiber";
import React from "react";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from "@react-three/drei";

function PayloadModel ({ orx, ory, orz }) {
    const obj = useLoader(OBJLoader, '/model.obj');
    // let rollAngle = Math.atan2(orx, orz) * (180.0 /  Math.PI);
    // let pitchAngle = Math.atan2(-orx, Math.sqrt(ory * ory + orz * orz)) * (180.0 / Math.PI);
    return <mesh position={[0, 2, 0]} scale={[0.06, 0.06, 0.06]} rotation={[ orx, ory, 0 ]}>
        <primitive object={obj} />
    </mesh>
}

function PayloadScene ({ orx, ory, orz }) {
    return <Canvas style={{ height: '45vh' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <PayloadModel
            orx={orx || 0}
            ory={ory || 0}
            orz={orz || 0}
        />
        <OrbitControls />
    </Canvas>
}

export default PayloadScene;