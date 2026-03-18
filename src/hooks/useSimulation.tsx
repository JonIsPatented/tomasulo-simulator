import { useEffect, useState } from 'react'
import { Simulation } from '../simulation/Simulation.tsx'

export const useSimulation = () => {
    const simulation = Simulation.getSimulation()

    const [data, setData] = useState(
        simulation.getSimulatorData()
    )

    useEffect(() => {
        const id = crypto.randomUUID()

        simulation.subscribe(setData, id)

        return () => {
            simulation.unsubscribe(id)
        }
    }, [])

    return data
}
