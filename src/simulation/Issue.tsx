import type { SimulatorData, Instruction, SourceReference} from "./Simulation"

export const issueStep = (currentState: SimulatorData): SimulatorData => {
    const queue = currentState.instructionQueue

    if (!queue || queue.length === 0) {
        return { ...currentState }
    }

    const instruction: Instruction = queue[0]
    
    const newInstructionHistory = [
        ...currentState.instructionHistory,
        {
            instruction,
            start: currentState.currentTick,
        },
    ]

    if (instruction.type === "arithmetic") {
        let resStations = [...currentState.reservationStations]
        let regFile = [...currentState.registerFile]

        const isAddSub =
            instruction.opcode === 'add' ||
            instruction.opcode === 'sub'

        const isMulDiv =
            instruction.opcode === 'mul' ||
            instruction.opcode === 'div'

        // Only handle arithmetic instructions
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

        let newTransmitFlags = {
            ...currentState.transmitFlags,
            instructionQueueToReservationStations: true
        }

        const getOperand = (regIndex: number): {
            value?: number,
            station?: number,
            waitingLoadSource?: SourceReference,
        } => {
            const reg = regFile[regIndex]

            if (!reg.hasValue) {
                if (reg.alias.source === "reservationStation") {
                    return {
                        station: reg.alias.index,
                    }
                }

                return {
                    waitingLoadSource: reg.alias,
                };
            }

            newTransmitFlags = {
                ...newTransmitFlags,
                registerFileToReservationStations: true
            }

            return {
                value: reg.value,
            }
        }

        const op1 = getOperand(instruction.source1)
        const op2 = getOperand(instruction.source2)

        const bothReady = op1.value !== undefined && op2.value !== undefined
        const neitherReady = op1.value === undefined && op2.value === undefined
        const atLeastOneReady = !neitherReady
        const exactlyOneReady = !bothReady && atLeastOneReady
        const onlyFirstReady = exactlyOneReady && op1.value !== undefined

        resStations[freeIndex] = bothReady ? {
            isEmpty: false,
            isExecuting: false,
            isReady: true,
            operation: instruction.opcode,
            firstArgument: op1.value!,
            secondArgument: op2.value!,
        } : neitherReady ? {
            isEmpty: false,
            isExecuting: false,
            isReady: false,
            operation: instruction.opcode,
            firstArgument: op1.station !== undefined ? {
                isReady: false,
                waitingFor: 'station',
                reservationStationIndex: op1.station!,
            } : {
                isReady: false,
                waitingFor: 'load',
                source: op1.waitingLoadSource!,
            },
            secondArgument: op2.station !== undefined ? {
                isReady: false,
                waitingFor: 'station',
                reservationStationIndex: op2.station!,
            } : {
                isReady: false,
                waitingFor: 'load',
                source: op2.waitingLoadSource!,
            }
        } : onlyFirstReady ? {
            isEmpty: false,
            isExecuting: false,
            isReady: false,
            operation: instruction.opcode,
            firstArgument: {
                isReady: true,
                value: op1.value!,
            },
            secondArgument: op2.station !== undefined ? {
                isReady: false,
                waitingFor: 'station',
                reservationStationIndex: op2.station!,
            } : {
                isReady: false,
                waitingFor: 'load',
                source: op2.waitingLoadSource!,
            }
        } : { // onlySecondReady
            isEmpty: false,
            isExecuting: false,
            isReady: false,
            operation: instruction.opcode,
            firstArgument: op1.station !== undefined ? {
                isReady: false,
                waitingFor: 'station',
                reservationStationIndex: op1.station!,
            } : {
                isReady: false,
                waitingFor: 'load',
                source: op1.waitingLoadSource!,
            },
            secondArgument: {
                isReady: true,
                value: op2.value!,
            }
        }

        // Register renaming for arithmetic destination
        regFile[instruction.destination] = {
            hasValue: false,
            alias: {
                source: "reservationStation",
                index: freeIndex,
            },
        }

        return {
            ...currentState,
            reservationStations: resStations,
            registerFile: regFile,
            instructionQueue: queue.slice(1),
            transmitFlags: newTransmitFlags,
            instructionHistory: newInstructionHistory,
        }
    }

    if (instruction.type === "memory"){
        let regFile = [...currentState.registerFile]
        let loadBuffers = [...currentState.loadBuffers]
        let storeBuffers = [...currentState.storeBuffers]

        const getMemoryOperand = (regIndex: number): {
            value?: number
            source?: SourceReference
        } => {
            const reg = regFile[regIndex];

            if (!reg.hasValue) return{source: reg.alias}

            return {
                value: reg.value,
            };
        }

        if(instruction.opcode === "ld"){
            const freeIndex = loadBuffers.findIndex((buffer) => buffer.isEmpty);

            if(freeIndex === -1) return currentState

            const baseOperand = getMemoryOperand(instruction.baseRegister);

            loadBuffers[freeIndex] = baseOperand.value !== undefined
            ? {
                isEmpty: false,
                isLoading: false,
                isReady: true,
                address: baseOperand.value + instruction.offset,
                ticksLeft: 0,
            }
            : {
                isEmpty: false,
                isLoading: false,
                isReady: false,
                waitingFor: baseOperand.source!,
                offset: instruction.offset,
            }

            regFile[instruction.register] = {
                hasValue: false,
                alias: {
                    source: "loadBuffer",
                    index: freeIndex,
                },
            }
            
            return {
                ...currentState,
                loadBuffers,
                registerFile: regFile,
                instructionQueue: queue.slice(1),
                transmitFlags: {
                    ...currentState.transmitFlags,
                    instructionQueueToReservationStations: true,
                },
                instructionHistory: newInstructionHistory,
            }
        }

        if(instruction.opcode === "st"){
            const freeIndex = storeBuffers.findIndex((buffer) => buffer.isEmpty)

            if(freeIndex === -1) return currentState

            const baseOperand = getMemoryOperand(instruction.baseRegister);
            const valueOperand = getMemoryOperand(instruction.register);

            const addressReady = baseOperand.value !== undefined;
            const valueReady = valueOperand.value !== undefined;

            storeBuffers[freeIndex] =
                addressReady && valueReady
                ? {
                    isEmpty: false,
                    isStoring: false,
                    isReady: true,
                    address: baseOperand.value! + instruction.offset,
                    value: valueOperand.value!,
                    ticksLeft: 0,
                }
                : !addressReady && valueReady
                    ? {
                        isEmpty: false,
                        isStoring: false,
                        isReady: false,
                        waitingFor: "address",
                        addressSource: baseOperand.source!,
                        offset: instruction.offset,
                        value: valueOperand.value!,
                    }
                    : addressReady && !valueReady
                        ? {
                            isEmpty: false,
                            isStoring: false,
                            isReady: false,
                            waitingFor: "value",
                            valueSource: valueOperand.source!,
                            address: baseOperand.value! + instruction.offset,
                        }
                        : {
                            isEmpty: false,
                            isStoring: false,
                            isReady: false,
                            waitingFor: "both",
                            addressSource: baseOperand.source!,
                            valueSource: valueOperand.source!,
                            offset: instruction.offset,
                        }
            return {
                ...currentState,
                storeBuffers,
                instructionQueue: queue.slice(1),
                transmitFlags: {
                    ...currentState.transmitFlags,
                    instructionQueueToReservationStations: true,
                },
                instructionHistory: newInstructionHistory,
            }
        }
    }
    return currentState
}
