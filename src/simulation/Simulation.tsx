import { failure, success, type Result } from '../util/Result.tsx'
import { broadcastStep } from './Broadcast.tsx'
import { dispatchStep } from './Dispatch.tsx'
import { issueStep } from './Issue.tsx'

// RegisterData Type
export interface ValueRegister<T> {
    hasValue: true
    value: T
}

export interface AliasRegister {
    hasValue: false
    alias: number
}

export type RegisterData<T> = ValueRegister<T> | AliasRegister
// End RegisterData Type

// ReservationStationData Type
export interface EmptyStation {
    isEmpty: true
    isExecuting: false
    isReady: false
}

export interface ReadyStation<T> {
    isEmpty: false
    isExecuting: boolean
    isReady: true
    operation: ArithmeticOpcode
    firstArgument: T
    secondArgument: T
}

export interface ReadyArgument<T> {
    isReady: true
    value: T
}

export interface StationWaitingArgument {
    isReady: false
    waitingFor: 'station'
    reservationStationIndex: number
}

export interface LoadWaitingArgument {
    isReady: false
    waitingFor: 'load'
    registerIndex: number
}

export type WaitingArgument = StationWaitingArgument | LoadWaitingArgument

export type ReservationStationArgument<T> = ReadyArgument<T> | WaitingArgument

export interface WaitingStation<T> {
    isEmpty: false
    isExecuting: false
    isReady: false
    operation: ArithmeticOpcode
    firstArgument: ReservationStationArgument<T>
    secondArgument: ReservationStationArgument<T>
}

export type ReservationStationData<T> = ReadyStation<T> | WaitingStation<T> | EmptyStation
// End ReservationStationData Type

// StoreBufferData Type
export interface EmptyStoreBuffer {
    isEmpty: true
    isStoring: false
    isReady: false
}

export interface ReadyStoreBuffer<T> {
    isEmpty: false
    isStoring: boolean
    isReady: true
    address: number
    value: T
}

export interface AddressWaitingStoreBuffer<T> {
    isEmpty: false
    isStoring: false
    isReady: false
    waitingFor: 'address'
    waitingStaionIndex: number
    value: T
}


export interface ValueWaitingStoreBuffer {
    isEmpty: false
    isStoring: false
    isReady: false
    waitingFor: 'value'
    waitingStationIndex: number
    address: number
}

export type WaitingStoreBuffer<T> = AddressWaitingStoreBuffer<T> | ValueWaitingStoreBuffer

export type StoreBufferData<T> = ReadyStoreBuffer<T> | WaitingStoreBuffer<T> | EmptyStoreBuffer
// End StoreBufferData Type

// LoadBufferData Type
export interface EmptyLoadBuffer {
    isEmpty: true
    isLoading: false
    isReady: false
}

export interface WaitingLoadBuffer {
    isEmpty: false
    isLoading: false
    isReady: false
    waitingStationIndex: number
}

export interface ReadyLoadBuffer {
    isEmpty: false
    isLoading: boolean
    isReady: true
    address: number
}

export type LoadBufferData = ReadyLoadBuffer | WaitingLoadBuffer | EmptyLoadBuffer
// End LoadBufferData Type

// DataBus Type
export interface IdleBus {
    isActive: false
}

export interface ActiveLoadSignalBus<T> {
    isActive: true
    value: T
    source: 'load'
    destinationRegister: number
}

export interface ActiveOperationSignalBus<T> {
    isActive: true
    value: T
    source: 'operation'
    sourceStation: number
}

export type ActiveBus<T> = ActiveLoadSignalBus<T> | ActiveOperationSignalBus<T>

export type DataBus<T> = ActiveBus<T> | IdleBus
// End DataBus Type

// FunctionUnitData Type
export interface EmptyFunctionUnit {
    isEmpty: true
}

export interface ActiveFunctionUnit<T> {
    isEmpty: false
    operation: ArithmeticOpcode
    firstArgument: T
    secondArgument: T
    ticksLeft: number
    sourceStationIndex: number
}

export type FunctionUnitData<T> = ActiveFunctionUnit<T> | EmptyFunctionUnit
// End FunctionUnitData Type

// Opcode Type
// Subset of opcodes for arithmetic instructions
export type ArithmeticOpcode = 'add' | 'sub' | 'mul' | 'div'

// Subset of opcodes for memory instructions
export type MemoryOpcode = 'ld' | 'st'

// Master list of opcodes
export type Opcode = ArithmeticOpcode | MemoryOpcode
// End Opcode Type

// Instruction Type
export interface ArithmeticInstruction {
    type: 'arithmetic'
    opcode: ArithmeticOpcode
    destination: number
    source1: number
    source2: number
}

export interface MemoryInstruction {
    type: 'memory'
    opcode: MemoryOpcode
    register: number
    baseRegister: number
    offset: number
}

export type Instruction = ArithmeticInstruction | MemoryInstruction
// End Instruction Type

// Format an instruction as a string for display in the UI
export const formatInstruction = (instruction: Instruction): string => {
    switch (instruction.opcode) {
        case 'add':
        case 'sub':
        case 'mul':
        case 'div':
            return `${instruction.opcode} f${instruction.destination}, f${instruction.source1}, f${instruction.source2}`

        case 'ld':
            return `ld f${instruction.register}, ${instruction.offset}(f${instruction.baseRegister})`

        case 'st':
            return `st f${instruction.register}, ${instruction.offset}(f${instruction.baseRegister})`
    }
}

// Number of cycles each of the listed
// instructions takes to complete
export interface InstructionDurations {
    addition: number,
    subtraction: number,
    multiplication: number,
    division: number,
    loading: number,
    storing: number,
}

export interface SimulatorData {
    // Eventually, this will include a full copy
    // of the current state of the simulator

    // The list of instructions to be executed, in order
    instructionQueue: Array<Instruction>

    // Values in the registers, sorted R0-RN
    registerFile: Array<RegisterData<number>>

    // Values in the reservation stations, sorted
    // from RS0-RSN
    reservationStations: Array<ReservationStationData<number>>

    // Load buffers
    loadBuffers: Array<LoadBufferData>,

    // Store buffers
    storeBuffers: Array<StoreBufferData<number>>

    // Number of adder reservation stations
    adderReservationStationCount: number

    // Number of multiplier reservation stations
    multiplierReservationStationCount: number

    // Common data bus for broadcast data
    commonDataBus: DataBus<number>

    // Adders/subtractors for operation on values in
    // the add/sub reservation stations
    addSubtractFunctionUnits: Array<FunctionUnitData<number>>

    // multipliers/dividers for operation on values in
    // the mul/div reservation stations
    multiplyDivideFunctionUnits: Array<FunctionUnitData<number>>

    // Clock rate of the simulation, measured
    // in ticks per second
    clockRate: number

    // Flags that indicate whether data was just
    // transmitted along the noted wires during the
    // most recent clock cycle
    transmitFlags: {
        registerFileToReservationStations: boolean,
        loadStoreBuffersToReservationStations: boolean,
        reservationStationsToFunctionUnits: boolean,
        instructionQueueToReservationStations: boolean,
        functionUnitsToCommonDataBus: boolean,
        commonDataBusToRegisterFile: boolean,
        commonDataBusToLoadStoreUnits: boolean,
        commonDataBusToReservationStations: boolean,
        storeBuffersToMemoryUnit: boolean,
        memoryUnitToLoadBuffers: boolean,
    }

    // Number of cycles taken to perform each
    // type of instruction
    cyclesPerInstruction: InstructionDurations
}

export class Simulation {

    private static instance: Simulation | null = null

    private constructor() {
        this.subscribers = []
    }

    public static readonly getSimulation = () => {
        if (Simulation.instance === null) {
            Simulation.instance = new Simulation()
        }
        return Simulation.instance
    }

    private subscribers: Array<{ func: (data: SimulatorData) => void, id: string }>

    // Provide the simulator with a callback to run whenever the state changes.
    // A unique string id must be provided for each subscriber, so that subscribers
    // can be unsubscribed from notifications when it is time for cleanup.
    public readonly subscribe = (func: (data: SimulatorData) => void, id: string): boolean => {
        if (this.subscribers.some(subscriber => subscriber.id === id)) {
            return false
        }
        this.subscribers.push({ func, id })
        return true
    }

    // Remove a subscribed callback from the simulator so that it is no longer
    // called when the state changes.
    public readonly unsubscribe = (id: string): boolean => {
        if (!this.subscribers.some(subscriber => subscriber.id === id)) {
            return false
        }
        this.subscribers = this.subscribers
            .filter(subscriber => subscriber.id !== id)
        return true
    }

    private currentState: SimulatorData = { // TODO
        ...defaultState(),
        registerFile: [
            { hasValue: true, value: 1.2 },
            { hasValue: true, value: 4.4 },
            { hasValue: true, value: 0 },
            { hasValue: true, value: 0 }
        ],
        instructionQueue: [
            {
                type: 'arithmetic',
                opcode: 'mul',
                source1: 0,
                source2: 1,
                destination: 0
            },
            {
                type: 'arithmetic',
                opcode: 'add',
                source1: 1,
                source2: 1,
                destination: 2
            },
            {
                type: 'arithmetic',
                opcode: 'sub',
                source1: 1,
                source2: 2,
                destination: 2
            },
            {
                type: 'arithmetic',
                opcode: 'div',
                source1: 0,
                source2: 1,
                destination: 3
            }
        ],
    }

    public readonly getSimulatorData = (): SimulatorData => {
        return this.currentState
    }

    private readonly publish = () => {
        this.subscribers.forEach((subscriber) => {
            subscriber.func(this.currentState)
        })
    }

    private timerId: ReturnType<typeof setInterval> | null = null

    public readonly startClock = () => {
        if (this.timerId) return
        this.timerId = setInterval(() => {
            this.step()
        }, 1000 / this.currentState.clockRate)
    }

    public readonly stopClock = () => {
        clearInterval(this.timerId ?? undefined)
        this.timerId = null
    }

    public readonly setClockRate = (newRatePerSecond: number) => {
        const wasRunning: boolean = !!this.timerId
        this.stopClock()
        this.currentState.clockRate = newRatePerSecond
        if (wasRunning) this.startClock()
        this.publish()
    }

    // Change how long each type of instruction takes to perform
    // adjustment: A function that takes in the old durations as
    // an argument and returns the desired durations
    // returns: A Result containing the new durations on
    // a success and an error message on a failure
    public readonly adjustInstructionDurations = (
        adjustment: (durations: InstructionDurations) => InstructionDurations
    ): Result<InstructionDurations, 'Duration cannot be less than 0'> => {
        const newDurations = adjustment(this.currentState.cyclesPerInstruction)
        if (Object.entries(newDurations).find(e => e[1] < 0))
            return failure('Duration cannot be less than 0')
        this.currentState = {
            ...this.currentState,
            cyclesPerInstruction: newDurations
        }
        return success(newDurations)
    }

    private readonly tick = () => {
        this.currentState = [this.currentState]
            .map(resetTransmitFlags)
            .map(issueStep)
            .map(dispatchStep)
            .map(broadcastStep)[0]
    }

    public readonly step = () => {
        this.tick()
        this.publish()
    }
}

const resetTransmitFlags = (data: SimulatorData) => {
    return {
        ...data,
        transmitFlags: {
            registerFileToReservationStations: false,
            loadStoreBuffersToReservationStations: false,
            reservationStationsToFunctionUnits: false,
            instructionQueueToReservationStations: false,
            functionUnitsToCommonDataBus: false,
            commonDataBusToRegisterFile: false,
            commonDataBusToLoadStoreUnits: false,
            commonDataBusToReservationStations: false,
            storeBuffersToMemoryUnit: false,
            memoryUnitToLoadBuffers: false,
        }
    }
}

const defaultState = (): SimulatorData => ({
    registerFile: [
        { hasValue: true, value: 0 },
        { hasValue: true, value: 0 },
        { hasValue: true, value: 0 },
        { hasValue: true, value: 0 }
    ],
    reservationStations: [
        {
            isEmpty: true,
            isExecuting: false,
            isReady: false,
        },
        {
            isEmpty: true,
            isExecuting: false,
            isReady: false,
        },
        {
            isEmpty: true,
            isExecuting: false,
            isReady: false,
        },
        {
            isEmpty: true,
            isExecuting: false,
            isReady: false,
        },
        {
            isEmpty: true,
            isExecuting: false,
            isReady: false,
        },
    ],
    loadBuffers: [
        {
            isEmpty: true,
            isReady: false,
            isLoading: false,
        },
        {
            isEmpty: true,
            isReady: false,
            isLoading: false,
        },
        {
            isEmpty: true,
            isReady: false,
            isLoading: false,
        },
        {
            isEmpty: true,
            isReady: false,
            isLoading: false,
        },
    ],
    storeBuffers: [
        {
            isEmpty: true,
            isReady: false,
            isStoring: false,
        },
        {
            isEmpty: true,
            isReady: false,
            isStoring: false,
        },
        {
            isEmpty: true,
            isReady: false,
            isStoring: false,
        },
        {
            isEmpty: true,
            isReady: false,
            isStoring: false,
        },
    ],
    commonDataBus: {
        isActive: false
    },
    addSubtractFunctionUnits: [
        {
            isEmpty: true,
        },
    ],
    multiplyDivideFunctionUnits: [
        {
            isEmpty: true
        },
    ],
    adderReservationStationCount: 3,
    multiplierReservationStationCount: 2,
    clockRate: 4,
    instructionQueue: [],
    transmitFlags: {
        registerFileToReservationStations: false,
        loadStoreBuffersToReservationStations: false,
        reservationStationsToFunctionUnits: false,
        instructionQueueToReservationStations: false,
        functionUnitsToCommonDataBus: false,
        commonDataBusToRegisterFile: false,
        commonDataBusToLoadStoreUnits: false,
        commonDataBusToReservationStations: false,
        storeBuffersToMemoryUnit: false,
        memoryUnitToLoadBuffers: false,
    },
    cyclesPerInstruction: {
        addition: 2,
        subtraction: 2,
        multiplication: 10,
        division: 40,
        loading: 4,
        storing: 4,
    },
})
