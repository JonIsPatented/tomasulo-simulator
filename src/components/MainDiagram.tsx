import { Section } from './Section'
import { RegisterFile } from './RegisterFile'
import { FuncUnits } from './FuncUnits'
import { ReservationStations } from './ReservationStations'

import { TitleBar } from './TitleBar'
import { CommonDataBus } from './CommonDataBus'

import { Buffers } from './Buffers'
import { Flex } from '@radix-ui/themes'
import { InstructionQueue } from './InstructionQueue'
import { useEffect, useRef, useState } from 'react'

export const MainDiagram = () => {

    const containerRef = useRef(null)

    const registerFileRef = useRef(null)
    const reservationStationsRef = useRef(null)
    const loadStoreBuffersRef = useRef(null)
    const functionUnitRef = useRef(null)

    type Position = {
        x: number,
        y: number,
        width: number
        height: number,
    }

    const [positions, setPositions] = useState<{
        registerFile: Position,
        reservationStations: Position,
        loadStoreBuffers: Position,
        functionUnit: Position
    } | undefined>()

    useEffect(() => {
        const updatePositions = () => {
            if (!containerRef.current) return
            if (!registerFileRef.current) return
            if (!reservationStationsRef.current) return
            if (!loadStoreBuffersRef.current) return
            if (!functionUnitRef.current) return

            const getPosition = (element: HTMLElement, parent: HTMLElement) => {
                const rect = element.getBoundingClientRect()
                const parentRect = parent.getBoundingClientRect()

                return {
                    x: rect.left - parentRect.left,
                    y: rect.top - parentRect.top,
                    width: rect.width,
                    height: rect.height
                }
            }

            const registerFilePos = getPosition(
                registerFileRef.current, containerRef.current
            )
            const reservationStationsPos = getPosition(
                reservationStationsRef.current, containerRef.current
            )
            const loadStoreBufferPos = getPosition(
                loadStoreBuffersRef.current, containerRef.current
            )
            const functionUnitPos = getPosition(
                functionUnitRef.current, containerRef.current
            )

            setPositions({
                registerFile: registerFilePos,
                reservationStations: reservationStationsPos,
                loadStoreBuffers: loadStoreBufferPos,
                functionUnit: functionUnitPos
            })
        }

        updatePositions()
        window.addEventListener('resize', updatePositions)

        return () => window.removeEventListener('resize', updatePositions)
    }, [])

    return (
        <div ref={containerRef} className='h-full p-4'>
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
                <div ref={registerFileRef} className='row-start-3 col-span-3'>
                    <Section title='Register File'>
                        <RegisterFile />
                    </Section>
                </div>

                {/* Reservation Stations */}
                <div ref={reservationStationsRef} className='col-span-6'>
                    <Section title='Reservation Stations'>
                        <ReservationStations />
                    </Section>
                </div>

                {/* Load / Store Buffers */}
                <div ref={loadStoreBuffersRef} className='col-span-3'>
                    <Section title='Load / Store Buffers'>
                        <Buffers />
                    </Section>
                </div>

                {/* Functional Units */}
                <div ref={functionUnitRef} className='col-span-6 col-start-4'>
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
