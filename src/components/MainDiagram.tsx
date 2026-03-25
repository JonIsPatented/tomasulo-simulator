import { Section } from './Section'
import { RegisterFile } from './RegisterFile'
import { FuncUnits } from './funcUnits'
import { ReservationStations } from './ReservationStations'

import { TitleBar } from './TitleBar'
import { Flex, Text } from '@radix-ui/themes'

import { useSimulation } from '../hooks/useSimulation'
import { Simulation } from '../simulation/Simulation'
import { CommonDataBus } from './commonDataBus'

import {Buffers} from './buffers'
import { Button, Flex, Text, Heading } from '@radix-ui/themes'
import { Iqueue } from './Iqueue'

export const MainDiagram = () => {

    return (
        <div className='h-full p-4'>
            <div className='grid grid-cols-12 gap-4 auto-rows-auto'>

                {/* Controls */}
                <TitleBar />
                {/* Instruction Queue */}
                <div className='col-span-12'>
                    <Section title='Instruction Queue'>
                        <Iqueue/>
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
                        <Buffers />
                    </Section>
                </div>

                {/* Functional Units */}
                <div className='col-span-6 col-start-4'>
                    <Section title='Functional Units'>
                        <FuncUnits />
                    </Section>
                </div>

                {/* Common Data Bus */}
                <div className='col-span-12'>
                    <Flex justify='center'>
                        <CommonDataBus/>
                    </Flex>
                </div>

            </div>
        </div>
    )
}
