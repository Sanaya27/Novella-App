import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Butterfly3D({ position, color = '#ec4899', index = 0 }) {
    const butterflyRef = useRef();
    const wingLeftRef = useRef();
    const wingRightRef = useRef();
    
    // Create butterfly geometry
    const bodyGeometry = useMemo(() => new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), []);
    const wingGeometry = useMemo(() => {
        const shape = new THREE.Shape();
        // Create heart-shaped wing (following user's heart preference)
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0, -0.1, -0.15, -0.1, -0.15, 0);
        shape.bezierCurveTo(-0.15, 0.08, -0.08, 0.15, 0, 0.12);
        shape.bezierCurveTo(0.08, 0.15, 0.15, 0.08, 0.15, 0);
        shape.bezierCurveTo(0.15, -0.1, 0, -0.1, 0, 0);
        
        return new THREE.ShapeGeometry(shape);
    }, []);
    
    // Animation with natural movement (fixing weird flight patterns)
    useFrame((state) => {
        if (butterflyRef.current) {
            const time = state.clock.elapsedTime + index * 0.5; // Stagger timing
            
            // Gentle curved flight path (not erratic)
            butterflyRef.current.position.x = position[0] + Math.sin(time * 0.5) * 2;
            butterflyRef.current.position.y = position[1] + time * 0.3 + Math.sin(time * 0.8) * 0.5;
            butterflyRef.current.position.z = position[2] + Math.cos(time * 0.3) * 1;
            
            // Natural rotation (±45° max, no crazy spinning)
            butterflyRef.current.rotation.y = Math.sin(time * 0.5) * Math.PI / 4;
            
            // Wing flapping with natural timing
            if (wingLeftRef.current && wingRightRef.current) {
                const flapAngle = Math.sin(time * 8) * 0.4; // Natural wing flap speed
                wingLeftRef.current.rotation.z = flapAngle;
                wingRightRef.current.rotation.z = -flapAngle;
            }
            
            // Reset when butterfly flies too far
            if (butterflyRef.current.position.y > 6) {
                butterflyRef.current.position.y = -2;
                butterflyRef.current.position.x = position[0] + (Math.random() - 0.5) * 2;
                butterflyRef.current.position.z = position[2] + (Math.random() - 0.5) * 1;
            }
        }
    });
    
    return (
        <group ref={butterflyRef} position={position}>
            {/* Body */}
            <mesh geometry={bodyGeometry}>
                <meshPhongMaterial color="#2d1b69" />
            </mesh>
            
            {/* Left Wing */}
            <mesh 
                ref={wingLeftRef}
                geometry={wingGeometry}
                position={[-0.08, 0, 0]}
                rotation={[0, 0, 0]}
            >
                <meshPhongMaterial 
                    color={color} 
                    transparent 
                    opacity={0.9}
                    side={THREE.DoubleSide}
                    emissive={color}
                    emissiveIntensity={0.1}
                />
            </mesh>
            
            {/* Right Wing */}
            <mesh 
                ref={wingRightRef}
                geometry={wingGeometry}
                position={[0.08, 0, 0]}
                rotation={[0, Math.PI, 0]}
            >
                <meshPhongMaterial 
                    color={color} 
                    transparent 
                    opacity={0.9}
                    side={THREE.DoubleSide}
                    emissive={color}
                    emissiveIntensity={0.1}
                />
            </mesh>
        </group>
    );
}

export default Butterfly3D;