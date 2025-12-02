import { useKeyboardControls } from "@react-three/drei"
import { useEffect, useRef } from "react"
import useGame from "./stores/useGame"
import { addEffect } from "@react-three/fiber"

export default function Interface()
{
    const time = useRef()
    const restart = useGame((state) => state.restart) // Brings thr restart from the useGame file
    const phase = useGame((state) => state.phase) // tells the current phase in useGame

    // An object containing all of the inputs properties 
    // Where we can kkep tract of when one of the controls are pressed
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

    // Timer set up to connect with elapsed time from useFrame()
    useEffect(() =>
    {
        const unsubscriubeEffect = addEffect(() =>
        {
            // Allows us to get the phase
            const state = useGame.getState()

            // Timer starting point
            let elapsedTime = 0

            // if statments to get the exact time 
            if(state.phase === 'playing')
                elapsedTime = Date.now() - state.startTime
            else if(state.phase === 'ended')
                elapsedTime = state.endTime - state.startTime

            elapsedTime /= 1000
            // Two Decimals for the timer
            elapsedTime = elapsedTime.toFixed(2)

            // Updating the time
            if(time.current)
                time.current.textContent = elapsedTime
        })

        return () => unsubscriubeEffect()
    }, [])
    

    const marble = useGame((state) => state.marble)
    const setMarble = useGame((state) => state.setMarble)

    return <div className="interface">
        {/* Time */}
        <div ref={ time } className="time">0.00</div>

        {/* Restart  */}
        {/* The code belloe ensures that the restart only appears at gameover  */}
        { phase === 'ended' && <div className="restart" onClick={ restart }>Restart</div> }

        {/* Controls */}
        <div className="controls">
            <div className="raw">
                <div className={ `key ${ forward ? 'active' : ' ' }` }></div>
            </div>
            <div className="raw">
                <div className={ `key ${ leftward ? 'active' : ' ' }` }></div>
                <div className={ `key ${ backward ? 'active' : ' ' }` }></div>
                <div className={ `key ${ rightward ? 'active' : ' ' }` }></div>
            </div>
            <div className="raw">
                <div className={ `key large ${ jump ? 'active' : ' ' }`}></div>
            </div>
        </div>

        {/* Marble Form */}
        {phase === 'ready' && (
            <form className="marble-form">
                <label>
                    Color
                    <input
                        type="color"
                        value={marble.color}
                        onChange={(e) => setMarble({ color: e.target.value })}
                    />
                </label>

                <label>
                    Radius
                    <input
                        type="range"
                        min="0.2"
                        max="0.5"
                        step="0.01"
                        value={marble.radius}
                        onChange={(e) => setMarble({ radius: parseFloat(e.target.value) })}
                    />
                </label>

                <label>
                    Metalness
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={marble.metalness}
                        onChange={(e) => setMarble({ metalness: parseFloat(e.target.value) })}
                    />
                </label>

                <label>
                    Roughness
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={marble.roughness}
                        onChange={(e) => setMarble({ roughness: parseFloat(e.target.value) })}
                    />
                </label>
            </form>
        )}
    </div>   
}