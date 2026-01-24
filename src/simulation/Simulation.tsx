interface ReservationStationData {
    // which operation is being performed in this station
    // or null if the station is empty
    operation: '+' | '-' | '*' | '/' | null

    // the value of the first argument, or null if
    // the argument is awaiting another station or
    // if this station is empty
    firstArgumentValue: number | null

    // the number of the station the first argument
    // is awaiting, or null if the argument is not
    // awaiting another station or if this station
    // is empty
    firstArgumentStation: number | null

    // the value of the second argument, or null if
    // the argument is awaiting another station or
    // if this station is empty
    secondArgumentValue: number | null

    // the number of the station the first argument
    // is awaiting, or null if the argument is not
    // awaiting another station or if this station
    // is empty
    secondArgumentStation: number | null

    // whether this station is empty
    isEmpty: boolean
}

interface SimulatorData {
    // Eventually, this will include a full copy
    // of the current state of the simulator

    // values in the registers, sorted R0-RN
    registerFile: Array<number>

    // aliases in the RAT, with null meaning no alias
    // and a number indicating the index of the
    // corresponding reservation station
    registerAliasTable: Array<number | null>

    // values in the reservation stations, sorted
    // from RS0-RSN
    reservationStations: Array<ReservationStationData>

    // number of adder reservation stations
    adderReservationStationCount: number

    // number of multiplier reservation stations
    multiplierReservationStationCount: number

    // clock rate of the simulation, measured
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

    public readonly getSimulatorData = (): SimulatorData => {
        return { // TODO
            registerFile: [1.2, -10.4, 8.0, -2.6],
            registerAliasTable: [null, null, 1, null],
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
            adderReservationStationCount: 3,
            multiplierReservationStationCount: 2,
            clockRate: 2
        }
    }

    private readonly publish = () => {
        const data = this.getSimulatorData()
        this.subscribers.forEach((subscriber) => {
            subscriber.func(data)
        })
    }

    private clockRatePerSecond: number = 1
    private timerId: ReturnType<typeof setInterval> | null = null

    public readonly startClock = () => {
        if (this.timerId) return
        this.timerId = setInterval(() => {
            this.tick()
            this.publish()
        }, this.clockRatePerSecond * 1000)
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
        // TODO
    }

}
