import { useEffect, useState } from 'react'
import { Simulation, type SimulatorData } from '../simulation/Simulation'

type Narrower<T> = (data: SimulatorData) => T

export const useSimulation = <T,>(narrower: Narrower<T>) => {
    const simulation = Simulation.getSimulation()

    const [data, setData] = useState<T>(
        narrower(simulation.getSimulatorData())
    )

    useEffect(() => {
        const id = crypto.randomUUID()

        const subscriber = (simData: SimulatorData) => {
            const newData = narrower(simData)
            setData(newData)
        }

        simulation.subscribe(subscriber, id)

        return () => {
            simulation.unsubscribe(id)
        }
    }, [])

    return data
}
