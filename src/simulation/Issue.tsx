import type { SimulatorData, Instruction } from './Simulation'

export const issueStep = (
  currentState: SimulatorData
): SimulatorData => {
  const queue = currentState.instructionQueue

  if (!queue || queue.length === 0) {
    return { ...currentState }
  }

  const instruction: Instruction = queue[0]

  let resStations = [...currentState.reservationStations]
  let regFile = [...currentState.registerFile]

  const isAddSub =
    instruction.opcode === 'add' || instruction.opcode === 'sub'

  const isMulDiv =
    instruction.opcode === 'mul' || instruction.opcode === 'div'

  // Ignore LD/ST for now
  if (!isAddSub && !isMulDiv) {
    return currentState
  }

  const start = isAddSub
    ? 0
    : currentState.adderReservationStationCount
  const end = isAddSub
    ? currentState.adderReservationStationCount
    : resStations.length

  const freeIndex = resStations.findIndex(
    (station, i) => i >= start && i < end && station.isEmpty
  )

  if (freeIndex === -1) {
    return currentState
  }

  let newTransmitFlags = {
    ...currentState.transmitFlags,
    instructionQueueToReservationStations: true,
  }

  const newInstructionHistory = [
    ...currentState.instructionHistory,
    {
      instruction: instruction,
      start: currentState.currentTick,
    },
  ]

  const getOperand = (
    regIndex: number
  ): {
    value?: number
    station?: number
    waitingRegister?: number
  } => {
    const reg = regFile[regIndex]

    if (!reg.hasValue) {
      return {
        station: reg.alias,
      }
    }

    newTransmitFlags = {
      ...newTransmitFlags,
      registerFileToReservationStations: true,
    }

    return {
      value: reg.value,
    }
  }

  const op1 = getOperand(instruction.source1)
  const op2 = getOperand(instruction.source2)

  const bothReady = op1.value !== undefined && op2.value !== undefined
  const neitherReady =
    op1.value === undefined && op2.value === undefined
  const atLeastOneReady = !neitherReady
  const exactlyOneReady = !bothReady && atLeastOneReady
  const onlyFirstReady = exactlyOneReady && op1.value !== undefined

  resStations[freeIndex] = bothReady
    ? {
        isEmpty: false,
        isExecuting: false,
        isReady: true,
        operation: instruction.opcode,
        firstArgument: op1.value!,
        secondArgument: op2.value!,
      }
    : neitherReady
      ? {
          isEmpty: false,
          isExecuting: false,
          isReady: false,
          operation: instruction.opcode,
          firstArgument:
            op1.station !== undefined
              ? {
                  isReady: false,
                  waitingFor: 'station',
                  reservationStationIndex: op1.station!,
                }
              : {
                  isReady: false,
                  waitingFor: 'load',
                  registerIndex: op1.waitingRegister!,
                },
          secondArgument:
            op2.station !== undefined
              ? {
                  isReady: false,
                  waitingFor: 'station',
                  reservationStationIndex: op2.station!,
                }
              : {
                  isReady: false,
                  waitingFor: 'load',
                  registerIndex: op2.waitingRegister!,
                },
        }
      : onlyFirstReady
        ? {
            isEmpty: false,
            isExecuting: false,
            isReady: false,
            operation: instruction.opcode,
            firstArgument: {
              isReady: true,
              value: op1.value!,
            },
            secondArgument:
              op2.station !== undefined
                ? {
                    isReady: false,
                    waitingFor: 'station',
                    reservationStationIndex: op2.station!,
                  }
                : {
                    isReady: false,
                    waitingFor: 'load',
                    registerIndex: op2.waitingRegister!,
                  },
          }
        : {
            // onlySecondReady
            isEmpty: false,
            isExecuting: false,
            isReady: false,
            operation: instruction.opcode,
            firstArgument:
              op1.station !== undefined
                ? {
                    isReady: false,
                    waitingFor: 'station',
                    reservationStationIndex: op1.station!,
                  }
                : {
                    isReady: false,
                    waitingFor: 'load',
                    registerIndex: op1.waitingRegister!,
                  },
            secondArgument: {
              isReady: true,
              value: op2.value!,
            },
          }

  // Register renaming (only if not store)
  regFile[instruction.destination] = {
    hasValue: false,
    alias: freeIndex,
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
