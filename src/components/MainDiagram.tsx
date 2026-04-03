import { Section } from './Section'
import { RegisterFile } from './RegisterFile'
import { FuncUnits } from './FuncUnits'
import { ReservationStations } from './ReservationStations'

import { TitleBar } from './TitleBar'
import { CommonDataBus } from './CommonDataBus'

import { Buffers } from './Buffers'
import { Flex } from '@radix-ui/themes'
import { InstructionQueue } from './InstructionQueue'
import { useLayoutEffect, useRef, useState } from 'react'

import { type Position, WiringOverlay } from './WiringOverlay'

export const MainDiagram = () => {

    const containerRef = useRef<HTMLDivElement | null>(null)

    const registerFileRef = useRef<HTMLDivElement | null>(null)
    const reservationStationsRef = useRef<HTMLDivElement | null>(null)
    const loadStoreBuffersRef = useRef<HTMLDivElement | null>(null)
    const functionUnitRef = useRef<HTMLDivElement | null>(null)
    const instructionQueueRef = useRef<HTMLDivElement | null>(null)
    const commonDataBusRef = useRef<HTMLDivElement | null>(null)

    const [positions, setPositions] = useState<{
        registerFile: Position,
        reservationStations: Position,
        loadStoreBuffers: Position,
        functionUnits: Position,
        instructionQueue: Position,
        commonDataBus: Position,
    } | undefined>()

    useLayoutEffect(() => {
        const container = containerRef.current
        const registerFile = registerFileRef.current
        const reservationStations = reservationStationsRef.current
        const loadStoreBuffers = loadStoreBuffersRef.current
        const functionUnits = functionUnitRef.current
        const instructionQueue = instructionQueueRef.current
        const commonDataBus = commonDataBusRef.current

        if (
            !container ||
            !registerFile ||
            !reservationStations ||
            !loadStoreBuffers ||
            !functionUnits ||
            !instructionQueue ||
            !commonDataBus
        ) {
            return
        }

        const getPosition = (element: Element) => {
            const rect = element.getBoundingClientRect()
            const parentRect = container.getBoundingClientRect()

            return {
                x: rect.left - parentRect.left,
                y: rect.top - parentRect.top,
                width: rect.width,
                height: rect.height
            }
        }

        const updatePositions = () => {
            setPositions({
                registerFile: getPosition(registerFile),
                reservationStations: getPosition(reservationStations),
                loadStoreBuffers: getPosition(loadStoreBuffers),
                functionUnits: getPosition(functionUnits),
                instructionQueue: getPosition(instructionQueue),
                commonDataBus: getPosition(commonDataBus)
            })
        }

        let frame: number | null = null

        const observer = new ResizeObserver(() => {
            if (frame) cancelAnimationFrame(frame)
            frame = requestAnimationFrame(updatePositions)
        })

        observer.observe(container)
        observer.observe(registerFile)
        observer.observe(reservationStations)
        observer.observe(loadStoreBuffers)
        observer.observe(functionUnits)
        observer.observe(instructionQueue)
        observer.observe(commonDataBus)

        updatePositions()

        return () => {
            observer.disconnect()
            if (frame) cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div ref={containerRef} className='h-full p-4 relative'>
            <div className='grid grid-cols-12 gap-4 auto-rows-auto'>

            {/* Title Bar - full width */}
            <div className='col-span-12'>
                <TitleBar />
            </div>

            {/* Register File  */}
            <div className='col-span-3 row-span-3'>
                <Section ref={registerFileRef} title='Register File'>
                    <RegisterFile />
                </Section>
            </div>

            {/* Instruction Queue */}
            <div className='col-span-9 h-45'>
                <Section ref={instructionQueueRef} title='Instruction Queue'>
                    <InstructionQueue />
                </Section>
            </div>

            {/* Reservation Stations */}
            <div className='col-span-9'>
                <Section ref={reservationStationsRef} title='Reservation Stations'>
                    <ReservationStations />
                </Section>
            </div>

            {/* Functional Units */}
            <div className='col-span-6 h-67'>
                <Section ref={functionUnitRef} title='Functional Units'>
                    <FuncUnits />
                </Section>
            </div>

            {/* Load/Store Buffer */}
            <div className='col-span-3 h-67'>
                <Section ref={loadStoreBuffersRef} title='Load / Store Buffers'>
                    <Buffers />
                </Section>
            </div>

            {/* Common Data Bus - full width at bottom */}
            <div className='col-span-12'>
                <Flex justify='center'>
                    <CommonDataBus ref={commonDataBusRef} />
                </Flex>
            </div>

            </div>
        </div>
    )
}
