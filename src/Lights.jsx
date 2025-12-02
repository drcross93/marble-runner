import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export default function Lights()
{
    // To be able to animate the directional light
    const light = useRef()

    // Animation 
    useFrame((state)=>
        {
            // The camera will move on the z axis
            light.current.position.z = state.camera.position.z + 1 - 4
            light.current.target.position.z = state.camera.position.z - 4 // Tarkets the ball
            light.current.target.updateMatrixWorld() // Updates the matrix so the previous line of code works
        })

    return <>
        <directionalLight
        ref={light}
            castShadow
            position={ [ 4, 4, 1 ] }
            intensity={ 4.5 }
            shadow-mapSize={ [ 1024, 1024 ] }
            shadow-camera-near={ 1 }
            shadow-camera-far={ 10 }
            shadow-camera-top={ 10 }
            shadow-camera-right={ 10 }
            shadow-camera-bottom={ - 10 }
            shadow-camera-left={ - 10 }
        />
        <ambientLight intensity={ 1.5 } />
    </>
}