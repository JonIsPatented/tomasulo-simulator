import { broadcastStep } from './Broadcast.tsx'
import { dispatchStep } from './Dispatch.tsx'
import { issueStep } from './Issue.tsx'

export interface ReservationStationData {
    // Which operation is being performed in this station
    // or null if the station is empty
    operation: '+' | '-' | '*' | '/' | null

    // The value of the first argument, or null if
    // the argument is awaiting another station or
    // if this station is empty
    firstArgumentValue: number | null

    // The number of the station the first argument
    // is awaiting, or null if the argument is not
    // awaiting another station or if this station
    // is empty
    firstArgumentStation: number | null

    // The value of the second argument, or null if
    // the argument is awaiting another station or
    // if this station is empty
    secondArgumentValue: number | null

    // The number of the station the first argument
    // is awaiting, or null if the argument is not
    // awaiting another station or if this station
    // is empty
    secondArgumentStation: number | null

    // Whether this station is empty
    isEmpty: boolean
}

export interface LoadStoreBufferData {

    // Memory address if known, or null if still waiting
    addressValue: number | null

    // Reservation station this address is waiting on,
    // or null if not waiting
    addressStation: number | null

    // Value to store.
    // This can be null if it's a load buffer
    dataValue: number | null

    // Reservation station this data is waiting on,
    // or null if not waiting
    dataStation: number | null

    // Whether this buffer is empty
    isEmpty: boolean
}

export interface RegisterData {
    // Alias for this register (to a reservation station),
    // with a number indicating the index of the corresponding
    // reservation station, and null indicating no alias
    alias: number | null

    // value currently stored in the register
    value: number | null
}

export interface DataBus {
    // The value being broadcast. Null if no value
    // is being broadcast at the moment.
    value: number | null

    // The index of the reservation station corresponding
    // to the operation that produced this value, or null
    // if the bus is off or the data is from memory rather
    // than from a function unit
    sourceStation: number | null

    // The index of the register the load operation
    // is writing to, or null if data bus is off or
    // if the data is not from memory
    destinationRegister: number | null
}

export interface FunctionUnit {
    // Which operation is being performed in this station
    // or null if the station is empty
    operation: '+' | '-' | '*' | '/' | null

    // The value of the first argument, or null if
    // the argument is awaiting another station or
    // if this station is empty
    firstArgumentValue: number | null

    // The value of the second argument, or null if
    // the argument is awaiting another station or
    // if this station is empty
    secondArgumentValue: number | null

    // The number of cycles left in the current function
    // execution for this unit, or null if no operation
    // is in progress
    ticksLeft: number | null

    // Whether this station is empty
    isEmpty: boolean
}

export interface SimulatorData {
    // Eventually, this will include a full copy
    // of the current state of the simulator

    // Values in the registers, sorted R0-RN
    registerFile: Array<RegisterData>

    // Values in the reservation stations, sorted
    // from RS0-RSN
    reservationStations: Array<ReservationStationData>

    // Load buffers
    loadBuffers: Array<LoadStoreBufferData>,

    // Store buffers
    storeBuffers: Array<LoadStoreBufferData>

    // Number of adder reservation stations
    adderReservationStationCount: number

    // Number of multiplier reservation stations
    multiplierReservationStationCount: number

    // Common data bus for broadcast data
    commonDataBus: DataBus

    // Adders/subtractors for operation on values in
    // the add/sub reservation stations
    addSubtractFunctionUnits: Array<FunctionUnit>

    // multipliers/dividers for operation on values in
    // the mul/div reservation stations
    multiplyDivideFunctionUnits: Array<FunctionUnit>

    // Clock rate of the simulation, measured
    // in ticks per second
    clockRate: number
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
        registerFile: [
            { alias: null, value: 1.2 },
            { alias: null, value: -10.4 },
            { alias: 1, value: null },
            { alias: null, value: -2.6 }
        ],
        reservationStations: [
            {
                operation: '+',
                firstArgumentValue: 10,
                firstArgumentStation: null,
                secondArgumentValue: null,
                secondArgumentStation: 3,
                isEmpty: false
            },
            {
                operation: '-',
                firstArgumentValue: null,
                firstArgumentStation: 0,
                secondArgumentValue: null,
                secondArgumentStation: 3,
                isEmpty: false
            },
            {
                operation: null,
                firstArgumentValue: null,
                firstArgumentStation: null,
                secondArgumentValue: null,
                secondArgumentStation: null,
                isEmpty: true
            },
            {
                operation: '*',
                firstArgumentValue: 10,
                firstArgumentStation: null,
                secondArgumentValue: 14.6,
                secondArgumentStation: null,
                isEmpty: false
            },
            {
                operation: null,
                firstArgumentValue: null,
                firstArgumentStation: null,
                secondArgumentValue: null,
                secondArgumentStation: null,
                isEmpty: true
            },
        ],
        loadBuffers: [
            {
                addressValue: null,
                addressStation: null,
                dataValue: null,
                dataStation: null,
                isEmpty: false
            },
            {
                addressValue: null,
                addressStation: null,
                dataValue: null,
                dataStation: null,
                isEmpty: false
            },
            {
                addressValue: null,
                addressStation: null,
                dataValue: null,
                dataStation: null,
                isEmpty: false
            },
            {
                addressValue: null,
                addressStation: null,
                dataValue: null,
                dataStation: null,
                isEmpty: false
            },
        ],
        storeBuffers: [
            {
                addressValue: null,
                addressStation: null,
                dataValue: null,
                dataStation: null,
                isEmpty: false
            },
            {
                addressValue: null,
                addressStation: null,
                dataValue: null,
                dataStation: null,
                isEmpty: false
            },
            {
                addressValue: null,
                addressStation: null,
                dataValue: null,
                dataStation: null,
                isEmpty: false
            },
            {
                addressValue: 67,
                addressStation: null,
                dataValue: null,
                dataStation: 3,
                isEmpty: false
            },
        ],
        commonDataBus: {
            value: null,
            sourceStation: null,
            destinationRegister: null
        },
        addSubtractFunctionUnits: [
            {
                operation: null,
                firstArgumentValue: null,
                secondArgumentValue: null,
                ticksLeft: null,
                isEmpty: true
            }
        ],
        multiplyDivideFunctionUnits: [
            {
                operation: null,
                firstArgumentValue: null,
                secondArgumentValue: null,
                ticksLeft: null,
                isEmpty: true
            }
        ],
        adderReservationStationCount: 3,
        multiplierReservationStationCount: 2,
        clockRate: 2
    }

    public readonly getSimulatorData = (): SimulatorData => {
        return this.currentState
    }

    private readonly publish = () => {
        this.subscribers.forEach((subscriber) => {
            subscriber.func(this.currentState)
        })
    }

    private clockRatePerSecond: number = 1
    private timerId: ReturnType<typeof setInterval> | null = null

    public readonly startClock = () => {
        if (this.timerId) return
        this.timerId = setInterval(() => {
            this.tick()
            this.publish()
        }, 1000 / this.clockRatePerSecond)
    }

    public readonly stopClock = () => {
        clearInterval(this.timerId ?? undefined)
        this.timerId = null
    }

    public readonly setClockRate = (newRatePerSecond: number) => {
        this.stopClock()
        this.clockRatePerSecond = newRatePerSecond
        this.startClock()
        this.publish()
    }

    private readonly tick = () => {
        this.currentState = [this.currentState]
            .map(issueStep)
            .map(dispatchStep)
            .map(broadcastStep)[0]
    }
}
