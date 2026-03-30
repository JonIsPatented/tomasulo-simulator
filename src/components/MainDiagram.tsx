import { Section } from './Section'
import { RegisterFile } from './RegisterFile'
import { FuncUnits } from './FuncUnits'
import { ReservationStations } from './ReservationStations'

import { TitleBar } from './TitleBar'
import { CommonDataBus } from './CommonDataBus'

import { Buffers } from './Buffers'
import { Flex } from '@radix-ui/themes'
import { InstructionQueue } from './InstructionQueue'

export const MainDiagram = () => {

    return (
        <div className='h-full p-4'>
            <div className='grid grid-cols-12 gap-4 auto-rows-auto'>

                {/* Controls */}
                <div className='col-span-12'>
                    <TitleBar />
                </div>
                {/* Instruction Queue */}
                <div className='col-start-5 col-span-4'>
                    <Section title='Instruction Queue'>
                        <InstructionQueue />
                    </Section>
                </div>

                {/* Register File */}
                <div className='row-start-3 col-span-3'>
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
                        <CommonDataBus />
                    </Flex>
                </div>

            </div>
        </div>
    )
}
