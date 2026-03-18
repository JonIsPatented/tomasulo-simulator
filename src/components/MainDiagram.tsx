import { Section } from './Section'
import { RegisterFile } from './RegisterFile.tsx'
import { ReservationStations } from './ReservationStations.tsx'
import { useSimulation } from '../hooks/useSimulation'
import { Simulation } from '../simulation/Simulation'
import { Button } from 'primereact/button'

export const MainDiagram = () => {

    const {
        clockRate
    } = useSimulation()

    const simulation = Simulation.getSimulation()

    return (
        <div className='w-full h-full p-4'>
            <div className='grid grid-cols-12 gap-4 auto-rows-fr'>

                {/* Controls */}
                <div className='col-span-12 flex justify-between items-center'>
                    <h2 className='text-xl font-semibold'>
                        Tomasulo Simulator
                    </h2>

                    <div className='flex gap-2 items-center'>
                        <Button
                            label="Start"
                            icon="pi pi-play"
                            onClick={simulation.startClock}
                        />
                        <Button
                            label="Stop"
                            icon="pi pi-stop"
                            severity="danger"
                            onClick={simulation.stopClock}
                        />
                        <span className='text-sm'>
                            {clockRate} ticks/sec
                        </span>
                    </div>
                </div>

                {/* Instruction Queue (placeholder for now) */}
                <div className='col-span-12'>
                    <Section title='Instruction Queue'>
                        <div className='text-sm'>
                            (TODO)
                        </div>
                    </Section>
                </div>

                {/* Register File */}
                <div className='col-span-3'>
                    <Section title='Register File'>
                        <RegisterFile />
                    </Section>
                </div>

                {/* Reservation Stations */}
                <div className='col-span-6'>
                    <Section title='Reservation Stations'>
                        <ReservationStations />
                    </Section>
                </div>

                {/* Load / Store Buffers (placeholder) */}
                <div className='col-span-3'>
                    <Section title='Load / Store Buffers'>
                        <div className='text-sm'>
                            (TODO)
                        </div>
                    </Section>
                </div>

                {/* Functional Units (placeholder) */}
                <div className='col-span-6 col-start-4'>
                    <Section title='Functional Units'>
                        <div className='text-sm'>
                            (TODO)
                        </div>
                    </Section>
                </div>

                {/* Common Data Bus */}
                <div className='col-span-12'>
                    <div className='text-center py-2 font-medium'>
                        Common Data Bus (TODO)
                    </div>
                </div>

            </div>
        </div>
    )
}
