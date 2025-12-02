import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useState,useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF } from '@react-three/drei'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// Materials
const floorMaterial = new THREE.MeshStandardMaterial({ color:'limegreen'})
const floor2Material = new THREE.MeshStandardMaterial({ color:'greenyellow'})
const obstacleMaterial = new THREE.MeshStandardMaterial({ color:'orangered'})
const wallMaterial = new THREE.MeshStandardMaterial({ color:'slategrey'})

/**
 * @component Blockstart
 * @param {Object} props
 * @param {Array<number>} props.position - The main position for the starting block
 * @returns {JSX.Element}
 */
export function BlockStart({ position = [ 0, 0, 0] })
{
    return <><group position={position}>
        {/* Floor */}
        <mesh
            geometry={boxGeometry}
            material={floorMaterial}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow />
    </group>
    <Float floatIntensity={0.25} rotationIntensity={0.25}>
    <Text 
        font='./bebas-neue-v9-latin-regular.woff'
        position={[ 0.75, 0.65, 0 ]} 
        roation-y={- 0.25}
        maxWidth={0.25}
        lineHeight={0.75}
        textAlign='right'
        scale={.5} 
        color={'orange'} 
        fontWeight={900}>
            Marble Runner
            <meshBasicMaterial toneMapped={false}/>
        </Text>
    </Float>
    </>
}


/**
 * Block End
 */
export function BlockEnd({ position = [ 0, 0, 0] })
{
    // Import hamburger 
    const hamburger = useGLTF('./hamburger.glb')

    // A function that allows you to edit all parts
    // This function was made so the hamburger can cast a shadow
    // Written on one line without the {} because theres only one rule
    hamburger.scene.children.forEach((mesh) => mesh.castShadow = true)

    return <group position={position}>
        <Text 
        font='./bebas-neue-v9-latin-regular.woff'
        scale={1}
        position={[0, 2.25, 2]}
        >
            FINISH
            <meshBasicMaterial toneMapped={false}/>
        </Text>
        {/* Floor */}
        <mesh 
            geometry={ boxGeometry} 
            material={floorMaterial}
            position={ [0, 0, 0 ]} 
            scale={[ 4, 0.2, 4]}
            receiveShadow
            />
        <RigidBody type='fixed' colliders='hull' position={ [0, 0.25, 0] } restitution={ 0.2} friction={0} >
            <primitive object={ hamburger.scene} scale={.2} />
        </RigidBody>
    </group>
}


/**
 * @component Blockspinner component
 * @param {Object} props
 * @param {Array<number>} props.position - The positions for the second part of the floor
 * @returns {JSX.Element}
 */
export function Blockspinner({ position=[0, 0, 0] })
{
    const obstacle =useRef()
    const [ speed ] = useState(() => (Math.random() + 0.2) * (Math.random < 0.5 ? - 1 : 1))
    
    // Animate the Spinner 
    useFrame((state) =>
        {
            const time = state.clock.getElapsedTime()

            const rotation = new THREE.Quaternion()
            rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
            obstacle.current.setNextKinematicRotation(rotation)
        })

    return <group position={position}>
        {/* Floor */}
         <mesh 
            geometry={ boxGeometry} 
            material={floor2Material}
            position={ [0, -0.1, 0 ]} 
            scale={[ 4, 0.2, 4]}
            receiveShadow
            />
        
        {/* Physics for Spinner */}
        <RigidBody 
            ref={obstacle}
            type='kinematicPosition' 
            position={ [0, 0.3, 0 ]}
            restitution={0.2}
            friction={0}
            >
                {/* Block Spinner  */}
            <mesh
                geometry={ boxGeometry} 
                material={obstacleMaterial}
                scale={[ 3.5, 0.3, 0.3]}
                castShadow
                />
        </RigidBody>
    </group>
}

/**
 * @component BlockLimbo
 * @param {*} param0 
 * @returns 
 */
export function BlockLimbo({ position=[0, 0, 0] })
{
    const obstacle =useRef()
    const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)
    
    // Animate the box Geometry to move veritically
    useFrame((state) =>
        {
            const time = state.clock.getElapsedTime()

            const y = Math.sin(time * timeOffset) + 1.15
            obstacle.current.setNextKinematicTranslation({x: position[0], y: position[1] + y, z: position[2]})
        })

    return <group position={position}>
        {/* Floor */}
         <mesh 
            geometry={ boxGeometry} 
            material={floor2Material}
            position={ [0, -0.1, 0 ]} 
            scale={[ 4, 0.2, 4]}
            receiveShadow
            />
        
        {/* Physics for Spinner */}
        <RigidBody 
            ref={obstacle}
            type='kinematicPosition' 
            position={ [0, 0.3, 0 ]}
            restitution={0.2}
            friction={0}
            >
                {/* Block Spinner  */}
            <mesh
                geometry={ boxGeometry} 
                material={obstacleMaterial}
                scale={[ 3.5, 0.3, 0.3]}
                castShadow
                />
        </RigidBody>
    </group>
}

/**
 * @component BlockAxe
 * @param {Object} props
 * @param {Array<number>} props.position - The positions for the axe block
 * @returns {JSX.Element}
 */
export function BlockAxe({ position=[0, 0, 0] })
{
    const obstacle =useRef()
    const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)
    
    // Animate the box Geometry to move veritically
    useFrame((state) =>
        {
            const time = state.clock.getElapsedTime()

            const x = Math.sin(time * timeOffset) * 1.25
            obstacle.current.setNextKinematicTranslation({x: position[0] + x, y: position[1] + 0.75, z: position[2]})
        })

    return <group position={position}>
        {/* Floor */}
         <mesh 
            geometry={ boxGeometry} 
            material={floor2Material}
            position={ [0, -0.1, 0 ]} 
            scale={[ 4, 0.2, 4]}
            receiveShadow
            />
        
        {/* Physics for Spinner */}
        <RigidBody 
            ref={obstacle}
            type='kinematicPosition' 
            position={ [0, 0.3, 0 ]}
            restitution={0.2}
            friction={0}
            >
                {/* Block Spinner  */}
            <mesh
                geometry={ boxGeometry} 
                material={obstacleMaterial}
                scale={[ 1.5, 1.5, 0.3]}
                castShadow
                />
        </RigidBody>
    </group>
}

/**
 * Walls
 * @param {W} param0 
 * @returns 
 */
function Bounds({ length = 1 })
{
    return <>
    <RigidBody type='fixed' restitution={0.2} friction={0}>
        {/* Right Wall */}
            <mesh
                position={ [ 2.15, 0.75, - (length * 2) + 2 ] }
                geometry={ boxGeometry }
                material={ wallMaterial }
                scale={ [ 0.3, 1.5, 4 * length ] }
                castShadow
            />

        {/* Left Wall */}
            <mesh
                position={ [ - 2.15, 0.75, - (length * 2) + 2 ] }
                geometry={ boxGeometry }
                material={ wallMaterial }
                scale={ [ 0.3, 1.5, 4 * length ] }
                receiveShadow
            />
        {/* End Wall */}
            <mesh
                position={ [ 0, 0.75, - (length * 4) + 2 ] }
                geometry={ boxGeometry }
                material={ wallMaterial }
                scale={ [ 4, 1.5, 0.3] }
                receiveShadow
            />
            <CuboidCollider 
                args={[ 2, 0.1, 2 * length ]} 
                position={[ 0, -0.1, - (length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    </>
}

export function Level({ 
        count = 5, 
        types =[ Blockspinner, BlockAxe, BlockLimbo ], 
        seed = 0 
    }) // Props
{
    const blocks =useMemo(()=>
        {
            // The Array is for each block for each level
            const blocks =[]

            // Fills the block array
            for(let i = 0; i < count; i++)
            {
                //Gives the random levels and the Math.floor keeps the count within the right range
                const type = types[Math.floor(Math.random() * types.length)]
                blocks.push(type)                
            }

            return blocks
        }, [count, types, seed])
    return<>
        <BlockStart position={[ 0, 0, 0 ]} />

        {/* Used the index number as the index because I used map() */}
        {/* index is multiplied by 4 so each tap gets its own floor */}
        { blocks.map((Blocks, index)=> <Blocks key={index} position={[ 0, 0, - (index + 1)* 4]}/>) }

        <BlockEnd position={ [ 0, 0, -(count + 1) * 4  ] } />

        <Bounds length={ count + 2 } />
    </>
}