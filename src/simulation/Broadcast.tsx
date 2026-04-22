import type {
  ArithmeticOpcode,
  SimulatorData,
  StoreBufferData,
  LoadBufferData,
} from './Simulation'

// ⋆.˚⟡ ࣪ ˖ MEMORY IS A LIE ⋆.˚⟡ ࣪ ˖
// for now...
// The now is now...

// Computes the result for each type of operation
// Currently does not support load / store
const computeResult = (
  operation: ArithmeticOpcode,
  firstArgumentValue: number,
  secondArgumentValue: number
): number => {
  switch (operation) {
    case 'add':
      return firstArgumentValue + secondArgumentValue
    case 'sub':
      return firstArgumentValue - secondArgumentValue
    case 'mul':
      return firstArgumentValue * secondArgumentValue
    case 'div':
      return secondArgumentValue === 0
        ? NaN
        : firstArgumentValue / secondArgumentValue
  }
}

export const broadcastStep = (
  currentState: SimulatorData
): SimulatorData => {
  let nextState: SimulatorData = {
    ...currentState,
    commonDataBus: {
      isActive: false,
    },
  }

  const finishedStoreIndex = nextState.storeBuffers.findIndex(
    (buffer) =>
      !buffer.isEmpty &&
      buffer.isReady &&
      buffer.isStoring &&
      buffer.ticksLeft === 0
  )

  if (finishedStoreIndex !== -1) {
    const finishedStore = nextState.storeBuffers[finishedStoreIndex]

    if (!finishedStore.isEmpty && finishedStore.isReady) {
      const nextMemory = new Map(nextState.memoryUnit)
      nextMemory.set(finishedStore.address, finishedStore.value)

      const nextStoreBuffers = nextState.storeBuffers.map(
        (buffer, i): StoreBufferData<number> => {
          if (i !== finishedStoreIndex) return buffer

          return {
            isEmpty: true,
            isReady: false,
            isStoring: false,
          }
        }
      )

      nextState = {
        ...nextState,
        memoryUnit: nextMemory,
        storeBuffers: nextStoreBuffers,
        transmitFlags: {
          ...nextState.transmitFlags,
          storeBuffersToMemoryUnit: true,
        },
      }
    }
  }

  const finishedLoadIndex = nextState.loadBuffers.findIndex(
    (buffer) =>
      !buffer.isEmpty &&
      buffer.isReady &&
      buffer.isLoading &&
      buffer.ticksLeft === 0
  )

  if (finishedLoadIndex !== -1) {
    const finishedLoad = nextState.loadBuffers[finishedLoadIndex]

    if (!finishedLoad.isEmpty && finishedLoad.isReady) {
      const destinationRegister = nextState.registerFile.findIndex(
        (register) =>
          !register.hasValue &&
          register.alias.source === 'loadBuffer' &&
          register.alias.index === finishedLoadIndex
      )

      const loadedValue =
        nextState.memoryUnit.get(finishedLoad.address) ?? 0

      const nextLoadBuffers = nextState.loadBuffers.map(
        (buffer, i): LoadBufferData => {
          if (i !== finishedLoadIndex) return buffer

          return {
            isEmpty: true,
            isReady: false,
            isLoading: false,
          }
        }
      )

      return {
        ...nextState,
        commonDataBus: {
          isActive: true,
          value: loadedValue,
          source: 'load',
          destinationRegister,
          sourceLoadBufferIndex: finishedLoadIndex,
        },
        loadBuffers: nextLoadBuffers,
        transmitFlags: {
          ...nextState.transmitFlags,
          memoryUnitToLoadBuffers: true,
          loadBuffersToCommonDataBus: true,
        },
      }
    }
  }

  const multiplyFunctionUnit =
    nextState.multiplyDivideFunctionUnits[0]
  const addFunctionUnit = nextState.addSubtractFunctionUnits[0]

  // Checks if the mul / div function unit is done
  if (
    !multiplyFunctionUnit.isEmpty &&
    multiplyFunctionUnit.ticksLeft === 0
  ) {
    return {
      ...nextState,
      commonDataBus: {
        isActive: true,
        value: computeResult(
          multiplyFunctionUnit.operation,
          multiplyFunctionUnit.firstArgument,
          multiplyFunctionUnit.secondArgument
        ),
        source: 'operation',
        sourceStation: multiplyFunctionUnit.sourceStationIndex,
      },
      multiplyDivideFunctionUnits: [
        {
          isEmpty: true,
        },
      ],
      transmitFlags: {
        ...nextState.transmitFlags,
        functionUnitsToCommonDataBus: true,
      },
    }
  }

  // Checks if the add / sub function unit is done
  if (!addFunctionUnit.isEmpty && addFunctionUnit.ticksLeft === 0) {
    return {
      ...nextState,
      commonDataBus: {
        isActive: true,
        value: computeResult(
          addFunctionUnit.operation,
          addFunctionUnit.firstArgument,
          addFunctionUnit.secondArgument
        ),
        source: 'operation',
        sourceStation: addFunctionUnit.sourceStationIndex,
      },
      addSubtractFunctionUnits: [
        {
          isEmpty: true,
        },
      ],
      transmitFlags: {
        ...nextState.transmitFlags,
        functionUnitsToCommonDataBus: true,
      },
    }
  }

  // Checks if the add / sub function unit is done
  if (!addFunctionUnit.isEmpty && addFunctionUnit.ticksLeft === 0) {
    return {
      ...nextState,
      commonDataBus: {
        isActive: false,
      },
    }
  }

  return {
    ...currentState,
    commonDataBus: {
      isActive: false,
    },
  }
}
