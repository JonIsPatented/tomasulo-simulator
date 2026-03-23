import { useEffect, useState } from 'react'
import { Simulation, type SimulatorData } from '../simulation/Simulation'
import isEqual from 'react-fast-compare'

type Narrower<T> = (data: SimulatorData) => T

export const useSimulation = <T,>(narrower: Narrower<T>) => {
    const simulation = Simulation.getSimulation()

    const [data, setData] = useState<T>(
        narrower(simulation.getSimulatorData())
    )

    useEffect(() => {
        const id = crypto.randomUUID()

        const subscriber = (data: SimulatorData) => {
            const newData = narrower(data)
            if (isEqual(data, newData)) return
            setData(newData)
        }

        simulation.subscribe(subscriber, id)

        return () => {
            simulation.unsubscribe(id)
        }
    }, [])

    return data
}
