import { Section } from './Section'
import { RegisterFile } from './RegisterFile'
import { FuncUnits } from './FuncUnits'
import { ReservationStations } from './ReservationStations'
import { TitleBar } from './TitleBar'
import { CommonDataBus } from './CommonDataBus'
import { Buffers } from './Buffers'
import { Flex } from '@radix-ui/themes'
import { InstructionQueue } from './InstructionQueue'
import { MemoryUnit } from './MemoryUnit'
import { InstructionHistory } from './InstructionHistory'
import { type Position, WiringOverlay } from './WiringOverlay'

import { useLayoutEffect, useRef, useState } from 'react'

export const MainDiagram = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const registerFileRef = useRef<HTMLDivElement | null>(null)
  const reservationStationsRef = useRef<HTMLDivElement | null>(null)
  const loadStoreBuffersRef = useRef<HTMLDivElement | null>(null)
  const functionUnitRef = useRef<HTMLDivElement | null>(null)
  const instructionQueueRef = useRef<HTMLDivElement | null>(null)
  const commonDataBusRef = useRef<HTMLDivElement | null>(null)
  const memoryUnitRef = useRef<HTMLDivElement | null>(null)

  const [positions, setPositions] = useState<
    | {
        registerFile: Position
        reservationStations: Position
        loadStoreBuffers: Position
        functionUnits: Position
        instructionQueue: Position
        commonDataBus: Position
        memoryUnit: Position
      }
    | undefined
  >()

  useLayoutEffect(() => {
    const container = containerRef.current
    const registerFile = registerFileRef.current
    const reservationStations = reservationStationsRef.current
    const loadStoreBuffers = loadStoreBuffersRef.current
    const functionUnits = functionUnitRef.current
    const instructionQueue = instructionQueueRef.current
    const commonDataBus = commonDataBusRef.current
    const memoryUnit = memoryUnitRef.current

    if (
      !container ||
      !registerFile ||
      !reservationStations ||
      !loadStoreBuffers ||
      !functionUnits ||
      !instructionQueue ||
      !commonDataBus ||
      !memoryUnit
    )
      return

    const getPosition = (element: Element) => {
      const rect = element.getBoundingClientRect()
      const parentRect = container.getBoundingClientRect()

      return {
        x: rect.left - parentRect.left,
        y: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
      }
    }

    const updatePositions = () => {
      setPositions({
        registerFile: getPosition(registerFile),
        reservationStations: getPosition(reservationStations),
        loadStoreBuffers: getPosition(loadStoreBuffers),
        functionUnits: getPosition(functionUnits),
        instructionQueue: getPosition(instructionQueue),
        commonDataBus: getPosition(commonDataBus),
        memoryUnit: getPosition(memoryUnit),
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
    observer.observe(memoryUnit)

    updatePositions()

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className='relative h-full p-4'
    >
      <div className='grid auto-rows-auto grid-cols-12 gap-x-8 gap-y-10'>
        {/* Controls */}
        <div className='col-span-12'>
          <TitleBar />
        </div>

        {/* Instruction History */}
        <div className='col-span-4'>
          <Section title='Instruction History'>
            <InstructionHistory />
          </Section>
        </div>

        {/* Instruction Queue */}
        <div className='col-span-4'>
          <Section
            ref={instructionQueueRef}
            title='Instruction Queue'
          >
            <InstructionQueue />
          </Section>
        </div>

        {/* Memory Unit */}
        <div className='col-span-4'>
          <Section
            ref={memoryUnitRef}
            title='Memory Unit'
          >
            <MemoryUnit />
          </Section>
        </div>

        {/* Register File */}
        <div className='col-span-3 row-span-2 row-start-3'>
          <Section
            ref={registerFileRef}
            title='Register File'
          >
            <RegisterFile />
          </Section>
        </div>

        {/* Reservation Stations */}
        <div className='col-span-6'>
          <Section
            ref={reservationStationsRef}
            title='Reservation Stations'
          >
            <ReservationStations />
          </Section>
        </div>

        {/* Load / Store Buffers */}
        <div className='col-span-3 row-span-2'>
          <Section
            ref={loadStoreBuffersRef}
            title='Load / Store Buffers'
          >
            <Buffers />
          </Section>
        </div>

        {/* Functional Units */}
        <div className='col-span-5 col-start-5'>
          <Section
            ref={functionUnitRef}
            title='Functional Units'
          >
            <FuncUnits />
          </Section>
        </div>

        {/* Common Data Bus */}
        <div className='col-span-12'>
          <Flex justify='center'>
            <CommonDataBus ref={commonDataBusRef} />
          </Flex>
        </div>
      </div>
      {positions && <WiringOverlay {...positions} />}
    </div>
  )
}
