import type {
  FunctionUnitData,
  ReadyStation,
  ReservationStationData,
  SimulatorData,
  SourceReference,
  LoadBufferData,
  StoreBufferData,
} from './Simulation'

export const dispatchStep: (
  currentState: SimulatorData
) => SimulatorData = (currentState: SimulatorData) => {
  const bus = currentState.commonDataBus

  let resStations = currentState.reservationStations
  let regFile = currentState.registerFile
  let transmitFlags = currentState.transmitFlags
  let loadBuffers = currentState.loadBuffers
  let storeBuffers = currentState.storeBuffers

  if (bus.isActive) {
    const matchesBusSource = (source: SourceReference): boolean => {
      return bus.source === 'operation'
        ? source.source === 'reservationStation' &&
            source.index === bus.sourceStation
        : source.source === 'loadBuffer' &&
            source.index === bus.sourceLoadBufferIndex
    }

    loadBuffers = loadBuffers.map((buffer): LoadBufferData => {
      if (buffer.isEmpty || buffer.isReady) return buffer
      if (!matchesBusSource(buffer.waitingFor)) return buffer

      return {
        isEmpty: false,
        isReady: true,
        isLoading: false,
        address: bus.value + buffer.offset,
        ticksLeft: 0,
      }
    })

    storeBuffers = storeBuffers.map(
      (buffer): StoreBufferData<number> => {
        if (buffer.isEmpty || buffer.isReady) return buffer

        if (buffer.waitingFor === 'address') {
          if (!matchesBusSource(buffer.addressSource)) return buffer

          return {
            isEmpty: false,
            isReady: true,
            isStoring: false,
            address: bus.value + buffer.offset,
            value: buffer.value,
            ticksLeft: 0,
          }
        }

        if (buffer.waitingFor === 'value') {
          if (!matchesBusSource(buffer.valueSource)) return buffer

          return {
            isEmpty: false,
            isReady: true,
            isStoring: false,
            address: buffer.address,
            value: bus.value,
            ticksLeft: 0,
          }
        }

        if (buffer.waitingFor === 'both') {
          const addressReady = matchesBusSource(buffer.addressSource)
          const valueReady = matchesBusSource(buffer.valueSource)

          if (!addressReady && !valueReady) return buffer

          if (addressReady) {
            return {
              isEmpty: false,
              isReady: false,
              isStoring: false,
              waitingFor: 'value',
              valueSource: buffer.valueSource,
              address: bus.value + buffer.offset,
            }
          }

          return {
            isEmpty: false,
            isReady: false,
            isStoring: false,
            waitingFor: 'address',
            addressSource: buffer.addressSource,
            offset: buffer.offset,
            value: bus.value,
          }
        }
        return buffer
      }
    )

    if (bus.source === 'operation') {
      transmitFlags = {
        ...transmitFlags,
        commonDataBusToRegisterFile: true,
      }
      resStations = resStations.map(
        (station, i): ReservationStationData<number> => {
          const firstFromStation =
            !station.isEmpty &&
            !station.isReady &&
            !station.firstArgument.isReady &&
            station.firstArgument.waitingFor === 'station' &&
            station.firstArgument.reservationStationIndex ===
              bus.sourceStation

          const secondFromStation =
            !station.isEmpty &&
            !station.isReady &&
            !station.secondArgument.isReady &&
            station.secondArgument.waitingFor === 'station' &&
            station.secondArgument.reservationStationIndex ===
              bus.sourceStation

          if (i === bus.sourceStation)
            return {
              isEmpty: true,
              isReady: false,
              isExecuting: false,
            }

          if (firstFromStation || secondFromStation)
            transmitFlags = {
              ...transmitFlags,
              commonDataBusToReservationStations: true,
            }

          return !firstFromStation && !secondFromStation
            ? {
                ...station,
              }
            : firstFromStation && station.secondArgument.isReady
              ? {
                  isReady: true,
                  isEmpty: false,
                  isExecuting: false,
                  operation: station.operation,
                  firstArgument: bus.value,
                  secondArgument: station.secondArgument.value,
                }
              : station.firstArgument.isReady
                ? {
                    isReady: true,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: station.firstArgument.value,
                    secondArgument: bus.value,
                  }
                : firstFromStation && secondFromStation
                  ? {
                      isReady: true,
                      isEmpty: false,
                      isExecuting: false,
                      operation: station.operation,
                      firstArgument: bus.value,
                      secondArgument: bus.value,
                    }
                  : firstFromStation
                    ? {
                        isReady: false,
                        isEmpty: false,
                        isExecuting: false,
                        operation: station.operation,
                        firstArgument: {
                          isReady: true,
                          value: bus.value,
                        },
                        secondArgument: {
                          ...station.secondArgument,
                        },
                      }
                    : {
                        isReady: false,
                        isEmpty: false,
                        isExecuting: false,
                        operation: station.operation,
                        firstArgument: {
                          ...station.firstArgument,
                        },
                        secondArgument: {
                          isReady: true,
                          value: bus.value,
                        },
                      }
        }
      )
      regFile = regFile.map((register) => {
        if (
          !register.hasValue &&
          register.alias.source === 'reservationStation' &&
          register.alias.index === bus.sourceStation
        ) {
          return {
            hasValue: true,
            value: bus.value,
          }
        }
        return register
      })
    } else if (bus.source === 'load') {
      transmitFlags = {
        ...transmitFlags,
        commonDataBusToLoadStoreUnits: true,
        commonDataBusToReservationStations: true,
      }
      resStations = resStations.map((station) => {
        const firstFromLoad =
          !station.isEmpty &&
          !station.isReady &&
          !station.firstArgument.isReady &&
          station.firstArgument.waitingFor === 'load' &&
          station.firstArgument.source.source === 'loadBuffer' &&
          station.firstArgument.source.index ===
            bus.sourceLoadBufferIndex

        const secondFromLoad =
          !station.isEmpty &&
          !station.isReady &&
          !station.secondArgument.isReady &&
          station.secondArgument.waitingFor === 'load' &&
          station.secondArgument.source.source === 'loadBuffer' &&
          station.secondArgument.source.index ===
            bus.sourceLoadBufferIndex

        if (firstFromLoad || secondFromLoad)
          transmitFlags = {
            ...transmitFlags,
            commonDataBusToReservationStations: true,
          }

        return !firstFromLoad && !secondFromLoad
          ? {
              ...station,
            }
          : firstFromLoad && station.secondArgument.isReady
            ? {
                isReady: true,
                isEmpty: false,
                isExecuting: false,
                operation: station.operation,
                firstArgument: bus.value,
                secondArgument: station.secondArgument.value,
              }
            : station.firstArgument.isReady
              ? {
                  isReady: true,
                  isEmpty: false,
                  isExecuting: false,
                  operation: station.operation,
                  firstArgument: station.firstArgument.value,
                  secondArgument: bus.value,
                }
              : firstFromLoad && secondFromLoad
                ? {
                    isReady: true,
                    isEmpty: false,
                    isExecuting: false,
                    operation: station.operation,
                    firstArgument: bus.value,
                    secondArgument: bus.value,
                  }
                : firstFromLoad
                  ? {
                      isReady: false,
                      isEmpty: false,
                      isExecuting: false,
                      operation: station.operation,
                      firstArgument: {
                        isReady: true,
                        value: bus.value,
                      },
                      secondArgument: {
                        ...station.secondArgument,
                      },
                    }
                  : {
                      isReady: false,
                      isEmpty: false,
                      isExecuting: false,
                      operation: station.operation,
                      firstArgument: {
                        ...station.firstArgument,
                      },
                      secondArgument: {
                        isReady: true,
                        value: bus.value,
                      },
                    }
      })
      regFile = regFile.map((register) => {
        if (
          bus.source === 'load' &&
          !register.hasValue &&
          register.alias.source === 'loadBuffer' &&
          register.alias.index === bus.sourceLoadBufferIndex
        ) {
          return {
            hasValue: true,
            value: bus.value,
          }
        }
        return register
      })
    }
  }

  const readyStationsByIndex: Array<{
    station: ReadyStation<number>
    index: number
  }> = resStations
    .map((station, i) => {
      return { station, i }
    })
    .filter((stationByIndex) => stationByIndex.station.isReady)
    .map((stationByIndex) => {
      return {
        station: stationByIndex.station as ReadyStation<number>,
        index: stationByIndex.i,
      }
    })

  const dec = (fu: FunctionUnitData<number>) => {
    if (fu.isEmpty || fu.ticksLeft === 0) return fu
    return {
      ...fu,
      ticksLeft: fu.ticksLeft - 1,
    }
  }

  const decLoadBuffer = (buffer: LoadBufferData): LoadBufferData => {
    if (buffer.isEmpty || !buffer.isReady) return buffer
    if (!buffer.isLoading || buffer.ticksLeft === 0) return buffer

    return {
      ...buffer,
      ticksLeft: buffer.ticksLeft - 1,
    }
  }

  const decStoreBuffer = (
    buffer: StoreBufferData<number>
  ): StoreBufferData<number> => {
    if (buffer.isEmpty || !buffer.isReady) return buffer
    if (!buffer.isStoring || buffer.ticksLeft === 0) return buffer

    return {
      ...buffer,
      ticksLeft: buffer.ticksLeft - 1,
    }
  }

  loadBuffers = loadBuffers.map(decLoadBuffer)
  storeBuffers = storeBuffers.map(decStoreBuffer)

  //let loadStoreTransmit = false

  const readyLoadIndex = loadBuffers.findIndex(
    (buffer) =>
      !buffer.isEmpty &&
      buffer.isReady &&
      !buffer.isLoading &&
      buffer.ticksLeft === 0
  )

  const readyLoad =
    readyLoadIndex === -1 ? null : loadBuffers[readyLoadIndex]

  if (
    readyLoadIndex !== -1 &&
    readyLoad &&
    !readyLoad.isEmpty &&
    readyLoad.isReady
  ) {
    loadBuffers = loadBuffers.map((buffer, i): LoadBufferData => {
      if (i !== readyLoadIndex) return buffer

      return {
        isEmpty: false,
        isReady: true,
        isLoading: true,
        address: readyLoad.address,
        ticksLeft: currentState.cyclesPerInstruction.loading,
      }
    })
  }

  const readyStoreIndex = storeBuffers.findIndex(
    (buffer) =>
      !buffer.isEmpty &&
      buffer.isReady &&
      !buffer.isStoring &&
      buffer.ticksLeft === 0
  )

  const readyStore =
    readyStoreIndex === -1 ? null : storeBuffers[readyStoreIndex]

  if (
    readyStoreIndex !== -1 &&
    readyStore &&
    !readyStore.isEmpty &&
    readyStore.isReady
  ) {
    storeBuffers = storeBuffers.map(
      (buffer, i): StoreBufferData<number> => {
        if (i !== readyStoreIndex) return buffer

        return {
          isEmpty: false,
          isReady: true,
          isStoring: true,
          address: readyStore.address,
          value: readyStore.value,
          ticksLeft: currentState.cyclesPerInstruction.storing,
        }
      }
    )
  }

  let addSubFuncUnits = currentState.addSubtractFunctionUnits.map(dec)
  let mulDivFuncUnits =
    currentState.multiplyDivideFunctionUnits.map(dec)
  let functionUnitTransmit = false

  if (readyStationsByIndex.length === 0) {
    return {
      ...currentState,
      reservationStations: resStations,
      registerFile: regFile,
      loadBuffers,
      storeBuffers,
      addSubtractFunctionUnits: addSubFuncUnits,
      multiplyDivideFunctionUnits: mulDivFuncUnits,
      transmitFlags: transmitFlags,
    }
  }

  if (addSubFuncUnits[0].isEmpty) {
    const readyAddSubStation = readyStationsByIndex.find(
      (stationByIndex) => {
        return (
          stationByIndex.index <
          currentState.adderReservationStationCount
        )
      }
    )
    if (readyAddSubStation) {
      const station = readyAddSubStation.station
      addSubFuncUnits = [
        {
          operation: station.operation,
          firstArgument: station.firstArgument,
          secondArgument: station.secondArgument,
          sourceStationIndex: readyAddSubStation.index,
          ticksLeft:
            station.operation === 'add'
              ? currentState.cyclesPerInstruction.addition
              : currentState.cyclesPerInstruction.subtraction,
          isEmpty: false,
        },
      ]

      resStations = resStations.map((s, i) => {
        if (s.isReady && i === readyAddSubStation.index) {
          return {
            ...s,
            isExecuting: true,
          }
        }
        return s
      })

      functionUnitTransmit = true
    }
  }

  if (mulDivFuncUnits[0].isEmpty) {
    const readyMulDivStation = readyStationsByIndex.find(
      (stationByIndex) => {
        return (
          stationByIndex.index >=
          currentState.adderReservationStationCount
        )
      }
    )
    if (readyMulDivStation) {
      const station = readyMulDivStation.station
      mulDivFuncUnits = [
        {
          operation: station.operation,
          firstArgument: station.firstArgument,
          secondArgument: station.secondArgument,
          sourceStationIndex: readyMulDivStation.index,
          ticksLeft:
            station.operation == 'mul'
              ? currentState.cyclesPerInstruction.multiplication
              : currentState.cyclesPerInstruction.division,
          isEmpty: false,
        },
      ]

      resStations = resStations.map((s, i) => {
        if (s.isReady && i === readyMulDivStation.index) {
          return {
            ...s,
            isExecuting: true,
          }
        }
        return s
      })

      functionUnitTransmit = true
    }
  }

  return {
    ...currentState,
    reservationStations: resStations,
    registerFile: regFile,
    loadBuffers,
    storeBuffers,
    addSubtractFunctionUnits: addSubFuncUnits,
    multiplyDivideFunctionUnits: mulDivFuncUnits,
    transmitFlags: {
      ...transmitFlags,
      reservationStationsToFunctionUnits: functionUnitTransmit,
    },
  }
}
