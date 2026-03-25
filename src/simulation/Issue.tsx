import type { SimulatorData, Instruction } from "./Simulation"

export const issueStep = (currentState: SimulatorData): SimulatorData => {
    const queue = currentState.instructionQueue

    if (!queue || queue.length === 0) {
        return { ...currentState }
    }

    const instruction: Instruction = queue[0]

    let resStations = [...currentState.reservationStations]
    let regFile = [...currentState.registerFile]

    const isAddSub =
        instruction.opcode === 'ADD' ||
        instruction.opcode === 'SUB'

    const isMulDiv =
        instruction.opcode === 'MUL' ||
        instruction.opcode === 'DIV'

    // Ignore LD/ST for now
    if (!isAddSub && !isMulDiv) {
        return currentState
    }

    const start = isAddSub ? 0 : currentState.adderReservationStationCount
    const end = isAddSub
        ? currentState.adderReservationStationCount
        : resStations.length

    const freeIndex = resStations.findIndex((station, i) =>
        i >= start &&
        i < end &&
        station.isEmpty
    )

    if (freeIndex === -1) {
        return currentState
    }

    const getOperand = (regIndex: number) => {
        const reg = regFile[regIndex]

        if (reg.alias !== null) {
            return {
                value: null,
                station: reg.alias,
                waitingRegister: null
            }
        }

        if (reg.value !== null) {
            return {
                value: reg.value,
                station: null,
                waitingRegister: null
            }
        }

        return {
            value: null,
            station: null,
            waitingRegister: regIndex
        }
    }

    const op1 = getOperand(instruction.source1)
    const op2 = getOperand(instruction.source2)

    const opMap = {
        ADD: '+',
        SUB: '-',
        MUL: '*',
        DIV: '/'
    } as const

    resStations[freeIndex] = {
        operation: opMap[instruction.opcode as keyof typeof opMap],
        firstArgumentValue: op1.value,
        firstArgumentStation: op1.station,
        firstArgumentWaitingRegister: op1.waitingRegister,
        secondArgumentValue: op2.value,
        secondArgumentStation: op2.station,
        secondArgumentWaitingRegister: op2.waitingRegister,
        isEmpty: false
    }

    // Register renaming (only if not store)
    regFile[instruction.destination] = {
        ...regFile[instruction.destination],
        alias: freeIndex,
        value: null
    }

    return {
        ...currentState,
        reservationStations: resStations,
        registerFile: regFile,
        instructionQueue: queue.slice(1)
    }
}
