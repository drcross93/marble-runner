import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import useGame from "./stores/useGame";


export default function Player()
{
    const body = useRef()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const { rapier, world } = useRapier()

    // 10, 10, 10 changes the initial position, starts far away and then zooms in
    const [ smoothedCameraPosition ] = useState(()=> new THREE.Vector3(10, 10, 10))
    const [ smoothedCameraTarget ] = useState(()=> new THREE.Vector3())

    // Retrieve the phase (in the store/useGame)
    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)
    const marble = useGame((state) => state.marble)

    // To get the ball to jump
    const jump = ()=>
    {
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction ={ x:0, y:-1, z:0 }
        const ray = new rapier.Ray(origin, direction) // Rapier version of a ray caster
        const hit = world.castRay(ray, 10, true) // 10 is max distance of impact and the true means the floor is solid
        
        if(hit.timeOfImpact < 0.15)
            body.current.applyImpulse({ x:0, y:0.5, z:0 })
    }

    // Reset Functions
    const reset = () =>
    {
        body.current.setTranslation({ x: 0, y: 1, z:0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    // To make sure the ball to jumps correctly, subscribe to the jump
    useEffect(() =>
        {
            const unsubscribeReset = useGame.subscribe(
                (state) => state.phase,
                (phase) =>
                    {
                        if(phase === 'ready')
                            reset()
                    }
            )

            // Allows the ball to jump
            const unsubscribeJump = subscribeKeys( // subsribe to one jump
                (state) => state.jump, // This is called a Selector
                (value) =>
                {
                    if(value)
                        jump()
                }
            )

            const unsubscribeAny = subscribeKeys(
                () =>
                {
                    start()
                }
            )

            return ()=>
            {
                unsubscribeReset() // Cleans the subscriptions 
                unsubscribeJump() // Stops the ball from double subscribing
                unsubscribeAny() // Cleaning up the events 
            }
        },[])

    // Directional movements 
    useFrame((state, delta)=> 
        {
            /**
             * Controls
             */
            // The key movements 
            const {forward, backward, leftward, rightward} = getKeys()
            
            // Starting values for ball movement
            const impulse = { x: 0, y: 0, z: 0 }
            const torque = { x: 0, y: 0, z: 0 }

            const impulseStrength = 0.6 * delta
            const torqueStrength = 0.2 * delta

            // Make the ball move forward
            if(forward)
            {
                impulse.z -= impulseStrength
                torque.x -= torqueStrength
            }

            // Make the ball move backward
            if(backward)
            {
                impulse.z += impulseStrength
                torque.x += torqueStrength
            }

            // Make the ball move leftward
            if(leftward)
            {
                impulse.x -= impulseStrength
                torque.z += torqueStrength
            }

            // Make the ball move rightward
            if(rightward)
            {
                impulse.x += impulseStrength
                torque.z -= torqueStrength
            }
            
            // Code to appy it to the body reference
            body.current.applyImpulse(impulse)
            body.current.applyTorqueImpulse(torque)

            /**
             * Camera
             */
            const bodyPosition = body.current.translation()
         
            const cameraPostion = new THREE.Vector3()
            cameraPostion.copy(bodyPosition)
            cameraPostion.z += 2.25
            cameraPostion.y += 0.65

            const cameraTarget = new THREE.Vector3()
            cameraTarget.copy(bodyPosition) // Keeps camera focused on marble
            cameraTarget.y += 0.25 // Places camera slightly above the marble

            // Creates smooth transitions for the camera movement
            // Added delta so the annimation remains the same regarless of the framerate
            smoothedCameraPosition.lerp(cameraPostion, 5 * delta)
            smoothedCameraTarget.lerp(cameraTarget, 5* delta)

            state.camera.position.copy(smoothedCameraPosition) // Moves camera to the marbel
            state.camera.lookAt(smoothedCameraTarget) //The camera will look at the target

            /**
             * Phases
             */
            if(bodyPosition.z < - (blocksCount * 4 + 2))
                end()

            if(bodyPosition.y < - 4 )
                restart()
        })

    return<>
        <RigidBody 
            ref={body} 
            canSleep={ false } // That way you can always move the ball  
            colliders='ball' 
            restitution={0.2} 
            friction={1}
            linearDamping={ 0.5 }
            angularDamping={ 0.5 }
            position={ [0, 1, 0] }
            >
            <mesh castShadow>
                <icosahedronGeometry args={[ marble.radius, 1 ]} />
                <meshStandardMaterial
                    flatShading
                    color={marble.color}
                    metalness={marble.metalness}
                    roughness={marble.roughness}
                />
            </mesh>
        </RigidBody>
    </>
}