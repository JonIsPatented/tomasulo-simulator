import { Section } from './Section'
import { RegisterFile } from './RegisterFile'
import { ReservationStations } from './ReservationStations'
import { useSimulation } from '../hooks/useSimulation'
import { Simulation } from '../simulation/Simulation'

import { Button, Flex, Text, Heading } from '@radix-ui/themes'

export const MainDiagram = () => {
    const clockRate = useSimulation((data) => data.clockRate)
    const simulation = Simulation.getSimulation()

    return (
        <div className='h-full p-4'>
            <div className='grid grid-cols-12 gap-4 auto-rows-auto'>

                {/* Controls */}
                <div className='col-span-12'>
                    <Flex justify="between" align="center">
                        <Heading size="4">
                            Tomasulo Simulator
                        </Heading>

                        <Flex gap="2" align="center">
                            <Button onClick={simulation.startClock} variant="outline">
                                Start
                            </Button>

                            <Button onClick={simulation.stopClock} variant="outline">
                                Stop
                            </Button>

                            <input 
                                type="number" 
                                id="quantity" 
                                name="quantity" 
                                min="1" 
                                max="10"
                                defaultValue={clockRate}
                                onChange={(e) => {
                                    //I love having to manually sanitize
                                    if (e.currentTarget.value == "") {
                                        e.currentTarget.value = "1"
                                    }
                                    const clamped: number = Math.min(Math.max(parseInt(e.currentTarget.value), 1), 10)
                                    e.currentTarget.value = clamped.toString()
                                    simulation.setClockRate(clamped)
                                }}
                            />
                            <Text size="2">
                                ticks/sec
                            </Text>
                        </Flex>
                    </Flex>
                </div>

                {/* Instruction Queue */}
                <div className='col-span-12'>
                    <Section title='Instruction Queue'>
                        <Text size="2">(TODO)</Text>
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

                {/* Load / Store Buffers */}
                <div className='col-span-3'>
                    <Section title='Load / Store Buffers'>
                        <Text size="2">(TODO)</Text>
                    </Section>
                </div>

                {/* Functional Units */}
                <div className='col-span-6 col-start-4'>
                    <Section title='Functional Units'>
                        <Text size="2">(TODO)</Text>
                    </Section>
                </div>

                {/* Common Data Bus */}
                <div className='col-span-12'>
                    <Flex justify='center'>
                        <Text weight="medium">
                            Common Data Bus (TODO)
                        </Text>
                    </Flex>
                </div>

            </div>
        </div>
    )
}
